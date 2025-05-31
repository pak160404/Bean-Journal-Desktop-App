import React, { useState, useEffect } from 'react';
import { JournalEntry } from '@/types/supabase';
import { Modal as AntModal } from 'antd';

interface DiaryDetailViewProps {
  diary: JournalEntry;
  onUpdateDiary: (updatedEntry: Partial<JournalEntry>) => Promise<void>;
}

const DiaryDetailView: React.FC<DiaryDetailViewProps> = ({ diary, onUpdateDiary }) => {
  const [editableTitle, setEditableTitle] = useState(diary.title || '');
  const [editableContent, setEditableContent] = useState(diary.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setEditableTitle(diary.title || '');
    setEditableContent(diary.content || '');
    setLastSaved(null);
    setSaveError(null);
  }, [diary]);

  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const handleVideoModalCancel = () => {
    setIsVideoModalVisible(false);
    setCurrentVideoUrl(null);
  };

  const formatDate = (isoStringInput: string | Date) => {
    if (!isoStringInput) return 'No date';
    const date = typeof isoStringInput === 'string' ? new Date(isoStringInput) : isoStringInput;
    try {
      return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return typeof isoStringInput === 'string' ? isoStringInput : isoStringInput.toISOString();
    }
  };

  const handleSave = async () => {
    if (!diary.id) {
      setSaveError("Cannot save, diary ID is missing.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      const updates: Partial<JournalEntry> = {
        title: editableTitle,
        content: editableContent,
        is_draft: false,
        updated_at: new Date().toISOString(),
      };
      await onUpdateDiary(updates);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error updating diary:", error);
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
      <header className="p-4 md:p-6 flex justify-between items-start border-b border-slate-200">
        <div className="flex-grow mr-4">
          <input
            type="text"
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            placeholder="Diary Title"
            className="text-2xl md:text-3xl font-semibold text-[#667760] leading-tight w-full border-0 focus:ring-0 p-0 bg-transparent"
            style={{ fontFamily: 'Readex Pro, sans-serif' }}
          />
          {diary.entry_timestamp && (
            <p className="text-xs text-slate-400 mt-1" style={{ fontFamily: 'Readex Pro, sans-serif' }}>
              Created: {formatDate(diary.entry_timestamp)}
              {lastSaved && <span className="ml-2 text-green-600">| Last saved: {formatDate(lastSaved)}</span>}
            </p>
          )}
        </div>
        <div className="flex space-x-1.5 flex-shrink-0">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>
      
      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-5">
        <textarea
          value={editableContent}
          onChange={(e) => setEditableContent(e.target.value)}
          placeholder="Start writing your diary entry here..."
          className="w-full h-full min-h-[300px] p-0 text-slate-700 text-base leading-relaxed border-0 focus:ring-0 resize-none bg-transparent"
          style={{ fontFamily: 'Readex Pro, sans-serif' }}
        />
        {saveError && <p className="text-sm text-red-500 mt-2">{saveError}</p>}
      </div>

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
          destroyOnClose
          centered
          width="80vw"
          styles={{ body: { padding: 0, lineHeight: 0 } }}
        >
          <video src={currentVideoUrl} controls autoPlay className="w-full h-auto max-h-[80vh] object-contain" />
        </AntModal>
      )}
    </div>
  );
};

export default DiaryDetailView; 