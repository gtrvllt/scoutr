"use client";
import React, { useState, useEffect } from "react";
import type { FeatureCollection } from "geojson";
import type { MapContainerProps } from "react-leaflet";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import Departure from "./home/Departure";
import "leaflet/dist/leaflet.css";
import "@/ui/global.css"; // Importez votre fichier CSS global

// Importation dynamique de MapContainer et d'autres composants leaflet
const MapContainer = dynamic(() =>
  import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() =>
  import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() =>
  import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });


const HomeMap: React.FC = () => {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(
    null
  );
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson"
        );
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données GeoJSON :",
          error
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Vous pouvez ajouter ici tout code qui dépend du routeur
  }, [pathname]);

  const onEachCountry = (feature: any, layer: any) => {
    layer.on({
      mouseover: () => {
        setHoveredCountry(feature.properties.name);
      },
      mouseout: () => {
        setHoveredCountry(null);
      },
      click: () => {
        // Rediriger vers la page spécifique du pays
        const countryCode = feature.properties.iso_a2;
        router.push(`/country/${countryCode}`);
      },
    });

    // Ajouter une infobulle pour afficher le nom du pays avec des styles personnalisés
    // layer.bindTooltip(feature.properties.name, {
    //   permanent: false,
    //   sticky: true,
    //   className: "custom-tooltip",
    // });
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
    <div className="map-container h-full" style={{ padding: '12px' }}>
      <Departure hoveredCountry={hoveredCountry} />
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "calc(100% - 30px)", width: "100%" }}
      >
        {/* <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        /> */}
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
