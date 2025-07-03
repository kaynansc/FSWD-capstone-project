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
        organizerId: data.organizerId,
        imageUrl: data.imageUrl
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
            name: true,
            phoneNumber: true,
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
        memberships: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                bio: true,
                phoneNumber: true,
              }
            }
          }
        }
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

  async search(params: SearchCommunityInput, userId?: string) {
    const { search, category, lat, lon, distance, page, limit, mostFeatured } = params
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
          },
          memberships: userId ? {
            where: {
              userId
            },
            select: {
              id: true
            }
          } : undefined
        },
        skip,
        take: limit,
        orderBy: mostFeatured ? {
          memberships: {
            _count: 'desc'
          }
        } : {
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
    if (data.imageUrl) updateData.imageUrl = data.imageUrl

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
        select: {
          community: {
            include: {
              category: true,
              events: {
                where: {
                  date: {
                    gte: new Date()
                  }
                },
                orderBy: {
                  date: 'asc'
                },
                take: 1,
                include: {
                  participants: userId ? {
                    where: {
                      userId
                    },
                    select: {
                      id: true
                    }
                  } : undefined
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
        imageUrl: m.community.imageUrl,
        category: {
          id: m.community.category.id,
          name: m.community.category.name
        },
        nextEvent: m.community.events[0] ? {
          title: m.community.events[0].title,
          date: m.community.events[0].date,
        } : null
      })),
      upcomingEvents: memberships.map(m => m.community.events),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit
      }
    }
  }

  async getCountCommunities() {
    return prisma.community.count()
  }
} 