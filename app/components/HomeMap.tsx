"use client";
import React, { useEffect, useRef, useState } from "react";
import type { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter, usePathname } from "next/navigation";
import "@/ui/global.css"; // Importez votre fichier CSS global
import { fetchCountries } from "@/lib/data";
import { useCountryListStore } from "@/store/countryListStore";

const HomeMap: React.FC = () => {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [countries, setCountries] = useState<any[]>([]); // État pour stocker les pays

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const hoveredFeatureIdRef = useRef<number | string | null>(null);
  const lastHoveredNameRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Charger pays + GeoJSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson"
        );
        const data = (await response.json()) as FeatureCollection & {
          features: Array<any>;
        };
        // Ajouter isCovered si disponible
        if (countries.length > 0) {
          data.features.forEach((feature: any) => {
            const code = feature?.properties?.iso_a2?.toUpperCase?.();
            if (code) {
              const c = countries.find((c) => c.code === code);
              feature.properties.isCovered = c?.isCovered || false;
            }
          });
        }
        setGeojsonData(data as FeatureCollection);
      } catch (error) {
        console.error("Erreur lors de la récupération des données GeoJSON :", error);
      }
    };

    const loadCountries = async () => {
      try {
        const fetchedCountries = await fetchCountries();
        setCountries(fetchedCountries || []);
        await fetchData();
      } catch (error) {
        console.error("Erreur lors de la récupération des pays :", error);
      }
    };

    loadCountries();
  }, []);

  // Initialiser Mapbox quand les données sont prêtes
  useEffect(() => {
    if (!geojsonData || !mapContainerRef.current || mapRef.current) return;

    // Nécessite NEXT_PUBLIC_MAPBOX_TOKEN
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token manquant. Définissez NEXT_PUBLIC_MAPBOX_TOKEN.");
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [0, 20],
      zoom: 2,
      renderWorldCopies: true, // valeur par défaut; explicitée pour clarté
      // maxBounds: [
      //   [-180, -85], // Sud-Ouest [lng, lat]
      //   [180, 85], // Nord-Est
      // ],
    });

    mapRef.current = map;

    map.on("load", () => {
      // Source GeoJSON avec IDs générés pour feature-state
      map.addSource("countries", {
        type: "geojson",
        data: geojsonData as any,
        generateId: true,
      } as any);

      // Calque de remplissage
      map.addLayer({
        id: "countries-fill",
        type: "fill",
        source: "countries",
        paint: {
          "fill-color": "#04BCAF",
          // Opacité plus forte au survol (feature-state)
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.7,
            0.3,
          ],
        },
      });

      // Contour
      map.addLayer({
        id: "countries-outline",
        type: "line",
        source: "countries",
        paint: { "line-color": "#000000", "line-width": 1.5 },
      });

      // Interactions
      // Throttle hover updates via rAF and avoid no-op updates
      const onMouseMove = (e: any) => {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          const feature = e.features?.[0];
          if (!feature) return;

          const name = feature?.properties?.name ?? null;
          if (lastHoveredNameRef.current !== name) {
            lastHoveredNameRef.current = name;
            setHoveredCountry(name);
          }

          const newId = feature.id;
          const prevId = hoveredFeatureIdRef.current;
          if (newId !== prevId) {
            if (prevId !== null && prevId !== undefined) {
              map.setFeatureState(
                { source: "countries", id: prevId },
                { hover: false }
              );
            }
            hoveredFeatureIdRef.current = newId;
            if (newId !== undefined && newId !== null) {
              map.setFeatureState({ source: "countries", id: newId }, { hover: true });
            }
          }

          map.getCanvas().style.cursor = "pointer";
        });
      };
      map.on("mousemove", "countries-fill", onMouseMove);

      map.on("mouseleave", "countries-fill", () => {
        if (hoveredFeatureIdRef.current !== null) {
          map.setFeatureState(
            { source: "countries", id: hoveredFeatureIdRef.current },
            { hover: false }
          );
        }
        hoveredFeatureIdRef.current = null;
        setHoveredCountry(null);
        lastHoveredNameRef.current = null;
        map.getCanvas().style.cursor = "";
      });

      map.on("click", "countries-fill", (e: any) => {
        const feature = e.features?.[0];
        const code = feature?.properties?.iso_a2;
        if (code) {
          setIsCountryListOpen(false);
          router.push(`/country/${code}`);
        }
      });
    });

    return () => {
      if (mapRef.current) {
        // Cleanup any pending rAF from mousemove throttling
        if (rafRef.current !== null) {
          try { cancelAnimationFrame(rafRef.current); } catch {}
          rafRef.current = null;
        }
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [geojsonData]);

  useEffect(() => {
    // Code dépendant du routeur si besoin
  }, [pathname]);

  const setIsCountryListOpen = useCountryListStore((state) => state.setIsCountryListOpen);

  return (
    <div className="map-container h-full">
      <div
        ref={mapContainerRef}
        style={{ height: "calc(100% - 30px)", width: "100%" }}
      />
    </div>
  );
};

export default HomeMap;