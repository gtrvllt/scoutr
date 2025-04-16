"use client";
import "@/ui/global.css";
import { useState } from "react";

export interface MetaProps {
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

const MetaItem = ({ meta }: { meta: MetaProps }) => {
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  let tags: string[] = [];
  try {
    // Si meta.tags est un JSON stringifié, parsez-le
    const parsedTags = JSON.parse(meta.tags);
    tags = Array.isArray(parsedTags) ? parsedTags : Object.values(parsedTags);
  } catch (error) {
    // Si ce n'est pas un JSON valide, utilisez un fallback
    tags = meta.tags.split(',').map((tag) => tag.trim());
  }

  return (
    <div className="meta pt-4 mb-4 grid grid-cols-2 gap-4 relative">
      {/* Image à gauche */}
      <div
        className="meta-image-container bg-red-100"
      >
        {meta.image_url ? (
          <img
            src={meta.image_url}
            alt={meta.name}
            className="w-full h-auto object-cover w-full max-w-[500px] h-auto transition-transform duration-300 cursor-pointer"
            onClick={() => setIsImageZoomed(true)}
          />
        ) : (
          <div className="max-w-[500px] h-32 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      <div>
        <div className="meta-header flex items-center mb-2 justify-start" style={{ display: 'flex', alignItems: 'flex-start' }}>
          <h2 className="text-xl font-bold mb-2 pr-5">{meta.name}</h2>
          <div className="tags mb-2 ml-auto">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
        <p className="text-gray-700 mb-2">{meta.description}</p>
      </div>
      {/* Zoomed image modal */}
      {isImageZoomed && (
        <div
          className="fixed flex flex-col inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageZoomed(false)}
          onKeyDown={(e) => setIsImageZoomed(false)}
        >
          <div className="flex items-start flex-col">
            <h1 className="text-white pb-4">{meta.name}</h1>
            <img
              src={meta.image_url}
              alt={meta.name}
              className="max-w-full max-h-full object-contain cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaItem;
