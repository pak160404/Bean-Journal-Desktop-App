import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from "@/utils/css";
import type { JournalEntry } from '@/types/supabase'; // Added JournalEntry type import

interface ActivityCalendarProps {
  journalEntries?: JournalEntry[]; // Changed activityData to journalEntries
  colors?: {
    light: string;
    dark: string;
    noActivity?: string;
  };
  // We'll add props for month navigation later
  // currentMonthStartDate?: Date;
}

const DESIRED_WEEK_COLUMN_WIDTH = 18; // Target footprint: 16px cell (w-4) + 2px gap (gap-0.5)
const MIN_WEEKS = 4; // Minimum number of weeks to display
const DEFAULT_WEEKS = 12; // Default number of weeks if width calculation isn't possible initially

const defaultColors = {
  light: '#E4EFE7',
  dark: '#99BC85',
  noActivity: 'rgba(209, 213, 219, 0.3)',
};

const getPastNDays = (n: number, endDate: Date = new Date()): Date[] => {
  const normalizedEndDate = new Date(endDate);
  normalizedEndDate.setHours(0, 0, 0, 0);
  return Array.from({ length: n }, (_, i) => {
    const date = new Date(normalizedEndDate);
    date.setDate(normalizedEndDate.getDate() - (n - 1 - i));
    return date;
  });
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper to get month names
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  journalEntries, // Changed from activityData
  colors = defaultColors,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numberOfWeeks, setNumberOfWeeks] = useState(DEFAULT_WEEKS);
  const [currentEndDate, setCurrentEndDate] = useState(new Date());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const elem = containerRef.current;
    if (!elem) { // If no element, do nothing
      return;
    }

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        if (containerWidth > 0) {
          const calculatedWeeks = Math.max(MIN_WEEKS, Math.floor(containerWidth / DESIRED_WEEK_COLUMN_WIDTH));
          
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          
          debounceTimerRef.current = setTimeout(() => {
            if (calculatedWeeks !== numberOfWeeks) { 
              setNumberOfWeeks(calculatedWeeks);
            }
          }, 150); // 150ms debounce delay
        }
      }
    });

    // Start observing the element. The observer will fire when size is known.
    observer.observe(elem);

    return () => {
      // Use the captured 'elem' for unobserve to ensure it's the same element instance
      observer.unobserve(elem); 
      // Disconnect the observer as a new one will be created if the effect re-runs
      observer.disconnect(); 
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfWeeks, MIN_WEEKS, DESIRED_WEEK_COLUMN_WIDTH]); // Added MIN_WEEKS and DESIRED_WEEK_COLUMN_WIDTH to dependencies as they are used in effect

  const numDaysToDisplay = useMemo(() => numberOfWeeks * 7, [numberOfWeeks]);

  // Recalculate displayDays whenever currentEndDate or numDaysToDisplay changes
  const displayDays = useMemo(() => {
    // console.log(`Recalculating displayDays for ${numDaysToDisplay} days ending ${currentEndDate}`);
    return getPastNDays(numDaysToDisplay, currentEndDate);
  }, [numDaysToDisplay, currentEndDate]);
  
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!journalEntries || journalEntries.length === 0) {
      displayDays.forEach(day => {
        map.set(formatDate(day), 0); // Default to 0 activity if no entries
      });
      return map;
    }

    const entryCountsByDate = new Map<string, number>();
    journalEntries.forEach(entry => {
      if (entry.entry_timestamp) {
        const entryDateStr = formatDate(new Date(entry.entry_timestamp));
        entryCountsByDate.set(entryDateStr, (entryCountsByDate.get(entryDateStr) || 0) + 1);
      }
    });

    displayDays.forEach(day => {
      const dateStr = formatDate(day);
      const count = entryCountsByDate.get(dateStr) || 0;
      let level = 0;
      if (count === 1) {
        level = 1;
      } else if (count === 2) {
        level = 2;
      } else if (count === 3) {
        level = 3;
      } else if (count >= 4) {
        level = 4;
      }
      map.set(dateStr, level);
    });

    return map;
  }, [displayDays, journalEntries]);

  const getColorForLevel = (level: number | undefined): string => {
    const currentColors = { ...defaultColors, ...colors };
    if (level === undefined || level === 0) return currentColors.noActivity;
    if (level === 1) return currentColors.light;
    if (level === 2) return `color-mix(in srgb, ${currentColors.light} 66%, ${currentColors.dark} 33%)`;
    if (level === 3) return `color-mix(in srgb, ${currentColors.light} 33%, ${currentColors.dark} 66%)`;
    if (level >= 4) return currentColors.dark;
    return currentColors.noActivity;
  };

  const { finalCellsToRender, actualColumnsToRenderValue } = useMemo(() => {
    // console.log('Recalculating finalCellsToRender and related values');
    if (displayDays.length === 0) {
        return { finalCellsToRender: [], actualColumnsToRenderValue: numberOfWeeks };
    }
    const firstDay = displayDays[0];
    const dayOfWeekForFirst = firstDay.getDay(); // 0 (Sun) - 6 (Sat)
    const emptyCellsAtStartCount = dayOfWeekForFirst;
    
    const numItemsBeforeEndPadding = emptyCellsAtStartCount + numDaysToDisplay;
    // actualColumnsToRenderValue should be the same as numberOfWeeks if numDaysToDisplay is a multiple of 7
    const calculatedActualColumns = Math.ceil(numItemsBeforeEndPadding / 7); 
    const totalCellsInRectangle = calculatedActualColumns * 7;
    const paddingCellsAtEndCount = totalCellsInRectangle - numItemsBeforeEndPadding;

    const cells = [
      ...Array(emptyCellsAtStartCount).fill(null),
      ...displayDays,
      ...Array(paddingCellsAtEndCount > 0 ? paddingCellsAtEndCount : 0).fill(null),
    ];
    return { finalCellsToRender: cells, actualColumnsToRenderValue: calculatedActualColumns };
  }, [displayDays, numDaysToDisplay, numberOfWeeks]);


  const monthLabelData = useMemo(() => {
    // console.log('Recalculating monthLabelData');
    const labels: { name: string; startColumn: number; span: number }[] = [];
    // Use actualColumnsToRenderValue for the total span of month labels
    if (displayDays.length === 0 || actualColumnsToRenderValue === 0) return labels;

    let currentMonthIndexInYear = -1;
    const WEEKS_IN_DATA_PERIOD = actualColumnsToRenderValue; // Align with the grid columns

    for (let weekIndex = 0; weekIndex < WEEKS_IN_DATA_PERIOD; weekIndex++) {
      // const dayIndexOffset = weekIndex * 7; // No longer needed
      // We only have displayDays for numberOfWeeks, so check boundary carefully
      // We need to associate a month with each column in WEEKS_IN_DATA_PERIOD
      // For columns that might be beyond the actual displayDays (if actualColumnsToRenderValue > numberOfWeeks due to padding)
      // we should try to extend the last known month or handle it gracefully.
      
      // Let's find the first day of the week for the current *grid column index* (weekIndex)
      // This requires considering the initial padding (emptyCellsAtStartCount)
      // The actual first day of data is displayDays[0]
      // The number of empty cells before displayDays[0] is displayDays[0].getDay()
      const firstDayOfWeekForGridColumn = new Date(displayDays[0]);
      // Adjust to the Sunday before or on displayDays[0]
      firstDayOfWeekForGridColumn.setDate(displayDays[0].getDate() - displayDays[0].getDay()); 
      // Now advance by weekIndex weeks
      firstDayOfWeekForGridColumn.setDate(firstDayOfWeekForGridColumn.getDate() + weekIndex * 7);

      // Ensure the day we are inspecting is within a reasonable range of our data
      // This logic might need refinement if actualColumnsToRenderValue is much larger than numberOfWeeks
      const dayToConsiderForMonth = firstDayOfWeekForGridColumn;

      // if (dayIndexOffset < displayDays.length) { // This check might be too restrictive now
      // const dayInWeek = displayDays[dayIndexOffset]; // This might be out of bounds
      
      // Use dayToConsiderForMonth if it's valid, otherwise, we might be in a padding column
      // For now, let's assume dayToConsiderForMonth is good enough for determining month for the column
      if (dayToConsiderForMonth) {
        const monthIdx = dayToConsiderForMonth.getMonth();
        if (monthIdx !== currentMonthIndexInYear) {
          if (currentMonthIndexInYear !== -1 && labels.length > 0) {
            const prevMonthData = labels[labels.length - 1];
            prevMonthData.span = weekIndex - prevMonthData.startColumn;
          }
          labels.push({ name: monthNames[monthIdx], startColumn: weekIndex, span: 1 });
          currentMonthIndexInYear = monthIdx;
        }
      }
    }

    if (labels.length > 0) {
      const lastMonthData = labels[labels.length - 1];
      if (lastMonthData) {
        lastMonthData.span = WEEKS_IN_DATA_PERIOD - lastMonthData.startColumn;
        if (lastMonthData.span <= 0) lastMonthData.span = 1;
      }
    } else if (WEEKS_IN_DATA_PERIOD > 0 && displayDays.length > 0) {
        // If no labels were created (e.g. all columns fall into one month that didn't change)
        // but there are columns and data, create one label spanning all columns.
        labels.push({ name: monthNames[displayDays[0].getMonth()], startColumn: 0, span: WEEKS_IN_DATA_PERIOD });
    }
    return labels.filter(label => label.span > 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayDays, numberOfWeeks, actualColumnsToRenderValue]); // Added actualColumnsToRenderValue


  const handlePrev = () => {
    setCurrentEndDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - numDaysToDisplay);
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentEndDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + numDaysToDisplay);
      return newDate;
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full border rounded-[10px] sm:rounded-[15px] p-1.5 sm:p-3 flex flex-col space-y-1 sm:space-y-1.5 bg-card"
    >
      <div className="flex justify-between items-center">
        <button onClick={handlePrev} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          &lt; Prev
        </button>
        {/* Optional: Display current date range or month/year here */}
        <button onClick={handleNext} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Next &gt;
        </button>
      </div>
      {/* Month Labels Row */}
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${actualColumnsToRenderValue}, minmax(0, 1fr))`}}>
        {monthLabelData.map((month, index) => (
          <div 
            key={`${month.name}-${index}-${month.startColumn}`}
            className="text-xs text-gray-700 dark:text-gray-300 py-1 truncate" // Added truncate
            style={{ gridColumnStart: month.startColumn + 1, gridColumnEnd: `span ${month.span}`, textAlign: 'center' }} // Added text-align
          >
            {month.name}
          </div>
        ))}
        {/* Fill remaining grid if not all columns covered by month labels explicitly - for safety */}
        {actualColumnsToRenderValue > 0 && monthLabelData.reduce((acc, m) => acc + m.span, 0) < actualColumnsToRenderValue &&
            Array.from({length: actualColumnsToRenderValue - monthLabelData.reduce((acc, m) => acc + m.span, 0) }).map((_, i) => <div key={`filler-month-${i}`}></div>)}
      </div>

      {/* Day Cells Grid - Restructured for horizontal flow of weeks */}
      <div 
        className="grid gap-0.5"
        style={{
          gridTemplateRows: `repeat(7, minmax(0, auto))`, // 7 rows for days of the week
          gridAutoFlow: 'column',
          gridTemplateColumns: `repeat(${actualColumnsToRenderValue}, minmax(0, auto))` // Columns take cell width
        }}
      >
        {finalCellsToRender.map((dayOrNull, index) => {
          // Empty cells (prefix for first week alignment, or fallback)
          if (!dayOrNull) {
            return (
              <div 
                key={`empty-${index}`} 
                className="w-4 h-4 border rounded-[4px] sm:rounded-[3px] bg-card" // Fixed size, styled like inactive cells
              />
            );
          }

          const day = dayOrNull as Date;
          const dateStr = formatDate(day);
          const activityLevel = activityMap.get(dateStr);
          const titleText = `Date: ${dateStr}\nActivity: ${activityLevel !== undefined ? activityLevel : 'No data'}`;
          const isInactive = activityLevel === undefined || activityLevel === 0;
          const cellBgColor = isInactive ? undefined : getColorForLevel(activityLevel);

          return (
            <div
              key={dateStr}
              title={titleText}
              className={cn(
                "w-4 h-4 border rounded-[4px] sm:rounded-[3px]", // Fixed size cells
                isInactive ? "bg-card" : "" // Apply bg-card if inactive
              )}
              style={{ backgroundColor: cellBgColor }} // Apply dynamic color if active
            >
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityCalendar; 