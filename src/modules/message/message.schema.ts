import { z } from 'zod'
import { FastifySchema } from 'fastify'

export const getMessagesSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['communityId'],
    properties: {
      communityId: { type: 'string' }
    }
  }
}
