import { prisma } from '@/shared/prisma/client'
import { CreateCategoryInput, ListCategoriesInput, UpdateCategoryInput } from './category.schema'

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

  async findAll(params: ListCategoriesInput) {
    const { mostFeatured, page, limit } = params

    console.log(params)
    
    return prisma.category.findMany({
      include: {
        _count: {
          select: {
            communities: true,
            interests: true
          }
        }
      },
      orderBy: mostFeatured ? {
        communities: {
          _count: 'desc'
        }
      } : {
        name: 'asc'
      },
      skip: (page - 1) * limit,
      take: limit
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