
import { prisma } from '@/shared/prisma/client'

export class MessageRepository {
  async create(content: string, communityId: string, senderId: string) {
    return prisma.message.create({
      data: {
        content,
        communityId,
        senderId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }

  async findByCommunityId(communityId: string) {
    return prisma.message.findMany({
      where: { communityId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }
}
