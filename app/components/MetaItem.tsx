'use client';
import '@/ui/global.css';

export interface MetaProps {
    id: string;
    user_id?: string;
    country_codes?: Record<string, any>;
    type: string;
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
    return (
        <div className="meta p-4 shadow-sm mb-4 grid grid-cols-2 gap-4">
            {/* Image à gauche */}
            <div className="meta-image-container">
                {meta.image_url ? (
                    <img
                        src={meta.image_url}
                        alt={meta.name}
                        className="w-full h-auto object-cover w-full max-w-[500px] h-auto"
                    />
                ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
            </div>

            {/* Texte à droite */}
            <div>
                <h2 className="text-xl font-bold mb-2">{meta.name}</h2>
                <p className="text-gray-700 mb-2">{meta.description}</p>
                <span className="text-sm text-gray-500 meta-type p-2">{meta.type}</span>
                {meta.add_date && (
                    <p className="text-sm text-gray-400">
                        {new Date(meta.add_date).toLocaleDateString()}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MetaItem;
