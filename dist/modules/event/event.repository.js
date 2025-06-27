"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRepository = void 0;
const client_1 = require("@/shared/prisma/client");
class EventRepository {
    async create(data) {
        return client_1.prisma.event.create({
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
    async findById(id, userId) {
        const event = await client_1.prisma.event.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        participants: true
                    }
                }
            }
        });
        if (!event)
            return null;
        if (userId) {
            const participant = await client_1.prisma.eventParticipant.findFirst({
                where: {
                    eventId: id,
                    userId
                }
            });
            return { ...event, isAttending: !!participant };
        }
        return event;
    }
    async findByCommunityId(communityId, filters, userId) {
        const { startDate, endDate, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;
        const where = {
            communityId,
            ...(startDate && { startTime: { gte: startDate } }),
            ...(endDate && { endTime: { lte: endDate } })
        };
        const [events, total] = await Promise.all([
            client_1.prisma.event.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            participants: true
                        }
                    },
                    participants: userId ? {
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
                orderBy: { date: 'asc' }
            }),
            client_1.prisma.event.count({ where })
        ]);
        return {
            data: events,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }
    async update(id, data) {
        return client_1.prisma.event.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await client_1.prisma.event.delete({
            where: { id }
        });
    }
    async addParticipant(eventId, userId) {
        return client_1.prisma.eventParticipant.create({
            data: {
                eventId,
                userId
            }
        });
    }
    async removeParticipant(eventId, userId) {
        const participant = await client_1.prisma.eventParticipant.findFirst({
            where: { eventId, userId }
        });
        if (participant) {
            await client_1.prisma.eventParticipant.delete({
                where: { id: participant.id }
            });
        }
    }
    async getParticipants(eventId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [participants, total] = await Promise.all([
            client_1.prisma.eventParticipant.findMany({
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
            client_1.prisma.eventParticipant.count({
                where: { eventId }
            })
        ]);
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
        };
    }
}
exports.EventRepository = EventRepository;
