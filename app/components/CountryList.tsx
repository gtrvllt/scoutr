"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import countries from "@/lib/countries.json";

export const CountryList = () => {
  const [filter, setFilter] = useState("");

  const getFilteredCountries = (query: string) => {
    return countries.filter((country) =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredCountries = getFilteredCountries(filter);

  const handleSearch = function (value) {
    setFilter(value);
  };

  return (
    <div className="p-4 country-list">
      <input
        type="search"
        placeholder="Search a country"
        className="border-none"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      ></input>
      <ul className="space-y-2">
        {/* {countries.map((country) => ( */}
        {filteredCountries.map((country) => (
          <li key={country.code}>
            <Link
              href={`/country/${country.code}`}
              className="block p-1 text-gray-900 hover:bg-gray-900 hover:text-white transition duration-100 ease-in-out"
            >
              {country.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
