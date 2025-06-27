"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = eventRoutes;
const event_usecase_1 = require("./event.usecase");
const event_repository_1 = require("./event.repository");
const community_repository_1 = require("../community/community.repository");
const event_schema_1 = require("./event.schema");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const auth_middleware_1 = require("../auth/auth.middleware");
async function eventRoutes(app) {
    const eventRepository = new event_repository_1.EventRepository();
    const communityRepository = new community_repository_1.CommunityRepository();
    const useCase = new event_usecase_1.EventUseCase(eventRepository, communityRepository);
    // Public routes
    app.register(async function (app) {
        app.addHook('onRequest', auth_middleware_1.authenticate);
        app.get('/communities/:communityId/events', {
            schema: {
                querystring: (0, zod_to_json_schema_1.zodToJsonSchema)(event_schema_1.searchEventSchema)
            }
        }, async (request, reply) => {
            const { communityId } = request.params;
            const params = request.query;
            const result = await useCase.searchEvents(communityId, params, request.user?.id);
            return reply.send(result);
        });
        app.get('/events/:id', async (request, reply) => {
            const { id } = request.params;
            const event = await useCase.getEventById(id, request.user?.id);
            return reply.send(event);
        });
    });
    // Protected routes (organizer/admin)
    app.register(async function (app) {
        app.addHook('onRequest', auth_middleware_1.authenticate);
        app.addHook('onRequest', (0, auth_middleware_1.authorizeRole)(['admin', 'organizer']));
        app.post('/communities/:communityId/events', {
            schema: {
                body: (0, zod_to_json_schema_1.zodToJsonSchema)(event_schema_1.createEventSchema)
            }
        }, async (request, reply) => {
            const { communityId } = request.params;
            const data = request.body;
            const event = await useCase.createEvent({ ...data, communityId }, request.user.id);
            return reply.status(201).send(event);
        });
        app.put('/events/:id', {
            schema: {
                body: (0, zod_to_json_schema_1.zodToJsonSchema)(event_schema_1.updateEventSchema)
            }
        }, async (request, reply) => {
            const { id } = request.params;
            const data = request.body;
            const event = await useCase.updateEvent(id, data, request.user.id);
            return reply.send(event);
        });
        app.delete('/events/:id', async (request, reply) => {
            const { id } = request.params;
            await useCase.deleteEvent(id, request.user.id);
            return reply.status(204).send();
        });
        app.get('/events/:id/participants', async (request, reply) => {
            const { id } = request.params;
            const { page, limit } = request.query;
            const pageNum = page ? Number(page) : undefined;
            const limitNum = limit ? Number(limit) : undefined;
            const result = await useCase.getEventParticipants(id, request.user.id, pageNum, limitNum);
            return reply.send(result);
        });
    });
    // Protected routes (authenticated users)
    app.register(async function (app) {
        app.addHook('onRequest', auth_middleware_1.authenticate);
        app.post('/events/:id/attendance', async (request, reply) => {
            const { id } = request.params;
            await useCase.joinEvent(id, request.user.id);
            return reply.status(201).send({ message: 'Successfully joined the event' });
        });
        app.delete('/events/:id/attendance', async (request, reply) => {
            const { id } = request.params;
            await useCase.leaveEvent(id, request.user.id);
            return reply.status(204).send();
        });
        //WIP
        // app.post('/events/:id/attendance', async (request, reply) => {
        //   const { id } = request.params as { id: string }
        //   await useCase.attendEvent(id, (request as AuthenticatedRequest).user.id)
        //   return reply.status(201).send({ message: 'Successfully attended the event' })
        // })
    });
}
