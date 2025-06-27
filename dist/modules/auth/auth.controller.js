"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_usecase_1 = require("./auth.usecase");
const auth_schema_1 = require("./auth.schema");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const user_repository_1 = require("../user/user.repository");
async function authRoutes(app) {
    const userRepository = new user_repository_1.UserRepository();
    const useCase = new auth_usecase_1.AuthUseCase(userRepository);
    app.post('/login', {
        schema: {
            body: (0, zod_to_json_schema_1.zodToJsonSchema)(auth_schema_1.loginSchema)
        }
    }, async (request, reply) => {
        const data = request.body;
        const user = await useCase.login(data);
        const token = await reply.jwtSign({
            id: user.id,
            role: user.role
        });
        return reply.send({
            token,
            user
        });
    });
    app.post('/register', {
        schema: {
            body: (0, zod_to_json_schema_1.zodToJsonSchema)(auth_schema_1.registerSchema)
        }
    }, async (request, reply) => {
        const data = request.body;
        const user = await useCase.register(data);
        return reply.send(user);
    });
}
