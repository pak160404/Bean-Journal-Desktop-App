import React from 'react';
import { DiaryEntry } from '@/app/diary/page'; // Import the type
import { cn } from "@/utils/css"; // For conditional class names

interface DiaryCardProps {
  diary: DiaryEntry;
  onSelectDiary: (id: string) => void;
  isSelected: boolean;
}

const DiaryCard: React.FC<DiaryCardProps> = ({ diary, onSelectDiary, isSelected }) => {
  return (
    <div 
      onClick={() => onSelectDiary(diary.id)}
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
        "border", // Basic border
        isSelected ? "bg-[#F5F8F4] border-[#A7BAA1] shadow-md" : "bg-[#F5F8F4] hover:bg-[#E9F0E6] border-[#DDE8DA] hover:border-[#CFE0CA]", // Figma: #FFEBF2 for cards, selected state purple
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
        {/* Category - Figma style_SQAN8F */}
        {diary.category && (
          <span 
            className="text-xs px-1.5 py-0.5 rounded-full bg-[#E9F0E6] text-[#667760]"
            style={{ fontFamily: 'Readex Pro, sans-serif' }}
          >
            {diary.category}
          </span>
        )}
        {/* Date - Figma style_SQAN8F */}
        <span 
            className="text-xs text-slate-400"
            style={{ fontFamily: 'Readex Pro, sans-serif' }}
        >
            {diary.date}
        </span>
      </div>
    </div>
  );
};

export default DiaryCard; 