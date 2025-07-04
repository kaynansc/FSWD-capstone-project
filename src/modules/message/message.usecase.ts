
import { MessageRepository } from './message.repository'

export class MessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async createMessage(content: string, communityId: string, senderId: string) {
    return this.messageRepository.create(content, communityId, senderId)
  }

  async getMessagesByCommunityId(communityId: string) {
    return this.messageRepository.findByCommunityId(communityId)
  }
}
