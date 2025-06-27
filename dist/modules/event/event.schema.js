"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEventSchema = exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
const locationSchema = zod_1.z.object({
    address: zod_1.z.string().min(1, 'Address is required'),
    lat: zod_1.z.number(),
    lon: zod_1.z.number()
});
exports.createEventSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string(),
    date: zod_1.z.string().transform(str => new Date(str)),
    location: locationSchema,
});
exports.updateEventSchema = exports.createEventSchema.partial();
exports.searchEventSchema = zod_1.z.object({
    startDate: zod_1.z.string().transform(str => new Date(str)).optional(),
    endDate: zod_1.z.string().transform(str => new Date(str)).optional(),
    page: zod_1.z.string().transform(str => Number(str)).optional(),
    limit: zod_1.z.string().transform(str => Number(str)).optional()
});
