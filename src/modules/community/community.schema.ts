import { z } from 'zod'

const locationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  lat: z.number(),
  lon: z.number()
})

export const createCommunitySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be at most 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().uuid('Invalid category ID'),
  location: locationSchema,
  meetingSchedule: z.string().min(3).max(255),
  contactEmail: z.string().email(),
  bannerImageUrl: z.string().url().optional()
})

export const updateCommunitySchema = createCommunitySchema.partial()

export const searchCommunitySchema = z.object({
  search: z.string().optional(),
  category: z.string().uuid('Invalid category ID').optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  distance: z.number().positive('Distance must be positive').optional(),
  page: z.number().int().positive('Page must be positive').default(1),
  limit: z.number().int().positive('Limit must be positive').max(100, 'Limit must be at most 100').default(10),
  mostFeatured: z.boolean().optional().default(false)
})

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>
export type SearchCommunityInput = z.infer<typeof searchCommunitySchema> 