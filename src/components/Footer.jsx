import React from 'react';
import { Sparkles, MessageSquare, Mail, MapPin, Globe, Share2 } from 'lucide-react';
import clubLogo from '../assets/logo.jpg';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="nav-brand" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
              <div className="brand-logo-icon" style={{ padding: 0, overflow: 'hidden', borderRadius: '50%', background: '#fff' }}>
                <img src={clubLogo} alt="SCRS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <button type="button" onClick={() => onNavigate('home')}>
                  Home & Overview
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('events')}>
                  Campus Events & Winners
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('team')}>
                  Team Leadership & Faculty
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('apply', { targetId: 'roles-section' })}
                >
                  Wings & Open Roles
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('apply', { openForm: true })}
                >
                  Apply Online
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('tracker')}>
                  Track Application Status
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('admin')}>
                  Coordinator Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Wings & Role Specializations */}
          <div>
            <h4 className="footer-col-title">Wings & Roles</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('apply', { domain: 'Technical & Web Dev Coordinator' })}
                >
                  Technical & Web Dev
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('apply', { domain: 'Creative Design & Media Coordinator' })}
                >
                  Creative Design & Media
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('apply', { domain: 'Events & Operations Coordinator' })}
                >
                  Events & Operations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('apply', { domain: 'Public Relations & Outreach Coordinator' })}
                >
                  Public Relations & Outreach
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('apply', { domain: 'Corporate & Sponsorship Coordinator' })}
                >
                  Corporate & Sponsorship
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('apply', { domain: 'Content & Editorial Coordinator' })}
                >
                  Content & Editorial
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Desk */}
          <div>
            <h4 className="footer-col-title">Recruitment Desk</h4>
            <ul className="footer-links-list">
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>8401, 8th Block, Kalasalingam University</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                <a href="mailto:Scrs@klu.ac.in" style={{ color: 'inherit' }}>
                  Scrs@klu.ac.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} SCRS Student Community & Research Society. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
