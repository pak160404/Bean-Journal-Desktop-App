import { useState, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  Edit3,
  Image as ImageIcon,
  Trash2,
  Share2,
  BarChart2,
  Settings,
  PlusCircle,
  CalendarDays,
  Smile,
  Tags as TagsIcon,
  Pin,
  Check,
} from "lucide-react";
import { useClerk, useSession } from "@clerk/clerk-react";
import ActivityCalendar from "@/components/ui/ActivityCalendar";
import { getProfileByUserId } from "@/services/profileService";
import { getJournalEntriesByUserId } from "@/services/journalEntryService";
import { getTagsForEntry } from "@/services/tagService";
import type { Profile, JournalEntry, Tag } from "@/types/supabase";
import { createClerkSupabaseClient } from "@/utils/supabaseClient";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Link } from "@tanstack/react-router";

const defaultCoverBg = "rgba(209, 213, 219, 0.5)";

// Helper function to parse BlockNote JSON content
// This is a simplified parser. A more robust one would handle various block types and styles.
const parseBlockNoteJsonContent = (
  jsonContent: string | undefined | null
): string => {
  if (!jsonContent) return "";
  try {
    const blocks = JSON.parse(jsonContent);
    let readableContent = "";
    if (Array.isArray(blocks)) {
      for (const block of blocks) {
        if (block.type === "paragraph" && Array.isArray(block.content)) {
          for (const item of block.content) {
            if (item.type === "text" && typeof item.text === "string") {
              readableContent += item.text + " "; // Add space between text items
            }
          }
          readableContent += "\n"; // Add newline after each paragraph
        }
        // Add more conditions here to handle other block types (headings, lists, etc.)
      }
    }
    return readableContent.trim();
  } catch (error) {
    console.error("Error parsing BlockNote JSON content:", error);
    // Fallback to returning the original string if it's not valid JSON or parsing fails
    // This is a basic fallback. Consider if the original string should be displayed if it's not JSON.
    return typeof jsonContent === "string" ? jsonContent : "";
  }
};

// Helper for Streak Card day abbreviations
const getDayAbbreviationForStreak = (date: Date): string => {
  const days = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
  return days[date.getDay()];
};

