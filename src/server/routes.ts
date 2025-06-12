import { FastifyInstance } from 'fastify'
import { userRoutes } from '@/modules/user/user.controller'

export async function registerRoutes(app: FastifyInstance) {
  app.register(userRoutes, { prefix: '/users' })
} 