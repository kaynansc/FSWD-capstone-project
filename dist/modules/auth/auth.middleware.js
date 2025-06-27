"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorizeRole = authorizeRole;
const app_error_1 = require("@/shared/errors/app-error");
async function authenticate(request, reply) {
    try {
        const decoded = await request.jwtVerify();
        request.user = decoded;
    }
    catch (err) {
        throw new app_error_1.UnauthorizedError();
    }
}
function authorizeRole(roles) {
    return async (request, reply) => {
        try {
            const user = request.user;
            if (!roles.includes(user.role)) {
                throw new app_error_1.ForbiddenError('Insufficient permissions');
            }
        }
        catch (err) {
            if (err instanceof app_error_1.ForbiddenError) {
                throw err;
            }
            throw new app_error_1.UnauthorizedError();
        }
    };
}
