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
                setCountryTags(meta_tags?? []);
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
                
                <div className="tags-container">
                    {countryTags.map((tag, index) => (
                        <span key={index} className="meta-tag">
                            {tag.name + ' '}
                        </span>
                    ))}
                </div>
                <div className="meta-list">
                    {metas?.map((meta) => {
                        return <MetaItem key={meta.id} meta={meta} />;
                    })}
                </div>
            </div>
        </>
    );
}

export default MetaList;