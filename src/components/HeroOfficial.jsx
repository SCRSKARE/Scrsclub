import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Calendar,
  Users,
  Compass,
  Award,
  BookOpen,
  ChevronDown
} from 'lucide-react';

import clubLogo from '../assets/logo.jpeg';

export default function HeroOfficial({ homepageData, onNavigate }) {
  const heroBadge = homepageData?.heroBadge || 'Soft Computing Research Society • Student Chapter';
  const heroHeadline = homepageData?.heroHeadline || 'Empowering Minds, Engineering Solutions & Fostering Research';
  const heroSubtitle = homepageData?.heroSubtitle ||
    'The premier technical and computing research community. We bridge the gap between academic theory, bleeding-edge engineering, and real-world impact through national hackathons, workshops, and publications.';

  const stats = homepageData?.stats || {
    members: '500+',
    events: '45+',
    papers: '18+',
    awards: '25+'
  };

  return (
    <section className="hero" style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '4rem', paddingBottom: '3rem' }}>
      <div className="container hero-content" style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
        {/* Official Club Emblem */}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '92px',
              height: '92px',
              borderRadius: '50%',
              padding: '4px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.8) 0%, rgba(99, 102, 241, 0.6) 100%)',
              boxShadow: '0 0 35px rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#ffffff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={clubLogo} alt="SCRS Official Emblem" style={{ width: '92%', height: '92%', objectFit: 'contain' }} />
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div className="hero-pill-badge" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
          <span className="pulse-dot" style={{ backgroundColor: '#10b981' }}></span>
          <span>{heroBadge}</span>
        </div>

        {/* Club Heading */}
        <h1
          className="hero-title"
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}
        >
          {heroHeadline.includes('&') ? (
            <>
              {heroHeadline.split('&')[0]} & <br />
              <span className="gradient-text">{heroHeadline.split('&')[1]}</span>
            </>
          ) : (
            <span className="gradient-text">{heroHeadline}</span>
          )}
        </h1>

        {/* Subtitle */}
        <p
          className="hero-subtitle"
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            maxWidth: '820px',
            margin: '0 auto 2.5rem auto'
          }}
        >
          {heroSubtitle}
        </p>

        {/* Main Action Buttons */}
        <div
          className="hero-cta-group"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3.5rem'
          }}
        >
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('upcoming-events')}
            style={{ fontSize: '1rem', padding: '0.85rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Calendar size={18} />
            <span>View Events</span>
            <ArrowRight size={16} />
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('team')}
            style={{ fontSize: '1rem', padding: '0.85rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Users size={18} />
            <span>Meet the Team</span>
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('about')}
            style={{ fontSize: '1rem', padding: '0.85rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Compass size={18} />
            <span>About the Club</span>
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1.25rem',
            padding: '1.75rem',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-light)',
            backdropFilter: 'blur(16px)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              {stats.members}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Members
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#06b6d4', fontFamily: 'var(--font-heading)' }}>
              {stats.events}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Events & Bootcamps
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#a855f7', fontFamily: 'var(--font-heading)' }}>
              {stats.papers}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Research Publications
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-heading)' }}>
              {stats.awards}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hackathon Trophies
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
