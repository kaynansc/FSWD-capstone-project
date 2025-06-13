import { FastifyInstance } from 'fastify'
import { CommunityUseCase } from './community.usecase'
import { CommunityRepository } from './community.repository'
import { createCommunitySchema, updateCommunitySchema, searchCommunitySchema, CreateCommunityInput, UpdateCommunityInput, SearchCommunityInput } from './community.schema'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { authenticate, authorizeRole } from '../auth/auth.middleware'

interface AuthenticatedRequest {
  user: {
    id: string
    role: string
  }
}

export async function communityRoutes(app: FastifyInstance) {
  const repository = new CommunityRepository()
  const useCase = new CommunityUseCase(repository)

  // Public routes
  app.get<{ Querystring: SearchCommunityInput }>('/', {
    schema: {
      querystring: zodToJsonSchema(searchCommunitySchema)
    }
  }, async (request, reply) => {
    const params = request.query
    const result = await useCase.searchCommunities(params)
    return reply.send(result)
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const community = await useCase.getCommunityById(id, (request as AuthenticatedRequest).user?.id)
    return reply.send(community)
  })

  // Protected routes
  app.register(async function (app) {
    app.addHook('onRequest', authenticate)
    app.addHook('onRequest', authorizeRole(['admin', 'organizer']))
  
    app.post<{ Body: CreateCommunityInput }>('/', {
      schema: {
        body: zodToJsonSchema(createCommunitySchema)
      }
    }, async (request, reply) => {
      const data = request.body
      const community = await useCase.createCommunity({
        ...data,
        organizerId: (request as AuthenticatedRequest).user.id
      })
      return reply.status(201).send(community)
    })

    app.put<{ Body: UpdateCommunityInput }>('/:id', {
      schema: {
        body: zodToJsonSchema(updateCommunitySchema)
      }
    }, async (request, reply) => {
      const { id } = request.params as { id: string }
      const data = request.body
      const community = await useCase.updateCommunity(id, data, (request as AuthenticatedRequest).user.id)
      return reply.send(community)
    })

    app.delete('/:id', async (request, reply) => {
      const { id } = request.params as { id: string }
      await useCase.deleteCommunity(id, (request as AuthenticatedRequest).user.id)
      return reply.status(204).send()
    })
  })

  // only for authenticated users (not admin or organizer)
  app.register(async function (app) {
    app.addHook('onRequest', authenticate)
  
    app.post('/:id/join', async (request, reply) => {
      const { id } = request.params as { id: string }
      await useCase.joinCommunity(id, (request as AuthenticatedRequest).user.id)
      return reply.status(204).send()
    })

    app.post('/:id/leave', async (request, reply) => {
      const { id } = request.params as { id: string }
      await useCase.leaveCommunity(id, (request as AuthenticatedRequest).user.id)
      return reply.status(204).send()
    })

    app.get('/me', async (request, reply) => {
      const { page, limit } = request.query as { page?: string, limit?: string }
      const pageNum = page ? Number(page) : undefined
      const limitNum = limit ? Number(limit) : undefined
      const result = await useCase.getUserCommunities((request as AuthenticatedRequest).user.id, pageNum, limitNum)
      return reply.send(result)
    })
  })
} 