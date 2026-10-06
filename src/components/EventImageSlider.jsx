import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function EventImageSlider({
  images = [],
  height = '220px',
  title = 'Event Image',
  autoSlide = true,
  autoSlideInterval = 4000,
  borderRadius = 'var(--radius-md)',
  showThumbnails = false
}) {
  // Filter out any empty strings or invalid URLs
  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    if (!autoSlide || validImages.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [autoSlide, validImages.length, autoSlideInterval, isHovered]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const handleDotClick = (index, e) => {
    e?.stopPropagation();
    setCurrentIndex(index);
  };

  if (validImages.length === 0) {
    return (
      <div style={{
        height,
        borderRadius,
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-dim)',
        border: '1px solid var(--border-subtle)'
      }}>
        <ImageIcon size={32} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Main Slide Frame */}
      <div
        style={{
          position: 'relative',
          height,
          borderRadius,
          overflow: 'hidden',
          background: '#0a101f',
          border: '1px solid var(--border-light)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides Track */}
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {validImages.map((imgUrl, idx) => (
            <div key={idx} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
              <img
                src={imgUrl}
                alt={`${title} slide ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

        {/* Subtle Bottom Gradient Shade for Controls */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '45px',
          background: 'linear-gradient(to top, rgba(6, 13, 27, 0.65) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* Slide Counter Badge */}
        {validImages.length > 1 && (
          <div style={{
            position: 'absolute',
            top: '0.65rem',
            right: '0.65rem',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            color: '#f8fafc',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.2rem 0.55rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            zIndex: 2,
            letterSpacing: '0.04em'
          }}>
            {currentIndex + 1} / {validImages.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              style={{
                position: 'absolute',
                top: '50%',
                left: '0.5rem',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 3,
                opacity: isHovered ? 1 : 0.75,
                transition: 'opacity 0.2s ease, background 0.2s ease'
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              style={{
                position: 'absolute',
                top: '50%',
                right: '0.5rem',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 3,
                opacity: isHovered ? 1 : 0.75,
                transition: 'opacity 0.2s ease, background 0.2s ease'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Pagination Dots (shown when thumbnails are not active) */}
        {!showThumbnails && validImages.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '0.65rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.4rem',
            zIndex: 3,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            padding: '0.2rem 0.55rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {validImages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => handleDotClick(dotIdx, e)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                style={{
                  width: currentIndex === dotIdx ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: currentIndex === dotIdx ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Interactive Thumbnail Gallery Strip */}
      {showThumbnails && validImages.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '0.45rem',
          marginTop: '0.65rem',
          overflowX: 'auto',
          paddingBottom: '0.2rem',
          scrollbarWidth: 'none'
        }}>
          {validImages.map((imgUrl, tIdx) => {
            const isSelected = currentIndex === tIdx;
            return (
              <button
                key={tIdx}
                type="button"
                onClick={(e) => handleDotClick(tIdx, e)}
                aria-label={`Select photo ${tIdx + 1}`}
                style={{
                  width: '54px',
                  height: '38px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? '0 0 10px var(--primary-glow)' : 'none',
                  opacity: isSelected ? 1 : 0.6,
                  padding: 0,
                  background: '#0a101f',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${tIdx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
