"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const client_1 = require("@/shared/prisma/client");
class AuthRepository {
    async findUserByEmail(email) {
        return client_1.prisma.user.findUnique({
            where: { email },
            include: {
                role: true
            }
        });
    }
}
exports.AuthRepository = AuthRepository;
