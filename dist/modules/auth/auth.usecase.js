"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUseCase = void 0;
const bcrypt_1 = require("bcrypt");
const app_error_1 = require("@/shared/errors/app-error");
class AuthUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async login(data) {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new app_error_1.UnauthorizedError('Invalid credentials');
        }
        const isValidPassword = await (0, bcrypt_1.compare)(data.password, user.password);
        if (!isValidPassword) {
            throw new app_error_1.UnauthorizedError('Invalid credentials');
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name
        };
    }
    async register(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new app_error_1.ConflictError('Email already registered');
        }
        const role = await this.roleRepository.findByName('user');

        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: await (0, bcrypt_1.hash)(data.password, 10),
            roleId: role.id
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name
        };
    }
}
exports.AuthUseCase = AuthUseCase;
