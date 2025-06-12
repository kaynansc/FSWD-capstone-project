import { prisma } from '@/shared/prisma/client'
import { CreateUserInput, UpdateUserProfileInput } from './user.schema'

export class UserRepository {
  async create(data: CreateUserInput & { roleId: string }) {
    return prisma.user.create({
      data,
      include: {
        role: true,
        interests: {
          include: {
            category: true
          }
        }
      }
    })
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        interests: {
          include: {
            category: true
          }
        }
      }
    })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        interests: {
          include: {
            category: true
          }
        }
      }
    })
  }

  async update(id: string, data: UpdateUserProfileInput) {
    const { interests, ...userData } = data

    // If interests are provided, update them
    if (interests) {
      // Delete existing interests
      await prisma.userInterest.deleteMany({
        where: { userId: id }
      })

      // Create new interests
      await prisma.userInterest.createMany({
        data: interests.map(categoryId => ({
          userId: id,
          categoryId
        }))
      })
    }

    return prisma.user.update({
      where: { id },
      data: userData,
      include: {
        role: true,
        interests: {
          include: {
            category: true
          }
        }
      }
    })
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
      include: {
        role: true,
        interests: {
          include: {
            category: true
          }
        }
      }
    })
  }
} 