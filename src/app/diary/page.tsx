'use client';

import { useState, useEffect } from 'react';
import DiaryCard from '@/components/diary/DiaryCard'; // Assuming this path
import DiaryCreateForm from '@/components/diary/DiaryCreateForm'; // Assuming this path
import DiaryDetailView from '@/components/diary/DiaryDetailView'; // Import the new component
// import { getAuth } from '@clerk/nextjs/server'; // Placeholder for auth if needed
// import { db } from '@/lib/db'; // Placeholder for db access

// Mock data for now
const mockDiaries: DiaryEntry[] = [
  {
    id: '1',
    title: 'A Day at the Park with a Furry Friend',
    content: "Started the day with a brisk walk in the park. The weather was perfect, sunny with a slight breeze.\n\nLater, I met up with Sarah and her golden retriever, Max. He's such an energetic dog! We played fetch for almost an hour.",
    category: 'Leisure',
    date: 'Today, 14:20',
    imageUrl: 'https://picsum.photos/seed/animal1/640/480', // Picsum photos with seed
  },
  {
    id: '2',
    title: 'Morning Run & Scenic Views',
    content: "Felt great to start the day with some fresh air. The park was beautiful and quiet. The sunrise was absolutely breathtaking, casting a golden glow over everything.\n\nManaged to capture a short clip of the birds singing their morning chorus.",
    category: 'Fitness',
    date: 'Yesterday, 08:30',
    imageUrl: 'https://picsum.photos/seed/nature1/640/480', // Picsum photos with seed
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
  },
  {
    id: '3',
    title: 'Productive Team Project Meeting',
    content: "Productive meeting with the team. We finalized the sprint goals for the next two weeks and assigned tasks. Everyone seems aligned and motivated, which is great to see.\n\nLater, I spent some time refactoring the authentication module. It's much cleaner now.",
    category: 'Work',
    date: '2 days ago, 11:00',
    // No image or video for this one
  },
  {
    id: '4',
    title: 'Culinary Adventure: New Recipe Trial',
    content: "Decided to try a new recipe for dinner tonight: a spicy Thai green curry. It took a while to prep all the ingredients, but the aroma filling the kitchen was incredible!\n\nThe final result was pretty good, though I might add a bit more coconut milk next time for extra creaminess. Took a quick snap before digging in!",
    category: 'Food',
    date: '3 days ago, 19:45',
    imageUrl: 'https://picsum.photos/seed/food1/640/480', // Picsum photos with seed
  },
];

export type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  category?: string;
  date: string;
  imageUrl?: string;
  videoUrl?: string;
  // Add other fields like userId, createdAt, updatedAt as needed
};

const DiaryPage = () => {
  // const { userId } = getAuth(req); // Example for getting user ID if using Clerk
  // if (!userId) {
  //   return <div>You need to be logged in to view this page.</div>;
  // }

  // const diaries = await db.diary.findMany({ where: { userId } }); // Example DB call

  const diaries: DiaryEntry[] = mockDiaries; // Using mock data for now

  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);
  const [rightPanelView, setRightPanelView] = useState<'view' | 'create'>('view'); // 'view' or 'create'

  useEffect(() => {
    if (diaries.length > 0 && !selectedDiaryId) {
      setSelectedDiaryId(diaries[0].id);
      setRightPanelView('view');
    } else if (diaries.length === 0) {
      setRightPanelView('create'); // Default to create if no diaries
    }
  }, [diaries, selectedDiaryId]);

  const handleSelectDiary = (id: string) => {
    setSelectedDiaryId(id);
    setRightPanelView('view');
  };

  const handleCreateNew = () => {
    setSelectedDiaryId(null); // Deselect any diary
    setRightPanelView('create');
  };

  const selectedDiary = diaries.find(diary => diary.id === selectedDiaryId);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 text-foreground"> {/* Figma like overall background */}
      {/* Left Sidebar */}
      <aside className="w-full md:w-1/3 lg:w-1/4 p-4 md:p-6 border-r border-slate-200 overflow-y-auto bg-white">
        <header className="mb-6">
          {/* My Diaries title - Figma node 88:407, style_SSNUMJ (Readex Pro, 20px, #989CB8) */}
          <h1 className="text-xl font-normal text-slate-500 mb-1" style={{ fontFamily: 'Readex Pro, sans-serif' }}>My diaries</h1>
          
          <button 
            onClick={handleCreateNew}
            className="w-full mt-3 mb-3 px-4 py-2 text-sm font-medium text-black bg-[#DAE6D4] rounded-lg hover:bg-[#DAE6D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DAE6D4] transition-colors"
          >
            + Create New Diary
          </button>
          {/* Search bar - Figma node 88:408 (Rect 88:409 bg #FFFFFF, stroke #DBDBDB) */}
          <div className="relative mt-2">
            <input 
              type="text" 
              placeholder="Search diaries" // Text from Figma node 88:410
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-[#DAE6D4] focus:border-[#DAE6D4] bg-white text-slate-700 placeholder-slate-400"
              style={{ fontFamily: 'Readex Pro, sans-serif', fontSize: '14px' }} // Approximating style_SSNUMJ for placeholder/input
            />
            {/* Search Icon - Figma node 88:411 - using SVG for now */}
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </header>

        {diaries.length > 0 ? (
          <div className="space-y-3">
            {diaries.map((diary) => (
              // Pass handleSelectDiary to DiaryCard
              <DiaryCard key={diary.id} diary={diary} onSelectDiary={handleSelectDiary} isSelected={diary.id === selectedDiaryId} />
            ))}
          </div>
        ) : (
          rightPanelView !== 'create' && (
            <p className="text-slate-500 text-center py-10">No diaries yet. Click "Create New Diary" to start!</p>
          )
        )}
      </aside>

      {/* Right Main Content Area */}
      <main className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-8 overflow-y-auto bg-pink-50 rounded-tl-2xl md:rounded-tl-none">
        {rightPanelView === 'create' ? (
          <>
            <header className="mb-6">
                <h2 className="text-3xl font-semibold text-slate-700" style={{ fontFamily: 'Readex Pro, sans-serif' }}>Create New Diary Entry</h2>
                <p className="text-slate-500">
                    Fill in the details below to add a new entry to your journal.
                </p>
            </header>
            <DiaryCreateForm />
          </>
        ) : selectedDiary ? (
          <DiaryDetailView diary={selectedDiary} />
        ) : (
          <div className="text-center py-10 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-semibold text-slate-600">Select a diary to view</h2>
            <p className="text-slate-500">Or create a new one to get started!</p>
          </div>
        )}
      </main>

      {/* Based on Figma node 88:393 "Trending Tags" - can be developed later, perhaps in sidebar or footer */}
      {/* <aside className="mt-12">
        <h3 className="text-xl font-semibold mb-4 text-accent-foreground">Trending Tags</h3>
        <div className="flex flex-wrap gap-2">
          {['Fitness', 'Travel', 'Work', 'Personal', 'Food'].map(tag => (
            <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      </aside> */}
    </div>
  );
};

export default DiaryPage; 