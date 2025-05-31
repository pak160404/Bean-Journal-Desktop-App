import React, { useState, useMemo } from 'react';
import { JournalEntry } from '@/types/supabase';
import { Modal as AntModal } from 'antd';
import Editor, { defaultEditorContent } from '@/components/editor/Editor';

interface DiaryDetailViewProps {
  diary: JournalEntry;
  onUpdateDiary: (updatedEntry: Partial<JournalEntry>) => Promise<void>;
  onDeleteDiary: (diaryIdToDelete: string) => Promise<void>;
}

const DiaryDetailView: React.FC<DiaryDetailViewProps> = ({ diary, onUpdateDiary, onDeleteDiary }) => {
  const [editableTitle, setEditableTitle] = useState(diary.title || '');
  const [contentForSave, setContentForSave] = useState<string | undefined>(
    diary.content ? diary.content : JSON.stringify(defaultEditorContent)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

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
      console.error("Cannot save, diary ID is missing.");
      return;
    }
    setIsSaving(true);
    try {
      const updates: Partial<JournalEntry> = {
        title: editableTitle,
        content: contentForSave || JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }),
        is_draft: false,
        updated_at: new Date().toISOString(),
      };
      await onUpdateDiary(updates);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error updating diary:", error);
      console.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const showDeleteConfirm = () => {
    setIsDeleteConfirmVisible(true);
  };

  const handleDeleteConfirmOk = async () => {
    if (!diary.id) {
      console.error("Cannot delete, diary ID is missing.");
      setIsDeleteConfirmVisible(false);
      return;
    }
    try {
      await onDeleteDiary(diary.id);
      setIsDeleteConfirmVisible(false);
    } catch (error) {
      console.error("Error deleting diary:", error);
      console.error("Failed to delete diary. Please try again.");
      setIsDeleteConfirmVisible(false);
    }
  };

  const handleDeleteConfirmCancel = () => {
    setIsDeleteConfirmVisible(false);
  };

  const initialContent = useMemo(() => {
    if (diary.content) {
      try {
        return JSON.parse(diary.content);
      } catch (e) {
        console.error("Error parsing diary content:", e);
        // Fallback to default content if parsing fails
      }
    }
    return defaultEditorContent;
  }, [diary.content]);

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
      
      <div className="flex-grow p-4 md:p-6 overflow-y-auto">
        <Editor
          initialValue={initialContent}
          onChange={(value) => {
            setContentForSave(value);
          }}
        />
      </div>

      <footer className="p-4 border-t border-slate-200 flex justify-end">
        <button 
          title="Delete Diary" 
          onClick={showDeleteConfirm}
          className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
        >
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

      <AntModal
        title="Confirm Deletion"
        open={isDeleteConfirmVisible}
        onOk={handleDeleteConfirmOk}
        onCancel={handleDeleteConfirmCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this diary entry titled "{diary.title}"? This action cannot be undone.</p>
      </AntModal>
    </div>
  );
};

export default DiaryDetailView; 