'use client';

import { useState, useEffect, useMemo } from 'react';
import DiaryCard from '@/components/diary/DiaryCard';
// import DiaryCreateForm from '@/components/diary/DiaryCreateForm'; // Commented out as DiaryDetailView will be editor
import DiaryDetailView from '@/components/diary/DiaryDetailView';
import { JournalEntry, Tag } from '@/types/supabase';
import { createClerkSupabaseClient } from "@/utils/supabaseClient"; // Added Supabase client creator
import { useAuth } from "@clerk/clerk-react"; // Added Clerk useAuth
import { createJournalEntry, getJournalEntriesByUserId, updateJournalEntry, deleteJournalEntry } from '@/services/journalEntryService'; // Added journal entry services and updateJournalEntry
import { getTagsByUserId, getEntryTagsByEntryId } from '@/services/tagService'; // Added tag service and getEntryTagsByEntryId

// Helper function to determine text color based on background brightness
const getContrastColor = (hexcolor?: string): string => {
  if (!hexcolor) return '#000000';
  hexcolor = hexcolor.replace("#", "");
  if (hexcolor.length === 3) {
    hexcolor = hexcolor.split('').map(char => char + char).join('');
  }
  if (hexcolor.length !== 6) {
    // If not a valid hex after attempting to correct, default to black
    return '#000000';
  }
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  // Check for NaN in case of parsing errors with invalid hex chars
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000';
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
};

// Local type extension for filtering purposes
interface JournalEntryWithTags extends JournalEntry {
  tag_ids?: string[];
}

