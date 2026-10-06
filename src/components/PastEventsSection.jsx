import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Sparkles,
  SlidersHorizontal,
  Award
} from 'lucide-react';
import EventDetailModal from './EventDetailModal';

// Interactive Image Carousel for each Past Event
function PastEventCard({ event, onOpenModal }) {
  const images = event.galleryImages && event.galleryImages.length > 0
    ? event.galleryImages
    : [event.bannerUrl];

  const [activeIdx, setActiveIdx] = useState(0);

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="card"
      style={{
        overflow: 'hidden',
        border: '1px solid var(--border-light)',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Visual Slider Container */}
      <div
        style={{
          position: 'relative',
          height: '280px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#0a0f1d'
        }}
      >
        <img
          src={images[activeIdx] || event.bannerUrl}
          alt={`${event.title} - Slide ${activeIdx + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease, opacity 0.3s ease'
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(8, 12, 21, 0.95) 0%, rgba(8, 12, 21, 0.2) 60%, transparent 100%)'
          }}
        />

        {/* Category Pill */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 3 }}>
          <span
            style={{
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              backdropFilter: 'blur(8px)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {event.category || 'Flagship Event'}
          </span>
        </div>

        {/* Multiple Images Carousel Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)'
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)'
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={18} />
            </button>

            {/* Slider Dots */}
            <div
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
                zIndex: 4
              }}
            >
              {images.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx(dotIdx);
                  }}
                  style={{
                    width: dotIdx === activeIdx ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: dotIdx === activeIdx ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                />
              ))}
            </div>

            {/* Photo Counter Badge */}
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 3,
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              {activeIdx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '0.75rem',
            lineHeight: 1.35
          }}
        >
          {event.title}
        </h3>

        {/* Metadata info */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} color="var(--primary)" />
            <span>{event.date}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} color="#06b6d4" />
            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.venue || 'KL University'}
            </span>
          </div>

          {event.attendance && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={15} color="#10b981" />
              <span>{event.attendance}</span>
            </div>
          )}
        </div>

        {/* Short description */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {event.shortDescription || event.fullDescription}
        </p>

        {/* Highlighted Winners Bar */}
        {event.winners && event.winners.length > 0 && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              marginBottom: '1.5rem',
              marginTop: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Trophy size={16} color="#f59e0b" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Event Winners ({event.winners.length})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {event.winners.slice(0, 2).map((winner, wIdx) => (
                <div
                  key={winner.id || wIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {winner.photoUrl && (
                    <img
                      src={winner.photoUrl}
                      alt={winner.name}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid rgba(245, 158, 11, 0.4)'
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {winner.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#fbbf24', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {winner.prize}
                    </div>
                  </div>
                </div>
              ))}

              {event.winners.length > 2 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '2px' }}>
                  + {event.winners.length - 2} more prize winners
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <button
          className="btn btn-secondary"
          onClick={() => onOpenModal(event)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem'
          }}
        >
          <span>View Recap & Full Gallery</span>
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}

export default function PastEventsSection({ pastEvents = [] }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Categories extraction
  const categories = ['ALL', ...Array.from(new Set(pastEvents.map(e => e.category).filter(Boolean)))];

  const filteredEvents = pastEvents.filter(ev => {
    const matchesCat = selectedCategory === 'ALL' || ev.category === selectedCategory;
    const matchesSearch =
      ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="past-events" style={{ padding: '5rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <Trophy size={15} />
            <span>Legacy & Milestone Showcases</span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Past Events & <span className="gradient-text">Hall of Fame</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Explore the flagship hackathons, technical symposiums, and engineering bootcamps hosted by SCRS.
            Browse through photo galleries and celebrate our prize winners.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2.5rem',
            padding: '1.25rem',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(12px)'
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)'
              }}
            />
            <input
              type="text"
              placeholder="Search past events or venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{
                paddingLeft: '38px',
                fontSize: '0.875rem',
                backgroundColor: 'rgba(15, 23, 42, 0.7)'
              }}
            />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Trophy size={48} color="var(--text-dim)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>No past events matched your query</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try clearing filters or search keywords.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem'
            }}
          >
            {filteredEvents.map(event => (
              <PastEventCard
                key={event.id}
                event={event}
                onOpenModal={(ev) => setSelectedEvent(ev)}
              />
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </div>
    </section>
  );
}
