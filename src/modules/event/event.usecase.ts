import { EventRepository } from './event.repository'
import { CreateEventInput, UpdateEventInput, SearchEventInput } from './event.schema'
import { ConflictError, NotFoundError, UnauthorizedError } from '../../shared/errors/app-error'
import { CommunityRepository } from '../community/community.repository'

export class EventUseCase {
  constructor(
    private readonly repository: EventRepository,
    private readonly communityRepository: CommunityRepository
  ) {}

  async createEvent(data: CreateEventInput & { communityId: string }, userId: string) {
    const community = await this.communityRepository.findById(data.communityId)
    if (!community) {
      throw new NotFoundError('Community not found')
    }

    if (community.organizerId !== userId) {
      throw new UnauthorizedError('Only community organizers can create events')
    }

    return this.repository.create(data)
  }

  async getEventById(id: string, userId?: string) {
    const event = await this.repository.findById(id, userId)
    if (!event) {
      throw new NotFoundError('Event not found')
    }
    return event
  }

  async searchEvents(communityId: string, filters: SearchEventInput, userId?: string) {
    const community = await this.communityRepository.findById(communityId)
    if (!community) {
      throw new NotFoundError('Community not found')
    }

    return this.repository.findByCommunityId(communityId, filters, userId)
  }

  async updateEvent(id: string, data: UpdateEventInput, userId: string) {
    const event = await this.repository.findById(id)
    if (!event) {
      throw new NotFoundError('Event not found')
    }

    const community = await this.communityRepository.findById(event.communityId)
    if (!community) {
      throw new NotFoundError('Community not found')
    }

    if (community.organizerId !== userId) {
      throw new UnauthorizedError('Only community organizers can update events')
    }

    if (data.location) {
      const { address, lat, lon } = data.location
      event.location = address
      event.latitude = lat
      event.longitude = lon
      delete data.location
    }

    return this.repository.update(id, data)
  }

  async deleteEvent(id: string, userId: string) {
    const event = await this.repository.findById(id)
    if (!event) {
      throw new NotFoundError('Event not found')
    }

    const community = await this.communityRepository.findById(event.communityId)
    if (!community) {
      throw new NotFoundError('Community not found')
    }

    if (community.organizerId !== userId) {
      throw new UnauthorizedError('Only community organizers can delete events')
    }

    await this.repository.delete(id)
  }

  async joinEvent(eventId: string, userId: string) {
    const event = await this.repository.findById(eventId)
    if (!event) {
      throw new NotFoundError('Event not found')
    }

    const community = await this.communityRepository.findById(event.communityId, userId)

    if (!community?.memberships?.length) {
      throw new UnauthorizedError('Only community members can join events')
    }

    const existingParticipant = await this.repository.findById(eventId, userId)
    if (existingParticipant?.isAttending) {
      throw new ConflictError('User is already participating in this event')
    }

    if (event.maxAttendees) {
      const { data } = await this.repository.getParticipants(eventId)
      if (data.length >= event.maxAttendees) {
        throw new ConflictError('Event has reached maximum participants')
      }
    }

    return this.repository.addParticipant(eventId, userId)
  }

  async leaveEvent(eventId: string, userId: string) {
    const event = await this.repository.findById(eventId)
    if (!event) {
      throw new NotFoundError('Event not found')
    }

    const existingParticipant = await this.repository.findById(eventId, userId)
    if (!existingParticipant?.isAttending) {
      throw new ConflictError('User is not participating in this event')
    }

    await this.repository.removeParticipant(eventId, userId)
  }

  async getEventParticipants(eventId: string, userId: string, page?: number, limit?: number) {
    const event = await this.repository.findById(eventId)
    if (!event) {
      throw new NotFoundError('Event not found')
    }

    const community = await this.communityRepository.findById(event.communityId)
    if (!community) {
      throw new NotFoundError('Community not found')
    }

    if (community.organizerId !== userId) {
      throw new UnauthorizedError('Only community organizers can view participants')
    }

    return this.repository.getParticipants(eventId, page, limit)
  }
} 