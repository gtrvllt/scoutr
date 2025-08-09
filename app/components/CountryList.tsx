"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import countries from "@/lib/countries.json";
import { FiSearch } from "react-icons/fi";

export const CountryList = () => {
  const [filter, setFilter] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const pathName = usePathname();

  useEffect(() => {
    if (pathName.startsWith("/country/")) {
      setIsOpen(false);
    }
  }, [pathName]);

  const handleSearch = (value: string) => {
    setFilter(value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={`country-list bg-white/80 backdrop-blur-md fixed top-54 left-0 z-50 h-[calc(100vh-54px)] overflow-y-scroll transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-10"
        }`}
      >
        {/* Content visible only when open */}
        {isOpen && (
          <div className="p-4">
            {/* Search input */}
            <div className="sticky top-0 z-10 bg-white p-4 pl-0">
              <input
                type="search"
                placeholder="Search a country"
                className="border-none w-full px-2 py-1"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <FiSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
            </div>

            {/* Country list */}
            <div className="max-h-100">
              <ul className="space-y-2 mt-2 flex flex-col h-full">
                {filteredCountries.map((country) => (
                  <li key={country.code}>
                    <Link
                      href={`/country/${country.code}`}
                      className="block p-1 text-gray-900 hover:bg-gray-900 hover:text-white transition"
                    >
                      {country.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={toggleSidebar}
        className="toggle-country-list  bg-transparent sticky transition-all duration-300 ease-in-out"
        style={{
          left: isOpen ? "264px" : "12px", // 256px (w-64) + 20px ou 40px (w-10) + 12px
        }}
      >
        {/* {isOpen ? "<" : ">"} */}
        <svg
          width="18"
          height="31"
          viewBox="0 0 18 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path d="M2 2L15.5 15.5L2 29" stroke="black" strokeWidth="3" />
        </svg>
      </button>
    </>
  );
};
