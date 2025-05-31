import React, { useState, useEffect } from 'react';
import { Tag } from '../../types/supabase';

interface TagEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Tag>) => void;
  initialData: Tag | null;
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

const TagEditModal: React.FC<TagEditModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState(PredefinedColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setTagName(initialData.name || '');
      setTagColor(initialData.color_hex || PredefinedColors[0]);
      setShowColorPicker(false); // Reset color picker visibility too
    } else if (isOpen) { // If modal is opened without initial data (should not happen with current logic, but good practice)
      setTagName('');
      setTagColor(PredefinedColors[0]);
      setShowColorPicker(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen || !initialData) return null; // Ensure initialData is present to edit

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) {
      alert("Tag name cannot be empty.");
      return;
    }
    onSubmit({ name: tagName, color_hex: tagColor });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-100 opacity-100">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Tag</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="editTagName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tag Name
            </label>
            <input
              type="text"
              id="editTagName" // Changed id to avoid conflict if both modals were somehow rendered
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="e.g., Work, Personal, Idea"
              maxLength={50}
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
              <div className="mt-3 grid grid-cols-6 gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow">
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
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 transition-colors shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TagEditModal; 