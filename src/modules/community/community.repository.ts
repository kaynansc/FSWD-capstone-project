import { Prisma } from '@prisma/client'
import { prisma } from '@/shared/prisma/client'
import { CreateCommunityInput, UpdateCommunityInput, SearchCommunityInput } from './community.schema'

export class CommunityRepository {
  async create(data: CreateCommunityInput & { organizerId: string }) {
    return prisma.community.create({
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        location: data.location.address,
        latitude: data.location.lat,
        longitude: data.location.lon,
        organizerId: data.organizerId
      },
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            memberships: true,
            events: true
          }
        }
      }
    })
  }

  async findById(id: string, userId?: string) {
    return prisma.community.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            name: true
          }
        },
        events: {
          where: {
            date: {
              gte: new Date()
            }
          },
          orderBy: {
            date: 'asc'
          },
          take: 3,
          select: {
            id: true,
            title: true,
            date: true
          }
        },
        _count: {
          select: {
            memberships: true
          }
        },
        memberships: userId ? {
          where: {
            userId
          },
          select: {
            id: true
          }
        } : undefined
      }
    })
  }

  async findByName(name: string) {
    return prisma.community.findFirst({
      where: { name },
      include: {
        _count: {
          select: {
            memberships: true,
            events: true
          }
        }
      }
    })
  }

  async search(params: SearchCommunityInput) {
    const { search, category, lat, lon, distance, page, limit } = params
    const skip = (page - 1) * limit

    const where: Prisma.CommunityWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.categoryId = category
    }

    if (lat && lon && distance) {
      // Using PostGIS for location search (you'll need to set up PostGIS in your database)
      where.location = {
        // This is a placeholder. You'll need to implement proper geospatial search
        // based on your database setup (PostGIS, etc.)
        contains: `${lat},${lon}`
      }
    }

    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: {
              memberships: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.community.count({ where })
    ])

    return {
      data: communities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit
      }
    }
  }

  async update(id: string, data: UpdateCommunityInput) {
    const updateData: Prisma.CommunityUpdateInput = {}

    if (data.name) updateData.name = data.name
    if (data.description) updateData.description = data.description
    if (data.categoryId) updateData.category = { connect: { id: data.categoryId } }
    if (data.location) {
      updateData.location = data.location.address
      updateData.latitude = data.location.lat
      updateData.longitude = data.location.lon
    }

    return prisma.community.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            memberships: true,
            events: true
          }
        }
      }
    })
  }

  async delete(id: string) {
    return prisma.community.delete({
      where: { id }
    })
  }

  async join(communityId: string, userId: string) {
    return prisma.membership.create({
      data: {
        communityId,
        userId
      }
    })
  }

  async leave(communityId: string, userId: string) {
    return prisma.membership.deleteMany({
      where: {
        communityId,
        userId
      }
    })
  }

  async getUserCommunities(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [memberships, total] = await Promise.all([
      prisma.membership.findMany({
        where: { userId },
        include: {
          community: {
            include: {
              _count: {
                select: {
                  events: {
                    where: {
                      date: {
                        gte: new Date()
                      }
                    }
                  }
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          joinedAt: 'desc'
        }
      }),
      prisma.membership.count({
        where: { userId }
      })
    ])

    return {
      data: memberships.map(m => ({
        id: m.community.id,
        name: m.community.name,
        upcomingEventCount: m.community._count.events
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit
      }
    }
  }
} 