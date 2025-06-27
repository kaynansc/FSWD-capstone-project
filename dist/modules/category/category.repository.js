"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const client_1 = require("@/shared/prisma/client");
class CategoryRepository {
    async create(data) {
        return client_1.prisma.category.create({
            data,
            include: {
                _count: {
                    select: {
                        communities: true,
                        interests: true
                    }
                }
            }
        });
    }
    async findById(id) {
        return client_1.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        communities: true,
                        interests: true
                    }
                }
            }
        });
    }
    async findByName(name) {
        return client_1.prisma.category.findUnique({
            where: { name },
            include: {
                _count: {
                    select: {
                        communities: true,
                        interests: true
                    }
                }
            }
        });
    }
    async findAll(params) {
        const { mostFeatured, page, limit } = params;
        console.log(params);
        return client_1.prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        communities: true,
                        interests: true
                    }
                }
            },
            orderBy: mostFeatured ? {
                communities: {
                    _count: 'desc'
                }
            } : {
                name: 'asc'
            },
            skip: (page - 1) * limit,
            take: limit
        });
    }
    async update(id, data) {
        return client_1.prisma.category.update({
            where: { id },
            data,
            include: {
                _count: {
                    select: {
                        communities: true,
                        interests: true
                    }
                }
            }
        });
    }
    async delete(id) {
        return client_1.prisma.category.delete({
            where: { id },
            include: {
                _count: {
                    select: {
                        communities: true,
                        interests: true
                    }
                }
            }
        });
    }
}
exports.CategoryRepository = CategoryRepository;
