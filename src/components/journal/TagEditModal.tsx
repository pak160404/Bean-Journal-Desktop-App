import React, { useState, useEffect, useRef } from 'react';
import { Tag } from '../../types/supabase';
import { uploadFile, getPublicUrl } from '@/services/storageService';
import type { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import LucideIconPicker from '../common/LucideIconPicker';
import { Icon } from "lucide-react";
import { type LucideIconName, lucideIconNodes } from "@/utils/lucideIconNames";

interface TagEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Omit<Tag, 'icon_name'> & { icon_name?: LucideIconName }>) => void;
  initialData: (Omit<Tag, 'icon_name'> & { icon_name?: LucideIconName | null }) | null;
  currentUserId: string;
  supabase: SupabaseClient;
}

const PredefinedColors = [
    '#FFADAD', // Light Red
    '#FFD6A5', // Light Orange
    '#FDFFB6', // Light Yellow
    '#CAFFBF', // Light Green
    '#9BF6FF', // Light Cyan
    '#A0C4FF', // Light Blue
    '#BDB2FF', // Light Purple
    '#FFC6FF', // Light Magenta
    '#FFD1DC', // Light Pink
    '#D4E09B', // Olive Green
    '#A2D2FF', // Sky Blue
    '#FEEAFA', // Lavender Pink
];

