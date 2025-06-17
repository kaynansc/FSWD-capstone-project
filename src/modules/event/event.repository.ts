import { prisma } from '@/shared/prisma/client'
import { Event, EventParticipant } from '@prisma/client'
import { CreateEventInput } from './event.schema'

export class EventRepository {
  async create(data: CreateEventInput & { communityId: string }): Promise<Event> {
    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location.address,
        latitude: data.location.lat,
        longitude: data.location.lon,
        communityId: data.communityId
      }
    });
  }

  async findById(id: string, userId?: string): Promise<(Event & { isAttending?: boolean }) | null> {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            participants: true
          }
        }
      }
    })

    if (!event) return null

    if (userId) {
      const participant = await prisma.eventParticipant.findFirst({
        where: {
          eventId: id,
          userId
        }
      })
      return { ...event, isAttending: !!participant }
    }

    return event
  }

  async findByCommunityId(
    communityId: string,
    filters: {
      startDate?: Date
      endDate?: Date
      page?: number
      limit?: number
    },
    userId?: string
  ) {
    const { startDate, endDate, page = 1, limit = 10 } = filters
    const skip = (page - 1) * limit

    const where = {
      communityId,
      ...(startDate && { startTime: { gte: startDate } }),
      ...(endDate && { endTime: { lte: endDate } })
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          _count: {
            select: {
              participants: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { date: 'asc' }
      }),
      prisma.event.count({ where })
    ])

    if (userId) {
      const participants = await prisma.eventParticipant.findMany({
        where: {
          eventId: { in: events.map(e => e.id) },
          userId
        }
      })
      const participantMap = new Map(participants.map(p => [p.eventId, true]))
      events.forEach(event => {
        event.isAttending = participantMap.has(event.id)
      })
    }

    return {
      data: events,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }
  }

  async update(id: string, data: Partial<Event>): Promise<Event> {
    return prisma.event.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.event.delete({
      where: { id }
    })
  }

  async addParticipant(eventId: string, userId: string): Promise<EventParticipant> {
    return prisma.eventParticipant.create({
      data: {
        eventId,
        userId
      }
    })
  }

  async removeParticipant(eventId: string, userId: string): Promise<void> {
    const participant = await prisma.eventParticipant.findFirst({
      where: { eventId, userId }
    })
    if (participant) {
      await prisma.eventParticipant.delete({
        where: { id: participant.id }
      })
    }
  }

  async getParticipants(eventId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [participants, total] = await Promise.all([
      prisma.eventParticipant.findMany({
        where: { eventId },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { rsvpAt: 'desc' }
      }),
      prisma.eventParticipant.count({
        where: { eventId }
      })
    ])

    return {
      data: participants.map(p => ({
        userId: p.user.id,
        name: p.user.name,
        attendanceAt: p.rsvpAt
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }
  }
} 