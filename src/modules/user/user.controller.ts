import { FastifyInstance } from 'fastify'
import { UserUseCase } from './user.usecase'
import { UserRepository } from './user.repository'
import { createUserSchema, updateUserSchema } from './user.schema'
import { zodToJsonSchema } from 'zod-to-json-schema'

export async function userRoutes(app: FastifyInstance) {
  const repository = new UserRepository()
  const useCase = new UserUseCase(repository)

  app.post('/', {
    schema: {
      body: zodToJsonSchema(createUserSchema)
    }
  }, async (request, reply) => {
    const data = request.body
    const user = await useCase.createUser(data)
    return reply.status(201).send(user)
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const user = await useCase.getUserById(id)
    return reply.send(user)
  })

  app.put('/:id', {
    schema: {
      body: zodToJsonSchema(updateUserSchema)
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const data = request.body
    const user = await useCase.updateUser(id, data)
    return reply.send(user)
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    await useCase.deleteUser(id)
    return reply.status(204).send()
  })
} 