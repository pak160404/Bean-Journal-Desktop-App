import React, { useState } from 'react';
import { DiaryEntry } from '@/app/diary/page'; // Import the type
import { Image as AntImage, Modal as AntModal } from 'antd'; // Import AntModal
// Make sure Ant Design global styles and ConfigProvider are set up in your layout.tsx or equivalent
// Also ensure Modal styles are available if not using global antd.css: import 'antd/es/modal/style/index.css';

interface DiaryDetailViewProps {
  diary: DiaryEntry;
  // Add onDelete, onEdit callbacks later
}

// A simple red pin icon, inspired by Figma's visual
const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1.5 -right-1.5 z-10 transform rotate-45 opacity-70 group-hover:opacity-100 transition-opacity">
    <path d="M12 2C10.6739 2 9.40215 2.52678 8.46447 3.46447C7.52678 4.40215 7 5.67392 7 7V13.586L4.707 15.879C4.51944 16.0664 4.36929 16.2883 4.26667 16.5322C4.16404 16.7761 4.11111 17.0379 4.11111 17.303C4.11111 17.5681 4.16404 17.83 4.26667 18.0738C4.36929 18.3177 4.51944 18.5396 4.707 18.727L5.273 19.293C5.46056 19.4806 5.68253 19.6308 5.92642 19.7334C6.1703 19.836 6.43215 19.8889 6.69722 19.8889C6.96229 19.8889 7.22414 19.836 7.46803 19.7334C7.71191 19.6308 7.93388 19.4806 8.12144 19.293L10.414 17H17C18.3261 17 19.5979 16.4732 20.5355 15.5355C21.4732 14.5979 22 13.3261 22 12V7C22 5.67392 21.4732 4.40215 20.5355 3.46447C19.5979 2.52678 18.3261 2 17 2H12Z" fill="#EF4444"/> {/* Red-500 */}
    <circle cx="12" cy="7" r="2" fill="white"/>
  </svg>
);

interface DiaryBlock {
  type: 'text' | 'image' | 'video' | 'bullet' | 'highlight';
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  items?: string[]; // For bullet points
}

// This function would ideally come from a pre-processing step or be part of data fetching
// For now, it crudely tries to make sense of the existing DiaryEntry structure
// and the Figma-inspired layout.
const parseDiaryContentToBlocks = (diary: DiaryEntry): DiaryBlock[] => {
  const blocks: DiaryBlock[] = [];

  // Main title of the diary itself becomes less prominent if we break content into blocks
  // So we assume the diary.title is handled by the header of DiaryDetailView.
  
  // Split content by newlines, but also consider images/videos as separate blocks.
  // This is a very basic parser and would need to be much more robust for real use.
  
  // For now, let's keep it simpler: one text block, then image, then video.
  // The user's image suggests a more complex, interleaved structure.
  // To achieve that, the `diary.content` would need to be structured data, not just a flat string.

  if (diary.content) {
    // Split by double newlines for paragraphs
    const paragraphs = diary.content.split(/\n\s*\n/);
    paragraphs.forEach(para => {
      if (para.trim() !== '') {
        blocks.push({ type: 'text', content: para.trim() });
      }
    });
  }

  if (diary.imageUrl) {
    blocks.push({ type: 'image', imageUrl: diary.imageUrl });
  }
  if (diary.videoUrl) {
    blocks.push({ type: 'video', videoUrl: diary.videoUrl });
  }

  // Add the highlight block as a fixed example, as per Figma 88:385
  blocks.push({ type: 'highlight', content: "Remember to eat some snack before go out side" });

  // Example of bullet points from Figma text element like 88:375
  // This is hardcoded for now to show structure
  if (diary.title.includes("Run for 30m")) { // A crude check for a specific diary entry
      blocks.push({ type: 'bullet', items: ["Run for 30m, then have a walk at the park", "Play basketball with my friends"] });
  }

  return blocks.filter(block => 
    (block.content && block.content.trim() !== '') || 
    block.imageUrl || 
    block.videoUrl || 
    (block.items && block.items.length > 0)
  );
};

const MEDIA_PREVIEW_SIZE = "w-48 h-48"; // Consistent square size for previews

