"use client";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/utils/css";

import feature1 from "@/images/feature1.png";

//TODO : Improve mobile version to display the image down the corresponding text instead of at the full bottom

const data = [
  {
    title: "Your Personal Digital Diary, Reimagined",
    content:
      "Experience journaling like never before with Bean Journal. Organize your thoughts, memories, and ideas with a flexible, Notion-like editor. Create, customize, and connect entries seamlessly.",
    srcImage: feature1,
  },
  {
    title: "Transform Your Memories into Moving Stories",
    content:
      "Bring your diary entries to life! Bean Journal's innovative AI can transform your written reflections into beautiful, shareable video summaries. Relive and share your journey in a whole new way.",
    srcImage:
      "https://images.unsplash.com/photo-1717501219074-943fc738e5a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8M3x8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Your Thoughts, Safe and Sound",
    content:
      "Bean Journal prioritizes your privacy. With robust security features, your personal entries are kept confidential and protected, giving you a safe space to express yourself.",
    srcImage:
      "https://images.unsplash.com/photo-1717501218636-a390f9ac5957?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Nnx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Discover Patterns in Your Journey",
    content:
      "Gain deeper insights into your life with Bean Journal's analytics. Track your moods, habits, and milestones to understand your personal growth over time.",
    srcImage:
      "https://images.unsplash.com/photo-1717501219781-54ac9d09051b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8N3x8fGVufDB8fHx8fA%3D%3D",
  },
];

export function Features() {
  const [featureOpen, setFeatureOpen] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isPageVisible, setIsPageVisible] = useState<boolean>(true);
  const [isComponentVisible, setIsComponentVisible] = useState<boolean>(true);
  const componentRef = useRef<HTMLDivElement>(null);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    const handleFocus = () => {
      setIsPageVisible(true);
    };

    const handleBlur = () => {
      setIsPageVisible(false);
    };

    // Set initial visibility state
    setIsPageVisible(document.visibilityState === "visible");

    // Add event listeners for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Add window focus/blur events for better mobile support
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // Add mobile-specific events
    window.addEventListener("pagehide", handleBlur);
    window.addEventListener("pageshow", handleFocus);

    // Clean up
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("pagehide", handleBlur);
      window.removeEventListener("pageshow", handleFocus);
    };
  }, []);

  // Set up Intersection Observer to detect when component is in viewport
  useEffect(() => {
    if (!componentRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Update visibility state based on intersection
        entries.forEach((entry) => {
          setIsComponentVisible(entry.isIntersecting);
        });
      },
      {
        root: null, // viewport
        threshold: 0.1, // trigger when at least 10% of the component is visible
      }
    );

    observer.observe(componentRef.current);

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  // Timer that only runs when page and component are visible
  useEffect(() => {
    if (!isPageVisible || !isComponentVisible) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev + 10);
    }, 10);

    return () => clearInterval(interval);
  }, [isPageVisible, isComponentVisible]);

  useEffect(() => {
    if (timer > 10000) {
      setFeatureOpen((prev) => (prev + 1) % data.length);
      setTimer(0);
    }
  }, [timer]);

  return (
    <div className="container my-[3rem]" ref={componentRef}>
      <div className="mb-20 text-center">
        <p className=" mb-2 font-medium text-neutral-500 text-sm uppercase">
          Discover Bean Journal
        </p>

        <h2 className="mb-4 font-semibold text-3xl text-neutral-800 tracking-tighter dark:text-neutral-300">
          Unlock Your Journaling Potential with Bean Journal
        </h2>
      </div>
      <div className=" grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-6 ">
          {data.map((item, index) => (
            <button
              className="w-full"
              key={item.title}
              onClick={() => {
                setFeatureOpen(index);
                setTimer(0);
              }}
              type="button"
            >
              <TextComponent
                content={item.content}
                isOpen={featureOpen === index}
                loadingWidthPercent={featureOpen === index ? timer / 100 : 0}
                number={index + 1}
                title={item.title}
              />
            </button>
          ))}
        </div>
        <div className="h-full">
          <div
            className={cn(
              "relative h-96 w-full overflow-hidden rounded-lg md:h-[500px]"
            )}
          >
            {data.map((item, index) => (
              <img
                alt={item.title}
                className={cn(
                  "absolute h-[500px] w-full transform-gpu rounded-lg object-cover transition-all duration-300",
                  featureOpen === index ? "scale-100" : "scale-70",
                  featureOpen > index ? "translate-y-full" : ""
                )}
                key={item.title}
                src={item.srcImage}
                style={{ zIndex: data.length - index }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
function TextComponent({
  number,
  title,
  content,
  isOpen,
  loadingWidthPercent,
}: Readonly<{
  number: number;
  title: string;
  content: string;
  isOpen: boolean;
  loadingWidthPercent?: number;
}>) {
  return (
    <div
      className={cn(
        "transform-gpu rounded-lg border transition-all",
        isOpen
          ? "border-neutral-500/10 bg-linear-to-b from-neutral-200/15 to-neutral-200/5 dark:border-neutral-500/15 dark:from-neutral-600/15 dark:to-neutral-600/5 dark:shadow-[2px_4px_25px_0px_rgba(248,248,248,0.06)_inset] "
          : "scale-90 border-transparent opacity-50 saturate-0"
      )}
    >
      <div className="flex w-full items-center gap-4 p-4">
        <p
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-500/20 text-neutral-600"
          )}
        >
          {number}
        </p>
        <h2
          className={cn(
            "text-left font-medium text-neutral-800 text-xl dark:text-neutral-200"
          )}
        >
          {title}
        </h2>
      </div>
      <div
        className={cn(
          "w-full transform-gpu overflow-hidden text-left text-neutral-600 transition-all duration-500 dark:text-neutral-400",
          isOpen ? " max-h-64" : "max-h-0"
        )}
      >
        <p className="p-4 text-lg">{content}</p>
        <div className="w-full px-4 pb-4">
          <div className="relative h-1 w-full overflow-hidden rounded-full">
            <div
              className={cn("absolute top-0 left-0 h-1 bg-neutral-500")}
              style={{ width: `${loadingWidthPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
