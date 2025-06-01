import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { JournalEntry, Tag } from '@/types/supabase';
import { Modal as AntModal, Select } from 'antd';
import Editor, { defaultEditorContent } from '@/components/editor/Editor';
import debounce from 'lodash/debounce';
import { getTagsByUserId, getTagsForEntry, updateEntryTags } from '@/services/tagService';
import { SupabaseClient } from '@supabase/supabase-js';
import { createMediaAttachment, getMediaAttachmentsByEntryId, deleteMediaAttachment } from '@/services/mediaAttachmentService';
import { getPublicUrl, deleteFiles } from '@/services/storageService';

// Local Tiptap Node interface for image URL extraction
interface TiptapNode {
  type?: string;
  attrs?: { src?: string; [key: string]: unknown };
  content?: TiptapNode[];
}

interface DiaryDetailViewProps {
  diary: JournalEntry;
  onUpdateDiary: (updatedEntry: Partial<JournalEntry>) => Promise<void>;
  onDeleteDiary: (diaryIdToDelete: string) => Promise<void>;
  userId: string;
  supabase: SupabaseClient;
}

const DiaryDetailView: React.FC<DiaryDetailViewProps> = ({ diary, onUpdateDiary, onDeleteDiary, userId, supabase }) => {
  const [editableTitle, setEditableTitle] = useState(diary.title || '');
  const [contentForSave, setContentForSave] = useState<string | undefined>(
    diary.content ? diary.content : JSON.stringify(defaultEditorContent)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(
    diary.updated_at ? new Date(diary.updated_at) : null
  );
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [initialLoadedTagIds, setInitialLoadedTagIds] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  const BUCKET_NAME = 'media-attachments';

  // Helper function to determine text color based on background brightness (copied from DiaryCard for now)
  const getContrastColor = (hexcolor?: string): string => {
    if (!hexcolor) return '#000000';
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  };

  useEffect(() => {
    const fetchTags = async () => {
      if (!userId || !supabase || !diary.id) return;
      setIsLoadingTags(true);
      try {
        const userTags = await getTagsByUserId(supabase, userId);
        setAvailableTags(userTags || []);

        const entryTags = await getTagsForEntry(supabase, diary.id);
        const currentEntryTagIds = entryTags.map(tag => tag.id as string);
        setSelectedTagIds(currentEntryTagIds);
        setInitialLoadedTagIds(currentEntryTagIds);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setIsLoadingTags(false);
      }
    };
    fetchTags();
  }, [userId, supabase, diary.id]);

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

  const handleSave = useCallback(async (currentTitle: string, currentContent?: string, tagIdsForSave?: string[]) => {
    if (!diary.id || !userId) {
      console.error("Cannot save, diary ID or user ID is missing.");
      return;
    }

    setIsSaving(true);
    setHasUnsavedChanges(false);
    try {
      const tagsToUpdate = tagIdsForSave || selectedTagIds;

      let tagsActuallyChanged = false;
      if (tagsToUpdate.length !== initialLoadedTagIds.length) {
          tagsActuallyChanged = true;
      } else {
          const sortedSelected = [...tagsToUpdate].sort();
          const sortedInitial = [...initialLoadedTagIds].sort();
          tagsActuallyChanged = !sortedSelected.every((val, index) => val === sortedInitial[index]);
      }

      if (tagsActuallyChanged) {
        await updateEntryTags(supabase, userId, diary.id, tagsToUpdate);
      }

      // Process media attachments (syncing: add new, remove old)
      if (currentContent && diary.id) {
        try {
          const parsedContent: TiptapNode = JSON.parse(currentContent);
          const currentEditorImageUrls: string[] = [];
          const extractImageUrls = (node: TiptapNode) => {
            if (node.type === 'image' && node.attrs?.src) {
              currentEditorImageUrls.push(node.attrs.src);
            }
            if (node.content && Array.isArray(node.content)) {
              node.content.forEach(extractImageUrls);
            }
          };
          extractImageUrls(parsedContent);

          const existingAttachments = await getMediaAttachmentsByEntryId(supabase, diary.id);
          const bucketBasePublicUrl = getPublicUrl(supabase, BUCKET_NAME, '').replace(/\/$/, ''); // Base URL for our bucket

          // 1. Delete attachments and files no longer in the editor content
          for (const attachment of existingAttachments) {
            const attachmentPublicUrl = getPublicUrl(supabase, BUCKET_NAME, attachment.file_path);
            if (!currentEditorImageUrls.includes(attachmentPublicUrl)) {
              try {
                await deleteFiles(supabase, BUCKET_NAME, [attachment.file_path]);
                await deleteMediaAttachment(supabase, attachment.id!); // id should exist for existing attachments
                console.log(`Deleted attachment and file: ${attachment.file_path}`);
              } catch (deleteError) {
                console.error(`Error deleting attachment or file ${attachment.file_path}:`, deleteError);
              }
            }
          }

          // 2. Add new attachments for images newly added to the editor
          const refreshedExistingAttachments = await getMediaAttachmentsByEntryId(supabase, diary.id);
          const refreshedExistingAttachmentFilePaths = refreshedExistingAttachments.map(att => att.file_path);

          for (const imageUrl of currentEditorImageUrls) {
            if (imageUrl.startsWith(bucketBasePublicUrl + '/')) { // Process only images from our bucket
              const relativeFilePath = imageUrl.substring(bucketBasePublicUrl.length + 1);

              if (!refreshedExistingAttachmentFilePaths.includes(relativeFilePath)) {
                let fileSize = -1;
                let fileNameOriginal = relativeFilePath.substring(relativeFilePath.lastIndexOf('/') + 1);
                const underscoreIndex = fileNameOriginal.indexOf('_');
                if (underscoreIndex > -1 && /^[0-9]+$/.test(fileNameOriginal.substring(0, underscoreIndex))) {
                  fileNameOriginal = fileNameOriginal.substring(underscoreIndex + 1);
                }

                try {
                  const response = await fetch(imageUrl, { method: 'HEAD', cache: 'no-store' });
                  if (response.ok) {
                    const contentLength = response.headers.get('Content-Length');
                    if (contentLength) fileSize = parseInt(contentLength, 10);
                    else console.warn(`Content-Length header missing for ${imageUrl}`);
                  } else {
                    console.warn(`HEAD request failed for ${imageUrl}: ${response.status}`);
                  }
                } catch (headError) {
                  console.warn(`Failed to fetch image size for ${imageUrl}:`, headError);
                }

                let mimeType = 'application/octet-stream';
                const extension = fileNameOriginal.split('.').pop()?.toLowerCase();
                if (extension) {
                  if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';
                  else if (extension === 'png') mimeType = 'image/png';
                  else if (extension === 'gif') mimeType = 'image/gif';
                  else if (extension === 'webp') mimeType = 'image/webp';
                }

                if (fileSize === -1) {
                    console.warn(`Could not determine file size for ${imageUrl}. Storing as -1.`);
                }

                await createMediaAttachment(supabase, {
                  entry_id: diary.id,
                  user_id: userId,
                  file_path: relativeFilePath,
                  file_name_original: fileNameOriginal,
                  file_type: 'image',
                  mime_type: mimeType,
                  file_size_bytes: fileSize,
                });
                console.log(`Created attachment for: ${relativeFilePath}`);
              }
            }
          }
        } catch (error) {
          console.error("Error processing media attachments during save:", error);
        }
      }

      const coreUpdates: Partial<JournalEntry> = {
        title: currentTitle,
        content: currentContent || JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }),
        is_draft: false,
        updated_at: new Date().toISOString(),
      };
      await onUpdateDiary(coreUpdates);

      setLastSaved(new Date());
      setInitialLoadedTagIds([...tagsToUpdate]);
      setHasUnsavedChanges(false);

    } catch (error) {
      console.error("Error saving diary:", error);
      setHasUnsavedChanges(true);
    } finally {
      setIsSaving(false);
    }
  }, [diary.id, userId, supabase, onUpdateDiary, initialLoadedTagIds, selectedTagIds]);

  const debouncedSave = useMemo(
    () => debounce((newTitle: string, newContent?: string, newTagIds?: string[]) => {
      handleSave(newTitle, newContent, newTagIds);
    }, 2000),
    [handleSave]
  );

  useEffect(() => {
    setEditableTitle(diary.title || '');
    setContentForSave(diary.content ? diary.content : JSON.stringify(defaultEditorContent));
  }, [diary.title, diary.content, diary.id]);

  useEffect(() => {
    const titleChanged = editableTitle !== (diary.title || '');
    const contentChanged = contentForSave !== (diary.content || JSON.stringify(defaultEditorContent));
    
    let tagsHaveChangedVsSavedState = false;
    if (selectedTagIds.length !== initialLoadedTagIds.length) {
      tagsHaveChangedVsSavedState = true;
    } else {
      const sortedSelected = [...selectedTagIds].sort();
      const sortedInitial = [...initialLoadedTagIds].sort();
      tagsHaveChangedVsSavedState = !sortedSelected.every((val, index) => val === sortedInitial[index]);
    }

    if (titleChanged || contentChanged || tagsHaveChangedVsSavedState) {
      setHasUnsavedChanges(true);
      debouncedSave(editableTitle, contentForSave, selectedTagIds);
    } else {
      setHasUnsavedChanges(false);
      debouncedSave.cancel();
    }
    
    return () => {
      debouncedSave.cancel();
    };
  }, [editableTitle, contentForSave, selectedTagIds, initialLoadedTagIds, diary.title, diary.content, debouncedSave]);

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
            className="text-2xl md:text-3xl font-semibold text-[#667760] leading-tight w-full border-0 focus:ring-0 p-0 bg-transparent focus:outline-none"
            style={{ fontFamily: 'Readex Pro, sans-serif' }}
          />
          <div className="mt-2">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Select tags"
              value={selectedTagIds}
              onChange={setSelectedTagIds}
              loading={isLoadingTags}
              options={availableTags.map(tag => ({
                label: (
                  <span style={{
                    backgroundColor: tag.color_hex || '#E9E9E9',
                    color: getContrastColor(tag.color_hex || '#E9E9E9'),
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    border: `1px solid ${tag.color_hex ? getContrastColor(tag.color_hex) + '20' : '#00000020'}`
                  }}>
                    {tag.name}
                  </span>
                ),
                value: tag.id as string,
              }))}
              optionFilterProp="label"
              tagRender={(props) => {
                const { value, closable, onClose } = props;
                const tag = availableTags.find(t => t.id === value);
                return (
                  <span
                    style={{
                      backgroundColor: tag?.color_hex || '#E9E9E9',
                      color: getContrastColor(tag?.color_hex || '#E9E9E9'),
                      margin: '2px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      fontSize: '12px',
                      border: `1px solid ${tag?.color_hex ? getContrastColor(tag.color_hex) + '20' : '#00000020'}`
                    }}
                  >
                    {tag?.name || value}
                    {closable && (
                      <span onClick={onClose} style={{ cursor: 'pointer', marginLeft: '5px' }}>
                        ×
                      </span>
                    )}
                  </span>
                );
              }}
            />
          </div>
          {diary.entry_timestamp && (
            <p className="text-xs text-slate-400 mt-1" style={{ fontFamily: 'Readex Pro, sans-serif' }}>
              Created: {formatDate(diary.entry_timestamp)}
              {lastSaved && <span className="ml-2 text-green-600">| Last saved: {formatDate(lastSaved)}</span>}
              {isSaving && (
                <span className="ml-2 text-slate-500 flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              )}
              {!isSaving && hasUnsavedChanges && (
                <span className="ml-2 text-orange-500">Unsaved changes</span>
              )}
            </p>
          )}
        </div>
        <div className="flex space-x-1.5 flex-shrink-0">
          <button 
            title="Delete Diary" 
            onClick={showDeleteConfirm}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </header>
      
      <div className="flex-grow p-4 md:p-6 overflow-y-scroll">
        <Editor
          key={lastSaved ? lastSaved.toISOString() : diary.id}
          initialValue={initialContent}
          onChange={(value) => {
            setContentForSave(value);
          }}
          supabase={supabase}
          userId={userId}
          bucketName={BUCKET_NAME}
        />
      </div>

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