const DiaryDetailView: React.FC<DiaryDetailViewProps> = ({ diary }) => {
  const contentBlocks = parseDiaryContentToBlocks(diary);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const showVideoModal = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoModalVisible(true);
  };

  const handleVideoModalCancel = () => {
    setIsVideoModalVisible(false);
    setCurrentVideoUrl(null);
  };

  return (
    // Main container for the detail view, takes full height and provides flex context
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
      {/* Header section - not scrollable */}
      <header className="p-4 md:p-6 flex justify-between items-start border-b border-slate-200">
        <div>
          <h2 
            className="text-2xl md:text-3xl font-semibold text-[#667760] leading-tight"
            style={{ fontFamily: 'Readex Pro, sans-serif' }}
          >
            {diary.title} {/* This is the main title like "Everyday Activity" */}
          </h2>
          {(diary.category || diary.date) && (
            <p className="text-xs text-slate-400 mt-1" style={{ fontFamily: 'Readex Pro, sans-serif' }}>
              {diary.category && <span className="mr-2">{diary.category}</span>}
              {diary.date && <span className="mr-2">{diary.category ? '|' : ''}</span>}
              {diary.date}
            </p>
          )}
        </div>
        <div className="flex space-x-1.5 flex-shrink-0">
            <button title="Add to entry" className="p-2 rounded-full bg-[#F5F8F4] hover:bg-[#E9F0E6] text-[#7A8C74] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            </button>
            <button title="Add photo" className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            <button title="Add video" className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h10M4 10h10M4 14h7M4 18h3" /></svg>
            </button>
        </div>
      </header>
      
      {/* Scrollable content area */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-5">
        {contentBlocks.map((block, index) => {
          switch (block.type) {
            case 'text':
              return (
                <div key={index} className="text-slate-700 text-base leading-relaxed" style={{ fontFamily: 'Readex Pro, sans-serif' }}>
                  {/* Split by newlines to respect paragraph breaks from original content */}
                  {block.content?.split('\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className={pIndex > 0 ? 'mt-3' : ''}>{paragraph}</p>
                  ))}
                </div>
              );
            case 'image':
              return (
                <div key={index} className={`my-4 relative group ${MEDIA_PREVIEW_SIZE} mx-auto md:mx-0 cursor-pointer shadow-md border border-slate-200 rounded-2xl overflow-hidden`}>
                  <AntImage
                    wrapperClassName={`${MEDIA_PREVIEW_SIZE} rounded-2xl` } // Ensures wrapper has the dimensions and rounded corners
                    src={block.imageUrl} 
                    alt={`Diary image ${index + 1}`}
                    className="w-full h-full object-cover" // Instructs the img tag itself to cover
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Explicit style for the image element
                    preview={{
                      maskClassName: 'rounded-2xl',
                    }}
                  />
                  <PinIcon />
                </div>
              );
            case 'video':
              return (
                <div 
                  key={index} 
                  className={`my-4 relative group ${MEDIA_PREVIEW_SIZE} mx-auto md:mx-0 cursor-pointer shadow-md border border-slate-200 rounded-2xl overflow-hidden bg-black flex items-center justify-center`}
                  onClick={() => block.videoUrl && showVideoModal(block.videoUrl)}
                >
                  <video 
                    src={block.videoUrl + '#t=0.1'} // #t=0.1 to show first frame as poster
                    className="w-full h-full object-cover"
                    playsInline // Good for mobile
                    muted // Often needed for autoplay if poster doesn't work
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback"
                  />
                  {/* Simple play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-opacity">
                    <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                  </div>
                  <PinIcon />
                </div>
              );
            case 'bullet':
                return (
                    <ul key={index} className="list-disc list-inside pl-1 space-y-1 text-slate-700" style={{ fontFamily: 'Readex Pro, sans-serif' }}>
                        {block.items?.map((item, itemIdx) => <li key={itemIdx}>{item}</li>)}
                    </ul>
                );
            case 'highlight':
              return (
                <div key={index} className="p-3 my-3 bg-[#F5F8F4] border-l-4 border-[#8FA188] rounded-md text-[#54614F] flex items-center space-x-2" style={{ fontFamily: 'Readex Pro, sans-serif' }}>
                  <svg className="w-5 h-5 text-[#7A8C74] flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <p className="text-sm font-medium">{block.content}</p>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>

      {/* Footer section - not scrollable */}
      <footer className="p-4 border-t border-slate-200 flex justify-end">
        <button title="Delete Diary" className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </footer>

      {currentVideoUrl && (
        <AntModal
          open={isVideoModalVisible}
          title="Video Preview"
          footer={null}
          onCancel={handleVideoModalCancel}
          destroyOnClose // Important to destroy video element when modal closes
          centered
          width="80vw"
          styles={{ body: { padding: 0, lineHeight: 0 } }} // AntD5+ styles prop
        >
          <video src={currentVideoUrl} controls autoPlay className="w-full h-auto max-h-[80vh] object-contain" />
        </AntModal>
      )}
    </div>
  );
};

export default DiaryDetailView; 