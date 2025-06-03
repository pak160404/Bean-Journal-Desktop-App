import React, { useState, useEffect, useRef } from 'react';

// --- IMPORTANT ---
// For this component to work correctly, the image frames (e.g., frame_000216.png to frame_000315.png)
// should be placed in your project's `public` directory, specifically under `public/images/hero_video/`.
// The paths below assume this location.
//
// Performance Warning: Loading 100 individual PNG frames (approx. 370KB each) can total ~37MB,
// which will significantly impact page load time and performance.
// Consider using a compressed video file or a sprite sheet for better optimization.

const frameCount = 90; // Corresponds to frames from _000216.png to _000315.png
const baseFrameNumber = 30;

const finalFramePaths = Array.from({ length: frameCount }, (_, i) => {
  const frameNumber = baseFrameNumber + i;
  return `/images/hero_video/frame_${String(frameNumber).padStart(6, '0')}.png`;
});

interface ParallaxVideoProps {
  className?: string;
  alt?: string;
}

const ParallaxVideo: React.FC<ParallaxVideoProps> = ({
  className,
  alt = "Parallax video background",
}) => {
  const [currentFrameSrc, setCurrentFrameSrc] = useState(finalFramePaths.length > 0 ? finalFramePaths[0] : '');
  const [preloadComplete, setPreloadComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]); // For preloading

  // Preload images
  useEffect(() => {
    if (finalFramePaths.length === 0) {
      setPreloadComplete(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = finalFramePaths.length;

    finalFramePaths.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      imageRefs.current[index] = img;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setPreloadComplete(true);
        }
      };
      img.onerror = () => {
        loadedCount++; // Still count it to avoid blocking indefinitely
        console.error(`Failed to load image: ${src}`);
        if (loadedCount === totalImages) {
          setPreloadComplete(true); // Mark as complete even if some fail, to not break UI
        }
      };
    });
  }, []); // Run once on mount

  // Handle scroll-based frame changes
  useEffect(() => {
    if (!preloadComplete || finalFramePaths.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Define the scroll range over which the animation occurs.
      // e.g., animation completes after scrolling 800px from the top of the page.
      // This value might need tuning based on your page layout and desired effect.
      const animationScrollRange = 800; // pixels

      let progress = Math.min(scrollY / animationScrollRange, 1);
      if (scrollY === 0) progress = 0; // Ensure first frame is shown when at the very top

      const frameIndex = Math.min(
        finalFramePaths.length - 1,
        Math.max(0, Math.floor(progress * finalFramePaths.length))
      );
      
      const newSrc = finalFramePaths[frameIndex];
      if (newSrc !== currentFrameSrc) {
        setCurrentFrameSrc(newSrc);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial frame based on current scroll position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [preloadComplete, currentFrameSrc]);

  if (finalFramePaths.length === 0) {
    return <div className={className}>Error: No frames to display.</div>;
  }
  
  // Display the first frame while preloading or if preloading hasn't completed
  const displaySrc = preloadComplete ? currentFrameSrc : finalFramePaths[0];

  return (
    <div ref={containerRef} className={className}>
      <img
        src={displaySrc}
        alt={alt}
        className="w-full h-full object-cover" // Image will fill the container, respecting aspect ratio set by className
      />
    </div>
  );
};

export default ParallaxVideo; 