# Test Supabase API CRUD via curl
# Replace <SUPABASE_URL> and <ANON_KEY> with your project values
# You can get your anon key from the Supabase dashboard > Project Settings > API

SUPABASE_URL="https://<SUPABASE_URL>.supabase.co"
ANON_KEY="<ANON_KEY>"

# 1. Create Meta
curl -X POST "$SUPABASE_URL/rest/v1/metas" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Meta", "description": "Created via curl"}'

# 2. List Metas
curl -X GET "$SUPABASE_URL/rest/v1/metas?select=*" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"

# 3. Update Meta (replace <ID> with a real id)
curl -X PATCH "$SUPABASE_URL/rest/v1/metas?id=eq.<ID>" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Meta"}'

# 4. Delete Meta (replace <ID> with a real id)
curl -X DELETE "$SUPABASE_URL/rest/v1/metas?id=eq.<ID>" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"
