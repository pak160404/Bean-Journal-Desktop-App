import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Tag } from '../../types/supabase'; // Import Tag interface

interface RecentCardsProps {
    tags: Tag[]; // Changed prop name and type
    onAddNewTag: () => void; // Callback for when the add new tag card is clicked
    onEditTag: (tag: Tag) => void; // Callback for editing a tag
    onDeleteTag: (tagId: string) => void; // Callback for deleting a tag
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

        const r1 = lighten(r, 40);
        const g1 = lighten(g, 40);
        const b1 = lighten(b, 40);

        const r2 = lighten(r, -10);
        const g2 = lighten(g, -10);
        const b2 = lighten(b, -10);

        const colorStart = `#${r1.toString(16).padStart(2, '0')}${g1.toString(16).padStart(2, '0')}${b1.toString(16).padStart(2, '0')}`;
        const colorEnd = `#${r2.toString(16).padStart(2, '0')}${g2.toString(16).padStart(2, '0')}${b2.toString(16).padStart(2, '0')}`;

        return { background: `linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)` };
    } catch (e) {
        // Fallback if color parsing fails
        return { background: `linear-gradient(135deg, ${colorHex} 0%, ${colorHex} 100%)` }; // Solid color as gradient
    }
};

const RecentCards: React.FC<RecentCardsProps> = ({ tags, onAddNewTag, onEditTag, onDeleteTag }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true); // Assume can scroll right initially if content overflows

    const CARD_MIN_WIDTH = 160; // From min-w-[160px]
    const GAP_SIZE = 20; // From gap-5 (1.25rem = 20px, assuming 1rem = 16px)
    // Max width for 7 items: (7 * 160) + (6 * 20) = 1120 + 120 = 1240px

    const checkScrollability = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollLeft = Math.ceil(container.scrollLeft); // Use Math.ceil to handle potential subpixel values
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;

            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollWidth - scrollLeft - clientWidth > 1); // Check if there's more than 1px to scroll
        }
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScrollability(); // Initial check

            container.addEventListener('scroll', checkScrollability, { passive: true });
            const resizeObserver = new ResizeObserver(checkScrollability);
            resizeObserver.observe(container);

            return () => {
                container.removeEventListener('scroll', checkScrollability);
                resizeObserver.unobserve(container);
                // resizeObserver.disconnect(); // Alternative cleanup
            };
        }
    }, [tags, checkScrollability]); // Re-check if tags change (affects scrollWidth) or checkScrollability changes


    const handleScroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollDistance = CARD_MIN_WIDTH + GAP_SIZE; // Scroll by one item
            const amount = direction === 'left' ? -scrollDistance : scrollDistance;
            container.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    return (
        <>
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;  /* Firefox */
                    }
                `}
            </style>
            <div className="mb-8 w-full overflow-hidden">
                <div className="flex justify-between items-center mb-6 max-w-[1240px]">
                    <h2 className="text-xl font-semibold text-[#989CB8]">Your Tags</h2>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => handleScroll('left')}
                            disabled={!canScrollLeft}
                            className="text-gray-400 hover:text-purple-500 transition-colors p-1 rounded-full hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <img src="/images/bean-journey/figma/icon_caret_right.png" alt="Scroll Left" className="w-6 h-6 transform rotate-180" />
                        </button>
                        <button 
                            onClick={() => handleScroll('right')}
                            disabled={!canScrollRight}
                            className="text-gray-400 hover:text-purple-500 transition-colors p-1 rounded-full hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <img src="/images/bean-journey/figma/icon_caret_right.png" alt="Scroll Right" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div 
                    ref={scrollContainerRef} 
                    className="no-scrollbar flex overflow-x-auto pb-4 gap-5 scroll-smooth scroll-snap-type-x-mandatory w-full max-w-[1240px]"
                >
                    {/* Placeholder card for creating a new tag */}
                    <div
                        onClick={onAddNewTag}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-md min-w-[160px] h-[180px] flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-solid border-gray-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-400 group transform hover:-translate-y-1 group-hover:bg-purple-50 dark:group-hover:bg-slate-700 scroll-snap-align-start flex-shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 group-hover:text-purple-500 mb-2.5 transition-colors duration-200">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <p className="text-[#2f2569] dark:text-slate-200 font-medium text-md group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">Create Tag</p>
                    </div>

                    {/* Render existing tags */}
                    {tags.map((tag) => (
                        <div
                            key={tag.id || tag.name} // Use name as fallback key if id is not yet available (e.g., optimistic update)
                            className="rounded-2xl shadow-md overflow-hidden min-w-[160px] h-[180px] relative flex flex-col group transform hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer scroll-snap-align-start flex-shrink-0"
                        >
                            {/* Action Icons: Edit and Delete */}
                            <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onEditTag(tag); }}
                                    className="p-1.5 bg-white/70 dark:bg-slate-700/70 hover:bg-white dark:hover:bg-slate-600 rounded-full text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors"
                                    title="Edit Tag"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteTag(tag.id!); }} // Assuming tag.id is always present for existing tags
                                    className="p-1.5 bg-white/70 dark:bg-slate-700/70 hover:bg-white dark:hover:bg-slate-600 rounded-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 transition-colors"
                                    title="Delete Tag"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            <div
                                className="h-3/5 rounded-t-2xl flex items-center justify-center p-3 transition-all duration-200 group-hover:opacity-90"
                                style={getGradientStyle(tag.color_hex)}
                            >
                                <span className="text-white text-4xl font-bold opacity-80 group-hover:opacity-100 drop-shadow-sm">
                                    {tag.name ? tag.name.charAt(0).toUpperCase() : '#'}
                                </span>
                            </div>
                            <div className="p-3.5 flex-1 flex flex-col justify-center items-center text-center bg-white dark:bg-slate-800 rounded-b-2xl">
                                <h3 className="text-[#2f2569] dark:text-slate-100 font-semibold text-md truncate w-full group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200" title={tag.name}>
                                    {tag.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default RecentCards; 