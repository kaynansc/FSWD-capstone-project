"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const user_usecase_1 = require("./user.usecase");
const user_repository_1 = require("./user.repository");
const user_schema_1 = require("./user.schema");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const auth_middleware_1 = require("../auth/auth.middleware");
async function userRoutes(app) {
    const userRepository = new user_repository_1.UserRepository();
    const userUseCase = new user_usecase_1.UserUseCase(userRepository);
    // Public routes
    app.post('/', {
        schema: {
            body: (0, zod_to_json_schema_1.zodToJsonSchema)(user_schema_1.createUserSchema)
        }
    }, async (request, reply) => {
        const data = request.body;
        const user = await userUseCase.createUser(data);
        return reply.status(201).send(user);
    });
    // Protected routes
    app.register(async function (app) {
        app.addHook('onRequest', auth_middleware_1.authenticate);
        // Get current user profile
        app.get('/me', async (request, reply) => {
            const userId = request.user.id;
            const profile = await userUseCase.getCurrentUserProfile(userId);
            return reply.send(profile);
        });
        // Update current user profile
        app.put('/me', {
            schema: {
                body: (0, zod_to_json_schema_1.zodToJsonSchema)(user_schema_1.updateUserProfileSchema)
            }
        }, async (request, reply) => {
            const userId = request.user.id;
            const data = request.body;
            const profile = await userUseCase.updateCurrentUserProfile(userId, data);
            return reply.send(profile);
        });
    });
}
