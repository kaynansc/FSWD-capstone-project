import { FastifyInstance } from 'fastify'
import { PlatformUseCase } from './platform.usecase'
import { PlatformRepository } from './platform.repository'
import { CommunityRepository } from '../community/community.repository'
import { searchManagedCommunitiesSchema, searchCommunityMembersSchema, SearchManagedCommunitiesInput, SearchCommunityMembersInput } from './platform.schema'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { authenticate, authorizeRole } from '../auth/auth.middleware'
import { UserRepository } from '../user/user.repository'
import { EventRepository } from '../event/event.repository'

interface AuthenticatedRequest {
  user: {
    id: string
    role: string
  }
}

export async function platformRoutes(app: FastifyInstance) {
  const platformRepository = new PlatformRepository()
  const communityRepository = new CommunityRepository()
  const userRepository = new UserRepository()
  const eventRepository = new EventRepository()

  const useCase = new PlatformUseCase(platformRepository, communityRepository, userRepository, eventRepository)

  app.get('/summary', async (request, reply) => {
    const result = await useCase.getSummary()
    return reply.send(result)
  })

  // Protected routes (organizer/admin)
  app.register(async function (app) {
    app.addHook('onRequest', authenticate)
    app.addHook('onRequest', authorizeRole(['admin', 'organizer']))

    app.get<{ Querystring: SearchManagedCommunitiesInput }>('/organizer/communities', {
      schema: {
        querystring: zodToJsonSchema(searchManagedCommunitiesSchema)
      }
    }, async (request, reply) => {
      const result = await useCase.getManagedCommunities(
        (request as AuthenticatedRequest).user.id,
        request.query
      )
      return reply.send(result)
    })

    app.get<{ Querystring: SearchCommunityMembersInput }>('/communities/:communityId/members', {
      schema: {
        querystring: zodToJsonSchema(searchCommunityMembersSchema)
      }
    }, async (request, reply) => {
      const { communityId } = request.params as { communityId: string }
      const result = await useCase.getCommunityMembers(
        communityId,
        (request as AuthenticatedRequest).user.id,
        request.query
      )
      return reply.send(result)
    })
  })
}
