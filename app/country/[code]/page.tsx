import countries from "@/lib/countries.json";
import { fetchMetas } from "app/lib/data";
import { supabase } from "@/lib/supabase";
import MetaItem from "@/components/meta/MetaItem";
import CountryHeader from "@/components/country/CountryHeader";
import AddMeta from "@/components/AddMeta";


export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = countries.find((c) => c.code === code);
  console.log('ABC country:', country);

  const { data: metas, error } = await supabase
    .from("metas")
    .select("*")
    .contains("country_codes", [country?.code]);
  console.log("metas:", metas);
  fetchMetas();

  if (!country) {
    return (
      <div>
        <h1>Country not found</h1>
        <p>No data available for code: {code}</p>
      </div>
    );
  }
  return (
    <>
      <div className="country-page-content">
        <CountryHeader country={country}></CountryHeader>
        <AddMeta country={country}></AddMeta>
        <div className="meta-list">
          {metas?.map((meta) => {
            return <MetaItem key={meta.id} meta={meta} />;
          })}
        </div>
      </div>
    </>
  );
}
