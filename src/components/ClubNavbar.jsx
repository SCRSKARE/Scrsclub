import React, { useState } from 'react';
import {
  Sparkles,
  Menu,
  X,
  Shield,
  ShieldCheck,
  User,
  LogIn,
  LogOut,
  ChevronRight,
  Calendar,
  Users,
  Lock
} from 'lucide-react';

import clubLogo from '../assets/logo.jpeg';

export default function ClubNavbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLoginModal,
  onSignOut
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabKey) => {
    setActiveTab(tabKey);
    setMobileMenuOpen(false);
    window.location.hash = `#${tabKey}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About' },
    { key: 'past-events', label: 'Past Events' },
    { key: 'upcoming-events', label: 'Upcoming Events' },
    { key: 'team', label: 'Team' },
    { key: 'hiring', label: 'Hiring', badge: 'LIVE' },
    { key: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1100, backdropFilter: 'blur(16px)', background: 'rgba(8, 12, 21, 0.85)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem' }}>
        {/* Brand Logo & Name */}
        <div
          className="nav-brand"
          onClick={() => handleNavClick('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <div
            className="brand-logo-icon"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(56, 189, 248, 0.6)',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <img
              src={clubLogo}
              alt="SCRS Official Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                SCRS
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(56, 189, 248, 0.18)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.35)'
                }}
              >
                STUDENT CHAPTER
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.02em', fontWeight: 600 }}>
              Soft Computing Research Society
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="nav-links" style={{ display: 'none', alignItems: 'center', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {navLinks.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <li key={item.key}>
                <button
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '9999px',
                        background: '#10b981',
                        color: '#fff',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Desktop Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`btn btn-secondary btn-sm ${activeTab === 'admin' ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    padding: '0.45rem 0.8rem',
                    borderColor: 'var(--primary)'
                  }}
                  title="Admin CMS Dashboard"
                >
                  <Lock size={13} color="var(--primary)" />
                  <span>Admin CMS</span>
                </button>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <User size={14} color="var(--primary)" />
                <span
                  style={{
                    fontSize: '0.825rem',
                    color: '#fff',
                    fontWeight: 600,
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={onSignOut}
                className="btn btn-secondary btn-sm"
                style={{
                  padding: '0.45rem',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f43f5e'
                }}
                title={`Signed in as ${currentUser.email}. Click to sign out.`}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="btn btn-primary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.875rem',
                padding: '0.45rem 1.15rem'
              }}
            >
              <LogIn size={15} />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: '#fff',
            cursor: 'pointer'
          }}
          className="mobile-hamburger-btn"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(10, 16, 28, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-light)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {navLinks.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : 'none',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontSize: '1rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '9999px',
                        background: '#10b981',
                        color: '#fff'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <ChevronRight size={16} color="var(--text-dim)" />
              </button>
            );
          })}

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.5rem 0' }} />

          {/* Login or User Status in Mobile */}
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleNavClick('admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: activeTab === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Lock size={16} color="var(--primary)" />
                  <span>Admin CMS Dashboard</span>
                </button>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.875rem', color: '#fff' }}>
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignOut();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f43f5e',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLoginModal();
              }}
              className="btn btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                fontSize: '0.95rem'
              }}
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
          )}
        </div>
      )}

      {/* Inline styles for responsive layout helper */}
      <style>{`
        @media (min-width: 992px) {
          .nav-links {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
