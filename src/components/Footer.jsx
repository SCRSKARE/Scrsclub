import React from 'react';
import { Sparkles, MessageSquare, Mail, MapPin, Globe, Share2 } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="nav-brand" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
              <div className="brand-logo-icon">
                <Sparkles size={20} color="#ffffff" />
              </div>
              <div>
                <span>SCRS</span>
                <span className="brand-badge" style={{ marginLeft: '4px' }}>HIRING</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Student Community & Research Society. Empowering student innovators, engineers, creators, and organizers to build campus-defining experiences.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: '36px', height: '36px', padding: 0 }}
                aria-label="GitHub Community"
              >
                <Globe size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: '36px', height: '36px', padding: 0 }}
                aria-label="LinkedIn"
              >
                <Share2 size={16} />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: '36px', height: '36px', padding: 0 }}
                aria-label="Discord Server"
              >
                <MessageSquare size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
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
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} SCRS Student Community & Research Society. All rights reserved.
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
