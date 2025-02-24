// components/HomeMap.tsx
"use client";
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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
