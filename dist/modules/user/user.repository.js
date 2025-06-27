"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@/shared/prisma/client");
class UserRepository {
    async create(data) {
        return client_1.prisma.user.create({
            data,
            include: {
                role: true,
                interests: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
    async findById(id) {
        return client_1.prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                interests: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
    async findByEmail(email) {
        return client_1.prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
                interests: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
    async update(id, data) {
        const { interests, ...userData } = data;
        // If interests are provided, update them
        if (interests) {
            // Delete existing interests
            await client_1.prisma.userInterest.deleteMany({
                where: { userId: id }
            });
            // Create new interests
            await client_1.prisma.userInterest.createMany({
                data: interests.map(categoryId => ({
                    userId: id,
                    categoryId
                }))
            });
        }
        return client_1.prisma.user.update({
            where: { id },
            data: userData,
            include: {
                role: true,
                interests: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
    async delete(id) {
        return client_1.prisma.user.delete({
            where: { id },
            include: {
                role: true,
                interests: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
}
exports.UserRepository = UserRepository;
