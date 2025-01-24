import countries from "@/lib/countries.json";
import { fetchMetas } from 'app/lib/data';
import { supabase } from '@/lib/supabase';

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const country = countries.find(c => c.code === code)

  const supabase = supabase.createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: metas, error } = await supabase
  .from('metas')
  .select('*');
  fetchMetas();
  console.log('ABC metas', metas)

  if (!country) {
    return (
      <div>
        <h1>Country not found</h1>
        <p>No data available for code: {code}</p>
      </div>
    );
  }
  const handleCreateMeta = async () => {
    const newMeta = await createMeta({ 
      country_code: code, 
      type: "test", 
      value: "Sample value", 
      description: "Test meta description" 
    });
    console.log("New meta created:", newMeta);
    // Vous pouvez ici rafraîchir la page ou re-fetcher les données si nécessaire
  };

  return (
    <>
      <h1>{country.name}</h1>
      <p>{code}</p>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
  <thead className="bg-gray-100">
    <tr>
      <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
      <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border border-gray-300 px-4 py-2">1</td>
      <td className="border border-gray-300 px-4 py-2">SEO</td>
      <td className="border border-gray-300 px-4 py-2">Meta Title</td>
      <td className="border border-gray-300 px-4 py-2">This is a meta description</td>
    </tr>
    <tr>
      <td className="border border-gray-300 px-4 py-2">2</td>
      <td className="border border-gray-300 px-4 py-2">Content</td>
      <td className="border border-gray-300 px-4 py-2">Header</td>
      <td className="border border-gray-300 px-4 py-2">A header for the page</td>
    </tr>
  </tbody>
</table>
    </>
  );
}