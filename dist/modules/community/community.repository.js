"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityRepository = void 0;
const client_1 = require("@/shared/prisma/client");
class CommunityRepository {
    async create(data) {
        return client_1.prisma.community.create({
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
        });
    }
    async findById(id, userId) {
        return client_1.prisma.community.findUnique({
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
        });
    }
    async findByName(name) {
        return client_1.prisma.community.findFirst({
            where: { name },
            include: {
                _count: {
                    select: {
                        memberships: true,
                        events: true
                    }
                }
            }
        });
    }
    async search(params, userId) {
        const { search, category, lat, lon, distance, page, limit, mostFeatured } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category) {
            where.categoryId = category;
        }
        if (lat && lon && distance) {
            // Using PostGIS for location search (you'll need to set up PostGIS in your database)
            where.location = {
                // This is a placeholder. You'll need to implement proper geospatial search
                // based on your database setup (PostGIS, etc.)
                contains: `${lat},${lon}`
            };
        }
        const [communities, total] = await Promise.all([
            client_1.prisma.community.findMany({
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
            client_1.prisma.community.count({ where })
        ]);
        return {
            data: communities,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                limit
            }
        };
    }
    async update(id, data) {
        const updateData = {};
        if (data.name)
            updateData.name = data.name;
        if (data.description)
            updateData.description = data.description;
        if (data.categoryId)
            updateData.category = { connect: { id: data.categoryId } };
        if (data.location) {
            updateData.location = data.location.address;
            updateData.latitude = data.location.lat;
            updateData.longitude = data.location.lon;
        }
        return client_1.prisma.community.update({
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
        });
    }
    async delete(id) {
        return client_1.prisma.community.delete({
            where: { id }
        });
    }
    async join(communityId, userId) {
        return client_1.prisma.membership.create({
            data: {
                communityId,
                userId
            }
        });
    }
    async leave(communityId, userId) {
        return client_1.prisma.membership.deleteMany({
            where: {
                communityId,
                userId
            }
        });
    }
    async getUserCommunities(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [memberships, total] = await Promise.all([
            client_1.prisma.membership.findMany({
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
            client_1.prisma.membership.count({
                where: { userId }
            })
        ]);
        return {
            data: memberships.map(m => ({
                id: m.community.id,
                name: m.community.name,
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
        };
    }
}
exports.CommunityRepository = CommunityRepository;
