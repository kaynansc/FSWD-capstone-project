import { prisma } from '@/shared/prisma/client'

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        role: true
      }
    })
  }
} 