import React from 'react';
import { JournalEntry } from '@/types/supabase'; // Import the JournalEntry type
import { cn } from "@/utils/css"; // For conditional class names

interface DiaryCardProps {
  diary: JournalEntry; // Changed to JournalEntry
  onSelectDiary: (id: string) => void;
  isSelected: boolean;
}

const DiaryCard: React.FC<DiaryCardProps> = ({ diary, onSelectDiary, isSelected }) => {
  // Helper to format the date, can be made more sophisticated
  const formatDate = (isoString: string) => {
    if (!isoString) return 'No date';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return isoString; // fallback to original string if formatting fails
    }
  };

  return (
    <div 
      onClick={() => onSelectDiary(diary.id!)} // Added non-null assertion for id
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
        "border", // Basic border
        isSelected ? "bg-[#F5F8F4] border-[#A7BAA1] shadow-md" : "bg-[#F5F8F4] hover:bg-[#E9F0E6] border-[#DDE8DA] hover:border-[#CFE0CA]",
        "shadow-sm hover:shadow-md"
      )}
      style={{
        // Target Figma card background: #FFEBF2 (fill_AU2N0E)
        // Selected state could be a bit darker or have a prominent border
      }}
    >
      {/* Title - Figma style_SSNUMJ (Readex Pro, 20px, #2F2569 color from a different element but looks more like title) */}
      <h3 
        className="text-md font-semibold mb-1 truncate text-slate-700"
        style={{ fontFamily: 'Readex Pro, sans-serif' }}
      >
        {diary.title}
      </h3>
      {/* Content Snippet - Figma style_SQAN8F (Readex Pro, 10px, #989CB8) */}
      <p 
        className="text-xs text-slate-500 mb-1.5 line-clamp-2"
        style={{ fontFamily: 'Readex Pro, sans-serif' }}
      >
        {diary.content}
      </p>
      <div className="flex justify-between items-center">
        {/* Category is not directly on JournalEntry, would be via EntryTag. For now, removing it. */}
        {/* {diary.category && (
          <span 
            className="text-xs px-1.5 py-0.5 rounded-full bg-[#E9F0E6] text-[#667760]"
            style={{ fontFamily: 'Readex Pro, sans-serif' }}
          >
            {diary.category}
          </span>
        )} */}
        <span 
            className="text-xs text-slate-400 ml-auto" // Added ml-auto to push date to the right if category is absent
            style={{ fontFamily: 'Readex Pro, sans-serif' }}
        >
            {formatDate(diary.entry_timestamp)} {/* Changed to entry_timestamp and formatted */}
        </span>
      </div>
    </div>
  );
};

export default DiaryCard; 