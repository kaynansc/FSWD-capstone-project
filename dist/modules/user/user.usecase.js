"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCase = void 0;
const bcrypt_1 = require("bcrypt");
const app_error_1 = require("@/shared/errors/app-error");
class UserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await (0, bcrypt_1.hash)(data.password, 10);
        const userData = {
            ...data,
            password: hashedPassword,
            roleId: process.env.DEFAULT_ROLE_ID || 'user-role-id' // You should set this in your .env
        };
        return this.userRepository.create(userData);
    }
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async deleteUser(id) {
        await this.getUserById(id);
        return this.userRepository.delete(id);
    }
    async getCurrentUserProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new app_error_1.NotFoundError('User not found');
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            interests: user.interests.map(interest => {
                return {
                    id: interest.category.id,
                    name: interest.category.name
                };
            }),
            role: user.role.name,
            createdAt: user.createdAt
        };
    }
    async updateCurrentUserProfile(userId, data) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new app_error_1.NotFoundError('User not found');
        }
        const updatedUser = await this.userRepository.update(userId, data);
        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            bio: updatedUser.bio,
            interests: updatedUser.interests.map(interest => interest.categoryId),
            role: updatedUser.role.name,
            updatedAt: updatedUser.updatedAt
        };
    }
}
exports.UserUseCase = UserUseCase;
