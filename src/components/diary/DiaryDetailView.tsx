import React, { useState, useEffect, useMemo } from 'react';
import { JournalEntry } from '@/types/supabase';
import { Modal as AntModal } from 'antd';
import {
  EditorRoot,
  EditorContent,
  StarterKit,
  Placeholder,
  JSONContent,
  EditorInstance as Editor, // Use EditorInstance from novel, which is Tiptap's core Editor
  Command, // For slash commands
  createSuggestionItems, // Helper for slash commands
  renderItems, // Helper for rendering slash command menu
  CodeBlockLowlight, // For code blocks with syntax highlighting
  TiptapLink, // For links
  UpdatedImage, // For images
  HighlightExtension, // For text highlighting
  TaskItem, // For task lists
  TaskList, // For task lists
} from 'novel';

// For CodeBlockLowlight
import { createLowlight } from 'lowlight'; // Import createLowlight for v3 compatibility
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';

// Create the lowlight instance
const lowlight = createLowlight();

// Register languages for lowlight
lowlight.register({ html: html });
lowlight.register({ css: css });
lowlight.register({ javascript: javascript });
lowlight.register({ typescript: typescript });
lowlight.register({ python: python });

interface DiaryDetailViewProps {
  diary: JournalEntry;
  onUpdateDiary: (updatedEntry: Partial<JournalEntry>) => Promise<void>;
  onDeleteDiary: (diaryIdToDelete: string) => Promise<void>;
}

const DiaryDetailView: React.FC<DiaryDetailViewProps> = ({ diary, onUpdateDiary, onDeleteDiary }) => {
  const [editableTitle, setEditableTitle] = useState(diary.title || '');
  const [contentForSave, setContentForSave] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

  const initialEditorContent = useMemo<JSONContent | undefined>(() => {
    if (diary.content) {
      try {
        // Attempt to parse if it's JSON (for old entries)
        return JSON.parse(diary.content) as JSONContent;
      } catch (e) {
        // If parsing fails, assume it's plain text.
        // Wrap plain text in a valid ProseMirror/Tiptap structure.
        if (typeof diary.content === 'string') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: diary.content }],
                    },
                ],
            };
        }
        console.warn("diary.content could not be parsed as JSON and is not a plain string:", diary.content);
        // Return an empty document structure if content is unusable
        return { type: 'doc', content: [{ type: 'paragraph' }] };
      }
    }
    // Return an empty document structure if diary.content is initially empty
    return { type: 'doc', content: [{ type: 'paragraph' }] };
  }, [diary.content]);

  // Define Suggestion Items for Slash Commands
  const suggestionItems = useMemo(() => createSuggestionItems([
    {
      title: 'Text',
      description: 'Start with plain text.',
      icon: "T ", // Placeholder icon
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
      },
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      icon: "H1",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      icon: "H2",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      icon: "H3",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      icon: "• ",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      icon: "1. ",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: 'Task List',
      description: 'Track tasks with a checklist.',
      icon: "[ ]",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: 'Code Block',
      description: 'Capture a code snippet.',
      icon: "</>",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
    {
      title: 'Highlight',
      description: 'Highlight important text.',
      icon: "H ", // Placeholder,
      command: ({ editor, range }) => {
        // For highlight, it's a mark, so it might be better applied to a selection or toggled
        // This command will toggle highlight on the current selection or at the cursor
        editor.chain().focus().deleteRange(range).setHighlight().run();
      }
    },
    {
      title: 'Image',
      description: 'Add an image from a URL.',
      icon: "🏞️",
      command: ({ editor, range }) => {
        const url = window.prompt('Enter image URL');
        if (url) {
          editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
        }
      },
    },
  ]), []);

  // Extensions for the editor
  const editorExtensions = useMemo(() => [
    StarterKit.configure({
      codeBlock: false,
    }),
    Placeholder.configure({
      placeholder: "What's on your mind? Type '/' for commands...",
    }),
    Command.configure({
      suggestion: {
        items: () => suggestionItems,
        render: renderItems,
      },
    }),
    CodeBlockLowlight.configure({ lowlight }),
    TiptapLink.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
    UpdatedImage.configure({}),
    HighlightExtension.configure({ multicolor: true }),
    TaskItem.configure({ nested: true }),
    TaskList,
  ], [suggestionItems]);

  useEffect(() => {
    setEditableTitle(diary.title || '');
    setContentForSave(diary.content || '');

    if (editorInstance) {
        const newContentForEditor = initialEditorContent; 
        // Ensure newContentForEditor is not undefined before calling setContent
        const contentToSet = newContentForEditor || { type: 'doc', content: [{ type: 'paragraph' }] };

        if (JSON.stringify(editorInstance.getJSON()) !== JSON.stringify(contentToSet)) {
            editorInstance.commands.setContent(contentToSet);
        }
    }
    setLastSaved(null);
    setSaveError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        content: contentForSave || '',
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

  const showDeleteConfirm = () => {
    setIsDeleteConfirmVisible(true);
  };

  const handleDeleteConfirmOk = async () => {
    if (!diary.id) {
      setSaveError("Cannot delete, diary ID is missing.");
      setIsDeleteConfirmVisible(false);
      return;
    }
    try {
      await onDeleteDiary(diary.id);
      setIsDeleteConfirmVisible(false);
    } catch (error) {
      console.error("Error deleting diary:", error);
      setSaveError("Failed to delete diary. Please try again.");
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
      
      <div className="flex-grow overflow-y-auto p-4 md:p-6 focus:outline-none">
        <EditorRoot>
          <EditorContent
            extensions={editorExtensions}
            initialContent={initialEditorContent}
            onUpdate={({ editor: currentEditor }) => {
              setContentForSave(currentEditor.getText());
              if (!editorInstance) {
                setEditorInstance(currentEditor);
              }
            }}
            editorProps={{
              attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none relative min-h-[300px] w-full bg-white focus:outline-none editor-container',
              },
            }}
          />
        </EditorRoot>
        {saveError && <p className="text-sm text-red-500 mt-2">{saveError}</p>}
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