const TagEditModal: React.FC<TagEditModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    currentUserId,
    supabase,
}) => {
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState(PredefinedColors[0]);
  const [iconName, setIconName] = useState<LucideIconName | ''>( '');
  const [iconEmoji, setIconEmoji] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setTagName(initialData.name || '');
      setTagColor(initialData.color_hex || PredefinedColors[0]);
      setIconName(initialData.icon_name || '');
      setIconEmoji(initialData.icon_emoji || '');
      setExistingImagePath(initialData.image_path || null);

      if (initialData.image_path) {
        // Use image_url_cached if available and valid, otherwise generate
        if (initialData.image_url_cached) {
            setImagePreviewUrl(initialData.image_url_cached);
        } else {
            const publicUrlData = getPublicUrl(supabase, 'tag-images', initialData.image_path);
            setImagePreviewUrl(publicUrlData);
        }
      } else {
        setImagePreviewUrl(null);
      }
      
      setSelectedFile(null);
      setRemoveCurrentImage(false);
      setIsUploading(false);
      setShowColorPicker(false);
      setShowIconPicker(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (isOpen) {
      setTagName('');
      setTagColor(PredefinedColors[0]);
      setIconName('');
      setIconEmoji('');
      setSelectedFile(null);
      setImagePreviewUrl(null);
      setExistingImagePath(null);
      setRemoveCurrentImage(false);
      setIsUploading(false);
      setShowColorPicker(false);
      setShowIconPicker(false);
    }
  }, [isOpen, initialData, supabase]);

  if (!isOpen || !initialData) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setRemoveCurrentImage(false); // If a new file is selected, don't remove the (soon to be old) image explicitly via this flag
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      // Keep existing image preview unless removeCurrentImage is checked
      if (existingImagePath && !removeCurrentImage) {
        if (initialData?.image_url_cached) {
            setImagePreviewUrl(initialData.image_url_cached);
        } else if (initialData?.image_path) {
            const publicUrlData = getPublicUrl(supabase, 'tag-images', initialData.image_path);
            setImagePreviewUrl(publicUrlData);
        }
      } else {
         setImagePreviewUrl(null); // Clear preview if file input is cleared and no existing/not removing
      }
    }
  };

  const handleRemoveImageToggle = () => {
    setRemoveCurrentImage(prev => {
        const willRemove = !prev;
        if (willRemove) {
            setSelectedFile(null);
            setImagePreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear the file input
            }
        } else {
            // If toggling off remove, and there was an existing image, restore its preview
            if (existingImagePath) {
                 if (initialData?.image_url_cached) {
                    setImagePreviewUrl(initialData.image_url_cached);
                } else if (initialData?.image_path) {
                    const publicUrlData = getPublicUrl(supabase, 'tag-images', initialData.image_path);
                    setImagePreviewUrl(publicUrlData);
                }
            }
        }
        return willRemove;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) {
      alert("Tag name cannot be empty.");
      return;
    }

    setIsUploading(true);
    const updatePayload: Partial<Omit<Tag, 'icon_name'> & { icon_name?: LucideIconName }> = {
      id: initialData.id, // Essential for update
      name: tagName,
      color_hex: tagColor,
      icon_name: iconName || undefined,
      icon_emoji: iconEmoji.trim() || undefined,
      // image_path and image_url_cached will be set below
    };

    try {
      if (selectedFile && currentUserId) { // New image uploaded
        const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const uniqueFileNamePart = uuidv4(); // Use UUID for filename component
        // Path within the bucket: userId/uuid_sanitizedOriginalName.ext
        const newFilePath = `${currentUserId}/${uniqueFileNamePart}_${sanitizedFileName}`;
        
        const uploadedPath = await uploadFile(supabase, 'tag-images', newFilePath, selectedFile, { upsert: true });
        
        if (uploadedPath) {
          updatePayload.image_path = uploadedPath;
          updatePayload.image_url_cached = getPublicUrl(supabase, 'tag-images', uploadedPath);
          if (!updatePayload.image_url_cached) {
            console.warn(`Failed to get public URL for new image ${uploadedPath}, but upload was successful.`);
            // updatePayload.image_url_cached will remain undefined if getPublicUrl failed or returned falsy
          }
        } else {
          console.error("Upload successful but path is missing in response data from uploadFile for new image.");
          throw new Error("Failed to upload new image: path missing in response from service.");
        }
      } else if (removeCurrentImage) { // Explicitly removing image
        updatePayload.image_path = undefined;
        updatePayload.image_url_cached = undefined;
      } else {
        // No change to image, keep existing path and cached URL
        updatePayload.image_path = existingImagePath || undefined;
        // If image_path is present but image_url_cached was missing/falsy from initialData, try to regenerate it
        if (updatePayload.image_path && !initialData.image_url_cached) {
            updatePayload.image_url_cached = getPublicUrl(supabase, 'tag-images', updatePayload.image_path);
            if (!updatePayload.image_url_cached) {
                console.warn(`Failed to regenerate public URL for existing image ${updatePayload.image_path}.`);
            }
        } else {
            updatePayload.image_url_cached = initialData.image_url_cached || undefined;
        }
      }

      // console.log("updatePayload", updatePayload); // Removed by user request
      onSubmit(updatePayload); // Restored call to onSubmit

    } catch (error) {
      console.error("Error during tag update:", error);
      alert(`Failed to update tag: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300 scale-100 opacity-100">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Tag</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Tag Name */}
          <div>
            <label htmlFor={`editTagName-${initialData.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tag Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id={`editTagName-${initialData.id}`}
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="e.g., Work, Personal, Idea"
              maxLength={50}
              required
            />
          </div>

          {/* Tag Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tag Color
            </label>
            <div className="flex items-center space-x-3">
                <div
                    className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-500 cursor-pointer shadow-sm"
                    style={{ backgroundColor: tagColor }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <input
                    type="text"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="#RRGGBB"
                    maxLength={7}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    title="Enter a valid hex color code (e.g., #RRGGBB)"
                />
            </div>
            {showColorPicker && (
                <div className="mt-3 grid grid-cols-6 sm:grid-cols-8 gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow">
                    {PredefinedColors.map(color => (
                        <div
                            key={color}
                            className="w-8 h-8 rounded-md cursor-pointer border border-gray-200 dark:border-gray-600 hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: color }}
                            onClick={() => { setTagColor(color); setShowColorPicker(false); }}
                        />
                    ))}
                </div>
            )}
          </div>

          {/* Icon Name - Replaced with Lucide Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lucide Icon (Optional)
            </label>
            <div className="flex items-center space-x-2 mb-2">
                {iconName && lucideIconNodes[iconName] && (
                    <div className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                        <Icon
                            iconNode={lucideIconNodes[iconName]}
                            size={24} 
                            className="text-gray-700 dark:text-gray-300" 
                        />
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="px-4 py-2.5 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-800 hover:bg-purple-200 dark:hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                    {showIconPicker ? 'Close Picker' : iconName ? 'Change Icon' : 'Choose Icon'}
                </button>
            </div>
            {showIconPicker && (
                <LucideIconPicker 
                    onSelectIcon={(selectedName) => {
                        setIconName(selectedName);
                        setShowIconPicker(false);
                    }}
                    selectedIconName={iconName || undefined}
                    onClose={() => setShowIconPicker(false)}
                />
            )}
          </div>

          {/* Icon Emoji */}
          <div>
            <label htmlFor={`editIconEmoji-${initialData.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icon Emoji (Optional)
            </label>
            <input
                type="text"
                id={`editIconEmoji-${initialData.id}`}
                value={iconEmoji}
                onChange={(e) => setIconEmoji(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g., ✨"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">If image is changed/uploaded, icon/emoji will be ignored.</p>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor={`editTagImage-${initialData.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tag Image (Optional)
            </label>
            <input
                type="file"
                id={`editTagImage-${initialData.id}`}
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-700 file:text-purple-700 dark:file:text-purple-100 hover:file:bg-purple-100 dark:hover:file:bg-purple-600"
                disabled={removeCurrentImage}
            />
            {imagePreviewUrl && (
                <div className="mt-3">
                    <img src={imagePreviewUrl} alt="Tag Preview" className="h-24 w-24 object-cover rounded-md shadow-md" />
                </div>
            )}
            {existingImagePath && (
                <div className="mt-2">
                    <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <input 
                            type="checkbox" 
                            checked={removeCurrentImage} 
                            onChange={handleRemoveImageToggle}
                            className="mr-2 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        />
                        Remove current image
                    </label>
                </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 transition-colors shadow-md disabled:opacity-50"
            >
              {isUploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TagEditModal; 