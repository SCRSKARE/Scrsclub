import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Shield, Clock, Search } from 'lucide-react';

export default function Hero({ onApplyClick, onTrackClick }) {
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 20 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="container hero-content">
        {/* Status Pill */}
        <div className="hero-pill-badge">
          <span className="pulse-dot" style={{ backgroundColor: '#10b981' }}></span>
          <span>Annual Coordinator Recruitment 2026-27 is LIVE</span>
        </div>

        {/* Heading */}
        <h1 className="hero-title">
          Lead Innovation. <br />
          <span className="gradient-text">Shape Campus Culture.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Join <strong>SCRS</strong> (Student Community & Research Society) as a <strong>Club Coordinator</strong>.
          Take ownership of high-impact initiatives, lead specialized teams, and architect the next generation of tech and creative experiences.
        </p>

        {/* Unified Call to Action */}
        <div className="hero-cta-group">
          <button
            className="btn btn-primary btn-lg"
            onClick={onApplyClick}
            style={{ fontSize: '1.1rem', padding: '0.95rem 2.2rem' }}
          >
            <Shield size={20} />
            <span>Apply for Role</span>
            <ArrowRight size={18} />
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={onTrackClick}
          >
            <Search size={18} />
            <span>Track Application</span>
          </button>
        </div>

        {/* Deadline Notice */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          padding: '0.5rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '3.5rem',
          fontSize: '0.88rem',
          color: 'var(--text-muted)'
        }}>
          <Clock size={15} color="var(--primary)" />
          <span>Application Window Closes In:</span>
          <strong style={{ color: 'var(--text-main)', letterSpacing: '0.04em' }}>
            {timeLeft.days}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
          </strong>
        </div>

        {/* Stats Grid */}
        <div className="hero-stats-grid">
          <div className="stat-item">
            <div className="stat-number">6</div>
            <div className="stat-label">Specialized Wings</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">12+</div>
            <div className="stat-label">Coordinator Roles</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">400+</div>
            <div className="stat-label">Alumni Network</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Leadership Ownership</div>
          </div>
        </div>
      </div>
    </section>
  );
}
