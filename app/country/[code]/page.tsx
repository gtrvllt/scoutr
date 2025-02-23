import countries from "@/lib/countries.json";
import { fetchMetas } from "app/lib/data";
import { supabase } from "@/lib/supabase";
import MetaItem from "@/components/meta/MetaItem";
import CountryHeader from "@/components/country/CountryHeader";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = countries.find((c) => c.code === code);

  const { data: metas, error } = await supabase.from("metas").select("*");
  fetchMetas();

  console.log("ABC country", country);
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
        <div className="meta-list">
          {metas.map((meta) => {
            return <MetaItem key={meta.id} meta={meta} />;
          })}
        </div>
      </div>
    </>
  );
}
