import { createFileRoute } from "@tanstack/react-router";
import "@fontsource/readex-pro/400.css"; // Regular weight
import "@fontsource/readex-pro/500.css"; // Medium weight
import "@fontsource/readex-pro/600.css"; // Medium weight
// import { CalendarIcon, ClockIcon } from "lucide-react"; // Assuming lucide-react for icons - Removed unused import
import { DayPicker, useNavigation } from 'react-day-picker'; // Import DayPicker, useNavigation, removed CaptionProps
import 'react-day-picker/dist/style.css'; // Import default styles (we'll override)
import { useState, useEffect } from "react";
import { format } from 'date-fns'; // Import date-fns utils
import beanLogo from "@/images/logo_bean_journal.png";

// Update the route path to make it a child of the journal root
export const Route = createFileRoute("/journal/")({
	component: Homepage,
});

// Define types for event data
type CalendarEvent = {
    date: Date;
    emoji: string;
    text: string;
    emojiBg: string; // Background for the emoji container
    textBg: string;  // Background for the text label
    mood?: 'happy' | 'sad' | 'neutral' | 'mad' | 'amazing'; // Add amazing to mood property
};

// Streak Modal Component
interface StreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    streakDays: number;
    activeDaysOfWeek: ('M' | 'Tu' | 'W' | 'Th' | 'F' | 'Sa' | 'Su')[];
}

