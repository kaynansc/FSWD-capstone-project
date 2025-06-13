import { z } from 'zod'

const locationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  lat: z.number(),
  lon: z.number()
})

export const createEventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string(),
  date: z.string().transform(str => new Date(str)),
  location: locationSchema,
})

export const updateEventSchema = createEventSchema.partial()

export const searchEventSchema = z.object({
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
  page: z.string().transform(str => Number(str)).optional(),
  limit: z.string().transform(str => Number(str)).optional()
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type SearchEventInput = z.infer<typeof searchEventSchema> 