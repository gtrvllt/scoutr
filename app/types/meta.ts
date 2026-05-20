export interface Meta {
    id: string
    idx?: number
    user_id?: string
    country_code?: string
    tags?: string | string[] | null
    title?: string
    name?: string
    description?: string | null
    image_url: string
    metadata?: Record<string, unknown> | null
    add_date?: string | null
    edit_date?: string | null
    created_by?: string | null
    updated_by?: string | null
    original_id?: string | null
}