import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  LogIn,
  LogOut,
  UserCheck,
  ShieldCheck,
  Calendar,
  Users,
  Briefcase,
  Search,
  Settings,
  Menu,
  X
} from 'lucide-react';
import clubLogo from '../assets/logo.jpg';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLoginModal,
  onSignOut
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleUserClick = () => {
    setIsMobileMenuOpen(false);
    if (!currentUser) {
      onOpenLoginModal();
    } else if (currentUser.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('tracker');
    }
  };

  const navTo = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        {/* Brand */}
        <div className="nav-brand" onClick={() => navTo('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-icon" style={{ padding: 0, overflow: 'hidden', borderRadius: '50%', background: 'transparent' }}>
            <img src={clubLogo} alt="SCRS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <div>
            <span>SCRS</span>
            <span className="brand-badge" style={{ marginLeft: '4px' }}>KARE</span>
          </div>
        </div>

        {/* Desktop Links */}
        <ul className="nav-links desktop-only">
          <li>
            <button
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => navTo('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => navTo('events')}
            >
              <Calendar size={15} style={{ marginRight: '4px' }} />
              <span>Events & Winners</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => navTo('team')}
            >
              <Users size={15} style={{ marginRight: '4px' }} />
              <span>Team</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'apply' ? 'active' : ''}`}
              onClick={() => navTo('apply')}
            >
              <Briefcase size={15} style={{ marginRight: '4px' }} />
              <span>Apply for Roles</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'tracker' ? 'active' : ''}`}
              onClick={() => navTo('tracker')}
            >
              <Search size={15} style={{ marginRight: '4px' }} />
              <span>My Status</span>
            </button>
          </li>

          {/* Admin Panel link */}
          {currentUser && currentUser.role === 'admin' && (
            <li>
              <button
                className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => navTo('admin')}
                style={{ color: '#fbbf24', fontWeight: 700 }}
              >
                <Settings size={15} style={{ marginRight: '4px' }} />
                <span>Admin Portal</span>
              </button>
            </li>
          )}
        </ul>

        {/* Actions & Mobile Toggle */}
        <div className="nav-actions">


          {/* AUTHENTICATION ACTION */}
          {!currentUser ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={onOpenLoginModal}
              style={{ padding: '0.45rem 1.15rem', fontSize: '0.88rem' }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleUserClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderColor: currentUser.role === 'admin' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(56, 189, 248, 0.5)',
                  background: currentUser.role === 'admin' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(56, 189, 248, 0.08)',
                  padding: '0.38rem 0.75rem'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: currentUser.role === 'admin' ? '#f59e0b' : 'var(--gradient-brand)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }} className="desktop-only">
                  {currentUser.displayName?.split(' ')[0]}
                </span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                onClick={onSignOut}
                title="Sign Out"
                style={{ padding: '0.4rem', color: '#fb7185' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              padding: '0.5rem',
              color: 'var(--text-main)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'none'
            }}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
            <li>
              <button
                className={`mobile-nav-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => navTo('home')}
              >
                🏠 Home
              </button>
            </li>
            <li>
              <button
                className={`mobile-nav-link ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => navTo('events')}
              >
                🚀 Events & Winners
              </button>
            </li>
            <li>
              <button
                className={`mobile-nav-link ${activeTab === 'team' ? 'active' : ''}`}
                onClick={() => navTo('team')}
              >
                👥 Team Coordinators
              </button>
            </li>
            <li>
              <button
                className={`mobile-nav-link ${activeTab === 'apply' ? 'active' : ''}`}
                onClick={() => navTo('apply')}
              >
                📝 Apply for Roles
              </button>
            </li>
            <li>
              <button
                className={`mobile-nav-link ${activeTab === 'tracker' ? 'active' : ''}`}
                onClick={() => navTo('tracker')}
              >
                🔍 My Status & Passes
              </button>
            </li>
            {currentUser && currentUser.role === 'admin' && (
              <li>
                <button
                  className={`mobile-nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                  onClick={() => navTo('admin')}
                  style={{ color: '#fbbf24', fontWeight: 800 }}
                >
                  🛡️ Admin Portal
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
