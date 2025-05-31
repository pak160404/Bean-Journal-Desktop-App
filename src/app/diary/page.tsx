'use client';

import { useState, useEffect, useMemo } from 'react';
import DiaryCard from '@/components/diary/DiaryCard';
// import DiaryCreateForm from '@/components/diary/DiaryCreateForm'; // Commented out as DiaryDetailView will be editor
import DiaryDetailView from '@/components/diary/DiaryDetailView';
import { JournalEntry } from '@/types/supabase';
import { createClerkSupabaseClient } from "@/utils/supabaseClient"; // Added Supabase client creator
import { useAuth } from "@clerk/clerk-react"; // Added Clerk useAuth
import { createJournalEntry, getJournalEntriesByUserId, updateJournalEntry } from '@/services/journalEntryService'; // Added journal entry services and updateJournalEntry

const DiaryPage = () => {
  const { getToken, userId } = useAuth();
  const supabase = useMemo(() => {
    // Only create a new client if getToken is available
    // For server components or environments where getToken might not be immediately ready,
    // you might need a more robust way to handle this, or ensure it's only called client-side.

    return createClerkSupabaseClient(getToken);
  }, [getToken]);

  const [diaries, setDiaries] = useState<JournalEntry[]>([]); // Initialize with empty array
  const [isLoadingDiaries, setIsLoadingDiaries] = useState(true);
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);
  // const [rightPanelView, setRightPanelView] = useState<'view' | 'create_deprecated'>('view'); // Removed unused state
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query

  // Fetch initial diaries
  useEffect(() => {
    if (userId && supabase) {
      setIsLoadingDiaries(true);
      getJournalEntriesByUserId(supabase, userId)
        .then(fetchedDiaries => {
          const sortedDiaries = (fetchedDiaries || []).sort((a, b) => new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime());
          setDiaries(sortedDiaries);
          if (sortedDiaries.length > 0 && !selectedDiaryId) {
            setSelectedDiaryId(sortedDiaries[0].id!);
          } else if (sortedDiaries.length === 0) {
            setSelectedDiaryId(null);
          }
          setIsLoadingDiaries(false);
        })
        .catch(err => {
          console.error("Error fetching diaries:", err);
          setError("Failed to load diaries.");
          setIsLoadingDiaries(false);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, supabase]); // Removed selectedDiaryId from dependency array, selection shouldn't re-fetch all diaries

  const handleSelectDiary = (id: string) => {
    setSelectedDiaryId(id);
  };

  const handleCreateNew = async () => {
    if (!userId || !supabase) {
      setError("User not authenticated or Supabase client not available.");
      return;
    }
    try {
      const newEntryBasics: Partial<JournalEntry> = {
        user_id: userId,
        entry_timestamp: new Date().toISOString(),
        title: "New Draft Diary", // Default title for new draft
        content: "", // Start with empty content
        is_draft: true, // Mark as draft
      };
      const newDiary = await createJournalEntry(supabase, newEntryBasics);
      if (newDiary && newDiary.id) {
        setDiaries(prevDiaries => [newDiary, ...prevDiaries].sort((a, b) => new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime()));
        setSelectedDiaryId(newDiary.id); // Select the new diary
      } else {
        setError("Failed to create new diary entry in the database.");
      }
    } catch (err) {
      console.error("Error creating new diary:", err);
      setError("An error occurred while creating the new diary.");
    }
  };

  const handleUpdateDiary = async (updates: Partial<JournalEntry>) => {
    if (!selectedDiaryId || !supabase) {
      setError("No diary selected or Supabase client not available for update.");
      throw new Error("Update preconditions not met."); // Throw error to be caught by DiaryDetailView
    }
    try {
      const updatedEntry = await updateJournalEntry(supabase, selectedDiaryId, updates);
      if (updatedEntry) {
        setDiaries(prevDiaries => 
          prevDiaries.map(d => d.id === selectedDiaryId ? { ...d, ...updatedEntry } : d)
                     .sort((a, b) => new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime())
        );
        // Optionally, you could re-fetch or just update local state
      } else {
        setError("Failed to save updates to the database.");
        throw new Error("Failed to save updates to the database.");
      }
    } catch (err) {
      console.error("Error updating diary in page:", err);
      setError("An error occurred while saving your changes.");
      throw err; // Re-throw to be caught by DiaryDetailView
    }
  };

  // Memoized filtered diaries for search
  const filteredDiaries = useMemo(() => {
    if (!searchQuery) {
      return diaries;
    }
    return diaries.filter(diary => 
      diary.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [diaries, searchQuery]);

  const selectedDiary = filteredDiaries.find(diary => diary.id === selectedDiaryId);
  // If selected diary is filtered out, try to find it in the original diaries list
  const currentSelectedDiary = selectedDiary || diaries.find(d => d.id === selectedDiaryId);

  if (!userId) {
    return <div className="p-8 text-center">Please sign in to view your diaries.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] bg-slate-50 text-foreground"> 
      <aside className="w-full md:w-1/3 lg:w-1/4 p-4 md:p-6 border-r border-slate-200 overflow-y-auto bg-white">
        <header className="mb-6">
          <h1 className="text-xl font-normal text-slate-500 mb-1" style={{ fontFamily: 'Readex Pro, sans-serif' }}>My diaries</h1>
          
          <button 
            onClick={handleCreateNew}
            disabled={isLoadingDiaries} // Disable button while loading/creating
            className="w-full mt-3 mb-3 px-4 py-2 text-sm font-medium text-black bg-[#DAE6D4] rounded-lg hover:bg-[#DAE6D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DAE6D4] transition-colors disabled:opacity-50"
          >
            + Create New Diary
          </button>
          <div className="relative mt-2">
            <input 
              type="text" 
              placeholder="Search diaries by title..."
              value={searchQuery} // Controlled component
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-[#DAE6D4] focus:border-[#DAE6D4] bg-white text-slate-700 placeholder-slate-400"
              style={{ fontFamily: 'Readex Pro, sans-serif', fontSize: '14px' }}
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </header>

        {isLoadingDiaries ? (
          <p className="text-slate-500 text-center py-10">Loading diaries...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
        ) : filteredDiaries.length > 0 ? (
          <div className="space-y-3">
            {filteredDiaries.map((diaryEntry) => (
              <DiaryCard key={diaryEntry.id} diary={diaryEntry} onSelectDiary={handleSelectDiary} isSelected={diaryEntry.id === selectedDiaryId} />
            ))}
          </div>
        ) : searchQuery && diaries.length > 0 ? (
          <p className="text-slate-500 text-center py-10">No diaries match your search "{searchQuery}".</p>
        ) : (
          <p className="text-slate-500 text-center py-10">No diaries yet. Click "Create New Diary" to start!</p>
        )}
      </aside>

      <main className="flex-1 w-full md:w-2/3 lg:w-3/4 p-4 md:p-8 overflow-y-auto bg-pink-50 rounded-tl-2xl md:rounded-tl-none">
        {/* Use currentSelectedDiary for the detail view to ensure it shows even if filtered out from the list */}
        {currentSelectedDiary ? (
          <DiaryDetailView diary={currentSelectedDiary} onUpdateDiary={handleUpdateDiary} />
        ) : isLoadingDiaries ? (
          <div className="text-center py-10 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-semibold text-slate-600">Loading...</h2>
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-semibold text-slate-600">
              {diaries.length === 0 ? "Create your first diary!" : "Select a diary to view or create a new one."}
            </h2>
            {diaries.length === 0 && (
                 <button 
                    onClick={handleCreateNew}
                    className="mt-4 px-6 py-3 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors"
                  >
                    Create Your First Diary
                </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DiaryPage; 