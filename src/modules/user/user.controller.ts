import { FastifyInstance } from 'fastify'
import { UserUseCase } from './user.usecase'
import { UserRepository } from './user.repository'
import { createUserSchema, updateUserProfileSchema, CreateUserInput, UpdateUserProfileInput } from './user.schema'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { authenticate } from '../auth/auth.middleware'

export async function userRoutes(app: FastifyInstance) {
  const userRepository = new UserRepository()
  const userUseCase = new UserUseCase(userRepository)

  // Public routes
  app.post<{ Body: CreateUserInput }>('/', {
    schema: {
      body: zodToJsonSchema(createUserSchema)
    }
  }, async (request, reply) => {
    const data = request.body
    const user = await userUseCase.createUser(data)
    return reply.status(201).send(user)
  })

  // Protected routes
  app.register(async function (app) {
    app.addHook('onRequest', authenticate)

    // Get current user profile
    app.get('/me', async (request, reply) => {
      const userId = (request.user as { id: string }).id
      const profile = await userUseCase.getCurrentUserProfile(userId)
      return reply.send(profile)
    })

    // Update current user profile
    app.put<{ Body: UpdateUserProfileInput }>('/me', {
      schema: {
        body: zodToJsonSchema(updateUserProfileSchema)
      }
    }, async (request, reply) => {
      const userId = (request.user as { id: string }).id
      const data = request.body
      const profile = await userUseCase.updateCurrentUserProfile(userId, data)
      return reply.send(profile)
    })
  })
} 