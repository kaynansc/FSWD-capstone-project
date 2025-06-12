import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../errors/app-error'

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message
    })
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  }

  if (error.name === 'TokenExpiredError') {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Token expired'
    })
  }

  // Log unexpected errors
  request.log.error(error)

  // Handle unexpected errors
  return reply.status(500).send({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  })
} 