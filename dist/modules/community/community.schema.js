"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCommunitySchema = exports.updateCommunitySchema = exports.createCommunitySchema = void 0;
const zod_1 = require("zod");
const locationSchema = zod_1.z.object({
    address: zod_1.z.string().min(1, 'Address is required'),
    lat: zod_1.z.number(),
    lon: zod_1.z.number()
});
exports.createCommunitySchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be at most 100 characters'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    categoryId: zod_1.z.string().uuid('Invalid category ID'),
    location: locationSchema,
    meetingSchedule: zod_1.z.string().min(3).max(255),
    contactEmail: zod_1.z.string().email(),
    bannerImageUrl: zod_1.z.string().url().optional()
});
exports.updateCommunitySchema = exports.createCommunitySchema.partial();
exports.searchCommunitySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().uuid('Invalid category ID').optional(),
    lat: zod_1.z.number().optional(),
    lon: zod_1.z.number().optional(),
    distance: zod_1.z.number().positive('Distance must be positive').optional(),
    page: zod_1.z.number().int().positive('Page must be positive').default(1),
    limit: zod_1.z.number().int().positive('Limit must be positive').max(100, 'Limit must be at most 100').default(10),
    mostFeatured: zod_1.z.boolean().optional().default(false)
});
