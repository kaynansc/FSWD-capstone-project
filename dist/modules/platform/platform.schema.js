"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummaryResponseSchema = void 0;
const zod_1 = require("zod");
exports.getSummaryResponseSchema = zod_1.z.object({
    communities: zod_1.z.number(),
    users: zod_1.z.number(),
    events: zod_1.z.number(),
});
