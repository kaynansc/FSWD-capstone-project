import { prisma } from '@/shared/prisma/client'
import { CreateUserInput, UpdateUserInput } from './user.schema'

export class UserRepository {
  async create(data: CreateUserInput) {
    return prisma.user.create({ data })
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }

  async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({ where: { id }, data })
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } })
  }
} 