import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Trophy, ExternalLink, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function EventDetailModal({ event, onClose, onRegisterClick }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!event) return null;

  const isPast = Boolean(event.winners);
  const images = event.galleryImages && event.galleryImages.length > 0
    ? event.galleryImages
    : [event.bannerUrl];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '900px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '0',
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          background: 'var(--bg-secondary)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.65)',
            border: '1px solid var(--border-subtle)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Carousel / Image Header */}
        <div style={{ position: 'relative', height: '360px', overflow: 'hidden', background: '#000' }}>
          <img
            src={images[activeImageIndex] || event.bannerUrl}
            alt={event.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.3s ease'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 50%, rgba(0,0,0,0.5) 100%)'
            }}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={handleNextImage}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>

              {/* Dots */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '6px',
                  zIndex: 2
                }}
              >
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(idx);
                    }}
                    style={{
                      width: idx === activeImageIndex ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: idx === activeImageIndex ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Title on Header */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.5rem',
              right: '1.5rem',
              zIndex: 3
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '9999px',
                backgroundColor: 'rgba(99, 102, 241, 0.25)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {event.category || 'SCRS Event'}
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {event.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem 1.75rem' }}>
          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={18} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date & Time</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {event.date} {event.time ? `• ${event.time}` : ''}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={18} color="#06b6d4" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Venue</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {event.venue || 'KL University'}
                </div>
              </div>
            </div>

            {event.attendance && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={18} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Participation</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {event.attendance}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description / Story */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#fff' }}>About This Event</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.975rem', whiteSpace: 'pre-line' }}>
              {event.fullDescription || event.description || event.shortDescription}
            </p>
          </div>

          {/* Important Info for Upcoming Events */}
          {!isPast && event.importantInfo && (
            <div
              style={{
                marginBottom: '2rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)'
              }}
            >
              <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} /> Important Guidelines & Prerequisites
              </h4>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {event.importantInfo}
              </p>
            </div>
          )}

          {/* Registration for Upcoming Events */}
          {!isPast && event.registrationLink && (
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Register for Event</span>
                <ExternalLink size={18} />
              </a>
            </div>
          )}

          {/* Gallery Thumbnails Strip */}
          {images.length > 1 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#fff' }}>Event Gallery ({images.length} Photos)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      height: '80px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: idx === activeImageIndex ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      opacity: idx === activeImageIndex ? 1 : 0.7,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Winners Section for Past Events */}
          {isPast && event.winners && event.winners.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Trophy size={22} color="#f59e0b" />
                <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>Hall of Winners & Champions</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {event.winners.map((winner, idx) => (
                  <div
                    key={winner.id || idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(18, 26, 44, 0.8)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {winner.photoUrl && (
                      <div
                        style={{
                          width: '100%',
                          height: '140px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          marginBottom: '1rem'
                        }}
                      >
                        <img
                          src={winner.photoUrl}
                          alt={winner.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.3) 100%)',
                        color: '#fbbf24',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {winner.prize}
                    </span>
                    <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>
                      {winner.name}
                    </h4>
                    {winner.teamMembers && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                        Members: {winner.teamMembers}
                      </p>
                    )}
                    {winner.projectTitle && (
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.5rem' }}>
                        Project: {winner.projectTitle}
                      </div>
                    )}
                    {winner.description && (
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {winner.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
