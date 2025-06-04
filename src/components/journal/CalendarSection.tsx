import React from 'react';
import { DayPicker, useNavigation } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';

// Define types for event data (can be moved to a types file if shared)
export type CalendarEvent = {
    id?: string;
    date: Date;
    emoji: string;
    text: string;
    emojiBg: string; // Background for the emoji container
    textBg: string;  // Background for the text label
    mood?: 'happy' | 'sad' | 'neutral' | 'mad' | 'amazing';
};

interface CalendarSectionProps {
    events: CalendarEvent[];
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
}

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
    const sunRays = [];
    for (let i = 0; i < 8; i++) {
        const angle = i * 45;
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

// Helper function to find all event data for a specific date
const findEventsForDate = (date: Date, events: CalendarEvent[]): CalendarEvent[] => {
    return events.filter(event =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
};

// Custom Day component
const DayContent = (props: { date: Date; displayMonth: Date; events: CalendarEvent[] }) => {
    const navigate = useNavigate();
    const dailyEvents = findEventsForDate(props.date, props.events);
    const event = dailyEvents.length > 0 ? dailyEvents[0] : undefined; // Use the first event for main display/mood animation
    const isOutside = props.date.getMonth() !== props.displayMonth.getMonth();

    const handleCellClick = () => {
        if (event && event.id) {
            navigate({ to: `/journal/diary` });
        }
    };

    return (
        <div 
            className="flex flex-col justify-between w-full h-full relative overflow-hidden group hover:bg-gray-50 transition-colors duration-200 p-1 cursor-pointer"
            onClick={handleCellClick}
        >
            <div className="absolute top-0 left-0 p-2">
                <span className={`text-xs font-medium ${isOutside ? 'text-gray-400' : 'text-[#2f2569]'}`}> {/* Adjusted text size for more space */}
                    {format(props.date, 'd')}
                </span>
            </div>
            {dailyEvents.length > 0 && (
                <>
                    {/* Animations based on the first event's mood */} 
                    {event && event.mood === 'amazing' && renderConfetti()}
                    {event && event.mood === 'happy' && renderSunnyDay()}
                    {event && event.mood === 'sad' && renderRainThunder()}
                    {event && event.mood === 'mad' && renderMadAnimation(event.emoji)}
                    
                    {/* Main event display (first event) */}
                    {event && (
                        <div 
                            className={`absolute transition-transform duration-300 ease-in-out ${event.mood === 'mad' ? 'group-hover:hidden' : 'group-hover:scale-110'}`}
                            style={{ top: '30%', right: '5%', zIndex: 20 }} // Adjusted top position
                        >
                            <img 
                                src={event.emoji} 
                                alt="Emoji" 
                                className="w-12 h-12 drop-shadow-md relative" // Adjusted size
                                style={{ position: 'relative', zIndex: 20 }}
                            />
                        </div>
                    )}

                    {/* Text label for the first event */} 
                    {event && (
                        <div className={`w-full mt-auto flex items-stretch overflow-hidden shadow-sm`}>
                            <div className={`w-1 ${event.textBg}`}></div>
                            <div className={`flex-1 bg-opacity-30 text-[10px] backdrop-blur-sm ${event.emojiBg === 'bg-[#222222]' ? 'text-white' : 'text-[#666B88] font-medium'} ${event.textBg} py-0.5 px-1.5 transition-all duration-200 ease-in-out`}> {/* Adjusted padding and text size */}
                                {event.text.replace("...", "...")}
                                {dailyEvents.length > 1 && <span className="font-bold ml-1">+{dailyEvents.length - 1}</span>}
                            </div>
                        </div>
                    )}

                    {/* Hover effect to show all event texts for the day */} 
                    {/* {dailyEvents.length > 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-75 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-auto z-30">
                            <p className="font-bold mb-1">{format(props.date, 'MMM d')}:</p>
                            {dailyEvents.map((e, index) => (
                                <p key={index} className="truncate">- {e.text}</p>
                            ))}
                        </div>
                    )} */}
                </>
            )}
            {props.date.getDate() === new Date().getDate() && 
             props.date.getMonth() === new Date().getMonth() && 
             props.date.getFullYear() === new Date().getFullYear() && !isOutside && ( // Only show for current month's today
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-500"></div>
            )}
        </div>
    );
};

// Custom Caption component
function CustomCaption(props: { currentMonth: Date, setCurrentMonth: (date: Date) => void }) {
    const { nextMonth, previousMonth } = useNavigation();
    const handlePreviousClick = () => {
        if (!previousMonth) return;
        props.setCurrentMonth(previousMonth);
    };
    const handleNextClick = () => {
        if (!nextMonth) return;
        props.setCurrentMonth(nextMonth);
    };

    const isTodayMonth = props.currentMonth.getMonth() === new Date().getMonth() &&
                         props.currentMonth.getFullYear() === new Date().getFullYear();

    return (
        <div className="flex justify-between items-center mb-6 px-1">
            <button
                disabled={!previousMonth}
                onClick={handlePreviousClick}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1"
            >
                <img src="/images/bean-journey/figma/icon_caret_right_calendar.png" alt="Previous Month" className="w-6 h-6 transform rotate-180" />
            </button>
            <h3 className="text-[#5B586E] font-medium text-lg">
                {isTodayMonth ? "Today" : format(props.currentMonth, 'MMMM yyyy')}
            </h3>
            <button
                disabled={!nextMonth}
                onClick={handleNextClick}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1"
            >
                <img src="/images/bean-journey/figma/icon_caret_right_calendar.png" alt="Next Month" className="w-6 h-6" />
            </button>
        </div>
    );
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ events, currentMonth, setCurrentMonth }) => {
    const modifiers = {
        hasEvent: events.map(event => event.date),
    };

    return (
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
                        formatWeekdayName: (day) => format(day, 'EEE')
                    }}
                    components={{
                        Day: (dayProps) => <DayContent {...dayProps} events={events} />,
                        Caption: () => <CustomCaption currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />,
                    }}
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
    );
};

export default CalendarSection; 