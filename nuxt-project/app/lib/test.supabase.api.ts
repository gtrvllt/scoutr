// Simple test script for supabase.api.ts fetchMetas and fetchMetaById
// Run with: npx tsx app/lib/test.supabase.api.ts
import { fetchMetas, fetchMetaById } from './supabase.api'

async function testFetchMetas() {
  console.log('Testing fetchMetas...')
  const { data, error } = await fetchMetas({ limit: 2 })
  if (error) {
    console.error('fetchMetas error:', error)
  } else {
    console.log('fetchMetas data:', data)
    if (data && data.length > 0) {
      const firstId = data[0].id
      await testFetchMetaById(firstId)
    } else {
      console.warn('No metas found to test fetchMetaById')
    }
  }
}

async function testFetchMetaById(id: string | number) {
  console.log(`Testing fetchMetaById with id=${id}...`)
  const { data, error } = await fetchMetaById(id)
  if (error) {
    console.error('fetchMetaById error:', error)
  } else {
    console.log('fetchMetaById data:', data)
  }
}

// Run tests
(async () => {
  await testFetchMetas()
})()
