import React from 'react';
import { Tag } from '../../types/supabase'; // Import Tag interface

interface RecentCardsProps {
    tags: Tag[]; // Changed prop name and type
    onAddNewTag: () => void; // Callback for when the add new tag card is clicked
}

// Helper to generate a simple gradient based on the hex color
const getGradientStyle = (colorHex?: string) => {
    if (!colorHex) {
        return { background: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)' }; // Default gray gradient
    }
    // Attempt to create a slightly lighter and a slightly darker shade for the gradient
    // This is a very basic approach and might not work well for all colors.
    // For more robust color manipulation, a library like `tinycolor2` would be better.
    try {
        const r = parseInt(colorHex.slice(1, 3), 16);
        const g = parseInt(colorHex.slice(3, 5), 16);
        const b = parseInt(colorHex.slice(5, 7), 16);

        const lighten = (val: number, amount: number) => Math.min(255, Math.max(0, val + amount));

        const r1 = lighten(r, 30);
        const g1 = lighten(g, 30);
        const b1 = lighten(b, 30);

        const r2 = lighten(r, -20);
        const g2 = lighten(g, -20);
        const b2 = lighten(b, -20);

        const colorStart = `#${r1.toString(16).padStart(2, '0')}${g1.toString(16).padStart(2, '0')}${b1.toString(16).padStart(2, '0')}`;
        const colorEnd = `#${r2.toString(16).padStart(2, '0')}${g2.toString(16).padStart(2, '0')}${b2.toString(16).padStart(2, '0')}`;

        return { background: `linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)` };
    } catch (e) {
        // Fallback if color parsing fails
        return { background: `linear-gradient(135deg, ${colorHex} 0%, ${colorHex} 100%)` }; // Solid color as gradient
    }
};

const RecentCards: React.FC<RecentCardsProps> = ({ tags, onAddNewTag }) => {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#989CB8]">Your Tags</h2>
                <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-purple-500 transition-colors p-1 rounded-full hover:bg-purple-100">
                        <img src="/images/bean-journey/figma/icon_caret_right.png" alt="Scroll Left" className="w-6 h-6 transform rotate-180" />
                    </button>
                    <button className="text-gray-400 hover:text-purple-500 transition-colors p-1 rounded-full hover:bg-purple-100">
                        <img src="/images/bean-journey/figma/icon_caret_right.png" alt="Scroll Right" className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-gray-100">
                {/* Placeholder card for creating a new tag */}
                <div 
                    onClick={onAddNewTag}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg min-w-[160px] h-[180px] flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 group transform hover:-translate-y-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 group-hover:text-purple-500 mb-2.5 transition-colors">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <p className="text-[#2f2569] dark:text-slate-200 font-medium text-md group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Create Tag</p>
                </div>

                {/* Render existing tags */}
                {tags.map((tag) => (
                    <div 
                        key={tag.id || tag.name} // Use name as fallback key if id is not yet available (e.g., optimistic update)
                        className="rounded-2xl shadow-lg overflow-hidden min-w-[160px] h-[180px] relative flex flex-col group transform hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                        <div 
                            className="h-3/5 rounded-t-2xl flex items-center justify-center p-3 transition-all duration-300 group-hover:opacity-90"
                            style={getGradientStyle(tag.color_hex)}
                        >
                            <span className="text-white text-4xl font-bold opacity-80 group-hover:opacity-100 drop-shadow-md">
                                {tag.name ? tag.name.charAt(0).toUpperCase() : '#'}
                            </span>
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-center items-center text-center bg-white dark:bg-slate-800 rounded-b-2xl">
                            <h3 className="text-[#2f2569] dark:text-slate-100 font-semibold text-md truncate w-full group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" title={tag.name}>
                                {tag.name}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentCards; 