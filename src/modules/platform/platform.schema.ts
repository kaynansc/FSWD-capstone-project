import { z } from 'zod'

export const searchManagedCommunitiesSchema = z.object({
  page: z.string().transform(str => Number(str)).optional(),
  limit: z.string().transform(str => Number(str)).optional()
})

export const searchCommunityMembersSchema = z.object({
  page: z.string().transform(str => Number(str)).optional(),
  limit: z.string().transform(str => Number(str)).optional()
})

export type SearchManagedCommunitiesInput = z.infer<typeof searchManagedCommunitiesSchema>
export type SearchCommunityMembersInput = z.infer<typeof searchCommunityMembersSchema> 