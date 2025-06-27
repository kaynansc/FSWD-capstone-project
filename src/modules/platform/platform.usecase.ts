import { AppError } from '@/shared/errors/app-error'
import { PlatformRepository } from './platform.repository'
import { CommunityRepository } from '../community/community.repository'
import { SearchManagedCommunitiesInput, SearchCommunityMembersInput } from './platform.schema'
import { EventRepository } from '../event/event.repository'
import { UserRepository } from '../user/user.repository'

export class PlatformUseCase {
  constructor(
    private platformRepository: PlatformRepository,
    private communityRepository: CommunityRepository,
    private userRepository: UserRepository,
    private eventRepository: EventRepository
  ) {}

  async getManagedCommunities(userId: string, params: SearchManagedCommunitiesInput) {
    const page = params.page || 1
    const limit = params.limit || 10

    return this.platformRepository.getManagedCommunities(userId, page, limit)
  }

  async getCommunityMembers(communityId: string, userId: string, params: SearchCommunityMembersInput) {
    const community = await this.communityRepository.findById(communityId)
    if (!community) {
      throw new AppError('Community not found', 404)
    }

    if (community.organizerId !== userId) {
      throw new AppError('You are not authorized to view this community\'s members', 403)
    }

    const page = params.page || 1
    const limit = params.limit || 10

    return this.platformRepository.getCommunityMembers(communityId, page, limit)
  }

  async getSummary() {
    const [communities, users, events] = await Promise.all([
      this.communityRepository.getCountCommunities(),
      this.userRepository.getCountUsers(),
      this.eventRepository.getCountEvents(),
    ])

    return {
      communities,
      users,
      events,
    }
  }
}
