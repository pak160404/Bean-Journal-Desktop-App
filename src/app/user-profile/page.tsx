import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Edit3, Image as ImageIcon, Trash2, Share2, BarChart2 } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import ActivityCalendar from '@/components/ui/ActivityCalendar';

const defaultCoverBg = 'rgba(209, 213, 219, 0.5)'; // Default light gray, similar to bg-gray-300/50

const staticProfileData = {
  coverPhotoUrl: null, // Set to null initially to test average color, or provide a URL
  streak: 30,
  latestDiary: {
    date: '02 Wed',
    content: 'Today i\'ve spent 2 hours running outside, also play basketball with my friends. What should i do tomorow?',
    imageUrl: '/images/placeholder-diary.jpg',
    moodImageUrl: '/images/placeholder-mood.png',
  },
};

const UserProfilePage = () => {
  const { user } = useClerk();
  const [averageColor, setAverageColor] = useState<string>(defaultCoverBg);

  let userName = 'User';
  let avatarSrc = '/avatars/shadcn.jpg'; 

  if (user) {
    userName = user.firstName || user.username || 'User';
    if (user.imageUrl) {
      const params = new URLSearchParams();
      params.set('height', '200');
      params.set('width', '200');
      params.set('quality', '100');
      params.set('fit', 'crop');
      avatarSrc = `${user.imageUrl}?${params.toString()}`;
    }
  }

  useEffect(() => {
    let objectUrl: string | null = null;
    console.log("[Effect] Running. AvatarSrc:", avatarSrc, "CoverPhotoUrl:", staticProfileData.coverPhotoUrl);

    const calculateAverageColor = async () => {
      if (!staticProfileData.coverPhotoUrl && avatarSrc && avatarSrc !== '/avatars/shadcn.jpg') {
        console.log("[Effect] Attempting to calculate average color for:", avatarSrc);
        try {
          const response = await fetch(avatarSrc);
          if (!response.ok) {
            console.error("[Effect] Failed to fetch image. Status:", response.status, response.statusText);
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
          }
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          console.log("[Effect] Blob Object URL created:", objectUrl);

          const img = new Image();
          img.src = objectUrl;

          img.onload = () => {
            console.log("[Effect] Image loaded from Object URL. Dimensions (w,h):", img.width, img.height);
            if (!img.width || !img.height) {
                console.error("[Effect] Image loaded with zero dimensions. Cannot process.");
                setAverageColor(defaultCoverBg);
                if (objectUrl) URL.revokeObjectURL(objectUrl);
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              console.error("[Effect] Failed to get canvas context.");
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
              // Define a central area for sampling
              const sampleX = Math.floor(canvas.width / 4);
              const sampleY = Math.floor(canvas.height / 4);
              const sampleWidth = Math.floor(canvas.width / 2);
              const sampleHeight = Math.floor(canvas.height / 2);

              console.log(`[Effect] Sampling area: x=${sampleX}, y=${sampleY}, w=${sampleWidth}, h=${sampleHeight}`);

              const imageData = ctx.getImageData(sampleX, sampleY, sampleWidth, sampleHeight);
              const data = imageData.data; // Ensure data is defined here
              const blockSize = 10;
              const lightnessThreshold = 100; // Pixels darker than this will be ignored

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
              console.log("[Effect] Pixel count after lightness filter:", pixelCount);
              if (pixelCount > 0) {
                r = Math.floor(r / pixelCount);
                g = Math.floor(g / pixelCount);
                b = Math.floor(b / pixelCount);
                console.log("[Effect] Calculated AVG RGB (lightness filtered):", r, g, b);
                setAverageColor(`rgb(${r},${g},${b})`);
              } else {
                 console.warn("[Effect] No pixels met lightness criteria. Falling back to default BG.");
                 setAverageColor(defaultCoverBg);
              }
            } catch (error) {
              console.error("[Effect] Error processing image data for average color:", error);
              setAverageColor(defaultCoverBg);
            }
            if (objectUrl) URL.revokeObjectURL(objectUrl);
          };

          img.onerror = (err) => {
            console.error("[Effect] Error loading image from Object URL:", err);
            setAverageColor(defaultCoverBg);
            if (objectUrl) URL.revokeObjectURL(objectUrl);
          };

        } catch (error) {
          console.error("[Effect] Error fetching or creating blob for image:", error);
          setAverageColor(defaultCoverBg);
          if (objectUrl) URL.revokeObjectURL(objectUrl); 
        }
      } else if (staticProfileData.coverPhotoUrl) {
        console.log("[Effect] Cover photo URL exists. No average color calculation needed.");
      } else {
        console.log("[Effect] No valid avatar for average color, or placeholder is used. Setting default BG.");
        setAverageColor(defaultCoverBg);
      }
    };

    calculateAverageColor();

    return () => {
      if (objectUrl) {
        console.log("[Effect Cleanup] Revoking Object URL:", objectUrl);
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [avatarSrc]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black text-[#2F2569] dark:text-gray-200">
      <div className="overflow-hidden">
        {/* Cover Photo Section */}
        <div 
          className={`relative h-48 md:h-64 ${!staticProfileData.coverPhotoUrl ? '' : 'bg-gray-300/50 dark:bg-gray-700/50'}`}
          style={!staticProfileData.coverPhotoUrl ? { backgroundColor: averageColor } : {}}
        >
          {staticProfileData.coverPhotoUrl && (
            <img
              src={staticProfileData.coverPhotoUrl}
              alt="Cover photo"
              className="w-full h-full object-cover"
            />
          )}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-xs dark:bg-gray-800/80 dark:hover:bg-gray-700"
          >
            <ImageIcon size={14} className="mr-1.5" />
            Edit Cover
          </Button>
        </div>

        {/* New wrapper for padded content below cover photo */}
        <div className="px-4 md:px-8">
          {/* Profile Header */}
          <div className="pb-6 -mt-16 md:-mt-20 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white dark:border-gray-800">
                <AvatarImage src={avatarSrc} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 absolute left-1/2 md:left-24 -translate-x-1/2 md:translate-x-0 top-20 md:top-28"
              >
                <ImageIcon size={14} />
              </Button>
              
              <div className="mt-[5.5rem] md:ml-6 text-center md:text-left w-full">
                <h1 className="text-2xl md:text-3xl font-bold ">{userName}</h1>
                {staticProfileData.streak > 0 && (
                  <p className="text-sm text-pink-500 font-semibold mt-1">
                    {staticProfileData.streak} day streak!
                  </p>
                )}
              </div>
              <div className="mt-2 md:mt-0 md:ml-auto flex space-x-2">
                <Button variant="outline" className="text-xs dark:text-gray-300 dark:border-gray-600">New Page</Button>
                <Button className="text-xs bg-[#b1dc98] text-[#2F2569]">Edit Profile</Button>
              </div>
            </div>
          </div>

          {/* Main Content Area - Using staticProfileData for diary, etc. */}
          <div className="py-4 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column / Main Content */}
              <div className="md:col-span-2 space-y-8">
                {/* Mood Stat Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">Mood Stat This Week</h2>
                  <div className="p-4 bg-white/20 dark:bg-slate-800/30 backdrop-blur-sm rounded-lg">
                    <BarChart2 size={64} className="mx-auto text-gray-400 dark:text-gray-500" />
                    <p className='text-center text-sm text-gray-500 mt-2'>Mood chart will appear here.</p>
                  </div>
                </div>

                {/* Latest Diary Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">Latest Diary</h2>
                  <div className="bg-[#b1dc98]/20 dark:bg-purple-900/40 backdrop-blur-sm p-4 rounded-lg relative">
                    <div className="flex items-start space-x-3">
                      {staticProfileData.latestDiary.moodImageUrl && (
                         <img src={staticProfileData.latestDiary.moodImageUrl} alt="Mood" className="w-12 h-12 rounded-full"/>
                      )}
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{staticProfileData.latestDiary.date}</p>
                        <p className="text-sm leading-relaxed">
                          {staticProfileData.latestDiary.content}
                        </p>
                      </div>
                    </div>
                    {staticProfileData.latestDiary.imageUrl && (
                      <img 
                        src={staticProfileData.latestDiary.imageUrl} 
                        alt="Diary entry" 
                        className="mt-3 rounded-lg w-full max-h-64 object-cover" 
                      />
                    )}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Share2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Edit3 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="md:col-span-1 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Activity</h3>
                  <div className="mb-6">
                    <ActivityCalendar 
                      colors={{
                        light: '#E4EFE7',
                        dark: '#99BC85',
                        noActivity: 'rgba(209, 213, 219, 0.3)' // Example, can be themed
                      }}
                      // activityData={[]} // Later, pass real data here
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Profile</h3>
                  <div className="p-4 bg-white/20 dark:bg-slate-800/30 backdrop-blur-sm rounded-lg text-sm text-gray-600 dark:text-gray-400">
                    More profile information or settings can go here.
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