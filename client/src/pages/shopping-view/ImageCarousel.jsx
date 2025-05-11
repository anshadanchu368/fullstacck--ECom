"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useInView } from "react-intersection-observer"

const ImageCarousel = ({ featureImageList = [], onSlideChange = null }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [renderedSlides, setRenderedSlides] = useState([0])
  const imagesRef = useRef({})
  const [imageCache, setImageCache] = useState({})
  const isFirstRender = useRef(true)
  const autoplayRef = useRef(null)
  const carouselRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Use intersection observer to pause autoplay when not in view
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  })

  // Set refs for both intersection observer and carousel element
  const setRefs = useCallback(
    (node) => {
      carouselRef.current = node
      inViewRef(node)
    },
    [inViewRef],
  )

  // Memoized navigation functions to prevent unnecessary re-renders
  const goToNextSlide = useCallback(() => {
    if (featureImageList.length <= 1) return
    setCurrentSlide((prev) => {
      const next = (prev + 1) % featureImageList.length
      if (onSlideChange) onSlideChange(next)
      return next
    })
  }, [featureImageList.length, onSlideChange])

  const goToPrevSlide = useCallback(() => {
    if (featureImageList.length <= 1) return
    setCurrentSlide((prev) => {
      const prevSlide = (prev - 1 + featureImageList.length) % featureImageList.length
      if (onSlideChange) onSlideChange(prevSlide)
      return prevSlide
    })
  }, [featureImageList.length, onSlideChange])

  const goToSlide = useCallback(
    (index) => {
      if (index === currentSlide) return
      setCurrentSlide(index)
      if (onSlideChange) onSlideChange(index)
    },
    [currentSlide, onSlideChange],
  )

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!carouselRef.current || !carouselRef.current.contains(document.activeElement)) return

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goToPrevSlide()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        goToNextSlide()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNextSlide, goToPrevSlide])

  // Handle touch events for swipe
  useEffect(() => {
    if (!carouselRef.current) return

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e) => {
      touchEndX.current = e.changedTouches[0].clientX
      handleSwipe()
    }

    const handleSwipe = () => {
      const swipeThreshold = 50
      const diff = touchStartX.current - touchEndX.current

      if (Math.abs(diff) < swipeThreshold) return

      if (diff > 0) {
        goToNextSlide()
      } else {
        goToPrevSlide()
      }
    }

    const element = carouselRef.current
    element.addEventListener("touchstart", handleTouchStart, { passive: true })
    element.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchend", handleTouchEnd)
    }
  }, [goToNextSlide, goToPrevSlide])

  // Optimized slide rendering and preloading
  useEffect(() => {
    if (featureImageList.length <= 1) return

    const nextSlide = (currentSlide + 1) % featureImageList.length
    const nextNextSlide = (currentSlide + 2) % featureImageList.length
    const prevSlide = (currentSlide - 1 + featureImageList.length) % featureImageList.length

    // Only render the slides that are visible or adjacent
    setRenderedSlides([prevSlide, currentSlide, nextSlide])

    // Use requestIdleCallback for non-critical preloading when browser is idle
    const preloadNextSlides = () => {
      // Immediate preload next slide
      if (featureImageList[nextSlide]?.image && !imagesRef.current[nextSlide]) {
        const img = new Image()
        img.fetchPriority = "high"
        img.src = featureImageList[nextSlide].image
        imagesRef.current[nextSlide] = true
      }

      // Delayed preload slide after next
      if (featureImageList[nextNextSlide]?.image && !imagesRef.current[nextNextSlide]) {
        const img = new Image()
        img.fetchPriority = "low"
        img.src = featureImageList[nextNextSlide].image
        imagesRef.current[nextNextSlide] = true
      }
    }

    if (window.requestIdleCallback) {
      window.requestIdleCallback(preloadNextSlides)
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(preloadNextSlides, 200)
    }

    // Prefetch placeholder if any slide has no image
    if (featureImageList.some((item) => !item.image || item.image === "/placeholder.svg")) {
      const placeholderImg = new Image()
      placeholderImg.src = "/placeholder.svg"
    }
  }, [currentSlide, featureImageList])

  // Optimized auto-slide timer with pause when not in view
  useEffect(() => {
    if (featureImageList.length <= 1) return
    if (!inView) return // Pause when not in viewport

    const slideDuration = 5000
    let startTime

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      if (elapsed >= slideDuration) {
        startTime = timestamp
        goToNextSlide()
      }

      autoplayRef.current = requestAnimationFrame(animate)
    }

    autoplayRef.current = requestAnimationFrame(animate)

    return () => {
      if (autoplayRef.current) {
        cancelAnimationFrame(autoplayRef.current)
      }
    }
  }, [featureImageList.length, goToNextSlide, inView])

  // Preload first few images on initial render
  useEffect(() => {
    if (!isFirstRender.current) return
    isFirstRender.current = false

    if (featureImageList.length > 0) {
      const newImageCache = { ...imageCache }

      // Preload first image with high priority
      if (featureImageList[0]?.image) {
        const firstImage = new Image()
        firstImage.fetchPriority = "high"
        firstImage.src = featureImageList[0].image
        firstImage.onload = () => {
          newImageCache[0] = true
          setImageCache({ ...newImageCache })
        }
        imagesRef.current[0] = true
      }

      // Use requestIdleCallback for preloading other images
      const preloadInitialImages = () => {
        for (let i = 1; i < Math.min(3, featureImageList.length); i++) {
          if (featureImageList[i]?.image && !newImageCache[i]) {
            const img = new Image()
            img.fetchPriority = "low"
            img.src = featureImageList[i].image
            img.onload = () => {
              newImageCache[i] = true
              setImageCache((prev) => ({ ...prev, [i]: true }))
            }
            imagesRef.current[i] = true
          }
        }
      }

      if (window.requestIdleCallback) {
        window.requestIdleCallback(preloadInitialImages)
      } else {
        setTimeout(preloadInitialImages, 200)
      }
    }
  }, [featureImageList])

  if (!featureImageList.length) return null

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
    )
  }

  return (
    <div
      ref={setRefs}
      className="relative w-full h-full overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      tabIndex={0}
    >
      {/* Navigation buttons for larger screens */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
        onClick={goToPrevSlide}
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
        onClick={goToNextSlide}
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <div className="absolute inset-0">
        {featureImageList.map((item, idx) => {
          if (!renderedSlides.includes(idx)) return null
          const imageUrl = item.image || "/placeholder.svg"
          const isActive = currentSlide === idx

          return (
            <div
              key={`slide-${idx}`}
              className="absolute inset-0 transition-opacity duration-500 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 10 : 0,
                willChange: "opacity",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} of ${featureImageList.length}`}
              aria-hidden={!isActive}
            >
              <picture>
                {/* WebP format for modern browsers */}
                <source
                  type="image/webp"
                  srcSet={imageUrl.endsWith(".webp") ? imageUrl : `${imageUrl.replace(/\.(jpe?g|png)$/i, ".webp")} 1x`}
                  media="(min-width: 1px)"
                />

                {/* Responsive image sources for different screen sizes */}
                <source media="(max-width: 640px)" srcSet={`${imageUrl}?width=640 1x, ${imageUrl}?width=1280 2x`} />
                <source media="(max-width: 1024px)" srcSet={`${imageUrl}?width=1024 1x, ${imageUrl}?width=2048 2x`} />

                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={item.alt || `Slide ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading={
                    idx === currentSlide || idx === (currentSlide + 1) % featureImageList.length ? "eager" : "lazy"
                  }
                  decoding="async"
                  fetchPriority={idx === currentSlide ? "high" : "low"}
                  onLoad={() => {
                    imagesRef.current[idx] = true
                    setImageCache((prev) => ({ ...prev, [idx]: true }))
                  }}
                  style={{
                    willChange: "opacity, transform",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                />
              </picture>
            </div>
          )
        })}
      </div>

      {/* Dot navigation */}
      <div
        className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20"
        role="tablist"
        aria-label="Carousel navigation"
      >
        {featureImageList.map((_, idx) => (
          <button
            key={`nav-${idx}`}
            className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 ${
              currentSlide === idx ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-selected={currentSlide === idx}
            role="tab"
            tabIndex={currentSlide === idx ? 0 : -1}
          />
        ))}
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ImageCarousel)
