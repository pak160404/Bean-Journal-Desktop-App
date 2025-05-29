import { createFileRoute } from "@tanstack/react-router";
import "@fontsource/readex-pro/400.css"; // Regular weight
import "@fontsource/readex-pro/500.css"; // Medium weight
import "@fontsource/readex-pro/600.css"; // Medium weight
// import { CalendarIcon, ClockIcon } from "lucide-react"; // Assuming lucide-react for icons - Removed unused import
import "react-day-picker/dist/style.css"; // Import default styles (we'll override)
import { useState, useEffect, useMemo } from "react";
import beanLogo from "@/images/logo_bean_journal.png";
import HeaderCard from "@/components/journal/HeaderCard";
import RecentCards from "@/components/journal/RecentCards";
import CalendarSection, {
  CalendarEvent,
} from "@/components/journal/CalendarSection";
import FloatingActionButton from "@/components/journal/FloatingActionButton";
import DebugControls from "@/components/journal/DebugControls";
import { Tag } from "../../types/supabase"; // Import Tag interface
import TagCreateModal from "@/components/journal/TagCreateModal"; // Import the modal
import { getTagsByUserId, createTag } from "../../services/tagService"; // Import tag services
import { createClerkSupabaseClient } from "../../utils/supabaseClient"; // Import Supabase client creator
import { useAuth } from "@clerk/clerk-react"; // Import useAuth for token

// Update the route path to make it a child of the journal root
export const Route = createFileRoute("/journal/")({
  component: Homepage,
});

// Streak Modal Component
interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  activeDaysOfWeek: ("M" | "Tu" | "W" | "Th" | "F" | "Sa" | "Su")[];
}

