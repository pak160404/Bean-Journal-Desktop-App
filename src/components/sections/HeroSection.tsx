import { HeroParallax } from "@/components/ui/hero-parallax";

// Define products for the HeroParallax component
const products = [
  { title: "3D Card", link: "#", thumbnail: "https://assets.aceternity.com/cloudinary_bkp/3d-card.png" },
  { title: "Animated Modal", link: "#", thumbnail: "https://assets.aceternity.com/animated-modal.png" },
  { title: "Animated Testimonials", link: "#", thumbnail: "https://assets.aceternity.com/animated-testimonials.webp" },
  { title: "Tooltip", link: "#", thumbnail: "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png" },
  { title: "GitHub Globe", link: "#", thumbnail: "https://assets.aceternity.com/github-globe.png" },
  // Need 10 more products for 3 rows
  { title: "Glare Card", link: "#", thumbnail: "https://assets.aceternity.com/glare-card.png" },
  { title: "Layout Grid", link: "#", thumbnail: "https://assets.aceternity.com/layout-grid.png" },
  { title: "Flip Text", link: "#", thumbnail: "https://assets.aceternity.com/flip-text.png" },
  { title: "Hero Highlight", link: "#", thumbnail: "https://assets.aceternity.com/hero-highlight.png" },
  { title: "Carousel", link: "#", thumbnail: "https://assets.aceternity.com/carousel.webp" },
  { title: "Placeholders Input", link: "#", thumbnail: "https://assets.aceternity.com/placeholders-and-vanish-input.png" },
  { title: "Shooting Stars", link: "#", thumbnail: "https://assets.aceternity.com/shooting-stars-and-stars-background.png" },
  { title: "Signup Form", link: "#", thumbnail: "https://assets.aceternity.com/signup-form.png" },
  { title: "Stars Background", link: "#", thumbnail: "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png" },
  { title: "Spotlight", link: "#", thumbnail: "https://assets.aceternity.com/spotlight-new.webp" },
  // Add more if needed, HeroParallax expects 15 for 3 full rows
  { title: "Spotlight Alt", link: "#", thumbnail: "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png"},
  { title: "Parallax Scroll", link: "#", thumbnail: "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png"},
];


const HeroSection = () => {
  // Removed ref, useScroll, useTransform hooks and marqueeImages array
  return <HeroParallax products={products} />;
};

export default HeroSection;