const UserProfilePage = () => {
  const { user } = useClerk();
  const { session } = useSession();
  const [averageColor, setAverageColor] = useState<string>(defaultCoverBg);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [latestDiary, setLatestDiary] = useState<JournalEntry | null>(null);
  const [userJournalEntries, setUserJournalEntries] = useState<JournalEntry[]>(
    []
  );
  const [readableDiaryContent, setReadableDiaryContent] = useState<string>("");
  const [latestDiaryTags, setLatestDiaryTags] = useState<Tag[]>([]);

  const activeSupabaseClient: SupabaseClient | null = useMemo(() => {
    if (session) {
      return createClerkSupabaseClient(() => session.getToken());
    }
    return null;
  }, [session]);

  useEffect(() => {
    if (user?.id && activeSupabaseClient) {
      getProfileByUserId(activeSupabaseClient, user.id)
        .then((data: Profile | null) => {
          setProfileData(data);
        })
        .catch((error: Error) =>
          console.error("Error fetching profile:", error)
        );

      getJournalEntriesByUserId(activeSupabaseClient, user.id)
        .then(async (data: JournalEntry[] | null) => {
          if (data && data.length > 0) {
            setUserJournalEntries(data);
            const sortedEntries = [...data].sort(
              (a, b) =>
                new Date(b.entry_timestamp).getTime() -
                new Date(a.entry_timestamp).getTime()
            );
            const diaryEntry = sortedEntries[0];
            setLatestDiary(diaryEntry);
            setReadableDiaryContent(
              parseBlockNoteJsonContent(diaryEntry.content)
            );

            if (diaryEntry.id && activeSupabaseClient) {
              try {
                const tags = await getTagsForEntry(
                  activeSupabaseClient,
                  diaryEntry.id
                );
                setLatestDiaryTags(tags);
              } catch (error) {
                console.error("Error fetching tags for diary:", error);
                setLatestDiaryTags([]);
              }
            }
          } else {
            setUserJournalEntries([]);
            setLatestDiary(null);
            setReadableDiaryContent("");
            setLatestDiaryTags([]);
          }
        })
        .catch((error: Error) => {
          console.error("Error fetching journal entries:", error);
          setUserJournalEntries([]);
        });
    }
  }, [user?.id, activeSupabaseClient]);

  useEffect(() => {
    let objectUrl: string | null = null;
    const calculateAverageColor = async () => {
      const currentAvatarSrc = user?.imageUrl;
      if (currentAvatarSrc && currentAvatarSrc !== "/avatars/shadcn.jpg") {
        try {
          const response = await fetch(currentAvatarSrc);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch image: ${response.status} ${response.statusText}`
            );
          }
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);

          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = objectUrl;

          img.onload = () => {
            if (!img.width || !img.height) {
              setAverageColor(defaultCoverBg);
              if (objectUrl) URL.revokeObjectURL(objectUrl);
              return;
            }
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              setAverageColor(defaultCoverBg);
              if (objectUrl) URL.revokeObjectURL(objectUrl);
              return;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let r = 0,
              g = 0,
              b = 0;
            let pixelCount = 0;
            try {
              const sampleX = Math.floor(canvas.width / 4);
              const sampleY = Math.floor(canvas.height / 4);
              const sampleWidth = Math.floor(canvas.width / 2);
              const sampleHeight = Math.floor(canvas.height / 2);
              const imageData = ctx.getImageData(
                sampleX,
                sampleY,
                sampleWidth,
                sampleHeight
              );
              const data = imageData.data;
              const blockSize = 10;
              const lightnessThreshold = 100;
              for (let i = 0; i < data.length; i += 4 * blockSize) {
                const currentR = data[i];
                const currentG = data[i + 1];
                const currentB = data[i + 2];
                const luminance =
                  0.2126 * currentR + 0.7152 * currentG + 0.0722 * currentB;
                if (luminance > lightnessThreshold) {
                  r += currentR;
                  g += currentG;
                  b += currentB;
                  pixelCount++;
                }
              }
              if (pixelCount > 0) {
                r = Math.floor(r / pixelCount);
                g = Math.floor(g / pixelCount);
                b = Math.floor(b / pixelCount);
                setAverageColor(`rgb(${r},${g},${b})`);
              } else {
                setAverageColor(defaultCoverBg);
              }
            } catch (error) {
              setAverageColor(defaultCoverBg);
            }
            if (objectUrl) URL.revokeObjectURL(objectUrl);
          };
          img.onerror = () => {
            setAverageColor(defaultCoverBg);
            if (objectUrl) URL.revokeObjectURL(objectUrl);
          };
        } catch (error) {
          setAverageColor(defaultCoverBg);
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        }
      } else {
        setAverageColor(defaultCoverBg);
      }
    };
    calculateAverageColor();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user?.imageUrl]);

  // Helper data for Streak Card
  const weekDaysForStreakCard = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i)); // 6 days ago to today
    return date;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please log in to view your profile.
      </div>
    );
  }

  if (!activeSupabaseClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        Initializing...
      </div>
    );
  }

  if (!profileData && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        Loading profile...
      </div>
    );
  }

  const userNameToDisplay = user.username || profileData?.username || "User";
  let finalAvatarSrc = user.imageUrl || "/avatars/shadcn.jpg";
  if (
    finalAvatarSrc &&
    finalAvatarSrc !== "/avatars/shadcn.jpg" &&
    !finalAvatarSrc.includes("?")
  ) {
    const params = new URLSearchParams();
    params.set("height", "400");
    params.set("width", "400");
    params.set("quality", "90");
    params.set("fit", "crop");
    finalAvatarSrc = `${finalAvatarSrc}?${params.toString()}`;
  }
  const coverPhotoUrl = null;
  const currentStreak = profileData?.current_journal_streak || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black text-[#2F2569] dark:text-gray-200">
      <div className="overflow-hidden">
        <div
          className={`relative h-48 md:h-64 ${!coverPhotoUrl ? "" : "bg-cover bg-center"}`}
          style={
            coverPhotoUrl
              ? { backgroundImage: `url(${coverPhotoUrl})` }
              : { backgroundColor: averageColor }
          }
        >
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-xs dark:bg-gray-800/80 dark:hover:bg-gray-700"
          >
            <ImageIcon size={14} className="mr-1.5" />
            Edit Cover
          </Button>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="pb-6 -mt-16 md:-mt-20 relative">
            <div className="flex flex-col items-center md:flex-row md:items-end md:space-x-5">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white dark:border-gray-800">
                  <AvatarImage src={finalAvatarSrc} alt={userNameToDisplay} />
                  <AvatarFallback>{userNameToDisplay.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 absolute -bottom-2 -right-2"
                >
                  <ImageIcon size={14} />
                </Button>
              </div>

              <div className="mt-3 md:mt-0 text-center md:text-left flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {userNameToDisplay}
                </h1>
                {profileData?.current_journal_streak &&
                  profileData.current_journal_streak > 0 && (
                    <p className="text-sm text-pink-500 font-semibold mt-1">
                      {profileData.current_journal_streak} day streak!
                    </p>
                  )}
              </div>

              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button
                  variant="outline"
                  className="text-xs dark:text-gray-300 dark:border-gray-600"
                >
                  <ImageIcon size={14} className="mr-1.5" /> Photo
                </Button>
                <Button
                  variant="outline"
                  className="text-xs dark:text-gray-300 dark:border-gray-600"
                >
                  <PlusCircle size={14} className="mr-1.5" /> New Page
                </Button>
                <Button className="text-xs bg-[#b1dc98] text-[#2F2569] hover:bg-[#a1cb88]">
                  <Edit3 size={14} className="mr-1.5" /> Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Settings size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="py-4 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Profile</h3>
                    <div className="relative overflow-hidden bg-white/30 dark:bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg">
                      <img
                        src={finalAvatarSrc}
                        alt={userNameToDisplay}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
                        <span className="font-semibold text-base text-white block truncate">
                          {userNameToDisplay}
                        </span>
                        <p className="text-xs text-gray-200 block truncate">
                          {profileData?.email || "No bio available."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Streak</h3>
                    <div className="relative p-4 bg-[#F0F7F0] dark:bg-gray-700/30 backdrop-blur-md rounded-lg shadow-lg text-sm">
                      <Pin
                        size={24}
                        className="absolute top-1 right-1 text-red-500 -rotate-45 opacity-70"
                      />
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-[#A8D5B0] rounded-full flex items-center justify-center relative dark:bg-[#6A9C78]">
                          <div className="w-10 h-10 bg-[#70A970] rounded-tl-[50px] rounded-tr-[50px] rounded-bl-[30px] rounded-br-[30px] dark:bg-[#507D50]"></div>
                          <div className="absolute w-4 h-2 border-b-2 border-t-2 border-l-2 border-r-2 rounded-b-full border-black/70 dark:border-white/70 bottom-[22px] left-1/2 transform -translate-x-1/2"></div>
                          <span
                            className="absolute text-2xl font-bold text-white"
                            style={{
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            {currentStreak}
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-[#6A9C78] dark:text-[#A8D5B0]">
                          day streak!
                        </span>
                      </div>
                      <div className="mt-4 flex justify-around items-end">
                        {weekDaysForStreakCard.map((date, index) => {
                          const dayIsStreaked = index >= 7 - currentStreak;
                          return (
                            <div
                              key={index}
                              className="flex flex-col items-center space-y-1"
                            >
                              <div
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                                ${
                                  dayIsStreaked
                                    ? "bg-[#A8D5B0] border-[#A8D5B0] dark:bg-[#6A9C78] dark:border-[#6A9C78]"
                                    : "border-[#A8D5B0] bg-white/30 dark:border-[#6A9C78] dark:bg-transparent"
                                }`}
                              >
                                {dayIsStreaked && (
                                  <Check size={18} className="text-white" />
                                )}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {getDayAbbreviationForStreak(date)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    Mood Stat This Week
                  </h2>
                  <div className="p-4 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg">
                    <BarChart2
                      size={64}
                      className="mx-auto text-gray-400 dark:text-gray-500"
                    />
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Mood chart will appear here.
                    </p>
                  </div>
                </div>

                {latestDiary && latestDiary.id ? (
                  <Link
                    to="/journal/diary"
                    className="block cursor-pointer group"
                  >
                    <h2 className="text-xl font-semibold mb-3 text-[#2F2569] dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Latest Diary
                    </h2>
                    <div className="bg-[#99BC85] dark:bg-[#7E9C6F] p-4 sm:p-6 rounded-lg shadow-xl relative text-gray-800 dark:text-gray-100 group-hover:shadow-2xl transition-shadow">
                      <div className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
                            <ImageIcon size={32} className="text-gray-500" />
                          </div>
                        </div>

                        <div className="col-span-9 md:col-span-7">
                          {latestDiary.title && (
                            <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900 dark:text-white">
                              {latestDiary.title}
                            </h3>
                          )}
                          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line line-clamp-3 group-hover:line-clamp-none">
                            {readableDiaryContent || "Content not available."}
                          </p>
                          {latestDiaryTags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2 items-center">
                              <TagsIcon
                                size={16}
                                className="text-gray-700 dark:text-gray-300"
                              />
                              {latestDiaryTags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className="text-xs bg-white/50 dark:bg-black/20 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="col-span-12 md:col-span-3 flex flex-col items-center md:items-end mt-2 md:mt-0">
                          {latestDiary.manual_mood_label && (
                            <div className="flex flex-col items-center mb-2">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/30 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-1">
                                <Smile
                                  size={24}
                                  className="text-gray-600 dark:text-gray-300"
                                />
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                {latestDiary.manual_mood_label}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center text-xs sm:text-sm mt-6 text-gray-700 dark:text-gray-300">
                            <CalendarDays size={14} className="mr-1.5" />
                            <span>
                              {latestDiary.entry_timestamp
                                ? new Date(
                                    latestDiary.entry_timestamp
                                  ).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    weekday: "short",
                                    month: "short",
                                  })
                                : "Date unavailable"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-black/20 rounded-full"
                        >
                          <Share2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-black/20 rounded-full"
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-full"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Latest Diary</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No diary entries yet or still loading...
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Activity</h3>
                  <div className="p-4 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg">
                    <ActivityCalendar
                      journalEntries={userJournalEntries}
                      colors={{
                        light: "#ebedf0",
                        dark: "#161b22",
                        noActivity: "rgba(209, 213, 219, 0.3)",
                      }}
                    />
                    <p className="text-center text-xs text-gray-500 mt-2">
                      {userJournalEntries.length > 0
                        ? "Journal activity based on your entries."
                        : "No activity data yet. Write some entries!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
