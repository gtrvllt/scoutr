"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchMetas, fetchTags } from "@/lib/data";
import type { Meta } from "@/components/meta/MetaList";
import MetaItem from "@/components/meta/MetaItem";
import "@/ui/global.css";

export default function AllMetasPage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<{ name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMetas();
        setMetas(Array.isArray(data) ? (data as Meta[]) : []);
        const tags = await fetchTags();
        setAllTags(Array.isArray(tags) ? tags : []);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load metas");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredMetas = useMemo(() => {
    if (selectedTags.length === 0) return metas;
    return metas.filter((meta) => {
      let tagsArr: string[] = [];
      if (Array.isArray(meta.tags)) {
        tagsArr = meta.tags as string[];
      } else if (typeof (meta as any).tags === "string") {
        try {
          const parsed = JSON.parse((meta as any).tags);
          tagsArr = Array.isArray(parsed) ? parsed : String((meta as any).tags).split(",");
        } catch {
          tagsArr = String((meta as any).tags).split(",");
        }
      }
      return tagsArr.some((t) => selectedTags.includes(t.trim()));
    });
  }, [metas, selectedTags]);

  return (
    <div className="py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">All Metas</h1>
      {/* Tag filter */}
      {!loading && !error && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, idx) => {
              const isSelected = selectedTags.includes(tag.name);
              return (
                <button
                  key={`${tag.name}-${idx}`}
                  className={`meta-tag px-2 py-1 border border-black rounded-none transition bg-transparent ${
                    isSelected ? "font-bold" : ""
                  }`}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      isSelected ? prev.filter((t) => t !== tag.name) : [...prev, tag.name]
                    )
                  }
                  type="button"
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
          {selectedTags.length > 0 && (
            <button
              className="mt-3 text-sm underline"
              onClick={() => setSelectedTags([])}
              type="button"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {loading && <p className="text-gray-600">Loading metas…</p>}
      {error && !loading && (
        <p className="text-red-600">{error}</p>
      )}
      {!loading && !error && (
        <div className="flex flex-col gap-6">
          {filteredMetas.length === 0 ? (
            <p className="text-gray-700">No metas yet.</p>
          ) : (
            filteredMetas.map((m) => <MetaItem key={m.id} meta={m as any} />)
          )}
        </div>
      )}
    </div>
  );
}
