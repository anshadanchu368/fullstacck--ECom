import { useState, useEffect, useRef } from 'react';

const ImageCarousel = ({ featureImageList = [], onSlideChange = null }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [renderedSlides, setRenderedSlides] = useState([0]);
  const imagesRef = useRef({});
  const [imageCache, setImageCache] = useState({});
  const isFirstRender = useRef(true);

  // Function to go to next slide — now properly scoped inside component
  const goToNextSlide = () => {
    if (featureImageList.length <= 1) return;
    setCurrentSlide((prev) => {
      const next = (prev + 1) % featureImageList.length;
      if (onSlideChange) onSlideChange(next);
      return next;
    });
  };

  // Function to go to previous slide (optional, not used in auto-slide)
  const goToPrevSlide = () => {
    if (featureImageList.length <= 1) return;
    setCurrentSlide((prev) => {
      const prevSlide = (prev - 1 + featureImageList.length) % featureImageList.length;
      if (onSlideChange) onSlideChange(prevSlide);
      return prevSlide;
    });
  };

  // Aggressive optimizations for rendering and preloading
  useEffect(() => {
    if (featureImageList.length <= 1) return;

    const nextSlide = (currentSlide + 1) % featureImageList.length;
    const nextNextSlide = (currentSlide + 2) % featureImageList.length;
    const prevSlide = (currentSlide - 1 + featureImageList.length) % featureImageList.length;

    setRenderedSlides([prevSlide, currentSlide, nextSlide]);

    // Immediate preload next slide
    if (featureImageList[nextSlide]?.image && !imagesRef.current[nextSlide]) {
      const img = new Image();
      img.fetchPriority = "high";
      img.src = featureImageList[nextSlide].image;
      imagesRef.current[nextSlide] = true;
    }

    // Delayed preload slide after next
    setTimeout(() => {
      if (featureImageList[nextNextSlide]?.image && !imagesRef.current[nextNextSlide]) {
        const img = new Image();
        img.fetchPriority = "low";
        img.src = featureImageList[nextNextSlide].image;
        imagesRef.current[nextNextSlide] = true;
      }
    }, 300);

    // Prefetch placeholder if any slide has no image
    if (featureImageList.some(item => !item.image || item.image === "/placeholder.svg")) {
      const placeholderImg = new Image();
      placeholderImg.src = "/placeholder.svg";
    }
  }, [currentSlide, featureImageList]);

  // Optimized auto-slide timer
  useEffect(() => {
    if (featureImageList.length <= 1) return;

    const slideDuration = 5000;
    let animationFrameId;
    let startTime;

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

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [featureImageList.length]); // <-- no currentSlide dependency needed

  // Preload first few images on initial render
  useEffect(() => {
    if (!isFirstRender.current) return;
    isFirstRender.current = false;

    if (featureImageList.length > 0) {
      const newImageCache = { ...imageCache };

      // Preload first image
      if (featureImageList[0]?.image) {
        const firstImage = new Image();
        firstImage.fetchPriority = "high";
        firstImage.src = featureImageList[0].image;
        firstImage.onload = () => {
          newImageCache[0] = true;
          setImageCache({ ...newImageCache });
        };
        imagesRef.current[0] = true;
      }

      // Preload next 2 images
      setTimeout(() => {
        for (let i = 1; i < Math.min(3, featureImageList.length); i++) {
          if (featureImageList[i]?.image && !newImageCache[i]) {
            const img = new Image();
            img.fetchPriority = "low";
            img.src = featureImageList[i].image;
            img.onload = () => {
              newImageCache[i] = true;
              setImageCache((prev) => ({ ...prev, [i]: true }));
            };
            imagesRef.current[i] = true;
          }
        }
      }, 200);
    }
  }, [featureImageList]);

  if (!featureImageList.length) return null;

  // Single image fallback (no carousel behavior)
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
          if (!renderedSlides.includes(idx)) return null;
          const imageUrl = item.image || "/placeholder.svg";

          return (
            <div
              key={`slide-${idx}`}
              className="absolute inset-0 transition-opacity duration-500 ease-in-out"
              style={{
                opacity: currentSlide === idx ? 1 : 0,
                zIndex: currentSlide === idx ? 10 : 0,
                willChange: "opacity",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            >
              <picture>
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
                    setImageCache(prev => ({ ...prev, [idx]: true }));
                  }}
                  style={{
                    willChange: "opacity, transform",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                />
              </picture>
            </div>
          );
        })}
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {featureImageList.map((_, idx) => (
          <button
            key={`nav-${idx}`}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === idx ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;