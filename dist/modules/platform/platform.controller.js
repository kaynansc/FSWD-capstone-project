"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformRoutes = platformRoutes;
const platform_repository_1 = require("./platform.repository");
const platform_usecase_1 = require("./platform.usecase");
async function platformRoutes(app) {
    const platformRepository = new platform_repository_1.PlatformRepository();
    const platformUsecase = new platform_usecase_1.PlatformUsecase(platformRepository);
    app.get('/summary', async (request, reply) => {
        try {
            const summary = await platformUsecase.getSummary();
            reply.send(summary);
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });
}
