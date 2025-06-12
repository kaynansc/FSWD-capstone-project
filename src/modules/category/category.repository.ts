import { prisma } from '@/shared/prisma/client'
import { CreateCategoryInput, UpdateCategoryInput } from './category.schema'

export class CategoryRepository {
  async create(data: CreateCategoryInput) {
    return prisma.category.create({
      data,
      include: {
        _count: {
          select: {
            communities: true,
            interests: true
          }
        }
      }
    })
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            communities: true,
            interests: true
          }
        }
      }
    })
  }

  async findByName(name: string) {
    return prisma.category.findUnique({
      where: { name },
      include: {
        _count: {
          select: {
            communities: true,
            interests: true
          }
        }
      }
    })
  }

  async findAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: {
            communities: true,
            interests: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
  }

  async update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            communities: true,
            interests: true
          }
        }
      }
    })
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
      include: {
        _count: {
          select: {
            communities: true,
            interests: true
          }
        }
      }
    })
  }
} 