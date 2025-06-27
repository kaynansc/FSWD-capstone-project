"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const app_error_1 = require("../errors/app-error");
async function errorHandler(error, request, reply) {
    if (error instanceof app_error_1.AppError) {
        return reply.status(error.statusCode).send({
            error: error.name,
            message: error.message
        });
    }
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
        return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Invalid token'
        });
    }
    if (error.name === 'TokenExpiredError') {
        return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Token expired'
        });
    }
    // Log unexpected errors
    request.log.error(error);
    // Handle unexpected errors
    return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
    });
}
