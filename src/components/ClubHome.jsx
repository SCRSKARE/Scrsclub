import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Briefcase,
  ArrowRight,
  Trophy,
  BookOpen,
  Code,
  ExternalLink,
  User
} from 'lucide-react';
import clubLogo from '../assets/logo.jpg';
import {
  getUpcomingEvents,
  getPastEvents,
  getTeamMembers,
  subscribeToUpcomingEvents,
  subscribeToPastEvents,
  subscribeToTeamMembers
} from '../services/db';
import EventImageSlider from './EventImageSlider';

export default function ClubHome({ onNavigate }) {
  const [upcomingEvents, setUpcomingEvents] = useState(getUpcomingEvents());
  const [pastEvents, setPastEvents] = useState(getPastEvents());
  const [teamMembers, setTeamMembers] = useState(getTeamMembers());

  useEffect(() => {
    const unsubEvents = subscribeToUpcomingEvents((events) => setUpcomingEvents(events));
    const unsubPast = subscribeToPastEvents((events) => setPastEvents(events));
    const unsubTeam = subscribeToTeamMembers((team) => setTeamMembers(team));

    return () => {
      unsubEvents();
      unsubPast();
      unsubTeam();
    };
  }, []);

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-content">
          {/* Logo Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-glow)',
            borderRadius: 'var(--radius-full)',
            padding: '0.4rem 1.25rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={clubLogo} alt="SCRS Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
              SOFT COMPUTING RESEARCH SOCIETY • KARE STUDENT CHAPTER
            </span>
          </div>

          <h1 className="hero-title">
            Empowering Innovation in <br />
            <span className="gradient-text">Soft Computing & Artificial Intelligence</span>
          </h1>

          <p className="hero-subtitle">
            The premier research and technical community at KARE. We build intelligent algorithms, organize national hackathons, publish student research, and engineer campus-defining software.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('events')}
            >
              <Calendar size={18} />
              <span>Explore Events & Winners</span>
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('apply')}
            >
              <Briefcase size={18} color="var(--primary)" />
              <span>Apply for Club Roles</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats-grid">
            <div className="stat-item">
              <div className="stat-number">400+</div>
              <div className="stat-label">Active Student Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">National Hackathons</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5</div>
              <div className="stat-label">Core Technical Wings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₹1.5L+</div>
              <div className="stat-label">Prizes & Grants Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT & MISSION SECTION */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderBlock: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">About SCRS KARE</span>
            <h2 className="section-title">Driving Research & Student Tech Leadership</h2>
            <p className="section-description">
              SCRS brings together students across Computer Science, IT, Electronics, and AI engineering to solve real-world computational challenges.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(0, 168, 232, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Code size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Technical & Web Innovation
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Engineering live university portals, automated judge bots, open-source repositories, and modern web platforms for campus events.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Soft Computing & AI Research
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Conducting workshops on Neural Networks, Fuzzy Logic, Genetic Algorithms, PySpark, and deep learning architectures.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Trophy size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                National Hackathons & Fests
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Organizing high-energy campus hackathons, design sprints, alumni talk series, and industry sponsor conclaves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED UPCOMING EVENTS PREVIEW */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span className="section-eyebrow">🚀 Live Campus Drives</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Upcoming Events</h2>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('events')}
              style={{ fontWeight: 700 }}
            >
              <span>View All Events</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {upcomingEvents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '560px',
              marginInline: 'auto'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
                No live campus drives or workshops currently scheduled. Stay tuned for new announcements!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {upcomingEvents.slice(0, 2).map(evt => (
                <div key={evt.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '190px', position: 'relative' }}>
                    <EventImageSlider
                      images={[evt.banner, ...(evt.photos || [])].filter(Boolean)}
                      height="190px"
                      title={evt.title}
                      borderRadius="0px"
                    />
                    <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '12px', border: '1px solid var(--border-light)', zIndex: 4 }}>
                      {evt.category}
                    </span>
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{evt.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem', flexGrow: 1 }}>{evt.description}</p>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '1rem' }}>
                      📅 {evt.date} • {evt.venue}
                    </div>
                    {evt.websiteUrl ? (
                      <a
                        href={evt.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}
                      >
                        <span>Apply for Event</span>
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => onNavigate('events')}>
                        <span>Register Now</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PAST EVENTS & HIGHLIGHTS ON HOME PAGE */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderBlock: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span className="section-eyebrow">🏆 Concluded Summits & Highlights</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Past Events & Winners</h2>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('events')}
              style={{ fontWeight: 700 }}
            >
              <span>Explore All Past Summits</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {pastEvents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '560px',
              marginInline: 'auto'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
                No past summits on record yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {pastEvents.slice(0, 2).map(evt => (
                <div key={evt.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <EventImageSlider
                    images={[evt.banner, ...(evt.photos || [])].filter(Boolean)}
                    height="210px"
                    title={evt.title}
                    borderRadius="0px"
                  />
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.4rem', fontWeight: 600 }}>
                      📅 {evt.date} • 📍 {evt.venue}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                      {evt.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem', flexGrow: 1 }}>
                      {evt.summary}
                    </p>

                    {/* Winners preview */}
                    {evt.winners && evt.winners.length > 0 && (
                      <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                          🥇 Winners Hall of Fame
                        </div>
                        {evt.winners.slice(0, 2).map((w, wIdx) => (
                          <div key={wIdx} style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {w.rank}: {w.name} ({w.project})
                          </div>
                        ))}
                      </div>
                    )}

                    <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => onNavigate('events')}>
                      <span>View Event Gallery & Highlights</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TEAM LEADERSHIP PREVIEW ON HOME PAGE */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderBlock: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span className="section-eyebrow">👥 Club Leadership</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Meet Our Coordinators</h2>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('team')}
              style={{ fontWeight: 700 }}
            >
              <span>View Full Team Directory</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {teamMembers.slice(0, 4).map(member => (
              <div key={member.id} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginInline: 'auto',
                  marginBottom: '1rem',
                  border: '2px solid var(--primary)',
                  boxShadow: '0 0 15px var(--primary-glow)',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <User size={36} color="var(--primary)" />
                  )}
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {member.name}
                </h4>
                <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {member.role}
                </p>
                <span className="skill-tag" style={{ fontSize: '0.72rem', padding: '0.15rem 0.6rem' }}>
                  {member.domain}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECRUITMENT CALLOUT BANNER */}
      <section className="section" style={{ paddingBlock: '3.5rem' }}>
        <div className="container">
          <div style={{
            background: 'var(--gradient-brand)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            color: '#ffffff',
            boxShadow: 'var(--shadow-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.18)', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem' }}>
                <Sparkles size={14} />
                <span>SCRS Hiring Drive 2026-27</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>
                Build Your Leadership Legacy as a Club Coordinator
              </h2>
              <p style={{ fontSize: '0.98rem', opacity: 0.95, lineHeight: 1.6 }}>
                Apply for Technical & Web Dev, Events & Operations, Creative Media, Corporate & Sponsorship, or PR Coordinator positions.
              </p>
            </div>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('apply')}
              style={{ background: '#ffffff', color: '#0b2545', fontWeight: 800, padding: '0.9rem 2rem' }}
            >
              <span>Apply for Roles</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
