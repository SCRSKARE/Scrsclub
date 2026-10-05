import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function HomeHighlights({
  homepageData,
  upcomingEvents = [],
  pastEvents = [],
  teamMembers = [],
  onNavigate,
  onApplyClick
}) {
  const featuredUpcoming = upcomingEvents[0];
  const featuredPast = pastEvents[0];
  const coreLeaders = teamMembers.filter(m => m.isCore).slice(0, 3);

  return (
    <div className="home-highlights" style={{ paddingBottom: '5rem' }}>
      <div className="container">
        {/* Intro narrative box */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            background: 'linear-gradient(135deg, rgba(18, 26, 44, 0.85) 0%, rgba(10, 15, 28, 0.95) 100%)',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '4.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ maxWidth: '850px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={16} />
              <span>Who We Are</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', lineHeight: 1.3 }}>
              {homepageData?.introTitle || 'Pioneering Computing, Innovation & Technical Leadership'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {homepageData?.introText ||
                'Founded with the mission to elevate student research and technical excellence, SCRS (Student Community & Research Society) organizes national-level hackathons, AI conclaves, hands-on bootcamps, and peer research initiatives. Whether you are passionate about Deep Learning, Systems Engineering, UI/UX, or Event Leadership, SCRS is the launchpad for your ambitions.'}
            </p>

            <button
              className="btn btn-secondary"
              onClick={() => onNavigate('about')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>Read Full Club Story & Faculty Vision</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* 1. Upcoming Event Highlight */}
        {featuredUpcoming && (
          <div style={{ marginBottom: '4.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#06b6d4', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Calendar size={15} />
                  <span>Next Flagship Gathering</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Upcoming Event Spotlight</h3>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => onNavigate('upcoming-events')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}
              >
                <span>View All Upcoming Events</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                background: 'var(--bg-card)'
              }}
            >
              <div style={{ position: 'relative', minHeight: '260px', background: '#090e1a' }}>
                <img
                  src={featuredUpcoming.bannerUrl}
                  alt={featuredUpcoming.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(6, 182, 212, 0.25)',
                    color: '#38bdf8',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  {featuredUpcoming.category || 'Featured'}
                </div>
              </div>

              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="pulse-dot" style={{ backgroundColor: '#10b981' }}></span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                    Registrations Live
                  </span>
                </div>
                <h4 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
                  {featuredUpcoming.title}
                </h4>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="var(--primary)" />
                    <span>{featuredUpcoming.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} color="#06b6d4" />
                    <span>{featuredUpcoming.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={15} color="#a855f7" />
                    <span>{featuredUpcoming.venue}</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {featuredUpcoming.description}
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {featuredUpcoming.registrationLink ? (
                    <a
                      href={featuredUpcoming.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <span>Register for Event</span>
                      <ExternalLink size={16} />
                    </a>
                  ) : null}

                  <button
                    className="btn btn-secondary"
                    onClick={() => onNavigate('upcoming-events')}
                  >
                    Event Details & Agenda
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Recent Past Event Highlight */}
        {featuredPast && (
          <div style={{ marginBottom: '4.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Trophy size={15} />
                  <span>Recent Glory</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Past Event Highlight</h3>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => onNavigate('past-events')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}
              >
                <span>Explore All Past Events & Winners</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                background: 'var(--bg-card)'
              }}
            >
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 'fit-content',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase'
                  }}
                >
                  {featuredPast.category || 'Concluded Event'}
                </span>
                <h4 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
                  {featuredPast.title}
                </h4>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="var(--primary)" />
                    <span>{featuredPast.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={15} color="#10b981" />
                    <span>{featuredPast.attendance}</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {featuredPast.shortDescription || featuredPast.fullDescription}
                </p>

                {featuredPast.winners && featuredPast.winners.length > 0 && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}
                  >
                    <Trophy size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600 }}>
                      Grand Winner: {featuredPast.winners[0].name} ({featuredPast.winners[0].prize})
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-secondary"
                  onClick={() => onNavigate('past-events')}
                  style={{ width: 'fit-content' }}
                >
                  View Event Recap & Photos
                </button>
              </div>

              <div style={{ position: 'relative', minHeight: '260px', background: '#090e1a' }}>
                <img
                  src={featuredPast.bannerUrl}
                  alt={featuredPast.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Team Preview */}
        {coreLeaders.length > 0 && (
          <div style={{ marginBottom: '4.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Users size={15} />
                  <span>Leadership</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Executive Team Preview</h3>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => onNavigate('team')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}
              >
                <span>View Full Team Directory</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {coreLeaders.map(leader => (
                <div
                  key={leader.id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <img
                    src={leader.photoUrl}
                    alt={leader.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--primary)'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                      {leader.name}
                    </h4>
                    <div style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {leader.designation}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {leader.wing}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Hiring / Recruitment Section Preview Banner */}
        <div
          className="card"
          style={{
            padding: '3rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              <span className="pulse-dot" style={{ backgroundColor: '#10b981' }}></span>
              Recruitment 2026-27 is LIVE
            </div>

            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', lineHeight: 1.25 }}>
              Lead Innovation. <br />
              <span className="gradient-text">Shape Campus Culture.</span>
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              We are recruiting Student Coordinators across Technical & Web Dev, Creative Media, Events & Operations,
              PR & Sponsorship, and AI/ML Research wings. Take ownership and build your leadership portfolio.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={onApplyClick}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
              >
                <Shield size={18} />
                <span>Apply for Coordinator Role</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigate('hiring')}
                style={{ fontSize: '1rem' }}
              >
                View Roles & Eligibility
              </button>
            </div>
          </div>

          <div
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recruitment Highlights
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>6 Specialized Wings</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tech, Research, Design, Operations, PR & Corporate</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4', marginTop: '6px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Live Application Tracker</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Track review status, interview schedule & scores online</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginTop: '6px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Official University Recognition</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Certificate of Leadership signed by Faculty Advisor & SAC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
