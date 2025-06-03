import React, { useState, useMemo } from 'react';
// import { DynamicIcon } from 'lucide-react/dynamic'; // No longer needed
import { lucideIconNames, type LucideIconName, lucideIconNodes } from '@/utils/lucideIconNames';
import { Icon } from 'lucide-react';

interface LucideIconPickerProps {
  onSelectIcon: (iconName: LucideIconName) => void;
  selectedIconName?: LucideIconName | null | ''; 
  onClose?: () => void; 
}

const LucideIconPicker: React.FC<LucideIconPickerProps> = ({ 
  onSelectIcon, 
  selectedIconName,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIconNames: LucideIconName[] = useMemo(() => {
    if (!searchTerm) {
      return lucideIconNames;
    }
    return lucideIconNames.filter(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleIconClick = (iconName: LucideIconName) => {
    onSelectIcon(iconName); 
    if (onClose) {
      onClose(); 
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md mx-auto my-4">
      <input
        type="text"
        placeholder="Search icons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white"
      />
      {filteredIconNames.length === 0 && (
          <p className='text-center text-gray-500 dark:text-gray-400'>No icons found matching your search.</p>
      )}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-72 overflow-y-auto pr-2 no-scrollbar">
        {filteredIconNames.map(iconName => {
          const node = lucideIconNodes[iconName];
          if (!node) return null; // Should not happen if lucideIconNames and lucideIconNodes are in sync

          return (
            <button
              key={iconName}
              onClick={() => handleIconClick(iconName)}
              title={iconName}
              className={`p-2 rounded-md flex items-center justify-center transition-colors duration-150
                          ${selectedIconName === iconName 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-gray-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'}`}
            >
              <Icon iconNode={node} size={24} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LucideIconPicker; 