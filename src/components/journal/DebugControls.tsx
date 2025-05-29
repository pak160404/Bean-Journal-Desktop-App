import React from 'react';

interface DebugControlsProps {
    showDebugButton: boolean;
    handleDebugClick: () => void;
    toggleDebugButton: () => void;
}

const DebugControls: React.FC<DebugControlsProps> = ({ showDebugButton, handleDebugClick, toggleDebugButton }) => {
    return (
        <>
            {showDebugButton && (
                <div className="fixed top-4 right-4 z-30">
                    <button 
                        onClick={handleDebugClick}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition-colors mr-2"
                    >
                        Test Streak Modal
                    </button>
                    <button 
                        onClick={toggleDebugButton}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                    >
                        Hide Debug
                    </button>
                </div>
            )}
            {!showDebugButton && (
                <div className="fixed top-4 right-4 z-30">
                    <button 
                        onClick={toggleDebugButton}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                    >
                        Show Debug
                    </button>
                </div>
            )}
        </>
    );
};

export default DebugControls; 