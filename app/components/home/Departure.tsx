import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DepartureProps {
    hoveredCountry: string | null;
}

const Departure: React.FC<DepartureProps> = ({ hoveredCountry }) => {
    const country = hoveredCountry || "Please select a destination";
    const [repeatedText, setRepeatedText] = useState('');

    useEffect(() => {
        const container = document.getElementById('text-container');
        if (container) {
            const containerWidth = container.offsetWidth;
            const textWidth = container.scrollWidth;
            const repetitions = Math.ceil(containerWidth / textWidth) + 1;
            setRepeatedText(Array(repetitions).fill(country + ' //// ').join(''));
        }
    }, [country]);

    return (
        <div id="text-container" className="flex" style={{ padding: '10px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <motion.span
                className="texte-defilant"
                initial={{ x: '100%' }}
                animate={{ x: '-100%' }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                style={{ display: 'inline-flex', alignItems: 'center' }}
            >
                <span>{repeatedText}</span>
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '5px' }}>
                    <g clipPath="url(#clip0_333_6885)">
                        <path d="M3.47115 2.375V4.56731H12.8871L2.375 15.0794L3.92058 16.625L14.4327 6.11288V15.5288H16.625V2.375H3.47115Z" fill="black" />
                    </g>
                    <defs>
                        <clipPath id="clip0_333_6885">
                            <rect width="19" height="19" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </motion.span>
        </div>
    );
};

export default Departure;
