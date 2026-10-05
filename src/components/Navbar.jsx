import React from 'react';
import {
  Sparkles,
  ArrowRight,
  LogIn,
  LogOut,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

import clubLogo from '../assets/logo.jpeg';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLoginModal,
  onSignOut
}) {
  const handleUserClick = () => {
    if (!currentUser) {
      onOpenLoginModal();
    } else if (currentUser.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('tracker');
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        {/* Brand */}
        <div className="nav-brand" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            className="brand-logo-icon"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#ffffff',
              border: '2px solid rgba(56, 189, 248, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <img src={clubLogo} alt="SCRS Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <span>SCRS</span>
            <span className="brand-badge" style={{ marginLeft: '4px' }}>HIRING</span>
          </div>
        </div>

        {/* Links */}
        <ul className="nav-links">
          <li>
            <button
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Overview
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('home');
                setTimeout(() => {
                  document.getElementById('roles-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
            >
              Wings & Roles
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'apply' ? 'active' : ''}`}
              onClick={() => setActiveTab('apply')}
            >
              Apply for Role
            </button>
          </li>

          {/* Contextual navigation link based on logged in role */}
          {currentUser && currentUser.role === 'admin' && (
            <li>
              <button
                className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
                style={{ color: '#fbbf24', fontWeight: 700 }}
              >
                Coordinator Panel
              </button>
            </li>
          )}

          {currentUser && currentUser.role !== 'admin' && (
            <li>
              <button
                className={`nav-link ${activeTab === 'tracker' ? 'active' : ''}`}
                onClick={() => setActiveTab('tracker')}
                style={{ color: '#38bdf8', fontWeight: 700 }}
              >
                My Status
              </button>
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          {/* Apply Shortcut */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('apply')}
            style={{ fontSize: '0.85rem' }}
          >
            <span>Apply</span>
            <ArrowRight size={13} />
          </button>

          {/* AUTHENTICATION ACTION: EITHER LOGIN BUTTON OR USER PROFILE */}
          {!currentUser ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={onOpenLoginModal}
              style={{ padding: '0.45rem 1.15rem', fontSize: '0.88rem' }}
            >
              <LogIn size={15} />
              <span>Login</span>
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
                  padding: '0.38rem 0.85rem'
                }}
                title={currentUser.role === 'admin' ? "Open Coordinator Admin Panel" : "Open Application Status"}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: currentUser.role === 'admin' ? '#f59e0b' : 'var(--gradient-brand)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'K'}
                </div>

                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  {currentUser.displayName || currentUser.email.split('@')[0]}
                </span>

                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '0.12rem 0.45rem',
                  borderRadius: '4px',
                  background: currentUser.role === 'admin' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(56, 189, 248, 0.25)',
                  color: currentUser.role === 'admin' ? '#fbbf24' : '#38bdf8'
                }}>
                  {currentUser.role === 'admin' ? 'Admin' : 'Applicant'}
                </span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                onClick={onSignOut}
                title="Sign Out"
                style={{ color: '#fb7185', padding: '0.4rem 0.55rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
