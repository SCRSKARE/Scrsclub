import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  ExternalLink,
  Sparkles,
  Ticket,
  Trophy
} from 'lucide-react';
import {
  getUpcomingEvents,
  getPastEvents,
  registerForEvent,
  subscribeToUpcomingEvents,
  subscribeToPastEvents
} from '../services/db';
import { getCurrentUser } from '../services/auth';
import EventImageSlider from './EventImageSlider';

export default function EventsSection({ _onOpenLoginModal, onNavigateToTracker }) {
  const [activeSubTab, setActiveSubTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [upcomingEvents, setUpcomingEvents] = useState(getUpcomingEvents());
  const [pastEvents, setPastEvents] = useState(getPastEvents());

  const currentUser = getCurrentUser();

  // Registration modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [regForm, setRegForm] = useState(() => ({
    fullName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    rollNumber: '',
    branch: 'Computer Science & Engineering',
    year: '2nd Year',
    phone: ''
  }));
  const [regSuccess, setRegSuccess] = useState(null);

  useEffect(() => {
    const unsubEvents = subscribeToUpcomingEvents((events) => setUpcomingEvents(events));
    const unsubPast = subscribeToPastEvents((events) => setPastEvents(events));

    return () => {
      unsubEvents();
      unsubPast();
    };
  }, []);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!regForm.email.toLowerCase().endsWith('@klu.ac.in')) {
      alert('Event registration requires an official @klu.ac.in university email.');
      return;
    }

    const reg = registerForEvent({
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      eventDate: selectedEvent.date,
      eventTime: selectedEvent.time,
      eventVenue: selectedEvent.venue,
      ...regForm
    });

    setRegSuccess(reg);
  };

  return (
    <section className="section" id="events-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(0, 168, 232, 0.12)',
            border: '1px solid rgba(0, 168, 232, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.95rem',
            color: 'var(--primary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Calendar size={14} />
            <span>SCRS Event Hub & Winners Gallery</span>
          </div>
          <h2 className="section-title">Campus Hackathons & Tech Conferences</h2>
          <p className="section-description">
            Register for upcoming soft computing workshops or explore past national summits, photo highlights, and winner hall of fame.
          </p>

          {/* Sub-tab Navigation */}
          <div style={{
            display: 'inline-flex',
            gap: '0.5rem',
            background: 'var(--bg-card)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-light)',
            marginTop: '1.5rem'
          }}>
            <button
              className={`filter-btn ${activeSubTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('upcoming')}
              style={{
                padding: '0.55rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                background: activeSubTab === 'upcoming' ? 'var(--gradient-brand)' : 'transparent',
                color: activeSubTab === 'upcoming' ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              🚀 Upcoming Events ({upcomingEvents.length})
            </button>
            <button
              className={`filter-btn ${activeSubTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('past')}
              style={{
                padding: '0.55rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                background: activeSubTab === 'past' ? 'var(--gradient-brand)' : 'transparent',
                color: activeSubTab === 'past' ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              🏆 Past Events & Winners ({pastEvents.length})
            </button>
          </div>
        </div>

        {/* UPCOMING EVENTS GRID */}
        {activeSubTab === 'upcoming' && (
          upcomingEvents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '560px',
              marginInline: 'auto'
            }}>
              <Calendar size={48} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                No Upcoming Events Scheduled
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                There are currently no upcoming events or workshops posted. Check back soon or browse past summit highlights!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="glass-card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s ease, border-color 0.25s ease'
                  }}
                >
                  {/* Event Image Banner Slideshow */}
                  <div style={{ height: '200px', position: 'relative', overflow: 'hidden', background: 'var(--bg-primary)' }}>
                    <EventImageSlider
                      images={[evt.banner, ...(evt.photos || [])].filter(Boolean)}
                      height="200px"
                      title={evt.title}
                      borderRadius="0px"
                    />
                    <span style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: 'var(--bg-secondary)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--primary)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      zIndex: 4
                    }}>
                      {evt.category || 'Tech Event'}
                    </span>
                    <span style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#10b981',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '20px',
                      zIndex: 4
                    }}>
                      {evt.fee || 'Free'}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.65rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                      {evt.title}
                    </h3>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem', flexGrow: 1 }}>
                      {evt.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-dim)',
                      background: 'var(--bg-primary)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                        <Calendar size={15} />
                        <span>{evt.date} • {evt.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                        <MapPin size={15} color="#34d399" />
                        <span>{evt.venue}</span>
                      </div>
                    </div>

                    {evt.websiteUrl ? (
                      <a
                        href={evt.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <ExternalLink size={16} />
                        <span>Apply for Event</span>
                      </a>
                    ) : (
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
                        onClick={() => {
                          setSelectedEvent(evt);
                          setRegSuccess(null);
                        }}
                      >
                        <Ticket size={16} />
                        <span>Register for Event</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* PAST EVENTS & WINNERS SHOWCASE */}
        {activeSubTab === 'past' && (
          pastEvents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '560px',
              marginInline: 'auto'
            }}>
              <Trophy size={48} color="var(--accent-amber)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                No Past Events On Record
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                There are currently no concluded summits or past events in the archive.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {pastEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="glass-card past-event-card"
                  style={{
                    padding: '2rem',
                    borderRadius: 'var(--radius-xl)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div className="past-event-grid">
                    {/* Left Column: Event Details & Winners Hall of Fame */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                          <span className="badge-status accepted" style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem' }}>
                            Concluded Summit
                          </span>
                          <span style={{
                            fontSize: '0.82rem',
                            color: 'var(--accent-cyan)',
                            background: 'rgba(56, 189, 248, 0.08)',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}>
                            <Calendar size={13} />
                            {evt.date}
                          </span>
                          <span style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-dim)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}>
                            <MapPin size={13} color="#34d399" />
                            {evt.venue}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                          {evt.title}
                        </h3>
                      </div>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                        {evt.summary}
                      </p>

                      {/* WINNERS HALL OF FAME PODIUM */}
                      {evt.winners && evt.winners.length > 0 && (
                        <div style={{
                          background: 'rgba(15, 23, 42, 0.55)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '1.25rem',
                          marginTop: '0.5rem'
                        }}>
                          <h4 style={{
                            fontSize: '0.95rem',
                            fontWeight: 800,
                            color: 'var(--accent-amber)',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <Trophy size={18} color="var(--accent-amber)" />
                            <span>Winners Hall of Fame & Awardees</span>
                          </h4>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                            {evt.winners.map((w, wIdx) => (
                              <div
                                key={wIdx}
                                style={{
                                  background: wIdx === 0 ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-primary)',
                                  border: wIdx === 0 ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--border-subtle)',
                                  borderRadius: 'var(--radius-md)',
                                  padding: '1rem'
                                }}
                              >
                                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: wIdx === 0 ? '#fbbf24' : 'var(--text-main)', marginBottom: '0.25rem' }}>
                                  {w.rank}
                                </div>
                                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                                  {w.name}
                                </div>
                                {w.members && (
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                                    {w.members}
                                  </div>
                                )}
                                <div style={{ fontSize: '0.82rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.45rem' }}>
                                  {w.project}
                                </div>
                                {w.prize && (
                                  <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.15rem 0.5rem', borderRadius: '8px', fontWeight: 700 }}>
                                    {w.prize}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Contained, Attractive Photo Gallery */}
                    <div className="past-event-media-panel">
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.65)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1rem',
                        boxShadow: 'var(--shadow-md)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                            <Sparkles size={14} color="var(--primary)" />
                            <span>Event Highlights</span>
                          </h4>
                          <span style={{
                            fontSize: '0.72rem',
                            color: 'var(--accent-cyan)',
                            background: 'rgba(0, 168, 232, 0.1)',
                            border: '1px solid rgba(0, 168, 232, 0.25)',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '10px',
                            fontWeight: 700
                          }}>
                            {[evt.banner, ...(evt.photos || [])].filter(Boolean).length} Photos
                          </span>
                        </div>

                        <EventImageSlider
                          images={[evt.banner, ...(evt.photos || [])].filter(Boolean)}
                          height="220px"
                          title={evt.title}
                          borderRadius="var(--radius-md)"
                          showThumbnails={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* EVENT REGISTRATION MODAL */}
        {selectedEvent && (
          <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
            <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Event Registration</h3>
                  <p style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '0.15rem' }}>
                    {selectedEvent.title}
                  </p>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedEvent(null)}>
                  <XCircle size={20} />
                </button>
              </div>

              {!regSuccess ? (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="modal-body">
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.25rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)'
                    }}>
                      <div><strong>Date:</strong> {selectedEvent.date} ({selectedEvent.time})</div>
                      <div><strong>Venue:</strong> {selectedEvent.venue}</div>
                      <div><strong>Pass Fee:</strong> <span style={{ color: '#34d399', fontWeight: 700 }}>{selectedEvent.fee}</span></div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-name">Full Name</label>
                      <input
                        id="reg-name"
                        type="text"
                        className="form-input"
                        placeholder="Enter student full name"
                        value={regForm.fullName}
                        onChange={(e) => setRegForm(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-email">University Email (@klu.ac.in)</label>
                      <input
                        id="reg-email"
                        type="email"
                        className="form-input"
                        placeholder="student.roll@klu.ac.in"
                        value={regForm.email}
                        onChange={(e) => setRegForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-roll">Roll Number</label>
                        <input
                          id="reg-roll"
                          type="text"
                          className="form-input"
                          placeholder="e.g. 2300030018"
                          value={regForm.rollNumber}
                          onChange={(e) => setRegForm(prev => ({ ...prev, rollNumber: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-year">Academic Year</label>
                        <select
                          id="reg-year"
                          className="form-select"
                          value={regForm.year}
                          onChange={(e) => setRegForm(prev => ({ ...prev, year: e.target.value }))}
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="PG / M.Tech">PG / M.Tech</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-phone">Phone / WhatsApp Number</label>
                      <input
                        id="reg-phone"
                        type="text"
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={regForm.phone}
                        onChange={(e) => setRegForm(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedEvent(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.4rem' }}>
                      <CheckCircle size={16} />
                      <span>Confirm Registration</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* REGISTRATION SUCCESS CARD */
                <div className="modal-body" style={{ textAlign: 'center', paddingBlock: '1rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginInline: 'auto',
                    marginBottom: '1rem'
                  }}>
                    <CheckCircle size={32} />
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    Registration Confirmed!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                    Your seat for <strong>{regSuccess.eventTitle}</strong> is reserved.
                  </p>

                  <div style={{
                    background: 'rgba(11, 23, 46, 0.9)',
                    border: '1px dashed rgba(56, 189, 248, 0.4)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    textAlign: 'left',
                    marginBottom: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>
                      Event Entry Pass Code
                    </span>
                    <code style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)', fontWeight: 800, display: 'block', marginBlock: '0.2rem 0.6rem' }}>
                      {regSuccess.passId}
                    </code>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      <strong>Attendee:</strong> {regSuccess.fullName} ({regSuccess.rollNumber})
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={() => setSelectedEvent(null)}>
                      Done
                    </button>
                    {onNavigateToTracker && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setSelectedEvent(null);
                          onNavigateToTracker();
                        }}
                      >
                        View My Passes in Tracker
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