function StreakModal({
  isOpen,
  onClose,
  streakDays,
  activeDaysOfWeek,
}: StreakModalProps) {
  if (!isOpen) return null;

  const daysMap: Record<string, boolean> = {
    M: activeDaysOfWeek.includes("M"),
    Tu: activeDaysOfWeek.includes("Tu"),
    W: activeDaysOfWeek.includes("W"),
    Th: activeDaysOfWeek.includes("Th"),
    F: activeDaysOfWeek.includes("F"),
    Sa: activeDaysOfWeek.includes("Sa"),
    Su: activeDaysOfWeek.includes("Su"),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-[600px] overflow-hidden transform transition-all">
        <div className="p-8 flex flex-col items-center">
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
          <div className="flex justify-between w-full mb-8 px-8 font-montserrat font-bold">
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl mb-2 ${daysMap["M"] ? "text-[#A192F8]" : "text-[#ADA0F9]"}`}
              >
                M
              </span>
              <div
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap["M"] ? "border-[#B6D78A]" : "border-[#DBDBDB]"}`}
              >
                {daysMap["M"] && (
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 6L6 11L15 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl mb-2 ${daysMap["Tu"] ? "text-[#A192F8]" : "text-[#ADA0F9]"}`}
              >
                Tu
              </span>
              <div
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap["Tu"] ? "border-[#B6D78A]" : "border-[#DBDBDB]"}`}
              >
                {daysMap["Tu"] && (
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 6L6 11L15 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl mb-2 ${daysMap["W"] ? "text-[#A192F8]" : "text-[#ADA0F9]"}`}
              >
                W
              </span>
              <div
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap["W"] ? "border-[#B6D78A]" : "border-[#DBDBDB]"}`}
              >
                {daysMap["W"] && (
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 6L6 11L15 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl mb-2 ${daysMap["Th"] ? "text-[#A192F8]" : "text-[#ADA0F9]"}`}
              >
                Th
              </span>
              <div
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap["Th"] ? "border-[#B6D78A]" : "border-[#DBDBDB]"}`}
              >
                {daysMap["Th"] && (
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 6L6 11L15 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl mb-2 ${daysMap["F"] ? "text-[#2F2569]" : "text-[#ADA0F9]"}`}
              >
                F
              </span>
              <div
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap["F"] ? "border-[#B6D78A] bg-[#B6D78A]" : "border-[#DBDBDB]"}`}
              >
                {daysMap["F"] && (
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 6L6 11L15 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl mb-2 ${daysMap["Sa"] ? "text-[#A192F8]" : "text-[#ADA0F9]"}`}
              >
                Sa
              </span>
              <div
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap["Sa"] ? "border-[#B6D78A]" : "border-[#DBDBDB]"}`}
              >
                {daysMap["Sa"] && (
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 6L6 11L15 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl mb-2 ${daysMap["Su"] ? "text-[#A192F8]" : "text-[#ADA0F9]"}`}
              >
                Su
              </span>
              <div
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${daysMap["Su"] ? "border-[#B6D78A]" : "border-[#DBDBDB]"}`}
              >
                {daysMap["Su"] && (
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 6L6 11L15 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
          <p className="text-[#2F2569] text-2xl mb-8 font-semibold">
            Write down your Bean Journey everyday
          </p>
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
    .confetti-piece:nth-child(10n) {
        left: 10%;
        animation-delay: 2.7s;
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

  const { getToken } = useAuth(); // Get getToken from Clerk
  // Memoize the Supabase client instance
  const supabase = useMemo(
    () => createClerkSupabaseClient(getToken),
    [getToken]
  );

  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [streakDays, setStreakDays] = useState(3);
  const [activeDaysOfWeek, setActiveDaysOfWeek] = useState<
    ("M" | "Tu" | "W" | "Th" | "F" | "Sa" | "Su")[]
  >(["M", "Tu", "W"]);
  const [showDebugButton, setShowDebugButton] = useState(true);

  // Tag related state
  const [tags, setTags] = useState<Tag[]>([]);
  const [isTagCreateModalOpen, setIsTagCreateModalOpen] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);

  // Placeholder for current user ID - replace with actual user management logic
  const currentUserId = "user123";

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      if (!currentUserId) return;
      setLoadingTags(true);
      setTagError(null);
      try {
        const fetchedTags = await getTagsByUserId(supabase, currentUserId);
        setTags(fetchedTags || []);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setTagError("Failed to load tags.");
      }
      setLoadingTags(false);
    };
    fetchTags();
  }, [currentUserId, supabase]);

  const handleCloseStreakModal = () => {
    const now = new Date();
    const currentDayIndex = now.getDay();
    const dayMapping = ["Su", "M", "Tu", "W", "Th", "F", "Sa"] as const;
    const today = dayMapping[currentDayIndex];

    if (!activeDaysOfWeek.includes(today)) {
      setActiveDaysOfWeek([...activeDaysOfWeek, today]);
    }
    setIsStreakModalOpen(false);
  };

  useEffect(() => {
    const checkFirstVisitOfDay = () => {
      const lastVisit = localStorage.getItem("beanJourney_lastVisit");
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      if (!lastVisit || lastVisit !== today) {
        let streak = Number(localStorage.getItem("beanJourney_streak") || "0");

        if (lastVisit) {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          if (lastVisit !== yesterdayStr) {
            streak = 1;
          } else {
            streak += 1;
          }
        } else {
          streak = 1;
        }

        localStorage.setItem("beanJourney_streak", streak.toString());
        localStorage.setItem("beanJourney_lastVisit", today);
        setStreakDays(streak);

        const currentDayIndex = now.getDay();
        const mondayFirstIndex =
          currentDayIndex === 0 ? 6 : currentDayIndex - 1;
        const dayMapping = ["M", "Tu", "W", "Th", "F", "Sa", "Su"] as const;
        const activeDays: typeof activeDaysOfWeek = [];

        for (let i = 0; i < Math.min(streak, 7); i++) {
          const dayIndex = (mondayFirstIndex - i + 7) % 7;
          activeDays.unshift(dayMapping[dayIndex]);
        }
        setActiveDaysOfWeek(activeDays);
        setIsStreakModalOpen(true);
      }
    };
    checkFirstVisitOfDay();
  }, []);

  const handleAddNewTag = () => {
    setIsTagCreateModalOpen(true);
  };

  const handleTagSubmit = async (tagData: {
    name: string;
    color_hex: string;
  }) => {
    if (!currentUserId) {
      setTagError("User not identified. Cannot create tag.");
      return;
    }
    setLoadingTags(true); // Reuse loading state for simplicity
    setTagError(null);
    try {
      const newTag = await createTag(supabase, {
        ...tagData,
        user_id: currentUserId,
        // id is generated by Supabase, is_ai_suggested defaults in DB
      });
      if (newTag) {
        setTags((prevTags) => [...prevTags, newTag]);
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
    setIsTagCreateModalOpen(false);
    setLoadingTags(false);
  };

  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0));
  const calendarEventsData: CalendarEvent[] = [
    {
      date: new Date(2024, 0, 1),
      emoji: "/images/bean-journey/figma/emoji_face_01.png",
      text: "Eat somethin...",
      emojiBg: "bg-[#FFEBF2]",
      textBg: "bg-[#FCA7C4]",
      mood: "amazing",
    },
    {
      date: new Date(2024, 0, 9),
      emoji: "/images/bean-journey/figma/emoji_face_02.png",
      text: "Eat somethin...",
      emojiBg: "bg-[#E6F9F1]",
      textBg: "bg-[#12A7F1]",
      mood: "happy",
    },
    {
      date: new Date(2024, 0, 19),
      emoji: "/images/bean-journey/figma/emoji_face_03.png",
      text: "Eat somethin...",
      emojiBg: "bg-[#222222]",
      textBg: "bg-[#B981F3]",
      mood: "neutral",
    },
    {
      date: new Date(2024, 0, 31),
      emoji: "/images/bean-journey/figma/emoji_face_04.png",
      text: "Eat somethin...",
      emojiBg: "bg-[#E6F9F1]",
      textBg: "bg-[#FF4BEF]",
      mood: "sad",
    },
  ];

  const handleDebugClick = () => {
    localStorage.removeItem("beanJourney_lastVisit");
    window.location.reload();
  };

  const toggleDebugButton = () => {
    setShowDebugButton((prev) => !prev);
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="h-full max-h-[calc(100vh-100px)] overflow-auto px-4 bg-white dark:bg-[#1E1726] border-x-1 dark:border-x-2">
        <HeaderCard />
        {/* Display loading or error for tags */}
        {loadingTags && (
          <p className="text-center text-gray-500 py-4">Loading tags...</p>
        )}
        {tagError && (
          <p className="text-center text-red-500 py-4">{tagError}</p>
        )}
        {!loadingTags && !tagError && (
          <RecentCards tags={tags} onAddNewTag={handleAddNewTag} />
        )}
        <CalendarSection
          events={calendarEventsData}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
        <DebugControls
          showDebugButton={showDebugButton}
          handleDebugClick={handleDebugClick}
          toggleDebugButton={toggleDebugButton}
        />
        <StreakModal
          isOpen={isStreakModalOpen}
          onClose={handleCloseStreakModal}
          streakDays={streakDays}
          activeDaysOfWeek={activeDaysOfWeek}
        />
        <TagCreateModal
          isOpen={isTagCreateModalOpen}
          onClose={() => setIsTagCreateModalOpen(false)}
          onSubmit={handleTagSubmit}
        />
        <FloatingActionButton />
      </div>
    </>
  );
}
