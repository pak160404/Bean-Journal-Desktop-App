import { useState, useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Edit3, Image as ImageIcon, Trash2, Share2, BarChart2, Settings, PlusCircle } from 'lucide-react';
import { useClerk, useSession } from '@clerk/clerk-react';
import ActivityCalendar from '@/components/ui/ActivityCalendar';
import { getProfileByUserId } from '@/services/profileService';
import { getJournalEntriesByUserId } from '@/services/journalEntryService';
import type { Profile, JournalEntry } from '@/types/supabase';
import { createClerkSupabaseClient } from '@/utils/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';

const defaultCoverBg = 'rgba(209, 213, 219, 0.5)';

const UserProfilePage = () => {
  const { user } = useClerk();
  const { session } = useSession();
  const [averageColor, setAverageColor] = useState<string>(defaultCoverBg);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [latestDiary, setLatestDiary] = useState<JournalEntry | null>(null);

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
        .catch((error: Error) => console.error("Error fetching profile:", error));

      getJournalEntriesByUserId(activeSupabaseClient, user.id)
        .then((data: JournalEntry[] | null) => {
          if (data && data.length > 0) {
            setLatestDiary(data[0]);
          }
        })
        .catch((error: Error) => console.error("Error fetching journal entries:", error));
    }
  }, [user?.id, activeSupabaseClient]);
  
  useEffect(() => {
    let objectUrl: string | null = null;
    const calculateAverageColor = async () => {
      const currentAvatarSrc = user?.imageUrl;
      if (currentAvatarSrc && currentAvatarSrc !== '/avatars/shadcn.jpg') { 
        try {
          const response = await fetch(currentAvatarSrc);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
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
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              setAverageColor(defaultCoverBg);
              if (objectUrl) URL.revokeObjectURL(objectUrl);
              return;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let r = 0, g = 0, b = 0;
            let pixelCount = 0;
            try {
              const sampleX = Math.floor(canvas.width / 4);
              const sampleY = Math.floor(canvas.height / 4);
              const sampleWidth = Math.floor(canvas.width / 2);
              const sampleHeight = Math.floor(canvas.height / 2);
              const imageData = ctx.getImageData(sampleX, sampleY, sampleWidth, sampleHeight);
              const data = imageData.data;
              const blockSize = 10; 
              const lightnessThreshold = 100; 
              for (let i = 0; i < data.length; i += 4 * blockSize) {
                const currentR = data[i];
                const currentG = data[i+1];
                const currentB = data[i+2];
                const luminance = 0.2126 * currentR + 0.7152 * currentG + 0.0722 * currentB;
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

  if (!user) { 
     return <div className="min-h-screen flex items-center justify-center">Please log in to view your profile.</div>;
  }

  if (!activeSupabaseClient) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">Initializing...</div>;
  }
  
  if (!profileData && user) { 
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">Loading profile...</div>;
  }
  
  const userNameToDisplay = user.firstName || profileData?.username || user.username || 'User';
  let finalAvatarSrc = user.imageUrl || '/avatars/shadcn.jpg';
  if (finalAvatarSrc && finalAvatarSrc !== '/avatars/shadcn.jpg' && !finalAvatarSrc.includes('?')) { 
      const params = new URLSearchParams();
      params.set('height', '200');
      params.set('width', '200');
      params.set('quality', '100');
      params.set('fit', 'crop');
      finalAvatarSrc = `${finalAvatarSrc}?${params.toString()}`;
  }
  const coverPhotoUrl = null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black text-[#2F2569] dark:text-gray-200">
      <div className="overflow-hidden">
        <div 
          className={`relative h-48 md:h-64 ${!coverPhotoUrl ? '' : 'bg-cover bg-center'}`}
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
                <h1 className="text-2xl md:text-3xl font-bold">{userNameToDisplay}</h1>
                {profileData?.current_journal_streak && profileData.current_journal_streak > 0 && (
                  <p className="text-sm text-pink-500 font-semibold mt-1">
                    {profileData.current_journal_streak} day streak!
                  </p>
                )}
              </div>

              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button variant="outline" className="text-xs dark:text-gray-300 dark:border-gray-600">
                  <PlusCircle size={14} className="mr-1.5" /> New Page
                </Button>
                <Button className="text-xs bg-[#b1dc98] text-[#2F2569] hover:bg-[#a1cb88]">
                  <Edit3 size={14} className="mr-1.5" /> Edit Profile
                </Button>
                 <Button variant="ghost" size="icon" className="dark:text-gray-300 dark:hover:bg-gray-700">
                  <Settings size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="py-4 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Mood Stat This Week</h2>
                  <div className="p-4 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg">
                    <BarChart2 size={64} className="mx-auto text-gray-400 dark:text-gray-500" />
                    <p className='text-center text-sm text-gray-500 mt-2'>Mood chart will appear here.</p>
                  </div>
                </div>

                {latestDiary ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Latest Diary</h2>
                    <div className="bg-[#b1dc98]/30 dark:bg-purple-900/50 backdrop-blur-md p-4 rounded-lg shadow-lg relative">
                      <div className="flex items-start space-x-3">
                        {latestDiary.manual_mood_label && (
                           <img src={`/images/moods/${latestDiary.manual_mood_label.toLowerCase().replace(' ', '-')}.png`} alt={latestDiary.manual_mood_label} className="w-12 h-12 rounded-full"/>
                        )}
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {latestDiary.entry_timestamp ? new Date(latestDiary.entry_timestamp).toLocaleDateString('en-US', { day: '2-digit', weekday: 'short' }) : 'Date not available'} 
                            {latestDiary.title && `- ${latestDiary.title}`}
                            </p>
                          <p className="text-sm leading-relaxed">
                            {latestDiary.content}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex space-x-1">
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
                          <Share2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
                          <Edit3 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-red-500 hover:bg-red-100/50 dark:hover:bg-red-900/40">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                     <h2 className="text-xl font-semibold mb-3">Latest Diary</h2>
                     <p className="text-sm text-gray-500">No diary entries yet.</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Activity</h3>
                  <div className="p-4 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg">
                    <ActivityCalendar 
                      colors={{
                        light: '#ebedf0',
                        dark: '#161b22',
                        noActivity: 'rgba(209, 213, 219, 0.3)'
                      }}
                    />
                     <p className='text-center text-xs text-gray-500 mt-2'>Activity data will be shown here.</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Profile</h3>
                  <div className="p-4 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-400">
                    <p>{profileData?.username || "No bio/username available."}</p> 
                  </div>
                </div>
                 <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="p-4 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-400">
                    <p>Trending tags or user's frequent tags will appear here.</p>
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