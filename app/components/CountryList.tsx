'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import countries from "@/lib/countries.json";

export const CountryList = () => {
    const [filter, setFilter] = useState("")

    return (
        <div className="p-4 bg-gray-50 rounded-md shadow">
            <h2 className="text-lg font-bold mb-4">Countries</h2>
            <ul className="space-y-2">
                {countries.map((country) => (
                    <li key={country.code}>
                        <Link
                            href={`/country/${country.code}`}
                            className="block p-1 text-gray-900 hover:bg-gray-900 hover:text-white transition duration-300 ease-in-out"
                        >
                            {country.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};