/**
 * Downloads country hero images from Unsplash and uploads them to Supabase Storage.
 * Run once: node scripts/upload-country-images.mjs
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env manually
const envPath = resolve(__dirname, '../.env')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
    .map(([k, ...v]) => [k, v.join('=')])
)

const SUPABASE_URL = env.NUXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || env.UNSPLASH_ACCESS_KEY
const BUCKET = 'images'
const FOLDER = 'countries'

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === 'your_service_role_key_here') {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing or not set in .env')
  process.exit(1)
}
if (!UNSPLASH_ACCESS_KEY) {
  console.error('❌ Pass your Unsplash Access Key: UNSPLASH_ACCESS_KEY=xxx node scripts/upload-country-images.mjs')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// Remaining countries (39) — already uploaded ones removed
const countries = [
  { code: 'MX', name: 'Mexico', id: 'uILhNE1VcwA' },
  { code: 'MN', name: 'Mongolia', id: 'yhbanN00pb8' },
  { code: 'ME', name: 'Montenegro', id: '_nupO8tu6sg' },
  { code: 'NP', name: 'Nepal', id: 'dstd4DoLQ90' },
  { code: 'NL', name: 'Netherlands', id: 'kNmlCjM3apA' },
  { code: 'NZ', name: 'New Zealand', id: '73F4pKoUkM0' },
  { code: 'NG', name: 'Nigeria', id: '67ruAEYmp4c' },
  { code: 'MK', name: 'North Macedonia', id: 'DULgmeMAtzQ' },
  { code: 'NO', name: 'Norway', id: 'khbjgGAerPU' },
  { code: 'PA', name: 'Panama', id: '0loy9XzGkAI' },
  { code: 'PH', name: 'Philippines', id: '9ZXHUr5aCwM' },
  { code: 'PL', name: 'Poland', id: 'VpCHHjbUJvY' },
  { code: 'PT', name: 'Portugal', id: 'gOLCAOuc7iA' },
  { code: 'RO', name: 'Romania', id: 'vYi0kzbK4sU' },
  { code: 'RU', name: 'Russia', id: 'B_F3hj-Z_Sc' },
  { code: 'RW', name: 'Rwanda', id: 'z-lNmXoXt-k' },
  { code: 'SN', name: 'Senegal', id: '7OVL_rjXSSM' },
  { code: 'RS', name: 'Serbia', id: 'xHnomVS0SiU' },
  { code: 'SG', name: 'Singapore', id: '7ryPpZK1qV8' },
  { code: 'SK', name: 'Slovakia', id: 'RErhr8r1q6s' },
  { code: 'SI', name: 'Slovenia', id: 'pOWBHdgy1Lo' },
  { code: 'ZA', name: 'South Africa', id: '04-C1NZk1hE' },
  { code: 'KR', name: 'South Korea', id: '5htrsUUbFGI' },
  { code: 'ES', name: 'Spain', id: 'VbLTNceBTFE' },
  { code: 'LK', name: 'Sri Lanka', id: 'jpTT_SAU034' },
  { code: 'SE', name: 'Sweden', id: 'EqtvTJ-ufnM' },
  { code: 'CH', name: 'Switzerland', id: 'V7WkmXntA8M' },
  { code: 'TW', name: 'Taiwan', id: 'au3CYbd7vCU' },
  { code: 'TZ', name: 'Tanzania', id: 'B8QoatPKAJg' },
  { code: 'TH', name: 'Thailand', id: 'sydwCr54rf0' },
  { code: 'TN', name: 'Tunisia', id: 'NULfCuLFTLg' },
  { code: 'TR', name: 'Turkey', id: 'WA1u0scVLZU' },
  { code: 'UG', name: 'Uganda', id: 'wrM9TOVDSrs' },
  { code: 'UA', name: 'Ukraine', id: '50vvwcNFFzU' },
  { code: 'AE', name: 'United Arab Emirates', id: 'Fr6zexbmjmc' },
  { code: 'GB', name: 'United Kingdom', id: '6b3r1WAjPBI' },
  { code: 'US', name: 'United States', id: 'UM8bURrginM' },
  { code: 'UY', name: 'Uruguay', id: 'YqUW7fT5NwM' },
  { code: 'VN', name: 'Vietnam', id: 'vcu-OZBxxRk' },
]

async function downloadImage(unsplashId) {
  // Get photo info from Unsplash API
  const apiRes = await fetch(`https://api.unsplash.com/photos/${unsplashId}`, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
  })
  if (!apiRes.ok) throw new Error(`Unsplash API ${apiRes.status} for ${unsplashId}`)
  const photo = await apiRes.json()
  const rawUrl = `${photo.urls.raw}&w=1400&auto=format&fit=crop&q=80`

  // Download the actual image
  const imgRes = await fetch(rawUrl)
  if (!imgRes.ok) throw new Error(`Image download ${imgRes.status}`)
  const buffer = await imgRes.arrayBuffer()
  return { buffer, contentType: 'image/jpeg' }
}

async function uploadToSupabase(code, buffer, contentType) {
  const path = `${FOLDER}/${code.toLowerCase()}.jpg`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

const results = {}
let success = 0
let failed = 0

for (const country of countries) {
  try {
    process.stdout.write(`⬇️  ${country.name} (${country.code})... `)
    const { buffer, contentType } = await downloadImage(country.id)
    const publicUrl = await uploadToSupabase(country.code, buffer, contentType)
    results[country.code] = publicUrl
    success++
    console.log(`✅`)
  } catch (err) {
    failed++
    console.log(`❌ ${err.message}`)
  }
}

console.log(`\n✅ ${success} uploaded, ❌ ${failed} failed`)
console.log('\nAdd these to countries.ts:\n')
for (const [code, url] of Object.entries(results)) {
  console.log(`  ${code}: "${url}"`)
}

// Write results to a JSON file for reference
writeFileSync(resolve(__dirname, '../scripts/country-image-urls.json'), JSON.stringify(results, null, 2))
console.log('\n📄 URLs saved to scripts/country-image-urls.json')
