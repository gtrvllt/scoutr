"use client";
import { useEffect, useRef, useState } from "react";
import countries from "@/lib/countries.json";
import { supabase } from "@/lib/supabase";
import "@/ui/global.css";
import { fetchMetasByCountryCode } from "@/lib/data";
import AddMeta from "../AddMeta";
import MetaItem from "@/components/meta/MetaItem";

export interface Meta {
    id: string;
    user_id?: string;
    country_code?: string;
    tags: string[];
    name: string;
    description: string;
    image_url?: string;
    metadata?: Record<string, any>;
    add_date?: string;
    edit_date?: string;
    created_by?: string;
    updated_by?: string;
    original_id?: string;
}

export interface MetaTag {
    name: string;
}
const MetaList = ({ countryCode }: { countryCode: string }) => {
    // const [metas, setMetas] = useState([]);
    const [metas, setMetas] = useState<Meta[]>([]);
    const country = countries.find((c) => c.code === countryCode);
    const [countryTags, setCountryTags] = useState<MetaTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const refreshMetas = async () => {
        const updated = await fetchMetasByCountryCode(countryCode);
        setMetas(Array.isArray(updated) ? updated : []);
    };

    useEffect(() => {
        refreshMetas();
    }, []);

    useEffect(() => {
        const fetchCountryTags = async () => {
            let { data: meta_tags, error } = await supabase
                .from('meta_tags')
                .select(`*`)
                .eq('country_code', countryCode);
            console.log("Fetched country tags:", meta_tags, error);
            if (error) {
                console.error("Error fetching country tags:", error);
                setCountryTags([]);
            } else {
                // Adapte cette ligne selon la structure de meta_tags
                setCountryTags(meta_tags ?? []);
            }
        };

        fetchCountryTags();
    }, [countryCode]);

    return (
        <>
            <div className="meta-list">
                {country && (
                    <AddMeta country={{ code: country.code, name: country.name }} onMetaAddedCallBack={refreshMetas}></AddMeta>
                )}

                <div className="tags-container mt-6">
                    {countryTags.map((tag, index) => {
                        const isSelected = selectedTags.includes(tag.name);
                        return (
                            <button
                                key={index}
                                className={`meta-tag px-2 py-1 border border-black rounded-none mr-2 transition bg-transparent ${isSelected ? " font-bold" : ""
                                    }`}
                                onClick={() => {
                                    setSelectedTags(prev =>
                                        isSelected
                                            ? prev.filter(t => t !== tag.name)
                                            : [...prev, tag.name]
                                    );
                                }}
                                type="button"
                            >
                                {tag.name}
                            </button>
                        );
                    })}
                </div>
                <div className="meta-list">
                    {(selectedTags.length > 0
                        ? metas.filter(meta => {
                            let tagsArr: string[] = [];
                            if (Array.isArray(meta.tags)) {
                                tagsArr = meta.tags;
                            } else if (typeof meta.tags === "string") {
                                try {
                                    const parsed = JSON.parse(meta.tags);
                                    tagsArr = Array.isArray(parsed) ? parsed : String(meta.tags).split(",");
                                } catch {
                                    tagsArr = String(meta.tags).split(",");
                                }
                            }
                            return tagsArr.some(tag => selectedTags.includes(tag.trim()));
                        })
                        : metas
                    ).map((meta) => {
                        return <MetaItem key={meta.id} meta={meta} />;
                    })}
                </div>
            </div>
        </>
    );
}

export default MetaList;