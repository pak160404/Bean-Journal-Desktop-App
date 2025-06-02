import React, { useState, useMemo, useEffect, useCallback } from "react";
import { JournalEntry, Tag } from "@/types/supabase";
import { Modal as AntModal, Select } from "antd";
import debounce from "lodash/debounce";
import {
  getTagsByUserId,
  getTagsForEntry,
  updateEntryTags,
} from "@/services/tagService";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  createMediaAttachment,
  getMediaAttachmentsByEntryId,
  deleteMediaAttachment,
} from "@/services/mediaAttachmentService";
import { getPublicUrl, deleteFiles } from "@/services/storageService";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { PartialBlock, Block } from "@blocknote/core";
import { v4 as uuidv4 } from 'uuid'; // For unique file names

interface DiaryDetailViewProps {
  diary: JournalEntry;
  onUpdateDiary: (updatedEntry: Partial<JournalEntry>) => Promise<void>;
  onDeleteDiary: (diaryIdToDelete: string) => Promise<void>;
  userId: string;
  supabase: SupabaseClient;
}

const defaultInitialBlocks: PartialBlock[] = [
  { type: "paragraph", content: "" },
];
const defaultInitialContentString = JSON.stringify(defaultInitialBlocks);

const DiaryDetailView: React.FC<DiaryDetailViewProps> = ({
  diary,
  onUpdateDiary,
  onDeleteDiary,
  userId,
  supabase,
}) => {
  const [editableTitle, setEditableTitle] = useState(diary.title || "");
  const [currentEditorContentString, setCurrentEditorContentString] = useState<string | undefined>(undefined);
  const [initialDiaryContentString, setInitialDiaryContentString] = useState<string | undefined>(undefined);

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

  const BUCKET_NAME = "media-attachments";

  const getContrastColor = (hexcolor?: string): string => {
    if (!hexcolor) return "#000000";
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#FFFFFF";
  };

  const handleFileUploadCallback = useCallback(async (file: File): Promise<string> => {
    if (!supabase || !userId || !diary || !diary.id) {
      console.error("Supabase client, userId, or diaryId not available for file upload.");
      throw new Error("Upload context not ready. Ensure the diary entry is loaded.");
    }
    
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`; // Use UUID for unique names
    const filePath = `${userId}/${diary.id}/${uniqueFileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, 
      });

    if (error) {
      console.error("Error uploading file to Supabase Storage:", error);
      throw new Error(`Storage upload failed: ${error.message}`);
    }
    
    if (!data || !data.path) {
        console.error("Upload successful but path is missing in response data.");
        throw new Error("Storage upload failed: path missing in response.");
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
    
    if (!publicUrlData?.publicUrl) {
         console.error("Error getting public URL for uploaded file:", data.path);
         throw new Error("Failed to get public URL. File uploaded but cannot be displayed.");
    }
    return publicUrlData.publicUrl;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, userId, diary?.id, BUCKET_NAME]);

  const editor = useCreateBlockNote({
    uploadFile: handleFileUploadCallback,
  });

  useEffect(() => {
    const fetchTags = async () => {
      if (!userId || !supabase || !diary.id) return;
      setIsLoadingTags(true);
      try {
        const userTags = await getTagsByUserId(supabase, userId);
        setAvailableTags(userTags || []);

        const entryTags = await getTagsForEntry(supabase, diary.id);
        const currentEntryTagIds = entryTags.map((tag) => tag.id as string);
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

  useEffect(() => {
    if (!editor || !diary) return;

    let blocksToLoad: PartialBlock[];
    let contentStrToStore: string;

    if (diary.content) {
        try {
            const parsed = JSON.parse(diary.content);
            if (Array.isArray(parsed) && parsed.length > 0) { 
                blocksToLoad = parsed;
                contentStrToStore = diary.content;
            } else if (Array.isArray(parsed) && parsed.length === 0) { // Handle empty array as valid empty content
                blocksToLoad = defaultInitialBlocks;
                contentStrToStore = defaultInitialContentString;
            }
            else {
                console.warn("Diary content is not a valid BlockNote array, using default.");
                blocksToLoad = defaultInitialBlocks;
                contentStrToStore = defaultInitialContentString;
            }
        } catch (e) {
            console.error("Failed to parse diary content, using default:", e);
            blocksToLoad = defaultInitialBlocks;
            contentStrToStore = defaultInitialContentString;
        }
    } else {
        blocksToLoad = defaultInitialBlocks;
        contentStrToStore = defaultInitialContentString;
    }
    
    const currentDocString = JSON.stringify(editor.document);
    if (contentStrToStore !== currentDocString) {
        editor.replaceBlocks(editor.document, blocksToLoad);
    }
    
    setInitialDiaryContentString(contentStrToStore);
    setCurrentEditorContentString(contentStrToStore); 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diary?.id, diary?.content, editor]);

  const handleVideoModalCancel = () => {
    setIsVideoModalVisible(false);
    setCurrentVideoUrl(null);
  };

  const formatDate = (isoStringInput: string | Date) => {
    if (!isoStringInput) return "No date";
    const date =
      typeof isoStringInput === "string"
        ? new Date(isoStringInput)
        : isoStringInput;
    try {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return typeof isoStringInput === "string"
        ? isoStringInput
        : isoStringInput.toISOString();
    }
  };
  
  const extractImageUrlsFromBN = (blocks: Block[]): string[] => {
    let urls: string[] = [];
    for (const block of blocks) {
      if (block.type === "image" && typeof block.props?.url === 'string') {
        urls.push(block.props.url);
      }
      if (block.children && Array.isArray(block.children)) {
        urls = urls.concat(extractImageUrlsFromBN(block.children as Block[]));
      }
    }
    return urls;
  };

  const handleSave = useCallback(
    async (
      currentTitle: string,
      currentContentString?: string,
      tagIdsForSave?: string[]
    ) => {
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
          tagsActuallyChanged = !sortedSelected.every(
            (val, index) => val === sortedInitial[index]
          );
        }

        if (tagsActuallyChanged) {
          await updateEntryTags(supabase, userId, diary.id, tagsToUpdate);
        }

        if (currentContentString && diary.id) {
          try {
            const parsedBlocks: Block[] = JSON.parse(currentContentString);
            const currentEditorImageUrls = extractImageUrlsFromBN(parsedBlocks);
            
            const existingAttachments = await getMediaAttachmentsByEntryId(
              supabase,
              diary.id
            );
            const rawBucketBasePublicUrl = getPublicUrl(
              supabase,
              BUCKET_NAME,
              ""
            );
            const bucketBasePublicUrl = rawBucketBasePublicUrl ? rawBucketBasePublicUrl.replace(/\/$/, "") : undefined;

            if (!bucketBasePublicUrl) {
                console.error("Could not determine bucket base public URL. Skipping media sync.");
            } else {
                // 1. Delete attachments and files no longer in the editor content
                for (const attachment of existingAttachments) {
                  const attachmentPublicUrl = `${bucketBasePublicUrl}/${attachment.file_path}`;
                  
                  if (!currentEditorImageUrls.includes(attachmentPublicUrl)) {
                    try {
                      await deleteFiles(supabase, BUCKET_NAME, [
                        attachment.file_path,
                      ]);
                      await deleteMediaAttachment(supabase, attachment.id!); 
                      console.log(
                        `Deleted attachment and file: ${attachment.file_path}`
                      );
                    } catch (deleteError) {
                      console.error(
                        `Error deleting attachment or file ${attachment.file_path}:`,
                        deleteError
                      );
                    }
                  }
                }

                // 2. Add new attachments for images newly added to the editor
                const refreshedExistingAttachments =
                  await getMediaAttachmentsByEntryId(supabase, diary.id);
                const refreshedExistingAttachmentFilePaths =
                  refreshedExistingAttachments.map((att) => att.file_path);

                for (const imageUrl of currentEditorImageUrls) {
                  if (imageUrl.startsWith(bucketBasePublicUrl + "/")) {
                    const relativeFilePath = imageUrl.substring(
                      bucketBasePublicUrl.length + 1
                    );

                    if (
                      !refreshedExistingAttachmentFilePaths.includes(
                        relativeFilePath
                      )
                    ) {
                      let fileSize = -1;
                      const fileNameOriginal = relativeFilePath.substring(
                        relativeFilePath.lastIndexOf("/") + 1
                      );

                      try {
                        const response = await fetch(imageUrl, {
                          method: "HEAD",
                          cache: "no-store",
                        });
                        if (response.ok) {
                          const contentLength =
                            response.headers.get("Content-Length");
                          if (contentLength) fileSize = parseInt(contentLength, 10);
                          else
                            console.warn(
                              `Content-Length header missing for ${imageUrl}`
                            );
                        } else {
                          console.warn(
                            `HEAD request failed for ${imageUrl}: ${response.status}`
                          );
                        }
                      } catch (headError) {
                        console.warn(
                          `Failed to fetch image size for ${imageUrl}:`,
                          headError
                        );
                      }

                      let mimeType = "application/octet-stream";
                      const extension = fileNameOriginal
                        .split(".")
                        .pop()
                        ?.toLowerCase();
                      if (extension) {
                        if (extension === "jpg" || extension === "jpeg")
                          mimeType = "image/jpeg";
                        else if (extension === "png") mimeType = "image/png";
                        else if (extension === "gif") mimeType = "image/gif";
                        else if (extension === "webp") mimeType = "image/webp";
                      }

                      if (fileSize === -1) {
                        console.warn(
                          `Could not determine file size for ${imageUrl}. Storing as -1.`
                        );
                      }
                      
                      await createMediaAttachment(supabase, {
                        entry_id: diary.id,
                        user_id: userId,
                        file_path: relativeFilePath,
                        file_name_original: fileNameOriginal,
                        file_type: "image",
                        mime_type: mimeType,
                        file_size_bytes: fileSize,
                      });
                      console.log(`Created attachment for: ${relativeFilePath}`);
                    }
                  }
                }
            }
          } catch (error) {
            console.error(
              "Error processing media attachments during save:",
              error
            );
          }
        }

        const coreUpdates: Partial<JournalEntry> = {
          title: currentTitle,
          content: currentContentString || defaultInitialContentString,
          is_draft: false,
          updated_at: new Date().toISOString(),
        };
        await onUpdateDiary(coreUpdates);

        setLastSaved(new Date());
        setInitialLoadedTagIds([...tagsToUpdate]);
        if(currentContentString !== undefined) {
          setInitialDiaryContentString(currentContentString);
        }
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Error saving diary:", error);
        setHasUnsavedChanges(true);
      } finally {
        setIsSaving(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      diary.id,
      userId,
      supabase,
      onUpdateDiary,
      initialLoadedTagIds,
      selectedTagIds,
      BUCKET_NAME
    ]
  );

  const debouncedSave = useMemo(
    () =>
      debounce(
        (newTitle: string, newContentString?: string, newTagIds?: string[]) => {
          handleSave(newTitle, newContentString, newTagIds);
        },
        2000
      ),
    [handleSave]
  );

  useEffect(() => {
    setEditableTitle(diary.title || "");
  }, [diary.title, diary.id]);

  useEffect(() => {
    if (currentEditorContentString === undefined || initialDiaryContentString === undefined) {
        return;
    }

    const titleChanged = editableTitle !== (diary.title || "");
    const contentChanged = currentEditorContentString !== initialDiaryContentString;

    let tagsHaveChangedVsSavedState = false;
    if (selectedTagIds.length !== initialLoadedTagIds.length) {
      tagsHaveChangedVsSavedState = true;
    } else {
      const sortedSelected = [...selectedTagIds].sort();
      const sortedInitial = [...initialLoadedTagIds].sort();
      tagsHaveChangedVsSavedState = !sortedSelected.every(
        (val, index) => val === sortedInitial[index]
      );
    }

    if (titleChanged || contentChanged || tagsHaveChangedVsSavedState) {
      setHasUnsavedChanges(true);
      debouncedSave(editableTitle, currentEditorContentString, selectedTagIds);
    } else {
      setHasUnsavedChanges(false);
      debouncedSave.cancel();
    }

    return () => {
      debouncedSave.cancel();
    };
  }, [
    editableTitle,
    currentEditorContentString,
    selectedTagIds,
    initialDiaryContentString,
    initialLoadedTagIds,
    diary.title,
    debouncedSave,
  ]);

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
            style={{ fontFamily: "Readex Pro, sans-serif" }}
          />
          <div className="mt-2">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Select tags"
              value={selectedTagIds}
              onChange={setSelectedTagIds}
              loading={isLoadingTags}
              options={availableTags.map((tag) => ({
                label: (
                  <span
                    style={{
                      backgroundColor: tag.color_hex || "#E9E9E9",
                      color: getContrastColor(tag.color_hex || "#E9E9E9"),
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      border: `1px solid ${tag.color_hex ? getContrastColor(tag.color_hex) + "20" : "#00000020"}`,
                    }}
                  >
                    {tag.name}
                  </span>
                ),
                value: tag.id as string,
              }))}
              optionFilterProp="label"
              tagRender={(props) => {
                const { value, closable, onClose } = props;
                const tag = availableTags.find((t) => t.id === value);
                return (
                  <span
                    style={{
                      backgroundColor: tag?.color_hex || "#E9E9E9",
                      color: getContrastColor(tag?.color_hex || "#E9E9E9"),
                      margin: "2px",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "12px",
                      border: `1px solid ${tag?.color_hex ? getContrastColor(tag.color_hex) + "20" : "#00000020"}`,
                    }}
                  >
                    {tag?.name || value}
                    {closable && (
                      <span
                        onClick={onClose}
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                      >
                        ×
                      </span>
                    )}
                  </span>
                );
              }}
            />
          </div>
          {diary.entry_timestamp && (
            <p
              className="text-xs text-slate-400 mt-1"
              style={{ fontFamily: "Readex Pro, sans-serif" }}
            >
              Created: {formatDate(diary.entry_timestamp)}
              {lastSaved && (
                <span className="ml-2 text-green-600">
                  | Last saved: {formatDate(lastSaved)}
                </span>
              )}
              {isSaving && (
                <span className="ml-2 text-slate-500 flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex-grow p-4 md:p-6 overflow-y-scroll">
        {editor && <BlockNoteView editor={editor} theme="light" onChange={() => {
          if (editor) {
            setCurrentEditorContentString(JSON.stringify(editor.document));
          }
        }} />}
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
          <video
            src={currentVideoUrl}
            controls
            autoPlay
            className="w-full h-auto max-h-[80vh] object-contain"
          />
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
        <p>
          Are you sure you want to delete this diary entry titled "{diary.title}
          "? This action cannot be undone.
        </p>
      </AntModal>
    </div>
  );
};

export default DiaryDetailView;