const DiaryPage = () => {
  const { getToken, userId } = useAuth();
  const supabase = useMemo(() => {
    // Only create a new client if getToken is available
    // For server components or environments where getToken might not be immediately ready,
    // you might need a more robust way to handle this, or ensure it's only called client-side.

    return createClerkSupabaseClient(getToken);
  }, [getToken]);

  const [diaries, setDiaries] = useState<JournalEntryWithTags[]>([]); // Initialize with empty array, ensure type is JournalEntryWithTags
  const [isLoadingDiaries, setIsLoadingDiaries] = useState(true);
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);
  // const [rightPanelView, setRightPanelView] = useState<'view' | 'create_deprecated'>('view'); // Removed unused state
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query

  const [allUserTags, setAllUserTags] = useState<Tag[]>([]);
  const [isLoadingUserTags, setIsLoadingUserTags] = useState(true);
  const [activeFilterTagIds, setActiveFilterTagIds] = useState<string[]>([]);

  // Fetch initial diaries and user tags
  useEffect(() => {
    if (userId && supabase) {
      setIsLoadingDiaries(true);
      getJournalEntriesByUserId(supabase, userId)
        .then(async fetchedDiaries => {
          if (!fetchedDiaries) {
            setDiaries([]);
            setSelectedDiaryId(null);
            setIsLoadingDiaries(false);
            return;
          }

          // Fetch tags for each diary
          const diariesWithTagsPromises = fetchedDiaries.map(async (diary) => {
            if (!diary.id) return { ...diary, tag_ids: [] }; // Should not happen if ID is guaranteed
            try {
              const entryTags = await getEntryTagsByEntryId(supabase, diary.id);
              const tagIds = entryTags.map(et => et.tag_id);
              return { ...diary, tag_ids: tagIds };
            } catch (tagError) {
              console.error(`Error fetching tags for diary ${diary.id}:`, tagError);
              return { ...diary, tag_ids: [] }; // Default to empty tags on error for this specific diary
            }
          });

          const diariesWithTags = await Promise.all(diariesWithTagsPromises);

          const sortedDiaries = diariesWithTags.sort((a, b) => new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime());
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

      setIsLoadingUserTags(true);
      getTagsByUserId(supabase, userId)
        .then(tags => {
          setAllUserTags(tags || []);
          setIsLoadingUserTags(false);
        })
        .catch(err => {
          console.error("Error fetching user tags:", err);
          // Optionally set an error state for tags
          setIsLoadingUserTags(false);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, supabase]);

  const handleSelectDiary = (id: string) => {
    setSelectedDiaryId(id);
  };

  const handleCreateNew = async () => {
    if (!userId || !supabase) {
      setError("User not authenticated or Supabase client not available.");
      return;
    }
    try {
      const newEntryBasics: Partial<JournalEntryWithTags> = {
        user_id: userId,
        entry_timestamp: new Date().toISOString(),
        title: "New Draft Diary", // Default title for new draft
        content: "", // Start with empty content
        is_draft: true, // Mark as draft
        tag_ids: [], // Initialize with empty tags
      };
      const newDiaryEntry = await createJournalEntry(supabase, newEntryBasics as Partial<JournalEntry>);
      if (newDiaryEntry && newDiaryEntry.id) {
        setDiaries(prevDiaries => [{ ...newDiaryEntry, tag_ids: [] }, ...prevDiaries].sort((a, b) => new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime()));
        setSelectedDiaryId(newDiaryEntry.id); // Select the new diary
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

  const handleDeleteDiary = async (diaryIdToDelete: string) => {
    if (!supabase) {
      setError("Supabase client not available for delete.");
      throw new Error("Delete preconditions not met.");
    }
    if (!diaryIdToDelete) {
        setError("No diary ID provided for deletion.");
        throw new Error("No diary ID provided for deletion.");
    }

    try {
      await deleteJournalEntry(supabase, diaryIdToDelete);
      setDiaries(prevDiaries => {
        const remainingDiaries = prevDiaries.filter(d => d.id !== diaryIdToDelete);
        if (remainingDiaries.length > 0) {
          // If the deleted diary was selected, select the first of the remaining diaries
          if (selectedDiaryId === diaryIdToDelete) {
            setSelectedDiaryId(remainingDiaries[0].id!);
          }
        } else {
          // No diaries left
          setSelectedDiaryId(null);
        }
        return remainingDiaries;
      });
      // Optionally, display a success message
    } catch (err) {
      console.error("Error deleting diary in page:", err);
      setError("An error occurred while deleting the diary.");
      throw err; // Re-throw to be caught by UI if needed
    }
  };

  const handleTagFilterClick = (tagId: string) => {
    setActiveFilterTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  // Memoized filtered diaries for search and tag filters
  const filteredDiaries = useMemo(() => {
    let tempDiaries = diaries;

    // Filter by search query (title)
    if (searchQuery) {
      tempDiaries = tempDiaries.filter(diary =>
        diary.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected tags
    // IMPORTANT: This assumes `diary.tag_ids` (an array of string IDs) exists on your JournalEntry objects.
    // If not, this part of the filtering will not work correctly.
    if (activeFilterTagIds.length > 0) {
      tempDiaries = tempDiaries.filter(diary => {
        const d = diary as JournalEntryWithTags; // Use local extended type
        const diaryTagIds = d.tag_ids;
        const matches = diaryTagIds && Array.isArray(diaryTagIds) && diaryTagIds.some((tagId: string) => activeFilterTagIds.includes(tagId));
        
        return matches;
      });
    }

    return tempDiaries;
  }, [diaries, searchQuery, activeFilterTagIds]);

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

          {/* Tag Filters Section */}
          <div className="mt-4">
            <h2 className="text-sm font-medium text-slate-500 mb-2" style={{ fontFamily: 'Readex Pro, sans-serif' }}>Filter by Tags:</h2>
            {isLoadingUserTags ? (
              <p className="text-xs text-slate-400">Loading tags...</p>
            ) : allUserTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allUserTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagFilterClick(tag.id!)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors duration-150 ease-in-out shadow-sm`}
                    style={
                      activeFilterTagIds.includes(tag.id!)
                        ? { backgroundColor: tag.color_hex || '#007AFF', color: getContrastColor(tag.color_hex || '#007AFF'), borderColor: tag.color_hex || '#007AFF' }
                        : { backgroundColor: '#F3F4F6', color: '#374151', borderColor: '#D1D5DB', fontFamily: 'Readex Pro, sans-serif' } // Tailwind gray-100 bg, gray-700 text, gray-300 border
                    }
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400" style={{ fontFamily: 'Readex Pro, sans-serif' }}>No tags created yet.</p>
            )}
          </div>
        </header>

        {isLoadingDiaries ? (
          <p className="text-slate-500 text-center py-10">Loading diaries...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
        ) : filteredDiaries.length > 0 ? (
          <div className="space-y-3">
            {filteredDiaries.map((diaryEntry) => {
              return (
                <DiaryCard 
                  key={diaryEntry.id} 
                  diary={diaryEntry} 
                  onSelectDiary={handleSelectDiary} 
                  isSelected={diaryEntry.id === selectedDiaryId} 
                  supabase={supabase} 
                  updated_at={diaryEntry.updated_at}
                />
              );
            })}
          </div>
        ) : searchQuery && diaries.length > 0 ? (
          <p className="text-slate-500 text-center py-10">No diaries match your search "{searchQuery}".</p>
        ) : diaries.length === 0 ? (
          <p className="text-slate-500 text-center py-10">No diaries yet. Click "Create New Diary" to start!</p>
        ) : ( // Condition for when filters result in no matches, but diaries exist
          <p className="text-slate-500 text-center py-10">No diaries match your current filters.</p>
        )}
      </aside>

      <main className="flex-1 w-full md:w-2/3 lg:w-3/4 p-4 md:p-8 overflow-y-auto bg-pink-50 rounded-tl-2xl md:rounded-tl-none">
        {/* Use currentSelectedDiary for the detail view to ensure it shows even if filtered out from the list */}
        {currentSelectedDiary ? (
          <DiaryDetailView 
            key={currentSelectedDiary.id}
            diary={currentSelectedDiary} 
            onUpdateDiary={handleUpdateDiary}
            onDeleteDiary={handleDeleteDiary} 
            userId={userId}
            supabase={supabase}
          />
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