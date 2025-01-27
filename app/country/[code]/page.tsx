import countries from "@/lib/countries.json";
import { fetchMetas } from 'app/lib/data';
import { supabase } from '@/lib/supabase';
import MetaItem from '@/components/MetaItem';

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const country = countries.find(c => c.code === code)

  const { data: metas, error } = await supabase
    .from('metas')
    .select('*');
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
      <h1>{country.name}</h1>
      <p>{code}</p>
      <div className="meta-list">
        {metas.map((meta) => {
          return (
            <MetaItem key={meta.id} meta={meta} />
          )
        })}
      </div>

    </>
  );
}