"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
exports.updateUserProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    bio: zod_1.z.string().optional(),
    interests: zod_1.z.array(zod_1.z.string().uuid()).optional()
});
