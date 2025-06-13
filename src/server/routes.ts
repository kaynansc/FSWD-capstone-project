import { FastifyInstance } from 'fastify'
import { userRoutes } from '@/modules/user/user.controller'
import { authRoutes } from '@/modules/auth/auth.controller'
import { categoryRoutes } from '@/modules/category/category.controller'
import { communityRoutes } from '@/modules/community/community.controller'
import { authenticate } from '@/modules/auth/auth.middleware'

export async function registerRoutes(app: FastifyInstance) {
  // Public routes
  app.register(authRoutes, { prefix: 'api/auth' })
  app.register(categoryRoutes, { prefix: 'api/categories' })
  app.register(communityRoutes, { prefix: 'api/communities' })
  
  // Protected routes
  app.register(async function (app) {
    app.addHook('onRequest', authenticate)
    app.register(userRoutes, { prefix: 'api/users' })
  })
} 