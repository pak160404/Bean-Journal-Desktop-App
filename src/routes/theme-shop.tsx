import { createFileRoute } from '@tanstack/react-router';
import { useTheme, AppTheme } from '../contexts/ThemeContext'; // Import from context

// Local Theme interface and themes array are no longer needed,
// as they come from AppTheme and useTheme() context.

export function ThemeShopPage() {
  const { themes, activeThemeId, setActiveThemeId, setThemes } = useTheme();

  const handleThemeAction = (theme: AppTheme) => {
    console.log('Attempting to apply theme for testing:', theme.name);
    if (theme.id === activeThemeId) {
      console.log('Theme already active:', theme.name);
      return; 
    }

    // Mark as owned if not already (for testing purposes)
    if (theme.status !== 'Owned') {
      console.log('Marking theme as owned for testing:', theme.name);
      setThemes(prevThemes =>
        prevThemes.map(t =>
          t.id === theme.id ? { ...t, status: 'Owned' } : t
        )
      );
    }
    // Apply the theme
    setActiveThemeId(theme.id);
    console.log('Applied theme:', theme.name);
  };

  const getButtonTextAndStyle = (theme: AppTheme) => {
    let text: string;
    let style: string;

    if (theme.id === activeThemeId) {
      text = 'Applied';
      style = 'bg-emerald-600 hover:bg-emerald-700 cursor-default';
    } else {
      // For testing, all non-active themes are applyable
      text = 'Apply';
      style = 'bg-green-500 hover:bg-green-600';
    }
    return { text, style };
  };

  return (
    <div className="w-full p-4 md:p-6">
      <h1 className="text-[1.05rem] font-bold text-gray-900 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        Theme Store
      </h1>
      <p className="mt-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
        Browse and select a new theme to personalize your journal&apos;s appearance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const { text: buttonText, style: buttonStyle } = getButtonTextAndStyle(theme);
          const isActive = theme.id === activeThemeId;
          return (
            <div
              key={theme.id}
              className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl 
                ${isActive ? 'ring-2 ring-emerald-500 dark:ring-emerald-400' : ''}` 
              }
            >
              <div
                className={`w-full h-40 ${theme.gradient || ''} flex items-center justify-center relative`}
                style={theme.previewStyle || {}} 
              >
                 <span className="text-white/90 text-xl font-semibold backdrop-blur-sm bg-black/25 px-4 py-2 rounded-md">
                  {theme.name}
                </span>
                {isActive && (
                  <span className="absolute top-2 right-2 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-100 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 min-h-[3rem]">{theme.description}</p>
                <div className="flex justify-between items-center mt-auto pt-2 mb-4">
                    <p className={`text-lg font-semibold ${theme.price === 'Free' ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'}`}>
                        {theme.price}
                    </p>
                </div>
                <button
                  onClick={() => handleThemeAction(theme)}
                  disabled={isActive} 
                  className={`w-full text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
                              ${buttonStyle}
                              ${isActive ? 'focus:ring-emerald-400' : 'focus:ring-green-400' }`}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/theme-shop')({
  component: ThemeShopPage,
});
