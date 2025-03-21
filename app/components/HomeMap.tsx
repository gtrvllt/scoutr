// components/HomeMap.tsx
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const countries = [
  { name: 'France', lat: 46.603354, lng: 1.888334, path: '/france' },
  { name: 'USA', lat: 37.09024, lng: -95.712891, path: '/usa' },
  // Ajoutez d'autres pays ici
];

const HomeMap: React.FC = () => {
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* {countries.map((country) => (
        <Marker key={country.name} position={[country.lat, country.lng]}>
          <Popup>{country.name}</Popup>
        </Marker>
      ))} */}
    </MapContainer>
  );
};

export default HomeMap;
