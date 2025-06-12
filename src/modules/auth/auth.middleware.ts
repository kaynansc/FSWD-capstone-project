import { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthorizedError, ForbiddenError } from '@/shared/errors/app-error'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    throw new UnauthorizedError()
  }
}

export function authorizeRole(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as { role: string }
      if (!roles.includes(user.role)) {
        throw new ForbiddenError('Insufficient permissions')
      }
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw err
      }
      throw new UnauthorizedError()
    }
  }
} 