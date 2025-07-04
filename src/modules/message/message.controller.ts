
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { MessageUseCase } from './message.usecase'
import { MessageRepository } from './message.repository'
import { getMessagesSchema } from './message.schema'

export async function messageRoutes(app: FastifyInstance) {
  const messageRepository = new MessageRepository()
  const messageUseCase = new MessageUseCase(messageRepository)

  app.get(
    '/communities/:communityId/messages',
    {
      schema: getMessagesSchema,
    },
    async (request: FastifyRequest<{ Params: { communityId: string } }>, reply: FastifyReply) => {
      const { communityId } = request.params
      try {
        const messages = await messageUseCase.getMessagesByCommunityId(communityId)
        return reply.send(messages)
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to retrieve messages' })
      }
    },
  )
}
