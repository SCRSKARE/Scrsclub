import React from 'react';
import {
  Sparkles,
  Mail,
  MapPin,
  Phone,
  Globe,
  Share2,
  MessageSquare,
  Lock,
  Shield,
  Calendar,
  Users
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(8, 12, 21, 0.95)', padding: '4rem 0 2rem 0' }}>
      <div className="container">
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Column */}
          <div>
            <div
              className="nav-brand"
              style={{ marginBottom: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              onClick={() => onNavigate('home')}
            >
              <div
                className="brand-logo-icon"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>SCRS</span>
                <span style={{ fontSize: '0.65rem', marginLeft: '6px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontWeight: 700 }}>
                  OFFICIAL
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Student Community & Research Society at KL University. Bridging academic research, bleeding-edge engineering, and high-octane hackathons.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: '34px', height: '34px', padding: 0 }}
                aria-label="GitHub Community"
              >
                <Globe size={15} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: '34px', height: '34px', padding: 0 }}
                aria-label="LinkedIn"
              >
                <Share2 size={15} />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: '34px', height: '34px', padding: 0 }}
                aria-label="Discord"
              >
                <MessageSquare size={15} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Official Website
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                >
                  About the Club
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('past-events')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                >
                  Past Events & Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('upcoming-events')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                >
                  Upcoming Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('team')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                >
                  Our Team & Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Hiring / Recruitment Portal */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hiring Portal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <button
                  onClick={() => onNavigate('hiring')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                >
                  Recruitment Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hiring')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                >
                  Wings & Roles Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hiring')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                >
                  Submit Application
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hiring')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                >
                  Track Application Status
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Campus Headquarters
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Room 304, Student Activity Center (SAC), KL University, Vaddeswaram, AP 522502</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>scrs@klu.ac.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#10b981" style={{ flexShrink: 0 }} />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            © {new Date().getFullYear()} SCRS (Student Community & Research Society). Official Student Chapter at KL University. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Designed for Innovation & Research</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
