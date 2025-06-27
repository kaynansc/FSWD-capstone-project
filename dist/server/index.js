"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = require("./routes");
const error_handler_1 = require("@/shared/middleware/error-handler");
const app = (0, fastify_1.default)({
    logger: true
});
// Register CORS
app.register(cors_1.default, {
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
});
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'your-secret-key'
});
// Register error handler
app.setErrorHandler(error_handler_1.errorHandler);
async function bootstrap() {
    try {
        await (0, routes_1.registerRoutes)(app);
        await app.listen({ port: Number(process.env.PORT) || 3333, host: '0.0.0.0' });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
bootstrap();
