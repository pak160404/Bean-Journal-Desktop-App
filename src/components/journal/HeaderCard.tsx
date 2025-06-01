import React from 'react';
import { JournalEntry } from '@/types/supabase'; // Import JournalEntry type
import { useNavigate } from '@tanstack/react-router'; // Import useNavigate

interface HeaderCardProps {
    journalEntries: JournalEntry[]; // Add journalEntries prop
}

const HeaderCard: React.FC<HeaderCardProps> = ({ journalEntries }) => {
    const totalEntries = journalEntries.length;
    let latestEntryDateString = "No entries yet";
    const navigate = useNavigate();

    if (totalEntries > 0) {
        // Sort entries by date to find the most recent one
        const sortedEntries = [...journalEntries].sort((a, b) => 
            new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime()
        );
        const latestEntry = sortedEntries[0];
        if (latestEntry && latestEntry.entry_timestamp) {
            const date = new Date(latestEntry.entry_timestamp);
            latestEntryDateString = `Latest updated: ${date.toLocaleDateString('en-US', {
                month: 'short', 
                day: 'numeric', 
                year: 'numeric'
            })}`;
        }
    }

    const handleCreateNewDiary = () => {
        navigate({ to: '/journal/diary', search: { createNew: true } });
    };

    return (
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8 relative overflow-hidden h-[270px]">
            {/* Sun Decoration */}
            <div className="absolute right-[0rem] -top-[0rem] w-[75rem] h-[18rem]  overflow-hidden">
                <img 
                    src="/images/bean-journey/figma/header_sun.png"
                    alt="Sun Elements" 
                    className="w-[100%] h-[100%] object-cover object-center"
                />
            </div>

            {/* Main Content Area */} 
            <div className="flex justify-between items-start relative z-10 h-full">
                {/* Left Column */} 
                <div className="flex flex-col w-3/5">
                    {/* Greeting & Title */} 
                    <div className="flex items-start mb-5">
                        <div className="w-2 h-[4.5rem] bg-[#7DF08F] rounded-full mr-3 mt-1"></div>
                        <div>
                            <p className="text-gray-500 text-[18px] font-normal mb-1 font-['Readex_Pro']">What a great day to learn something new</p>
                            <div className="flex items-center">
                                <h1 className="text-[38px] font-normal text-[#2f2569] mr-2 font-['Readex_Pro']">Today is a sunny day</h1> 
                                <img src="/images/bean-journey/figma/header_sun_decoration.png" alt="Sun Icon" className="w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    {/* Details */} 
                    <div className="pl-5 space-y-2.5">
                        <p className="text-[#2f2569] font-normal text-[20px] font-['Readex_Pro']">Details</p> 
                        <div className="flex flex-col space-y-2.5">
                            <div className="flex items-center text-[#989CB8]">
                                <img src="/images/bean-journey/figma/icon_book_open.png" alt="Diaries Icon" className="w-5 h-5 mr-2" />
                                <span className="text-[16px] font-normal font-['Readex_Pro']">Diaries: {totalEntries}</span>
                            </div>
                            <div className="flex items-center text-[#989CB8]">
                                <img src="/images/bean-journey/figma/icon_clock_bold.png" alt="Clock Icon" className="w-5 h-5 mr-2" />
                                <span className="text-[16px] font-normal font-['Readex_Pro']">{latestEntryDateString}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Forest Illustration - positioned in the middle-right */} 
                <div className="absolute right-[34rem] top-[4rem]">
                    <img 
                        src="/images/bean-journey/figma/header_illustration_forest.png"
                        alt="Forest Illustration" 
                        className="w-52 h-auto" 
                    /> 
                </div>
                <div className="absolute right-[45.5rem] top-[4rem]">
                    <img 
                        src="/images/bean-journey/figma/header_illustration_forest.png"
                        alt="Forest Illustration" 
                        className="w-52 h-auto" 
                    /> 
                </div>
                
                {/* "Have anything awesome today?" text with button */} 
                <div className="absolute -bottom-4 -right-4 flex items-center">
                    <span className="text-black w-[8rem] text-[16px] font-['Readex_Pro'] mr-3">Have anything awsome today ?</span>
                    <button 
                        className="bg-[#f2e7ff] w-10 h-10 rounded-md flex items-center justify-center border-[0.1rem] border-[#9645FF] hover:bg-[#e8d6ff] transition-colors"
                        onClick={handleCreateNewDiary}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9645ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeaderCard; 