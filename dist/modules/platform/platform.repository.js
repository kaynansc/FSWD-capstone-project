"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformRepository = void 0;
const client_1 = require("@/shared/prisma/client");
class PlatformRepository {
    async getCommunities() {
        return client_1.prisma.community.count();
    }
    async getUsers() {
        return client_1.prisma.user.count();
    }
    async getEvents() {
        return client_1.prisma.event.count();
    }
}
exports.PlatformRepository = PlatformRepository;
