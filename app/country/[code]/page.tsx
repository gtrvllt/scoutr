import countries from "@/lib/countries.json";
import { fetchMetas, fetchMetasByCountryCode } from "app/lib/data";
import { supabase } from "@/lib/supabase";
import MetaItem from "@/components/meta/MetaItem";
import CountryHeader from "@/components/country/CountryHeader";
import AddMeta from "@/components/AddMeta";
import MetaList from "@/components/meta/MetaList";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = countries.find((c) => c.code === code);
  console.log('ABC country:', country);

  // Attendre la promesse pour obtenir les données réelles
  const rawMetas = await fetchMetasByCountryCode(code);
  const metas = Array.isArray(rawMetas) ? rawMetas : [];
  console.log('ABC metas:', metas);

  const refreshMetas = async () => {
    console.log('refreshMetas called');
  }

  if (!country) {
    return (
      <div>
        <h1>Pays non trouvé</h1>
        <p>Aucune donnée disponible pour le code : {code}</p>
      </div>
    );
  }

  return (
    <>
      <div className="country-page-content">
        <CountryHeader country={country}></CountryHeader>
        {/* <AddMeta country={country}></AddMeta>
        <div className="meta-list">
          {metas?.map((meta) => {
            return <MetaItem key={meta.id} meta={meta} />;
          })}
        </div> */}
        <MetaList countryCode={country.code} />
      </div>
    </>
  );
}
