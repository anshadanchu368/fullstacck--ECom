const goToNextSlide = () => {
  if (featureImageList.length <= 1) return;
  setCurrentSlide(prev => (prev + 1) % featureImageList.length);
  if (onSlideChange) onSlideChange((currentSlide + 1) % featureImageList.length);
};

const goToPrevSlide = () => {
  if (featureImageList.length <= 1) return;
  setCurrentSlide(prev => (prev - 1 + featureImageList.length) % featureImageList.length);
  if (onSlideChange) onSlideChange((currentSlide - 1 + featureImageList.length) % featureImageList.length);
};import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ImageCarousel = ({ featureImageList = [], onSlideChange = null }) => {
const [currentSlide, setCurrentSlide] = useState(0);
const [renderedSlides, setRenderedSlides] = useState([0]); // Only render current and adjacent slides
const slideTimerRef = useRef(null);
const imagesRef = useRef({});
const [imageCache, setImageCache] = useState({});
const isFirstRender = useRef(true);

// Aggressive optimizations for rendering and preloading
useEffect(() => {
  if (featureImageList.length <= 1) return;
  
  // Calculate which slides should be rendered (current, next, and previous)
  const nextSlide = (currentSlide + 1) % featureImageList.length;
  const nextNextSlide = (currentSlide + 2) % featureImageList.length;
  const prevSlide = (currentSlide - 1 + featureImageList.length) % featureImageList.length;
  
  // Only render the minimum necessary slides
  setRenderedSlides([prevSlide, currentSlide, nextSlide]);
  
  // Immediate preload for next slide if not already cached
  if (featureImageList[nextSlide]?.image && !imagesRef.current[nextSlide]) {
    const img = new Image();
    img.fetchPriority = "high"; // High priority for next slide
    img.src = featureImageList[nextSlide].image;
    imagesRef.current[nextSlide] = true;
  }
  
  // Delayed preload for slide after next
  setTimeout(() => {
    if (featureImageList[nextNextSlide]?.image && !imagesRef.current[nextNextSlide]) {
      const img = new Image();
      img.fetchPriority = "low"; // Lower priority for slide after next
      img.src = featureImageList[nextNextSlide].image;
      imagesRef.current[nextNextSlide] = true;
    }
  }, 300); // Short delay to prioritize next slide
  
  // Check if we need to prefetch placeholders
  if (featureImageList.some(item => !item.image || item.image === "/placeholder.svg")) {
    const placeholderImg = new Image();
    placeholderImg.src = "/placeholder.svg";
  }
}, [currentSlide, featureImageList]);

// Optimized timer for slide transition
useEffect(() => {
  if (featureImageList.length <= 1) return;
  
  // Use requestAnimationFrame for smoother timing
  let startTime;
  let animationFrameId;
  const slideDuration = 5000; // 5 seconds per slide
  
  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    
    if (elapsed >= slideDuration) {
      startTime = timestamp;
      goToNextSlide();
    }
    
    animationFrameId = requestAnimationFrame(animate);
  };
  
  animationFrameId = requestAnimationFrame(animate);
  
  // More efficient cleanup
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    startTime = null;
  };
}, [currentSlide, featureImageList.length]);

// On first render, aggressively preload first few images in the background
useEffect(() => {
  if (!isFirstRender.current) return;
  isFirstRender.current = false;
  
  if (featureImageList.length > 0) {
    // Create a temporary image cache to prevent duplicate loading
    const newImageCache = {...imageCache};
    
    // Immediately load first image with highest priority
    if (featureImageList[0]?.image) {
      const firstImage = new Image();
      firstImage.fetchPriority = "high";
      firstImage.src = featureImageList[0].image;
      firstImage.onload = () => {
        newImageCache[0] = true;
        setImageCache({...newImageCache});
      };
      imagesRef.current[0] = true;
    }
    
    // Preload next 2 images with lower priority
    setTimeout(() => {
      for (let i = 1; i < Math.min(3, featureImageList.length); i++) {
        if (featureImageList[i]?.image && !newImageCache[i]) {
          const img = new Image();
          img.fetchPriority = "low";
          img.src = featureImageList[i].image;
          img.onload = () => {
            newImageCache[i] = true;
            setImageCache(prev => ({...prev, [i]: true}));
          };
          imagesRef.current[i] = true;
        }
      }
    }, 200); // Short delay to prioritize first image
  }
}, [featureImageList]);

if (!featureImageList.length) return null;

// If only one slide, render it simply without animations
if (featureImageList.length === 1) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={featureImageList[0].image || "/placeholder.svg"}
        alt="Feature image"
        className="w-full h-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}

return (
  <div className="relative w-full h-full overflow-hidden">
    <div className="absolute inset-0">
      {featureImageList.map((item, idx) => {
        // Only render slides that need to be visible
        if (!renderedSlides.includes(idx)) return null;
        
        // Use standard image for low-end devices, WebP if supported
        const imageUrl = item.image || "/placeholder.svg";
        
        return (
          <motion.div
            key={`slide-${idx}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentSlide === idx ? 1 : 0,
              zIndex: currentSlide === idx ? 10 : 0,
            }}
            transition={{
              opacity: { duration: 0.5, ease: "easeInOut" }, // Faster transition
            }}
          >
            {/* Optimized image with layered approach */}
            <picture>
              {/* Provide WebP format if your server supports it */}
              <source 
                type="image/webp"
                srcSet={`${imageUrl.replace(/\.(jpe?g|png)$/i, '.webp')} 1x`}
                media="(min-width: 1px)" 
              />
              <img
                src={imageUrl}
                alt={`Slide ${idx + 1}`}
                className="w-full h-full object-cover"
                loading={idx === currentSlide ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={idx === currentSlide ? "high" : "low"}
                onLoad={() => {
                  imagesRef.current[idx] = true;
                  setImageCache(prev => ({...prev, [idx]: true}));
                }}
                style={{
                  willChange: "opacity, transform", // Hint to browser to optimize for animation
                  transform: "translateZ(0)", // Force GPU acceleration
                  backfaceVisibility: "hidden", // Prevent flickering in some browsers
                }}
              />
            </picture>
            
          </motion.div>
        );
      })}
    </div>
    
    {/* Optional: Simple dot navigation */}
    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
      {featureImageList.map((_, idx) => (
        <button
          key={`nav-${idx}`}
          className={`w-2 h-2 rounded-full ${currentSlide === idx ? 'bg-white' : 'bg-white/50'}`}
          onClick={() => setCurrentSlide(idx)}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  </div>
);
};

export default ImageCarousel;