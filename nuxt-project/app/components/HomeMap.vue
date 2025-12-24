<template>
  <div class="map-container h-full">
    <div ref="mapContainerRef" style="height: calc(100% - 30px); width: 100%;"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { FeatureCollection } from 'geojson'
import { useRouter } from 'vue-router'
import { fetchCountries } from '~/composables/useCountries'
import { useCountryListStore } from '~/stores/countryList'

const mapContainerRef = ref<HTMLDivElement | null>(null)
let mapRef: any = null
let hoveredFeatureIdRef: any = null
let lastHoveredNameRef: string | null = null
let rafRef: number | null = null

const hoveredCountry = ref<string | null>(null)
const countries = ref<any[]>([])

const router = useRouter()
const countryListStore = useCountryListStore()

onMounted(async () => {
  const config = useRuntimeConfig()
  const token = config.public.NUXT_PUBLIC_MAPBOX_TOKEN as string | undefined

  const mapboxgl = (await import('mapbox-gl')).default
  if (!token) {
    console.error('NUXT_PUBLIC_MAPBOX_TOKEN missing. Set it in nuxt-project/.env and runtimeConfig.')
  }
  mapboxgl.accessToken = token || ''

  try {
    countries.value = await fetchCountries()
  } catch (e) {
    console.error('Error fetching countries', e)
  }

  let geojsonData: FeatureCollection | null = null
  try {
    const res = await fetch('https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson')
    const data = (await res.json()) as FeatureCollection & { features: Array<any> }
    if (countries.value.length > 0) {
      data.features.forEach((feature: any) => {
        const code = feature?.properties?.iso_a2?.toUpperCase?.()
        if (code) {
          const c = countries.value.find((c: any) => c.code === code)
          feature.properties.isCovered = c?.isCovered || false
        }
      })
    }
    geojsonData = data
  } catch (e) {
    console.error('Erreur lors de la récupération des données GeoJSON :', e)
  }

  if (!geojsonData || !mapContainerRef.value) return

  const styleOrEmpty =
    process.env.NUXT_PUBLIC_MAPBOX_NO_BASEMAP === 'true'
      ? ({ version: 8, sources: {}, layers: [] } as any)
      : ('mapbox://styles/mapbox/light-v11' as any)

  const map = new (mapboxgl as any).Map({
    container: mapContainerRef.value,
    style: styleOrEmpty,
    center: [0, 20],
    zoom: 2,
    renderWorldCopies: false,
    minZoom: 1.2,
    maxZoom: 5,
    cooperativeGestures: true,
    localIdeographFontFamily: 'sans-serif',
  })

  mapRef = map

  map.on('load', () => {
    ;(map as any).setPrefetchZoomDelta?.(0)

    map.scrollZoom.enable()
    map.doubleClickZoom.enable()
    map.boxZoom.enable()
    map.keyboard.enable()
    map.dragRotate.disable()
    map.touchZoomRotate.enable()
    ;(map.touchZoomRotate as any).disableRotation?.()

    map.addSource('countries', {
      type: 'geojson',
      data: geojsonData as any,
      generateId: true,
    } as any)

    map.addLayer({
      id: 'countries-fill',
      type: 'fill',
      source: 'countries',
      paint: {
        'fill-color': '#04BCAF',
        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.7, 0.3],
      },
    })

    map.addLayer({
      id: 'countries-outline',
      type: 'line',
      source: 'countries',
      paint: { 'line-color': '#000000', 'line-width': 1.5 },
    })

    const onMouseMove = (e: any) => {
      if (rafRef) return
      rafRef = requestAnimationFrame(() => {
        rafRef = null
        const feature = e.features?.[0]
        if (!feature) return

        const name = feature?.properties?.name ?? null
        if (lastHoveredNameRef !== name) {
          lastHoveredNameRef = name
          hoveredCountry.value = name
        }

        const newId = feature.id
        const prevId = hoveredFeatureIdRef
        if (newId !== prevId) {
          if (prevId !== null && prevId !== undefined) {
            map.setFeatureState({ source: 'countries', id: prevId }, { hover: false })
          }
          hoveredFeatureIdRef = newId
          if (newId !== undefined && newId !== null) {
            map.setFeatureState({ source: 'countries', id: newId }, { hover: true })
          }
        }

        map.getCanvas().style.cursor = 'pointer'
      })
    }

    map.on('mousemove', 'countries-fill', onMouseMove)

    map.on('mouseleave', 'countries-fill', () => {
      if (hoveredFeatureIdRef !== null) {
        map.setFeatureState({ source: 'countries', id: hoveredFeatureIdRef }, { hover: false })
      }
      hoveredFeatureIdRef = null
      hoveredCountry.value = null
      lastHoveredNameRef = null
      map.getCanvas().style.cursor = ''
    })

    map.on('click', 'countries-fill', (e: any) => {
      const feature = e.features?.[0]
      const code = feature?.properties?.iso_a2
      if (code) {
        countryListStore.setIsCountryListOpen(false)
        router.push(`/country/${code}`)
      }
    })

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
    let isRecentering = false
    const onMoveEnd = () => {
      if (isRecentering) {
        isRecentering = false
        return
      }
      const c = map.getCenter()
      let lng = c.lng
      let lat = clamp(c.lat, -85, 85)
      const threshold = 175
      let jumped = false
      if (lng > threshold) {
        lng -= 360
        jumped = true
      } else if (lng < -threshold) {
        lng += 360
        jumped = true
      }
      if (jumped || lat !== c.lat) {
        isRecentering = true
        map.jumpTo({ center: [lng, lat], zoom: map.getZoom(), bearing: 0, pitch: 0 })
      }
    }
    map.on('moveend', onMoveEnd)
  })
})

onBeforeUnmount(() => {
  if (rafRef !== null) {
    try {
      cancelAnimationFrame(rafRef)
    } catch (e) {}
    rafRef = null
  }
  if (mapRef) {
    mapRef.remove()
    mapRef = null
  }
})
</script>


