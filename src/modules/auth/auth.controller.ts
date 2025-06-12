import { FastifyInstance } from 'fastify'
import { AuthUseCase } from './auth.usecase'
import { loginSchema, LoginInput, RegisterInput, registerSchema } from './auth.schema'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { UserRepository } from '../user/user.repository'

export async function authRoutes(app: FastifyInstance) {
  const userRepository = new UserRepository()
  const useCase = new AuthUseCase(userRepository)

  app.post<{ Body: LoginInput }>('/login', {
    schema: {
      body: zodToJsonSchema(loginSchema)
    }
  }, async (request, reply) => {
    const data = request.body
    const user = await useCase.login(data)
    
    const token = await reply.jwtSign({
      id: user.id,
      role: user.role
    })

    return reply.send({
      token,
      user
    })
  })

  app.post<{ Body: RegisterInput }>('/register', {
    schema: {
      body: zodToJsonSchema(registerSchema)
    }
  }, async (request, reply) => {
    const data = request.body
    const user = await useCase.register(data)
    return reply.send(user)
  })
} 