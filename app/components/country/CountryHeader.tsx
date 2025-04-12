"use client";
import "@/ui/global.css";

export interface CountryProps {
  name: string;
  code: string;
  continent: Record<string, any>;
}

const CountryHeader = ({ country }: { country: CountryProps }) => {
  return (
    <div className="country-header pb-6">
      <div className="country-details">

      </div>
      <h1 className="font-bold">{country.name}</h1>
      <p>Code // {country.code}</p>
      <p>Continent // {country.continent}</p>
    </div>
  );
};

export default CountryHeader;
