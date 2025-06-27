import { CommunityRepository } from './community.repository'
import { CreateCommunityInput, UpdateCommunityInput, SearchCommunityInput } from './community.schema'
import { ConflictError, NotFoundError, UnauthorizedError } from '../../shared/errors/app-error'

export class CommunityUseCase {
  constructor(private repository: CommunityRepository) {}

  async createCommunity(data: CreateCommunityInput & { organizerId: string }) {
    // Check if user already has a community with the same name
    const existingCommunity = await this.repository.findByName(data.name)
    if (existingCommunity) {
      throw new ConflictError('Community with this name already exists')
    }

    return this.repository.create(data)
  }

  async getCommunityById(id: string, userId?: string) {
    const community = await this.repository.findById(id, userId)
    
    if (!community) {
      throw new NotFoundError('Community not found')
    }

    return community
  }

  async searchCommunities(params: SearchCommunityInput, userId?: string) {
    return this.repository.search(params, userId)
  }

  async updateCommunity(id: string, data: UpdateCommunityInput, userId: string) {
    const community = await this.getCommunityById(id)

    if (!community) {
      throw new NotFoundError('Community not found')
    }

    if (community.organizerId !== userId) {
      throw new UnauthorizedError('Only the organizer can update the community')
    }

    // If name is being updated, check for conflicts
    if (data.name) {
      const existingCommunity = await this.repository.findByName(data.name)
      if (existingCommunity && existingCommunity.id !== id) {
        throw new ConflictError('Community with this name already exists')
      }
    }

    return this.repository.update(id, data)
  }

  async deleteCommunity(id: string, userId: string) {
    const community = await this.getCommunityById(id)

    if (!community) {
      throw new NotFoundError('Community not found')
    }

    if (community.organizerId !== userId) {
      throw new UnauthorizedError('Only the organizer can delete the community')
    }

    // Check if community has members or events
    if (community._count.memberships > 0 || community.events.length > 0) {
      throw new ConflictError('Cannot delete community that has members or events')
    }

    return this.repository.delete(id)
  }

  async joinCommunity(communityId: string, userId: string) {
    const community = await this.getCommunityById(communityId, userId)

    if (!community) {
      throw new NotFoundError('Community not found')
    }

    // Check if user is already a member
    const isMember = community.memberships?.some(m => m.id)

    if (isMember) {
      throw new ConflictError('User is already a member of this community')
    }

    return this.repository.join(communityId, userId)
  }

  async leaveCommunity(communityId: string, userId: string) {
    const community = await this.getCommunityById(communityId, userId)

    if (!community) {
      throw new NotFoundError('Community not found')
    }

    // Check if user is a member
    const isMember = community.memberships?.some(m => m.id)
    if (!isMember) {
      throw new ConflictError('User is not a member of this community')
    }

    return this.repository.leave(communityId, userId)
  }

  async getUserCommunities(userId: string, page?: number, limit?: number) {
    return this.repository.getUserCommunities(userId, page, limit)
  }
} 