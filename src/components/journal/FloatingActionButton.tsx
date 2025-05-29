import React from 'react';

const FloatingActionButton: React.FC = () => {
    return (
        <div className="fixed bottom-8 right-8 z-20">
            <button className="w-14 h-14 bg-[#CA91FE] rounded-full flex items-center justify-center shadow-lg relative hover:bg-[#b87ee0] transition-colors duration-200">
                <img src="/images/bean-journey/figma/fab_icon_vector4.svg" alt="FAB Icon part 1" className="absolute w-8 h-8" style={{ top: '12px', left: '12px' }} /> 
                <img src="/images/bean-journey/figma/fab_icon_vector5.svg" alt="FAB Icon part 2" className="absolute w-3 h-3" style={{ top: '20px', left: '22px' }} />
                <img src="/images/bean-journey/figma/fab_icon_vector6.svg" alt="FAB Icon part 3" className="absolute w-3 h-3" style={{ top: '20px', left: '30px' }} />
            </button>
        </div>
    );
};

export default FloatingActionButton; 