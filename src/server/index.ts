import fastify from 'fastify'
import jwt from '@fastify/jwt'
import { registerRoutes } from './routes'
import { errorHandler } from '@/shared/middleware/error-handler'

const app = fastify({
  logger: true
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
})

// Add JWT types to FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      role: string
    }
  }
}

// Register error handler
app.setErrorHandler(errorHandler)

async function bootstrap() {
  try {
    await registerRoutes(app)
    await app.listen({ port: Number(process.env.PORT) || 3333, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

bootstrap()   