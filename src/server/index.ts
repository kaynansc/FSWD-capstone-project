import fastify from 'fastify'
import { registerRoutes } from './routes'

const app = fastify({
  logger: true
})

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