function StreakModal({ isOpen, onClose, streakDays, activeDaysOfWeek }: StreakModalProps) {
    if (!isOpen) return null;

    // Map of days to determine which ones are active
    const daysMap: Record<string, boolean> = {
        'M': activeDaysOfWeek.includes('M'),
        'Tu': activeDaysOfWeek.includes('Tu'),
        'W': activeDaysOfWeek.includes('W'),
        'Th': activeDaysOfWeek.includes('Th'),
        'F': activeDaysOfWeek.includes('F'),
        'Sa': activeDaysOfWeek.includes('Sa'),
        'Su': activeDaysOfWeek.includes('Su')
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl w-[600px] overflow-hidden transform transition-all">
                {/* Modal content from Figma design */}
                <div className="p-8 flex flex-col items-center">
                    {/* Bean logo with number */}
                    <div className="relative mb-8">
                        <img 
                            src={beanLogo} 
                            alt="Bean Logo" 
                            className="w-48 h-48 scale-150 ml-[-1rem] mr-[1rem]" 
                        />
                        <div className="absolute inset-0 mt-[5.75rem] flex items-center justify-center">
                            <span className="text-white text-6xl font-bold">
                                {streakDays}
                            </span>
                        </div>
                    </div>

                    {/* Days of the week with check circles */}
                    <div className="flex justify-between w-full mb-8 px-8 font-montserrat font-bold">
                        {/* Monday */}
                        <div className="flex flex-col items-center">
                            <span className={`text-3xl mb-2 ${daysMap['M'] ? 'text-[#A192F8]' : 'text-[#ADA0F9]'}`}>
                                M
                            </span>
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap['M'] ? 'border-[#B6D78A]' : 'border-[#DBDBDB]'}`}>
                                {daysMap['M'] && (
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        
                        {/* Tuesday */}
                        <div className="flex flex-col items-center">
                            <span className={`text-3xl mb-2 ${daysMap['Tu'] ? 'text-[#A192F8]' : 'text-[#ADA0F9]'}`}>
                                Tu
                            </span>
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap['Tu'] ? 'border-[#B6D78A]' : 'border-[#DBDBDB]'}`}>
                                {daysMap['Tu'] && (
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        
                        {/* Wednesday */}
                        <div className="flex flex-col items-center">
                            <span className={`text-3xl mb-2 ${daysMap['W'] ? 'text-[#A192F8]' : 'text-[#ADA0F9]'}`}>
                                W
                            </span>
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap['W'] ? 'border-[#B6D78A]' : 'border-[#DBDBDB]'}`}>
                                {daysMap['W'] && (
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        
                        {/* Thursday */}
                        <div className="flex flex-col items-center">
                            <span className={`text-3xl mb-2 ${daysMap['Th'] ? 'text-[#A192F8]' : 'text-[#ADA0F9]'}`}>
                                Th
                            </span>
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap['Th'] ? 'border-[#B6D78A]' : 'border-[#DBDBDB]'}`}>
                                {daysMap['Th'] && (
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        
                        {/* Friday */}
                        <div className="flex flex-col items-center">
                            <span className={`text-3xl mb-2 ${daysMap['F'] ? 'text-[#2F2569]' : 'text-[#ADA0F9]'}`}>
                                F
                            </span>
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap['F'] ? 'border-[#B6D78A] bg-[#B6D78A]' : 'border-[#DBDBDB]'}`}>
                                {daysMap['F'] && (
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        
                        {/* Saturday */}
                        <div className="flex flex-col items-center">
                            <span className={`text-3xl mb-2 ${daysMap['Sa'] ? 'text-[#A192F8]' : 'text-[#ADA0F9]'}`}>
                                Sa
                            </span>
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap['Sa'] ? 'border-[#B6D78A]' : 'border-[#DBDBDB]'}`}>
                                {daysMap['Sa'] && (
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        
                        {/* Sunday */}
                        <div className="flex flex-col items-center">
                            <span className={`text-3xl mb-2 ${daysMap['Su'] ? 'text-[#A192F8]' : 'text-[#ADA0F9]'}`}>
                                Su
                            </span>
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap['Su'] ? 'border-[#B6D78A]' : 'border-[#DBDBDB]'}`}>
                                {daysMap['Su'] && (
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Text */}
                    <p className="text-[#2F2569] text-2xl mb-8 font-semibold">
                        Write down your Bean Journey everyday
                    </p>

                    {/* Continue button */}
                    <button 
                        onClick={onClose}
                        className="w-full py-5 bg-[#E5D1FE] rounded-xl text-[#9645FF] text-2xl font-medium hover:bg-[#d9bbff] transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

function Homepage() {
    // CSS for animations
    const animationStyles = `
    /* Sunny Day Animation */
    @keyframes sun-rays {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes sunshine {
        0% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 0.9; }
    }
    
    @keyframes cloud-drift {
        0% { transform: translateX(-15px); opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { transform: translateX(80px); opacity: 0; }
    }
    
    /* Rain Animation */
    @keyframes rain-fall {
        0% { transform: translateY(-10px); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translateY(60px); opacity: 0; }
    }
    
    /* Thunder Animation */
    @keyframes thunder-flash {
        0%, 100% { opacity: 0; }
        10% { opacity: 1; }
        20% { opacity: 0; }
        30% { opacity: 0.6; }
        40% { opacity: 0; }
    }
    
    /* Mad Animation */
    @keyframes mad-shake {
        0% { transform: translateX(0); }
        10% { transform: translateX(-1px) rotate(-1deg); }
        20% { transform: translateX(1px) rotate(1deg); }
        30% { transform: translateX(-2px) rotate(-2deg); }
        40% { transform: translateX(2px) rotate(2deg); }
        50% { transform: translateX(-1px) rotate(-1deg); }
        60% { transform: translateX(1px) rotate(1deg); }
        70% { transform: translateX(-1px) rotate(-1deg); }
        80% { transform: translateX(1px) rotate(1deg); }
        90% { transform: translateX(-1px); }
        100% { transform: translateX(0); }
    }
    
    /* Amazing Animation */
    @keyframes confetti-fall {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
        25% { opacity: 1; }
        100% { transform: translateY(60px) rotate(360deg); opacity: 0; }
    }
    
    .confetti-container {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        top: 0;
        left: 0;
        pointer-events: none;
    }
    
    .sunny-container {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        top: 0;
        left: 0;
        pointer-events: none;
    }
    
    .rain-container {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        top: 0;
        left: 0;
        pointer-events: none;
    }
    
    .mad-container {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        top: 0;
        left: 0;
        pointer-events: none;
    }
    
    .mad-container img {
        animation: mad-shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite;
        transform-origin: center;
    }
    
    .confetti-piece {
        position: absolute;
        width: 8px;
        height: 8px;
        background: #FFC107;
        opacity: 0;
        top: 0;
        animation: confetti-fall 3s ease-in-out infinite;
    }
    
    .confetti-piece:nth-child(2n) {
        background: #FF5722;
        height: 6px;
        width: 6px;
        animation-delay: 0.2s;
    }
    
    .confetti-piece:nth-child(3n) {
        background: #E91E63;
        height: 7px;
        width: 7px;
        animation-delay: 0.4s;
    }
    
    .confetti-piece:nth-child(4n) {
        background: #9C27B0;
        height: 5px;
        width: 5px;
        animation-delay: 0.6s;
    }
    
    .confetti-piece:nth-child(5n) {
        background: #03A9F4;
        height: 9px;
        width: 9px;
        animation-delay: 0.8s;
    }
    
    .sunshine {
        position: absolute;
        top: 20px;
        right: 30px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: #FFD700;
        box-shadow: 0 0 20px 8px rgba(255, 215, 0, 0.7);
        animation: sunshine 4s ease-in-out infinite;
        opacity: 0;
        z-index: 5;
    }
    
    .sun-ray-line {
        position: absolute;
        background: #FFD700;
        width: 3px;
        height: 15px;
        top: 50%;
        left: 50%;
        transform-origin: bottom center;
    }
    
    .cloud {
        position: absolute;
        width: 60px;
        height: 25px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        opacity: 0;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        animation: cloud-drift 15s linear infinite;
    }
    
    .cloud:before {
        content: '';
        position: absolute;
        top: -15px;
        left: 12px;
        width: 25px;
        height: 25px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .cloud:after {
        content: '';
        position: absolute;
        top: -22px;
        right: 12px;
        width: 35px;
        height: 35px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .rain-drop {
        position: absolute;
        width: 2px;
        height: 10px;
        background: #03A9F4;
        opacity: 0;
        top: 0;
        animation: rain-fall 2s linear infinite;
    }
    
    .rain-drop:nth-child(2n) {
        left: 20%;
        animation-delay: 0.3s;
    }
    
    .rain-drop:nth-child(3n) {
        left: 40%;
        animation-delay: 0.6s;
    }
    
    .rain-drop:nth-child(4n) {
        left: 60%;
        animation-delay: 0.9s;
    }
    
    .rain-drop:nth-child(5n) {
        left: 80%;
        animation-delay: 1.2s;
    }
    
    .rain-drop:nth-child(6n) {
        left: 90%;
        animation-delay: 1.5s;
    }
    
    .rain-drop:nth-child(7n) {
        left: 70%;
        animation-delay: 1.8s;
    }
    
    .rain-drop:nth-child(8n) {
        left: 30%;
        animation-delay: 2.1s;
    }
    
    .rain-drop:nth-child(9n) {
        left: 50%;
        animation-delay: 2.4s;
    }
    
    .rain-drop:nth-child(10n) {
        left: 10%;
        animation-delay: 2.7s;
    }
    
    .thunder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.3);
        opacity: 0;
        animation: thunder-flash 4s ease-out infinite;
        pointer-events: none;
    }
    `;

	// Streak modal state
	const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
	const [streakDays, setStreakDays] = useState(3); // Example: 3 days streak
	const [activeDaysOfWeek, setActiveDaysOfWeek] = useState<('M' | 'Tu' | 'W' | 'Th' | 'F' | 'Sa' | 'Su')[]>(['M', 'Tu', 'W']);

	// Debug button to manually trigger the streak modal
	const [showDebugButton, setShowDebugButton] = useState(true);
	
	// Function to handle closing the streak modal and marking today
	const handleCloseStreakModal = () => {
		// Get current day of week
		const now = new Date();
		const currentDayIndex = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
		const dayMapping = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'] as const;
		const today = dayMapping[currentDayIndex];
		
		// Add today to activeDaysOfWeek if not already included
		if (!activeDaysOfWeek.includes(today)) {
			setActiveDaysOfWeek([...activeDaysOfWeek, today]);
		}
		
		// Close the modal
		setIsStreakModalOpen(false);
	};
	
	useEffect(() => {
		// Check if it's the first visit of the day
		const checkFirstVisitOfDay = () => {
			const lastVisit = localStorage.getItem('beanJourney_lastVisit');
			const now = new Date();
			const today = now.toISOString().split('T')[0]; // Get YYYY-MM-DD format
			
			if (!lastVisit || lastVisit !== today) {
				// First visit today - show the streak modal
				// Calculate and update streak
				let streak = Number(localStorage.getItem('beanJourney_streak') || '0');
				
				// Check if the last visit was yesterday to maintain streak
				if (lastVisit) {
					const yesterday = new Date(now);
					yesterday.setDate(yesterday.getDate() - 1);
					const yesterdayStr = yesterday.toISOString().split('T')[0];
					
					if (lastVisit !== yesterdayStr) {
						// If last visit wasn't yesterday, reset streak
						streak = 1;
					} else {
						// Increment streak if last visit was yesterday
						streak += 1;
					}
				} else {
					// First time ever, set streak to 1
					streak = 1;
				}
				
				// Save updated streak and today's date
				localStorage.setItem('beanJourney_streak', streak.toString());
				localStorage.setItem('beanJourney_lastVisit', today);
				
				// Update state
				setStreakDays(streak);
				
				// Update active days (this is simplified, in a real app you'd track which days user was active)
				const currentDayIndex = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
				// Map Sunday (0) to position 6 for Monday-first week
				const mondayFirstIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
				
				// Convert to our day format and track last N days (up to current streak, max 7)
				const dayMapping = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'] as const;
				const activeDays: typeof activeDaysOfWeek = [];
				
				for (let i = 0; i < Math.min(streak, 7); i++) {
					const dayIndex = (mondayFirstIndex - i + 7) % 7; // Go backwards from today
					activeDays.unshift(dayMapping[dayIndex]); // Add to beginning so most recent is last
				}
				
				setActiveDaysOfWeek(activeDays);
				
				// Show modal
				setIsStreakModalOpen(true);
			}
		};
		
		// Run check on component mount
		checkFirstVisitOfDay();
	}, []);

	// Sample data for recently visited
	const recentCards = [
		{ title: "Study", date: "Dec 20, 2023", img: "/images/bean-journey/figma/card_study_img.png", icon: "/images/bean-journey/figma/card_study_icon.png" },
		{ title: "Fitness", date: "Dec 20, 2023", img: "/images/bean-journey/figma/card_fitness_img.png", icon: "/images/bean-journey/figma/card_fitness_icon.png" },
		{ title: "Nature", date: "Dec 20, 2023", img: "/images/bean-journey/figma/card_nature_img.png", icon: "/images/bean-journey/figma/card_nature_icon.png" },
		{ title: "Pet", date: "Dec 20, 2023", img: "/images/bean-journey/figma/card_pet_img.png", icon: "/images/bean-journey/figma/card_pet_icon.png" },
		{ title: "Night Activity", date: "Dec 20, 2023", img: "/images/bean-journey/figma/card_night_img.png", icon: "/images/bean-journey/figma/card_night_icon.png" },
		{ title: "Winter", date: "Dec 20, 2023", img: "/images/bean-journey/figma/card_winter_img.png", icon: "/images/bean-journey/figma/card_winter_icon.png" },
	];

    // --- Calendar State and Data ---
    const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0)); // Example: January 2024
    const events: CalendarEvent[] = [
        { date: new Date(2024, 0, 1), emoji: "/images/bean-journey/figma/emoji_face_01.png", text: "Eat somethin...", emojiBg: 'bg-[#FFEBF2]', textBg: 'bg-[#FCA7C4]', mood: 'amazing' },
        { date: new Date(2024, 0, 9), emoji: "/images/bean-journey/figma/emoji_face_02.png", text: "Eat somethin...", emojiBg: 'bg-[#E6F9F1]', textBg: 'bg-[#12A7F1]', mood: 'happy' },
        { date: new Date(2024, 0, 19), emoji: "/images/bean-journey/figma/emoji_face_03.png", text: "Eat somethin...", emojiBg: 'bg-[#222222]', textBg: 'bg-[#B981F3]', mood: 'neutral' },
        { date: new Date(2024, 0, 31), emoji: "/images/bean-journey/figma/emoji_face_04.png", text: "Eat somethin...", emojiBg: 'bg-[#E6F9F1]', textBg: 'bg-[#FF4BEF]', mood: 'sad' },
    ];

    // Helper function to create confetti elements
    const renderConfetti = () => {
        const pieces = [];
        for (let i = 0; i < 15; i++) {
            const left = `${Math.random() * 100}%`;
            const animationDuration = `${2 + Math.random() * 2}s`;
            const transform = `rotate(${Math.random() * 360}deg)`;
            
            pieces.push(
                <div 
                    key={i} 
                    className="confetti-piece" 
                    style={{ 
                        left, 
                        animationDuration,
                        transform,
                    }}
                />
            );
        }
        return <div className="confetti-container group-hover:opacity-100 opacity-0 transition-opacity">{pieces}</div>;
    };

    // Helper function to create sunny day elements
    const renderSunnyDay = () => {
        // Create 8 sun rays positioned around the sun
        const sunRays = [];
        for (let i = 0; i < 8; i++) {
            const angle = i * 45; // 8 rays distributed evenly (360 / 8 = 45 degrees)
            
            sunRays.push(
                <div 
                    key={`ray-${i}`}
                    className="sun-ray-line"
                    style={{
                        transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                        transformOrigin: 'bottom',
                    }}
                />
            );
        }
        
        return (
            <div className="sunny-container group-hover:opacity-100 opacity-0 transition-opacity duration-500">
                <div className="cloud" style={{ top: "10px", left: "5px", animationDelay: "0.5s" }}></div>
                <div className="cloud" style={{ top: "40px", left: "30px", width: "50px", height: "20px", animationDelay: "3s" }}></div>
                
                <div className="sunshine" style={{ top: "-10px", right: "-10px", left: "auto" }}>
                    {sunRays}
                </div>
            </div>
        );
    };

    // Helper function to create rain & thunder elements
    const renderRainThunder = () => {
        const drops = [];
        for (let i = 0; i < 30; i++) {
            const left = `${Math.random() * 100}%`;
            const animationDuration = `${1 + Math.random() * 1}s`;
            
            drops.push(
                <div 
                    key={i} 
                    className="rain-drop" 
                    style={{ 
                        left, 
                        animationDuration,
                    }}
                />
            );
        }
        return (
            <div className="rain-container group-hover:opacity-100 opacity-0 transition-opacity">
                {drops}
                <div className="thunder"></div>
            </div>
        );
    };
    
    // Helper function to create mad animation elements
    const renderMadAnimation = (emoji: string) => {
        return (
            <div className="mad-container group-hover:opacity-100 opacity-100 transition-opacity">
                <img 
                    src={emoji} 
                    alt="Mad Emoji" 
                    className="w-[4rem] h-[4rem] drop-shadow-md hidden group-hover:block" 
                />
            </div>
        );
    };

    // Create a modifier for dates with events
    const modifiers = {
        hasEvent: events.map(event => event.date),
    };

    // Helper function to find event data for a specific date
    const findEventForDate = (date: Date): CalendarEvent | undefined => {
        return events.find(event =>
            event.date.getDate() === date.getDate() &&
            event.date.getMonth() === date.getMonth() &&
            event.date.getFullYear() === date.getFullYear()
        );
    };

    // Custom Day component - Always show day number
    const DayContent = (props: { date: Date; displayMonth: Date }) => {
        const date = props.date;
        const event = findEventForDate(date);
        const isOutside = props.date.getMonth() !== props.displayMonth.getMonth();

        return (
            <div className="flex flex-col justify-between w-full h-full relative overflow-hidden group hover:bg-gray-50 transition-colors duration-200">
                {/* Day number, positioned in top-left corner with subtle gradient background */}
                <div className="absolute top-0 left-0 p-2">
                    <span className={`text-sm font-medium ${isOutside ? 'text-gray-400' : 'text-[#2f2569]'}`}>
                        {format(date, 'd')}
                    </span>
                </div>
                {/* Render event content if it exists and is not outside */}
                {event && !isOutside && (
                    <>
                        {/* Add the appropriate animation based on mood */}
                        {event.mood === 'amazing' && renderConfetti()}
                        {event.mood === 'happy' && renderSunnyDay()}
                        {event.mood === 'sad' && renderRainThunder()}
                        {event.mood === 'mad' && renderMadAnimation(event.emoji)}
                        
                        {/* Emoji positioned precisely per image with subtle animation on hover */}
                        <div 
                            className={`absolute transition-transform duration-300 ease-in-out ${event.mood === 'mad' ? 'group-hover:hidden' : 'group-hover:scale-110'}`}
                            style={{ top: '35%', right: '5%', zIndex: 20 }}
                        >
                            <img 
                                src={event.emoji} 
                                alt="Emoji" 
                                className="w-[4rem] h-[4rem] drop-shadow-md relative"
                                style={{ position: 'relative', zIndex: 20 }}
                            />
                        </div>
                        {/* Text label at the bottom, full width with accent on left */}
                        <div className={`w-full mt-auto flex items-stretch overflow-hidden shadow-sm`}>
                            <div className={`w-1.5 ${event.textBg}`}></div>
                            <div className={`flex-1 bg-opacity-30 text-xs backdrop-blur-sm ${event.emojiBg === 'bg-[#222222]' ? 'text-white' : 'text-[#666B88] font-medium'} ${event.textBg} py-1 px-3 transition-all duration-200 ease-in-out`}>
                                {event.text.replace("...", "...")}
                            </div>
                        </div>
                    </>
                )}
                {/* Add subtle current day indicator if it's today */}
                {date.getDate() === new Date().getDate() && 
                 date.getMonth() === new Date().getMonth() && 
                 date.getFullYear() === new Date().getFullYear() && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-400"></div>
                )}
            </div>
        );
    };

    // Custom Caption component for header
    function CustomCaption(/*Removed props: CaptionProps - might not need displayMonth*/) {
        const { nextMonth, previousMonth } = useNavigation();
        const handlePreviousClick = () => {
            if (!previousMonth) return;
            setCurrentMonth(previousMonth);
        };
        const handleNextClick = () => {
            if (!nextMonth) return;
            setCurrentMonth(nextMonth);
        };

        // Determine if the currentMonth state represents today's actual month
        const isTodayMonth = currentMonth.getMonth() === new Date().getMonth() &&
                             currentMonth.getFullYear() === new Date().getFullYear();

        return (
            <div className="flex justify-between items-center mb-6 px-1"> {/* Match Figma spacing */}
                <button
                    disabled={!previousMonth}
                    onClick={handlePreviousClick}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1" // Added padding
                >
                    <img src="/images/bean-journey/figma/icon_caret_right_calendar.png" alt="Previous Month" className="w-6 h-6 transform rotate-180" />
                </button>
                <h3 className="text-[#5B586E] font-medium text-lg">
                    {/* Show "Today" or Month based on state */}
                    {isTodayMonth ? "Today" : format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                    disabled={!nextMonth}
                    onClick={handleNextClick}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1" // Added padding
                >
                    <img src="/images/bean-journey/figma/icon_caret_right_calendar.png" alt="Next Month" className="w-6 h-6" />
                </button>
            </div>
        );
    }

    // Function to handle debug button click
    const handleDebugClick = () => {
        // Clear localStorage items to simulate first visit
        localStorage.removeItem('beanJourney_lastVisit');
        
        // Refresh the page to trigger the useEffect
        window.location.reload();
    };

    // Function to toggle debug button visibility
    const toggleDebugButton = () => {
        setShowDebugButton(prev => !prev);
    };

	return (
		<>
			<style>{animationStyles}</style>
			<div className="h-full max-h-[calc(100vh-100px)] overflow-auto px-4 bg-white dark:bg-[#1E1726] border-x-1 dark:border-x-2"> 
				{/* Header Card - Exact Figma Match */}
				<div className="bg-white rounded-lg p-8 shadow-sm mb-8 relative overflow-hidden h-[270px]">
					{/* Sun Decoration */}
					<div className="absolute right-[0rem] -top-[0rem] w-[75rem] h-[18rem]  overflow-hidden">
						<img 
							src="/images/bean-journey/figma/header_sun.png"
							alt="Sun Elements" 
							className="w-[100%] h-[100%] object-cover object-center"
						/>
					</div>

					{/* Main Content Area */} 
					<div className="flex justify-between items-start relative z-10 h-full">
						{/* Left Column */} 
						<div className="flex flex-col w-3/5">
							{/* Greeting & Title */} 
							<div className="flex items-start mb-5">
								<div className="w-2 h-[4.5rem] bg-[#7DF08F] rounded-full mr-3 mt-1"></div>
								<div>
									<p className="text-gray-500 text-[18px] font-normal mb-1 font-['Readex_Pro']">What a great day to learn something new</p>
									<div className="flex items-center">
										<h1 className="text-[38px] font-normal text-[#2f2569] mr-2 font-['Readex_Pro']">Today is a sunny day</h1> 
										<img src="/images/bean-journey/figma/header_sun_decoration.png" alt="Sun Icon" className="w-8 h-8" />
									</div>
								</div>
							</div>

							{/* Details */} 
							<div className="pl-5 space-y-2.5">
								<p className="text-[#2f2569] font-normal text-[20px] font-['Readex_Pro']">Details</p> 
								<div className="flex flex-col space-y-2.5">
									<div className="flex items-center text-[#989CB8]">
										<img src="/images/bean-journey/figma/icon_book_open.png" alt="Diaries Icon" className="w-5 h-5 mr-2" />
										<span className="text-[16px] font-normal font-['Readex_Pro']">Diaries: 13</span>
									</div>
									<div className="flex items-center text-[#989CB8]">
										<img src="/images/bean-journey/figma/icon_clock_bold.png" alt="Clock Icon" className="w-5 h-5 mr-2" />
										<span className="text-[16px] font-normal font-['Readex_Pro']">Latest updated: Aug 08 2024</span>
									</div>
								</div>
							</div>
						</div>

						{/* Forest Illustration - positioned in the middle-right */} 
						<div className="absolute right-[34rem] top-[4rem]">
							<img 
								src="/images/bean-journey/figma/header_illustration_forest.png"
								alt="Forest Illustration" 
								className="w-52 h-auto" 
							/> 
						</div>
						<div className="absolute right-[45.5rem] top-[4rem]">
							<img 
								src="/images/bean-journey/figma/header_illustration_forest.png"
								alt="Forest Illustration" 
								className="w-52 h-auto" 
							/> 
						</div>
						
						{/* "Have anything awesome today?" text with button */} 
						<div className="absolute -bottom-4 -right-4 flex items-center">
							<span className="text-black w-[8rem] text-[16px] font-['Readex_Pro'] mr-3">Have anything awsome today ?</span>
							<button className="bg-[#f2e7ff] w-10 h-10 rounded-md flex items-center justify-center border-[0.1rem] border-[#9645FF]">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9645ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<line x1="12" y1="5" x2="12" y2="19"></line>
									<line x1="5" y1="12" x2="19" y2="12"></line>
								</svg>
							</button>
						</div>
					</div>
				</div>
				
				{/* Recently Visited Section */}
				<div className="mb-8">
					<div className="flex justify-between items-center mb-4"> {/* Add container for title and arrows */}
						<h2 className="text-lg font-medium text-[#989CB8]">Recently visited</h2>
						{/* Add Navigation Arrows (Functionality needs implementation) */}
						<div className="flex space-x-2">
							{/* Placeholder for Left Arrow */}
							{/* <button className="text-gray-400 hover:text-gray-600"> < </button> */}
							<button className="text-gray-400 hover:text-gray-600">
								<img src="/images/bean-journey/figma/icon_caret_right.png" alt="Scroll Right" className="w-6 h-6 transform rotate-180" /> {/* Reusing caret icon, rotated */}
							</button>
							<button className="text-gray-400 hover:text-gray-600">
								<img src="/images/bean-journey/figma/icon_caret_right.png" alt="Scroll Right" className="w-6 h-6" />
							</button>
						</div>
					</div>
					{/* Update grid and card styles */}
					<div className="grid grid-cols-6 gap-4 overflow-x-auto pb-4"> {/* Adjusted padding */}
						{recentCards.map((card, index) => (
							<div key={index} className="bg-white rounded-3xl shadow-sm overflow-visible min-w-[180px] relative"> {/* Added relative, changed overflow back */}
								{/* Remove relative from image container */}
								<div className="h-32 bg-gray-200 rounded-t-3xl overflow-hidden">
									<img src={card.img} alt={card.title} className="w-full h-full object-cover" />
								</div>
								{/* Position icon absolutely on the boundary, left-aligned with padding, larger */}
								<div className="absolute top-32 left-4 -translate-y-1/2"> {/* Positioned left-4, NO bg/padding/shadow */}
									<img src={card.icon} alt={`${card.title} icon`} className="w-10 h-10" /> {/* Increased icon size */}
								</div>
								{/* Text content, left aligned, added top padding */}
								<div className="p-4 pt-8 text-left"> {/* Added pt-8, text-left */}
									<h3 className="text-[#2f2569] font-medium text-lg mb-1">{card.title}</h3>
									<p className="text-sm text-[#cac9c8]">{card.date}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				
				{/* Calendar Section */}
				<div>
					<h2 className="text-lg font-medium text-[#989CB8] mb-4">Calendar</h2>
					<div className="bg-white rounded-lg shadow-sm p-4">
                        <DayPicker
                            mode="single"
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                            showOutsideDays
                            fixedWeeks
                            modifiers={modifiers}
                            formatters={{
                                formatWeekdayName: (day) => format(day, 'EEE') // Format as Mon, Tue, ...
                            }}
                            // --- Custom Components ---
                            components={{
                                Day: DayContent,
                                Caption: CustomCaption, // Use custom caption
                            }}
                            // --- Styling via classNames prop ---
                            classNames={{
                                root: 'w-full',
                                months: 'w-full',
                                month: 'w-full space-y-4',
                                table: 'w-full border-collapse rounded-xl shadow-sm overflow-hidden',
                                tbody: '',
                                caption_label: 'text-[#5B586E] font-medium text-lg',
                                nav_button: 'p-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors duration-200',
                                head_row: 'flex border-b border-gray-100 bg-gray-50',
                                head_cell: 'flex-1 text-center py-3 text-[#989CB8] text-base font-medium',
                                row: 'flex w-full',
                                cell: 'flex-1 border-r border-b border-gray-100 last:border-r-0 h-40 relative transition-all duration-200 hover:border-purple-100',
                                day: 'w-full h-full text-center font-medium',
                                day_selected: '!bg-purple-100 !text-purple-800',
                                day_today: 'font-bold',
                                day_outside: 'text-gray-400 opacity-75',
                                day_disabled: 'text-gray-300',
                            }}
                        />
					</div>
				</div>
				
				{/* Debug button */}
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
				
				{/* Show debug button toggle when debug button is hidden */}
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
				
				{/* Streak Modal */}
				<StreakModal 
					isOpen={isStreakModalOpen}
					onClose={handleCloseStreakModal}
					streakDays={streakDays}
					activeDaysOfWeek={activeDaysOfWeek}
				/>
				
				{/* Updated Chat bubble / Floating Action Button */}
				<div className="fixed bottom-8 right-8 z-20"> {/* Added z-index */} 
					<button className="w-14 h-14 bg-[#CA91FE] rounded-full flex items-center justify-center shadow-lg relative hover:bg-[#b87ee0] transition-colors duration-200"> {/* Increased size, updated bg, added relative, hover, transition */} 
						{/* Replace emoji span with SVG icons */}
						{/* Note: Positioning might need fine-tuning based on actual SVG rendering */}
						<img src="/images/bean-journey/figma/fab_icon_vector4.svg" alt="FAB Icon part 1" className="absolute w-8 h-8" style={{ top: '12px', left: '12px' }} /> 
						<img src="/images/bean-journey/figma/fab_icon_vector5.svg" alt="FAB Icon part 2" className="absolute w-3 h-3" style={{ top: '20px', left: '22px' }} />
						<img src="/images/bean-journey/figma/fab_icon_vector6.svg" alt="FAB Icon part 3" className="absolute w-3 h-3" style={{ top: '20px', left: '30px' }} />
					</button>
				</div>
			</div>
		</>
	);
}
