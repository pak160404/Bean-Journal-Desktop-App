import React, { useState, useEffect, useRef } from 'react';
import { uploadFile } from '@/services/storageService';
import { getPublicUrl } from '@/services/storageService';
import type { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

interface TagCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (tagData: {
        name: string;
        color_hex: string;
        icon_name?: string;
        icon_emoji?: string;
        image_path?: string;
        image_url_cached?: string;
    }) => void;
    defaultColor?: string;
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

const TagCreateModal: React.FC<TagCreateModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    defaultColor = PredefinedColors[0],
    currentUserId,
    supabase
}) => {
    const [name, setName] = useState('');
    const [colorHex, setColorHex] = useState(defaultColor);
    const [iconName, setIconName] = useState('');
    const [iconEmoji, setIconEmoji] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setColorHex(defaultColor);
            setIconName('');
            setIconEmoji('');
            setSelectedFile(null);
            setImagePreviewUrl(null);
            setIsUploading(false);
            setShowColorPicker(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [isOpen, defaultColor]);

    if (!isOpen) return null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
            setImagePreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Tag name cannot be empty.");
            return;
        }

        setIsUploading(true);
        let imagePath: string | undefined = undefined;
        let imageUrlCached: string | undefined = undefined;

        try {
            if (selectedFile && currentUserId) {
                const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const uniqueFileNamePart = uuidv4();
                const filePath = `${currentUserId}/${uniqueFileNamePart}_${sanitizedFileName}`;
                
                const uploadedPath = await uploadFile(supabase, 'tag-images', filePath, selectedFile, { upsert: true });
                
                if (uploadedPath) {
                    imagePath = uploadedPath;
                    imageUrlCached = getPublicUrl(supabase, 'tag-images', imagePath);
                    if (!imageUrlCached) {
                        console.warn(`Failed to get public URL for ${imagePath}, but upload was successful. Proceeding with path only for image_url_cached.`);
                    }
                } else {
                    console.error("Upload successful but path is missing in response data from uploadFile service.");
                    throw new Error("Storage upload failed: path missing in response from service.");
                }
            }

            onSubmit({
                name,
                color_hex: colorHex,
                icon_name: iconName.trim() || undefined,
                icon_emoji: iconEmoji.trim() || undefined,
                image_path: imagePath,
                image_url_cached: imageUrlCached
            });
        } catch (error) {
            console.error("Error during tag creation:", error);
            alert(`Failed to create tag: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300 scale-100 opacity-100">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Create New Tag</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tag Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="tagName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="e.g., Work, Personal, Idea"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tag Color
                        </label>
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-500 cursor-pointer shadow-sm"
                                style={{ backgroundColor: colorHex }}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                            />
                            <input
                                type="text"
                                value={colorHex}
                                onChange={(e) => setColorHex(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="#RRGGBB"
                                maxLength={7}
                            />
                        </div>
                        {showColorPicker && (
                            <div className="mt-3 grid grid-cols-6 sm:grid-cols-8 gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow">
                                {PredefinedColors.map(color => (
                                    <div
                                        key={color}
                                        className="w-8 h-8 rounded-md cursor-pointer border border-gray-200 dark:border-gray-600 hover:opacity-80 transition-opacity"
                                        style={{ backgroundColor: color }}
                                        onClick={() => { setColorHex(color); setShowColorPicker(false); }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="iconName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Icon Name (Optional)
                        </label>
                        <input
                            type="text"
                            id="iconName"
                            value={iconName}
                            onChange={(e) => setIconName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="e.g., FaBook (from library)"
                        />
                    </div>
                    <div>
                        <label htmlFor="iconEmoji" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Icon Emoji (Optional)
                        </label>
                        <input
                            type="text"
                            id="iconEmoji"
                            value={iconEmoji}
                            onChange={(e) => setIconEmoji(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="e.g., ✨"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">If image is uploaded, icon/emoji will be ignored.</p>
                    </div>
                    <div>
                        <label htmlFor="tagImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tag Image (Optional)
                        </label>
                        <input
                            type="file"
                            id="tagImage"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-700 file:text-purple-700 dark:file:text-purple-100 hover:file:bg-purple-100 dark:hover:file:bg-purple-600"
                        />
                        {imagePreviewUrl && (
                            <div className="mt-3">
                                <img src={imagePreviewUrl} alt="Preview" className="h-24 w-24 object-cover rounded-md shadow-md" />
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
                            {isUploading ? 'Creating...' : 'Create Tag'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TagCreateModal; 