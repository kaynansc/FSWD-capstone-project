import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(255).optional()
})

export const listCategoriesSchema = z.object({
  mostFeatured: z.boolean().optional().default(false),
  page: z.number().int().positive('Page must be positive').default(1),
  limit: z.number().int().positive('Limit must be positive').max(100, 'Limit must be at most 100').default(100)
})

export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema> 
export type ListCategoriesInput = z.infer<typeof listCategoriesSchema>