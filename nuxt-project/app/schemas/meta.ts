import { z } from 'zod'

export const MetaSchema = z.object({
  id: z.string().uuid().optional(),
  idx: z.number().optional(),
  user_id: z.string().uuid().optional(),
  country_code: z.string().length(2).optional(),
  tags: z.union([z.string(), z.array(z.string())]).nullable().optional(),
  title: z.string().max(200).optional(),
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  image_url: z.string().url(),
  metadata: z.record(z.any()).nullable().optional(),
  add_date: z.string().optional(),
  edit_date: z.string().optional(),
  created_by: z.string().nullable().optional(),
  updated_by: z.string().nullable().optional(),
  original_id: z.string().nullable().optional()
})

export const MetaCreateSchema = MetaSchema.omit({ id: true, add_date: true, edit_date: true })
export const MetaUpdateSchema = MetaSchema.partial()

export type MetaInput = z.infer<typeof MetaSchema>
export type MetaCreateInput = z.infer<typeof MetaCreateSchema>
export type MetaUpdateInput = z.infer<typeof MetaUpdateSchema>
