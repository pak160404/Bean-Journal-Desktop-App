import { useState, useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Profile, JournalEntry } from "../../types/supabase";
import { StreakModal, StreakModalProps } from "./StreakModal";

interface StreakManagementProps {
  supabase: SupabaseClient;
  userId: string | null | undefined;
  userProfile: Profile | null;
  journalEntries: JournalEntry[];
  debugStreakKey: number;
}

const StreakManagement: React.FC<StreakManagementProps> = ({ 
  supabase, 
  userId, 
  userProfile, 
  journalEntries, 
  debugStreakKey 
}) => {
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [activeDaysOfWeek, setActiveDaysOfWeek] = useState<StreakModalProps['activeDaysOfWeek']>([]);

  const handleCloseStreakModal = () => {
    setIsStreakModalOpen(false);
  };

  useEffect(() => {
    const checkFirstVisitOfDay = () => {
      if (!userProfile || !userId) return;

      const lastVisit = localStorage.getItem("beanJourney_lastVisit");
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];

      // Determine active days based on actual entries in the last 7 days
      const dayMapping: ReadonlyArray<"Su" | "M" | "Tu" | "W" | "Th" | "F" | "Sa"> = [
        "Su", "M", "Tu", "W", "Th", "F", "Sa"
      ];
      const daysWithEntriesInWindow = new Set<"M" | "Tu" | "W" | "Th" | "F" | "Sa" | "Su">();

      const startOfToday = new Date(now);
      startOfToday.setHours(0,0,0,0);

      const allEntryYYYYMMDD = new Set(
        journalEntries.map(entry => {
          const entryDate = new Date(entry.created_at?.toString() || "");
          return entryDate.toISOString().split("T")[0];
        })
      );

      for (let i = 0; i < 7; i++) {
        const dateToCheck = new Date(startOfToday);
        dateToCheck.setDate(startOfToday.getDate() - i); // Iterate from today backwards for 7 days
        
        const dateYYYYMMDD = dateToCheck.toISOString().split("T")[0];
        if (allEntryYYYYMMDD.has(dateYYYYMMDD)) {
          daysWithEntriesInWindow.add(dayMapping[dateToCheck.getDay()]);
        }
      }

      const orderReference: Array<"M" | "Tu" | "W" | "Th" | "F" | "Sa" | "Su"> = 
        ["M", "Tu", "W", "Th", "F", "Sa", "Su"];
      
      const finalActiveDays = orderReference.filter(day => daysWithEntriesInWindow.has(day));
      setActiveDaysOfWeek(finalActiveDays);

      // Modal opening logic
      if (!lastVisit || lastVisit !== todayStr || debugStreakKey > 0) {
        if (!lastVisit || lastVisit !== todayStr) { 
            localStorage.setItem("beanJourney_lastVisit", todayStr);
        }
        setIsStreakModalOpen(true);
      }
    };

    if (userId && supabase && userProfile) {
      checkFirstVisitOfDay();
    }
  }, [userId, supabase, userProfile, journalEntries, debugStreakKey]);

  if (!userProfile) return null;

  return (
    <StreakModal
      isOpen={isStreakModalOpen}
      onClose={handleCloseStreakModal}
      currentStreak={userProfile.current_journal_streak || 0}
      activeDaysOfWeek={activeDaysOfWeek}
      lastEntryDateDisplay={userProfile.last_entry_date ? new Date(userProfile.last_entry_date).toLocaleDateString() : undefined}
    />
  );
};

export default StreakManagement; 