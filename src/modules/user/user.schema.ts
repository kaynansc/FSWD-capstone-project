import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
})

export const updateUserProfileSchema = z.object({
  name: z.string().min(3).optional(),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  interests: z.array(z.string().uuid()).optional()
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema> 