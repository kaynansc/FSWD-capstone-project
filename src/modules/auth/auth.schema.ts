import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

export type LoginInput = z.infer<typeof loginSchema> 
export type RegisterInput = z.infer<typeof registerSchema> 