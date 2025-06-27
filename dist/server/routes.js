"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const user_controller_1 = require("@/modules/user/user.controller");
const auth_controller_1 = require("@/modules/auth/auth.controller");
const category_controller_1 = require("@/modules/category/category.controller");
const community_controller_1 = require("@/modules/community/community.controller");
const auth_middleware_1 = require("@/modules/auth/auth.middleware");
const event_controller_1 = require("../modules/event/event.controller");
const platform_controller_1 = require("../modules/platform/platform.controller");
async function registerRoutes(app) {
    // Public routes
    app.register(auth_controller_1.authRoutes, { prefix: 'api/auth' });
    app.register(category_controller_1.categoryRoutes, { prefix: 'api/categories' });
    app.register(community_controller_1.communityRoutes, { prefix: 'api/communities' });
    app.register(event_controller_1.eventRoutes, { prefix: 'api' });
    app.register(platform_controller_1.platformRoutes, { prefix: 'api/platform' });
    // Protected routes
    app.register(async function (app) {
        app.addHook('onRequest', auth_middleware_1.authenticate);
        app.register(user_controller_1.userRoutes, { prefix: 'api/users' });
    });
}
