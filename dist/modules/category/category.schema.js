"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.listCategoriesSchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().max(255).optional()
});
exports.listCategoriesSchema = zod_1.z.object({
    mostFeatured: zod_1.z.boolean().optional().default(false),
    page: zod_1.z.number().int().positive('Page must be positive').default(1),
    limit: zod_1.z.number().int().positive('Limit must be positive').max(100, 'Limit must be at most 100').default(100)
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
