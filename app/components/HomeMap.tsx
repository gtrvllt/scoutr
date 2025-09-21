"use client";
import React, { useState, useEffect } from "react";
import type { FeatureCollection } from "geojson";
import type { MapContainerProps } from "react-leaflet";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import Departure from "./home/Departure";
import "leaflet/dist/leaflet.css";
import "@/ui/global.css"; // Importez votre fichier CSS global
import { fetchCountries } from "@/lib/data";

// Importation dynamique de MapContainer et d'autres composants leaflet
const MapContainer = dynamic(() =>
  import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(() =>
  import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(() =>
  import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);

const HomeMap: React.FC = () => {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [countries, setCountries] = useState<any[]>([]); // État pour stocker les pays
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson"
        );
        const data = await response.json();
        console.log("GeoJSON data fetched:", data);

        // Ajouter isCovered uniquement si countries est disponible
        if (countries.length > 0) {
          data.features.forEach((feature: any) => {
            const countryCode = feature.properties.iso_a2.toUpperCase();
            console.log("feature.properties:", feature.properties);
            if (feature.properties) {
              const c = countries.find((c) => c.code === countryCode);
              feature.properties.isCovered = c?.isCovered || false;
            }
          });
        }
        setGeojsonData(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données GeoJSON :",
          error
        );
      }
    };

    // Appeler fetchCountries et attendre son résultat
    const loadCountries = async () => {
      try {
        const fetchedCountries = await fetchCountries();
        setCountries(fetchedCountries); // Mettre à jour l'état avec les pays
        // Appeler fetchData uniquement si countries est chargé
        await fetchData();
      } catch (error) {
        console.error("Erreur lors de la récupération des pays :", error);
      }
    };

    loadCountries();
  }, []); // Vide pour exécuter une seule fois au montage

  useEffect(() => {
    // Code dépendant du routeur
  }, [pathname]);

  const onEachCountry = (feature: any, layer: any) => {
    layer.on({
      mouseover: () => setHoveredCountry(feature.properties.name),
      mouseout: () => setHoveredCountry(null),
      click: () => {
        const countryCode = feature.properties.iso_a2;
        router.push(`/country/${countryCode}`);
      },
    });
  };

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  if (!geojsonData) {
    return <div>Chargement...</div>;
  }



  return (
    <div className="map-container h-full" style={{ padding: "12px" }}>
      <Departure hoveredCountry={hoveredCountry} />
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "calc(100% - 30px)", width: "100%" }}
        maxBounds={[
          [-85, -180], // Sud-Ouest
          [85, 180],   // Nord-Est
        ]}
        maxBoundsViscosity={1.0}
      >
        <GeoJSON
          data={geojsonData}
          style={(feature) => ({
            fillColor:
              hoveredCountry === feature?.properties?.name ? "pink" : "#04BCAF",
            weight: 2,
            color: "black",
            fillOpacity:
              hoveredCountry === feature?.properties?.name ? 0.7 : 0.3,
          })}
          onEachFeature={onEachCountry}
        />
      </MapContainer>
    </div>
  );
};

export default HomeMap;