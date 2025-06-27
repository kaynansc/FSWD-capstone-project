"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventUseCase = void 0;
const app_error_1 = require("../../shared/errors/app-error");
class EventUseCase {
    constructor(repository, communityRepository) {
        this.repository = repository;
        this.communityRepository = communityRepository;
    }
    async createEvent(data, userId) {
        const community = await this.communityRepository.findById(data.communityId);
        if (!community) {
            throw new app_error_1.NotFoundError('Community not found');
        }
        if (community.organizerId !== userId) {
            throw new app_error_1.UnauthorizedError('Only community organizers can create events');
        }
        return this.repository.create(data);
    }
    async getEventById(id, userId) {
        const event = await this.repository.findById(id, userId);
        if (!event) {
            throw new app_error_1.NotFoundError('Event not found');
        }
        return event;
    }
    async searchEvents(communityId, filters, userId) {
        const community = await this.communityRepository.findById(communityId);
        if (!community) {
            throw new app_error_1.NotFoundError('Community not found');
        }
        return this.repository.findByCommunityId(communityId, filters, userId);
    }
    async updateEvent(id, data, userId) {
        const event = await this.repository.findById(id);
        if (!event) {
            throw new app_error_1.NotFoundError('Event not found');
        }
        const community = await this.communityRepository.findById(event.communityId);
        if (!community) {
            throw new app_error_1.NotFoundError('Community not found');
        }
        if (community.organizerId !== userId) {
            throw new app_error_1.UnauthorizedError('Only community organizers can update events');
        }
        return this.repository.update(id, data);
    }
    async deleteEvent(id, userId) {
        const event = await this.repository.findById(id);
        if (!event) {
            throw new app_error_1.NotFoundError('Event not found');
        }
        const community = await this.communityRepository.findById(event.communityId);
        if (!community) {
            throw new app_error_1.NotFoundError('Community not found');
        }
        if (community.organizerId !== userId) {
            throw new app_error_1.UnauthorizedError('Only community organizers can delete events');
        }
        await this.repository.delete(id);
    }
    async joinEvent(eventId, userId) {
        const event = await this.repository.findById(eventId);
        if (!event) {
            throw new app_error_1.NotFoundError('Event not found');
        }
        const existingParticipant = await this.repository.findById(eventId, userId);
        if (existingParticipant?.isAttending) {
            throw new app_error_1.ConflictError('User is already participating in this event');
        }
        if (event.maxAttendees) {
            const { data } = await this.repository.getParticipants(eventId);
            if (data.length >= event.maxAttendees) {
                throw new app_error_1.ConflictError('Event has reached maximum participants');
            }
        }
        return this.repository.addParticipant(eventId, userId);
    }
    async leaveEvent(eventId, userId) {
        const event = await this.repository.findById(eventId);
        if (!event) {
            throw new app_error_1.NotFoundError('Event not found');
        }
        const existingParticipant = await this.repository.findById(eventId, userId);
        if (!existingParticipant?.isAttending) {
            throw new app_error_1.ConflictError('User is not participating in this event');
        }
        await this.repository.removeParticipant(eventId, userId);
    }
    async getEventParticipants(eventId, userId, page, limit) {
        const event = await this.repository.findById(eventId);
        if (!event) {
            throw new app_error_1.NotFoundError('Event not found');
        }
        const community = await this.communityRepository.findById(event.communityId);
        if (!community) {
            throw new app_error_1.NotFoundError('Community not found');
        }
        if (community.organizerId !== userId) {
            throw new app_error_1.UnauthorizedError('Only community organizers can view participants');
        }
        return this.repository.getParticipants(eventId, page, limit);
    }
}
exports.EventUseCase = EventUseCase;
