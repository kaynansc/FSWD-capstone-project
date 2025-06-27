"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityUseCase = void 0;
const app_error_1 = require("../../shared/errors/app-error");
class CommunityUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async createCommunity(data) {
        // Check if user already has a community with the same name
        const existingCommunity = await this.repository.findByName(data.name);
        if (existingCommunity) {
            throw new app_error_1.ConflictError('Community with this name already exists');
        }
        return this.repository.create(data);
    }
    async getCommunityById(id, userId) {
        const community = await this.repository.findById(id, userId);
        if (!community) {
            throw new app_error_1.NotFoundError('Community not found');
        }
        return community;
    }
    async searchCommunities(params, userId) {
        return this.repository.search(params, userId);
    }
    async updateCommunity(id, data, userId) {
        const community = await this.getCommunityById(id);
        if (!community) {
            throw new app_error_1.NotFoundError('Community not found');
        }
        if (community.organizerId !== userId) {
            throw new app_error_1.UnauthorizedError('Only the organizer can update the community');
        }
        // If name is being updated, check for conflicts
        if (data.name) {
            const existingCommunity = await this.repository.findByName(data.name);
            if (existingCommunity && existingCommunity.id !== id) {
                throw new app_error_1.ConflictError('Community with this name already exists');
            }
        }
        return this.repository.update(id, data);
    }
    async deleteCommunity(id, userId) {
        const community = await this.getCommunityById(id);
        if (!community) {
            throw new app_error_1.NotFoundError('Community not found');
        }
        if (community.organizerId !== userId) {
            throw new app_error_1.UnauthorizedError('Only the organizer can delete the community');
        }
        // Check if community has members or events
        if (community._count.memberships > 0 || community._count.events > 0) {
            throw new app_error_1.ConflictError('Cannot delete community that has members or events');
        }
        return this.repository.delete(id);
    }
    async joinCommunity(communityId, userId) {
        const community = await this.getCommunityById(communityId, userId);
        if (!community) {
            throw new app_error_1.NotFoundError('Community not found');
        }
        // Check if user is already a member
        const isMember = community.memberships?.some(m => m.id);
        if (isMember) {
            throw new app_error_1.ConflictError('User is already a member of this community');
        }
        return this.repository.join(communityId, userId);
    }
    async leaveCommunity(communityId, userId) {
        const community = await this.getCommunityById(communityId, userId);
        if (!community) {
            throw new app_error_1.NotFoundError('Community not found');
        }
        // Check if user is a member
        const isMember = community.memberships?.some(m => m.id);
        if (!isMember) {
            throw new app_error_1.ConflictError('User is not a member of this community');
        }
        return this.repository.leave(communityId, userId);
    }
    async getUserCommunities(userId, page, limit) {
        return this.repository.getUserCommunities(userId, page, limit);
    }
}
exports.CommunityUseCase = CommunityUseCase;
