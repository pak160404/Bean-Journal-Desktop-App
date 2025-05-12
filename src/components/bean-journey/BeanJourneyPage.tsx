import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export function BeanJourneyPage() {
  const animationRef = useRef<{ pause: () => void } | null>(null);
  
  useEffect(() => {
    // Animation effects when component mounts
    animate('.bean-journey-title', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1000,
      easing: 'outExpo'
    });
    
    animate('.bean-journey-content', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: 300,
      easing: 'outExpo'
    });

    animate('.bean-journey-button', {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1000,
      delay: 600,
      easing: 'outExpo'
    });

    animate('.bean-journey-cards .card', {
      opacity: [0, 1],
      translateY: [50, 0],
      delay: stagger(200, {start: 800}),
      duration: 800,
      easing: 'outExpo'
    });

    // Bean animation
    const beanAnimation = animate('.bean-icon', {
      translateY: [-10, 10],
      duration: 1500,
      direction: 'alternate',
      loop: true,
      easing: 'inOutSine'
    });

    animationRef.current = beanAnimation;

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fc] dark:bg-gray-900 pt-4 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Bean Logo */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="w-full md:w-1/2">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 relative mr-4">
                <img 
                  src="/images/bean-journey/bean-gradient.svg" 
                  alt="Bean Logo" 
                  className="bean-icon w-full h-full object-contain"
                />
              </div>
              <h1 className="bean-journey-title text-4xl md:text-5xl font-bold text-[#2f2569] dark:text-amber-400">
                Bean Journal
              </h1>
            </div>
            <div className="bean-journey-content space-y-4 text-[#2f2569] dark:text-slate-300 max-w-xl">
              <p className="text-lg">
                Follow the journey of coffee beans from seed to cup. Explore the origins, 
                processing methods, and brewing techniques that transform coffee beans 
                into your favorite beverage.
              </p>
              <p className="text-lg">
                Join our community of coffee enthusiasts to share experiences, 
                discover new flavors, and deepen your appreciation of coffee.
              </p>
            </div>
            <div className="bean-journey-button mt-8">
              <Button className="bg-[#9645ff] hover:bg-[#8035ee] text-white px-8 py-3 text-lg rounded-2xl">
                Start Your Journey
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E4EFE7] to-[#99BC85] rounded-3xl transform rotate-3 opacity-25"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 transform -rotate-1">
                <img 
                  src="/images/bean-journey/bean-hero.jpg" 
                  alt="Coffee Journey" 
                  className="w-full h-64 object-cover rounded-2xl mb-4"
                />
                <h3 className="text-2xl font-bold text-[#2f2569] dark:text-amber-400 mb-2">Coffee Journey</h3>
                <p className="text-[#666b88] dark:text-slate-300">
                  Today is a great day to learn something new about coffee. 
                  From farm to cup, every step matters.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Journey Categories Section */}
        <h2 className="text-2xl font-bold text-[#2f2569] dark:text-amber-400 mb-6">Explore Bean Journal</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full bean-journey-cards">
          {[
            { 
              title: "Origin", 
              desc: "Explore coffee producing regions and their unique flavor profiles.",
              color: "from-[#f6efff] to-[#e9daff]",
              textColor: "text-[#2f2569]",
              image: "/images/bean-journey/nature.jpg"
            },
            { 
              title: "Processing", 
              desc: "Learn how different processing methods affect coffee taste.",
              color: "from-[#ffebf2] to-[#ffd1e7]",
              textColor: "text-[#2f2569]",
              image: "/images/bean-journey/fitness.jpg"
            },
            { 
              title: "Brewing", 
              desc: "Discover various brewing techniques to perfect your cup.",
              color: "from-[#e8edff] to-[#d1e0ff]",
              textColor: "text-[#2f2569]",
              image: "/images/bean-journey/pet.jpg"
            }
          ].map((item, index) => (
            <Card 
              key={index}
              className="card border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-40">
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                </div>
              </div>
              <CardContent className={`pt-4 bg-gradient-to-b ${item.color}`}>
                <p className={`${item.textColor} dark:text-slate-300 py-4`}>{item.desc}</p>
                <Button className="w-full bg-white hover:bg-gray-100 text-[#2f2569] mt-2 border border-[#e0e0e0]">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Community Section */}
        <div className="mt-16 bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[#2f2569] dark:text-amber-400 mb-6">Community Stories</h2>
              <p className="text-[#666b88] dark:text-slate-300 mb-6">
                Read stories from coffee lovers around the world. Learn from their experiences 
                and share your own journey with our community.
              </p>
              <p className="text-[#666b88] dark:text-slate-300 mb-8">
                Join discussions, attend virtual tastings, and connect with fellow enthusiasts
                who share your passion for quality coffee.
              </p>
              <div className="flex">
                <Button className="bg-[#2f2569] hover:bg-[#24205a] text-white mr-4">
                  Browse Stories
                </Button>
                <Button className="bg-white hover:bg-gray-100 text-[#2f2569] border border-[#e0e0e0]">
                  Join Community
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#ead6ff] to-[#c9abff] rounded-lg p-4">
                <h4 className="font-bold text-[#2f2569] mb-2">Coffee Tastings</h4>
                <p className="text-sm text-[#2f2569]">Join weekly virtual tastings with coffee experts</p>
              </div>
              <div className="bg-gradient-to-br from-[#ade4ff] to-[#7ccfff] rounded-lg p-4">
                <h4 className="font-bold text-[#2f2569] mb-2">Brewing Tips</h4>
                <p className="text-sm text-[#2f2569]">Learn expert techniques from our community</p>
              </div>
              <div className="bg-gradient-to-br from-[#ffd1fb] to-[#ffb1f8] rounded-lg p-4">
                <h4 className="font-bold text-[#2f2569] mb-2">Bean Reviews</h4>
                <p className="text-sm text-[#2f2569]">Read honest reviews from real coffee lovers</p>
              </div>
              <div className="bg-gradient-to-br from-[#ffebf2] to-[#ffd1e1] rounded-lg p-4">
                <h4 className="font-bold text-[#2f2569] mb-2">DIY Recipes</h4>
                <p className="text-sm text-[#2f2569]">Discover creative coffee-based recipes</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Updates */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#2f2569] dark:text-amber-400">Recent Updates</h2>
            <span className="text-[#989cb8]">Latest updated: Aug 08 2024</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Nature', 'Fitness', 'Study', 'Winter'].map((tag, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-32 bg-gray-200 relative">
                  <img 
                    src={`/images/bean-journey/${tag.toLowerCase() === 'study' ? 'pet' : tag.toLowerCase()}.jpg`} 
                    alt={tag} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#2f2569] dark:text-amber-400">{tag}</h3>
                  <p className="text-xs text-[#cac9c8]">Dec 20, 2023</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 