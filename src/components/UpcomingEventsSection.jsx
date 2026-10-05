import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Share2,
  CheckCircle2
} from 'lucide-react';
import EventDetailModal from './EventDetailModal';

// Live Countdown Timer Component
function CountdownBadge({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    try {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPast: false
      };
    } catch {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '9999px',
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#f87171',
          fontSize: '0.75rem',
          fontWeight: 700
        }}
      >
        Event Concluded
      </span>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(0, 0, 0, 0.75)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        backdropFilter: 'blur(8px)',
        color: '#fff',
        fontSize: '0.8rem',
        fontWeight: 700
      }}
    >
      <Clock size={14} color="#38bdf8" />
      <span style={{ color: '#38bdf8' }}>{timeLeft.days}d</span>
      <span style={{ opacity: 0.5 }}>:</span>
      <span style={{ color: '#a5b4fc' }}>{String(timeLeft.hours).padStart(2, '0')}h</span>
      <span style={{ opacity: 0.5 }}>:</span>
      <span style={{ color: '#c084fc' }}>{String(timeLeft.minutes).padStart(2, '0')}m</span>
      <span style={{ opacity: 0.5 }}>:</span>
      <span style={{ color: '#34d399' }}>{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  );
}

export default function UpcomingEventsSection({ upcomingEvents = [] }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleShare = (event, e) => {
    e.stopPropagation();
    const shareText = `Check out ${event.title} organized by SCRS at KL University!`;
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText} - ${window.location.origin}/#upcoming-events`);
      setCopiedId(event.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section id="upcoming-events" style={{ padding: '5rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#06b6d4',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <Sparkles size={15} />
            <span>Mark Your Calendars</span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Upcoming <span className="gradient-text">Club Events</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Gear up for the next wave of hackathons, AI workshops, coding competitions, and guest talks.
            Reserve your seat early before registrations close!
          </p>
        </div>

        {/* Upcoming Events Grid */}
        {upcomingEvents.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Calendar size={48} color="var(--text-dim)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Upcoming Events Scheduled Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Check back soon or follow our social channels for announcements on upcoming summits!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {upcomingEvents.map((event, index) => {
              const isFirst = index === 0;

              return (
                <div
                  key={event.id}
                  className="card"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isFirst ? 'minmax(320px, 1.1fr) minmax(320px, 1fr)' : 'minmax(280px, 0.9fr) minmax(320px, 1fr)',
                    gap: '2rem',
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-light)',
                    background: isFirst
                      ? 'linear-gradient(135deg, rgba(20, 30, 55, 0.8) 0%, rgba(12, 18, 32, 0.95) 100%)'
                      : 'var(--bg-card)',
                    boxShadow: isFirst ? '0 12px 36px rgba(99, 102, 241, 0.15)' : 'var(--shadow-md)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Left Column: Image Banner & Countdown */}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      minHeight: '260px',
                      background: '#0a0f1d'
                    }}
                  >
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        minHeight: '260px'
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.4) 100%)'
                      }}
                    />

                    {/* Category pill */}
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2 }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRadius: '9999px',
                          background: 'rgba(6, 182, 212, 0.25)',
                          color: '#38bdf8',
                          border: '1px solid rgba(6, 182, 212, 0.45)',
                          backdropFilter: 'blur(8px)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {event.category || 'Upcoming'}
                      </span>
                    </div>

                    {/* Live Countdown Overlay */}
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', zIndex: 2 }}>
                      <CountdownBadge targetDate={event.date} />
                    </div>

                    {/* Share action */}
                    <button
                      onClick={(e) => handleShare(event, e)}
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        zIndex: 2,
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.65)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: copiedId === event.id ? '#10b981' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                      }}
                      title="Share Event"
                    >
                      {copiedId === event.id ? <CheckCircle2 size={16} /> : <Share2 size={16} />}
                    </button>
                  </div>

                  {/* Right Column: Information, Timeline, Registration */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Status indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="pulse-dot" style={{ backgroundColor: event.isRegistrationOpen ? '#10b981' : '#f59e0b' }}></span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: event.isRegistrationOpen ? '#34d399' : '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {event.isRegistrationOpen ? 'Registrations Open' : 'Registrations Closing Soon'}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: isFirst ? '1.75rem' : '1.45rem',
                          fontWeight: 800,
                          color: '#fff',
                          marginBottom: '1rem',
                          lineHeight: 1.3
                        }}
                      >
                        {event.title}
                      </h3>

                      {/* Event Meta Details Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                          gap: '0.75rem',
                          marginBottom: '1.25rem',
                          padding: '0.9rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={16} color="var(--primary)" />
                          <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Date</div>
                            <div style={{ fontWeight: 600, color: '#fff' }}>{event.date}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={16} color="#06b6d4" />
                          <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Time</div>
                            <div style={{ fontWeight: 600, color: '#fff' }}>{event.time}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={16} color="#a855f7" />
                          <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Venue</div>
                            <div style={{ fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                              {event.venue}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.95rem',
                          lineHeight: 1.65,
                          marginBottom: '1.25rem'
                        }}
                      >
                        {event.description}
                      </p>

                      {/* Important Info notice */}
                      {event.importantInfo && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.6rem',
                            padding: '0.75rem 1rem',
                            background: 'rgba(6, 182, 212, 0.06)',
                            borderLeft: '3px solid #06b6d4',
                            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                            marginBottom: '1.5rem',
                            fontSize: '0.825rem',
                            color: '#93c5fd'
                          }}
                        >
                          <AlertCircle size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{event.importantInfo}</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border-subtle)'
                      }}
                    >
                      {event.registrationLink ? (
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                          style={{
                            flex: '1 1 200px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '0.95rem',
                            padding: '0.75rem 1.5rem'
                          }}
                        >
                          <span>Register Now</span>
                          <ExternalLink size={16} />
                        </a>
                      ) : (
                        <button
                          className="btn btn-primary"
                          disabled
                          style={{ flex: '1 1 200px', opacity: 0.6 }}
                        >
                          Registrations Closed
                        </button>
                      )}

                      <button
                        className="btn btn-secondary"
                        onClick={() => setSelectedEvent(event)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.75rem 1.25rem'
                        }}
                      >
                        <span>Full Agenda</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Full Upcoming Event Details */}
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </div>
    </section>
  );
}
