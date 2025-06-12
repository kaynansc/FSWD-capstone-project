import { FastifyInstance } from 'fastify'
import { CategoryUseCase } from './category.usecase'
import { CategoryRepository } from './category.repository'
import { createCategorySchema, updateCategorySchema, CreateCategoryInput, UpdateCategoryInput } from './category.schema'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { authenticate, authorizeRole } from '../auth/auth.middleware'

export async function categoryRoutes(app: FastifyInstance) {
  const repository = new CategoryRepository()
  const useCase = new CategoryUseCase(repository)

  // Public routes
  app.get('/', async (request, reply) => {
    const categories = await useCase.listCategories()
    return reply.send(categories)
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const category = await useCase.getCategoryById(id)
    return reply.send(category)
  })

  // Protected routes (admin only)
  app.register(async function (app) {
    app.addHook('onRequest', authenticate)
    app.addHook('onRequest', authorizeRole(['admin']))

    app.post<{ Body: CreateCategoryInput }>('/', {
      schema: {
        body: zodToJsonSchema(createCategorySchema)
      }
    }, async (request, reply) => {
      const data = request.body
      const category = await useCase.createCategory(data)
      return reply.status(201).send(category)
    })

    app.put<{ Body: UpdateCategoryInput }>('/:id', {
      schema: {
        body: zodToJsonSchema(updateCategorySchema)
      }
    }, async (request, reply) => {
      const { id } = request.params as { id: string }
      const data = request.body
      const category = await useCase.updateCategory(id, data)
      return reply.send(category)
    })

    app.delete('/:id', async (request, reply) => {
      const { id } = request.params as { id: string }
      await useCase.deleteCategory(id)
      return reply.status(204).send()
    })
  })
} 