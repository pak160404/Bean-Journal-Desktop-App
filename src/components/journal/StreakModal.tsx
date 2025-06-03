import beanLogo from "@/images/logo_bean_journal.png";

// Streak Modal Component
export interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  activeDaysOfWeek: ("M" | "Tu" | "W" | "Th" | "F" | "Sa" | "Su")[];
  lastEntryDateDisplay?: string; // Optional: Display for the last entry date
}

export function StreakModal({
  isOpen,
  onClose,
  currentStreak,
  activeDaysOfWeek,
  lastEntryDateDisplay,
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
                {currentStreak}
              </span>
            </div>
          </div>
          {lastEntryDateDisplay && (
            <p className="text-[#2F2569] text-lg mb-2">
              Last entry: {lastEntryDateDisplay}
            </p>
          )}
          <p className="text-[#2F2569] text-xl mb-6 font-medium">
            You're on a {currentStreak}-day streak!
          </p>
          <div className="flex justify-between w-full mb-8 px-8 font-montserrat font-bold">
            {Object.entries(daysMap).map(([day, isActive]) => (
              <div className="flex flex-col items-center" key={day}>
                <span
                  className={`text-3xl mb-2 ${isActive ? "text-[#A192F8]" : "text-[#ADA0F9]"}`}
                >
                  {day}
                </span>
                <div
                  className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${isActive ? "border-[#B6D78A] bg-[#B6D78A]" : "border-[#DBDBDB]"}`}
                >
                  {isActive && (
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
            ))}
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