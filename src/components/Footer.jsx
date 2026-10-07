import React from 'react';
import { Sparkles, MessageSquare, Mail, MapPin, Globe, Share2, Phone } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

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
            <div className="nav-brand" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
              <div className="brand-logo-icon">
                <Sparkles size={20} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>SCRS</span>
                <span style={{ fontSize: '0.65rem', marginLeft: '6px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', fontWeight: 700 }}>
                  STUDENT CHAPTER
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Soft Computing Research Society. Bridging academic research, theoretical algorithms, bleeding-edge engineering, and high-octane hackathons.
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
                <button onClick={() => onNavigate('home')} style={{ color: 'inherit' }}>
                  Overview & Tracks
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('roles-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  style={{ color: 'inherit' }}
                >
                  Wings & Roles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('apply')} style={{ color: 'inherit' }}>
                  Apply Online
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracker')} style={{ color: 'inherit' }}>
                  Track Application
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} style={{ color: 'inherit' }}>
                  Coordinator Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Wings */}
          <div>
            <h4 className="footer-col-title">Wings</h4>
            <ul className="footer-links-list">
              <li>Technical & Web Dev</li>
              <li>Creative Design & Media</li>
              <li>Events & Operations</li>
              <li>Public Relations & Outreach</li>
              <li>Corporate & Sponsorship</li>
              <li>Content & Editorial</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-col-title">Recruitment Desk</h4>
            <ul className="footer-links-list">
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Student Activity Center, Room 304</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                <span>recruitment@scrs-club.org</span>
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
                <span>8TH BLOCK,KALASALINGAM UNIVERSITY,TN-626126</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>scrs@klu.ac.in</span>
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
            © {CURRENT_YEAR} SCRS (Student Community & Research Society). Official Student Chapter at KL University. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Annual Recruitment Drive 2026-27</span>
            <span>•</span>
            <span>Powered by Firebase & Modern Web</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
