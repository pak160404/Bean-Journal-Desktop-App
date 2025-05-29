import React, { useState, useEffect } from 'react';

interface TagCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (tagData: { name: string; color_hex: string }) => void;
    defaultColor?: string;
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

const TagCreateModal: React.FC<TagCreateModalProps> = ({ isOpen, onClose, onSubmit, defaultColor = PredefinedColors[0] }) => {
    const [name, setName] = useState('');
    const [colorHex, setColorHex] = useState(defaultColor);
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setColorHex(defaultColor);
            setShowColorPicker(false);
        }
    }, [isOpen, defaultColor]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Tag name cannot be empty."); // Simple validation
            return;
        }
        onSubmit({ name, color_hex: colorHex });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-100 opacity-100">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Create New Tag</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tag Name
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
                            <div className="mt-3 grid grid-cols-6 gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow">
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
                            Create Tag
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TagCreateModal; 