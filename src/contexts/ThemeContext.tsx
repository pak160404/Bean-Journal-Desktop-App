import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the structure of a theme (can be imported from theme-shop or defined here if kept separate)
export interface AppTheme {
  id: string;
  name: string;
  description: string;
  price: string;
  status: 'Owned' | 'Available' | 'Coming Soon';
  gradient?: string; // For Tailwind gradient classes
  previewStyle?: React.CSSProperties; // For inline styles or image previews
  // Add a property to hold the actual class to be applied to the body/main wrapper
  themeClass?: string; 
}

interface ThemeContextType {
  themes: AppTheme[];
  activeThemeId: string | null;
  setActiveThemeId: (id: string | null) => void;
  setThemes: React.Dispatch<React.SetStateAction<AppTheme[]>>; // To allow updating theme status (e.g., 'Owned')
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Initial themes - this should ideally come from a shared source or props
// For now, duplicating the structure from theme-shop.tsx for clarity
const initialThemes: AppTheme[] = [
  {
    id: 'green-meadow',
    name: 'Green Meadow',
    description: 'A fresh and calming theme with natural greens.',
    gradient: 'bg-gradient-to-r from-[#E4EFE7] to-[#99BC85]',
    themeClass: 'theme-green-meadow', // Example class name
    price: 'Free',
    status: 'Owned', // Default theme
  },
  {
    id: 'abstract-art',
    name: 'Abstract Art',
    description: 'Vibrant and modern, inspired by abstract patterns.',
    gradient: 'bg-gradient-to-br from-orange-400 via-red-400 to-blue-500',
    themeClass: 'theme-abstract-art',
    price: '$2.99',
    status: 'Available',
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset Horizon',
    description: 'Warm gradients for a cozy, evening atmosphere.',
    gradient: 'bg-gradient-to-r from-orange-300 via-yellow-200 to-teal-300',
    themeClass: 'theme-sunset-horizon',
    price: '$1.99',
    status: 'Available',
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep, dark blues for focused, late-night sessions.',
    gradient: 'bg-gradient-to-r from-gray-700 via-gray-900 to-black',
    themeClass: 'theme-midnight-blue',
    price: 'Free',
    status: 'Available',
  },
  {
    id: 'cosmic-dream',
    name: 'Cosmic Dream',
    description: 'Explore the universe with this starry theme.',
    gradient: 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500',
    themeClass: 'theme-cosmic-dream',
    price: '$4.99',
    status: 'Coming Soon',
  },
];


interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themes, setThemes] = useState<AppTheme[]>(initialThemes);
  // Set 'green-meadow' as the default active theme
  const [activeThemeId, setActiveThemeIdState] = useState<string | null>('green-meadow'); 

  useEffect(() => {
    const appWrapper = document.getElementById('app-theme-wrapper');
    if (!appWrapper) {
      // Wrapper not found, could be on a page that doesn't have it (e.g., landing)
      // Or it hasn't rendered yet. Consider if early exit is desired.
      // For now, attempt to clean updocumentElement if wrapper is gone.
      initialThemes.forEach(theme => {
        if (theme.themeClass) document.documentElement.classList.remove(theme.themeClass);
      });
      return;
    }

    const currentTheme = themes.find(t => t.id === activeThemeId);
    
    // Remove all theme classes from the wrapper
    initialThemes.forEach(theme => {
      if (theme.themeClass) appWrapper.classList.remove(theme.themeClass);
    });
    // Also ensure no theme classes linger on html element from previous logic
    initialThemes.forEach(theme => {
        if (theme.themeClass) document.documentElement.classList.remove(theme.themeClass);
    });

    if (currentTheme && currentTheme.themeClass) {
      appWrapper.classList.add(currentTheme.themeClass);
      console.log(`Applied theme class: ${currentTheme.themeClass} to #app-theme-wrapper`);
    } else if (activeThemeId === null) {
        console.log("No active theme or theme has no themeClass. Default styles apply to #app-theme-wrapper.");
    }

  }, [activeThemeId, themes]);

  const setActiveThemeId = (id: string | null) => {
    setActiveThemeIdState(id);
  };

  return (
    <ThemeContext.Provider value={{ themes, activeThemeId, setActiveThemeId, setThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}; 