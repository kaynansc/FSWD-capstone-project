import { prisma } from '@/shared/prisma/client'

export class PlatformRepository {
  async getManagedCommunities(organizerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where: {
          organizerId
        },
        include: {
          _count: {
            select: {
              memberships: true,
              events: {
                where: {
                  date: {
                    gte: new Date()
                  }
                }
              }
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
              date: true,
              location: true,
              _count: {
                select: {
                  participants: true
                }
              }
            }
          }
        },
        skip,
        take: limit
      }),
      prisma.community.count({
        where: {
          organizerId
        }
      })
    ])

    return {
      data: communities.map(community => ({
        id: community.id,
        name: community.name,
        memberCount: community._count.memberships,
        pendingEventCount: community._count.events,
        upcomingEvents: community.events.map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          participantCount: event._count.participants
        }))
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getCommunityMembers(communityId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [memberships, total] = await Promise.all([
      prisma.membership.findMany({
        where: {
          communityId
        },
        select: {
          joinedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        skip,
        take: limit
      }),
      prisma.membership.count({
        where: {
          communityId
        }
      })
    ])

    return {
      data: memberships.map(membership => ({
        userId: membership.user.id,
        name: membership.user.name,
        email: membership.user.email,
        joinedAt: membership.joinedAt
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
} 