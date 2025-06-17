import { FastifyInstance } from 'fastify'
import { EventUseCase } from './event.usecase'
import { EventRepository } from './event.repository'
import { CommunityRepository } from '../community/community.repository'
import { createEventSchema, updateEventSchema, searchEventSchema, CreateEventInput, UpdateEventInput, SearchEventInput } from './event.schema'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { authenticate, authorizeRole } from '../auth/auth.middleware'

interface AuthenticatedRequest {
  user: {
    id: string
    role: string
  }
}

export async function eventRoutes(app: FastifyInstance) {
  const eventRepository = new EventRepository()
  const communityRepository = new CommunityRepository()
  const useCase = new EventUseCase(eventRepository, communityRepository)

  // Public routes
  app.get<{ Querystring: SearchEventInput }>('/communities/:communityId/events', {
    schema: {
      querystring: zodToJsonSchema(searchEventSchema)
    }
  }, async (request, reply) => {
    const { communityId } = request.params as { communityId: string }
    const params = request.query
    const result = await useCase.searchEvents(communityId, params, (request as AuthenticatedRequest).user?.id)
    return reply.send(result)
  })

  app.get('/events/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const event = await useCase.getEventById(id, (request as AuthenticatedRequest).user?.id)
    return reply.send(event)
  })

  // Protected routes (organizer/admin)
  app.register(async function (app) {
    app.addHook('onRequest', authenticate)
    app.addHook('onRequest', authorizeRole(['admin', 'organizer']))

    app.post<{ Body: CreateEventInput }>('/communities/:communityId/events', {
      schema: {
        body: zodToJsonSchema(createEventSchema)
      }
    }, async (request, reply) => {
      const { communityId } = request.params as { communityId: string }
      const data = request.body
      const event = await useCase.createEvent({ ...data, communityId }, (request as AuthenticatedRequest).user.id)
      return reply.status(201).send(event)
    })

    app.put<{ Body: UpdateEventInput }>('/events/:id', {
      schema: {
        body: zodToJsonSchema(updateEventSchema)
      }
    }, async (request, reply) => {
      const { id } = request.params as { id: string }
      const data = request.body
      const event = await useCase.updateEvent(id, data, (request as AuthenticatedRequest).user.id)
      return reply.send(event)
    })

    app.delete('/events/:id', async (request, reply) => {
      const { id } = request.params as { id: string }
      await useCase.deleteEvent(id, (request as AuthenticatedRequest).user.id)
      return reply.status(204).send()
    })

    app.get('/events/:id/participants', async (request, reply) => {
      const { id } = request.params as { id: string }
      const { page, limit } = request.query as { page?: string, limit?: string }
      const pageNum = page ? Number(page) : undefined
      const limitNum = limit ? Number(limit) : undefined
      const result = await useCase.getEventParticipants(id, (request as AuthenticatedRequest).user.id, pageNum, limitNum)
      return reply.send(result)
    })
  })

  // Protected routes (authenticated users)
  app.register(async function (app) {
    app.addHook('onRequest', authenticate)

    app.post('/events/:id/attendance', async (request, reply) => {
      const { id } = request.params as { id: string }
      await useCase.joinEvent(id, (request as AuthenticatedRequest).user.id)
      return reply.status(201).send({ message: 'Successfully joined the event' })
    })

    app.delete('/events/:id/attendance', async (request, reply) => {
      const { id } = request.params as { id: string }
      await useCase.leaveEvent(id, (request as AuthenticatedRequest).user.id)
      return reply.status(204).send()
    })

    //WIP
    // app.post('/events/:id/attendance', async (request, reply) => {
    //   const { id } = request.params as { id: string }
    //   await useCase.attendEvent(id, (request as AuthenticatedRequest).user.id)
    //   return reply.status(201).send({ message: 'Successfully attended the event' })
    // })

  })
} 