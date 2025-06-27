"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityRoutes = communityRoutes;
const community_usecase_1 = require("./community.usecase");
const community_repository_1 = require("./community.repository");
const community_schema_1 = require("./community.schema");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const auth_middleware_1 = require("../auth/auth.middleware");
async function communityRoutes(app) {
    const repository = new community_repository_1.CommunityRepository();
    const useCase = new community_usecase_1.CommunityUseCase(repository);
    app.get('/', {
        schema: {
            querystring: (0, zod_to_json_schema_1.zodToJsonSchema)(community_schema_1.searchCommunitySchema)
        }
    }, async (request, reply) => {
        const params = request.query;
        const userId = request.user?.id;
        const result = await useCase.searchCommunities(params, userId);
        return reply.send(result);
    });
    app.register(async function (app) {
        app.addHook('onRequest', auth_middleware_1.authenticate);
        app.get('/:id', async (request, reply) => {
            const { id } = request.params;
            const community = await useCase.getCommunityById(id, request.user?.id);
            return reply.send(community);
        });
    });
    // Protected routes
    app.register(async function (app) {
        app.addHook('onRequest', auth_middleware_1.authenticate);
        app.addHook('onRequest', (0, auth_middleware_1.authorizeRole)(['admin', 'organizer']));
        app.post('/', {
            schema: {
                body: (0, zod_to_json_schema_1.zodToJsonSchema)(community_schema_1.createCommunitySchema)
            }
        }, async (request, reply) => {
            const data = request.body;
            const community = await useCase.createCommunity({
                ...data,
                organizerId: request.user.id
            });
            return reply.status(201).send(community);
        });
        app.put('/:id', {
            schema: {
                body: (0, zod_to_json_schema_1.zodToJsonSchema)(community_schema_1.updateCommunitySchema)
            }
        }, async (request, reply) => {
            const { id } = request.params;
            const data = request.body;
            const community = await useCase.updateCommunity(id, data, request.user.id);
            return reply.send(community);
        });
        app.delete('/:id', async (request, reply) => {
            const { id } = request.params;
            await useCase.deleteCommunity(id, request.user.id);
            return reply.status(204).send();
        });
    });
    // only for authenticated users (not admin or organizer)
    app.register(async function (app) {
        app.addHook('onRequest', auth_middleware_1.authenticate);
        app.post('/:id/join', async (request, reply) => {
            const { id } = request.params;
            await useCase.joinCommunity(id, request.user.id);
            return reply.status(204).send();
        });
        app.post('/:id/leave', async (request, reply) => {
            const { id } = request.params;
            await useCase.leaveCommunity(id, request.user.id);
            return reply.status(204).send();
        });
        app.get('/me', async (request, reply) => {
            const { page, limit } = request.query;
            const pageNum = page ? Number(page) : undefined;
            const limitNum = limit ? Number(limit) : undefined;
            const result = await useCase.getUserCommunities(request.user.id, pageNum, limitNum);
            return reply.send(result);
        });
    });
}
