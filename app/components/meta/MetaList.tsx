"use client";
import { useEffect, useRef, useState } from "react";
import countries from "@/lib/countries.json";
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
const MetaList = ({ countryCode }: { countryCode: string }) => {
    // const [metas, setMetas] = useState([]);
    const [metas, setMetas] = useState<Meta[]>([]);
    const country = countries.find((c) => c.code === countryCode);
    const refreshMetas = async () => {
        const updated = await fetchMetasByCountryCode(countryCode);
        setMetas(Array.isArray(updated) ? updated : []);
    };

    useEffect(() => {
        refreshMetas();
    }, []);

    return (
        <>
            <div className="meta-list">
                {country && (
                    <AddMeta country={{ code: country.code, name: country.name }} onMetaAddedCallBack={refreshMetas}></AddMeta>
                )}
                tags
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