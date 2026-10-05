import React, { useState } from 'react';
import {
  X,
  AlertCircle,
  Building,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  User,
  KeyRound
} from 'lucide-react';
import { signInWithGoogleKlu, signInWithOrgEmailOnly, signInWithPasscode } from '../services/auth';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  // Active Login Mode: 'student' | 'admin'
  const [loginMode, setLoginMode] = useState('student');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Inputs
  const [orgEmail, setOrgEmail] = useState('');
  const [passcode, setPasscode] = useState('');

  // 1. Google Sign-In
  const handleGoogleLogin = async () => {
    setAuthError('');
    setIsLoading(true);
    try {
      const user = await signInWithGoogleKlu();
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      console.error(err);
      setAuthError(err.message || 'Google sign-in failed. Please verify popup settings or try email login.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Email Sign-In (@klu.ac.in)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!orgEmail.trim()) return;
    setAuthError('');
    setIsLoading(true);
    try {
      const user = await signInWithOrgEmailOnly(orgEmail);
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      console.error(err);
      setAuthError(err.message || 'Verification failed. Only official @klu.ac.in emails are allowed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Coordinator / Admin Passcode Sign-In
  const handlePasscodeSubmit = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setAuthError('');
    setIsLoading(true);
    try {
      const adminUser = await signInWithPasscode(passcode);
      onLoginSuccess(adminUser);
      onClose();
    } catch (err) {
      console.error(err);
      setAuthError(err.message || 'Invalid passcode. Please enter the valid coordinator passcode (scrs2026).');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: '440px',
          width: '90%',
          padding: 0,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: loginMode === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                color: loginMode === 'admin' ? 'var(--primary)' : '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {loginMode === 'admin' ? <ShieldCheck size={22} /> : <Building size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {loginMode === 'admin' ? 'Coordinator Admin Login' : 'SCRS Member Login'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: loginMode === 'admin' ? '#a5b4fc' : '#38bdf8', fontWeight: 600, margin: 0 }}>
                {loginMode === 'admin' ? 'Admin CMS & Recruitment Control' : 'University Account (@klu.ac.in)'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle: Student / Applicant vs Coordinator / Admin */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
          <button
            type="button"
            onClick={() => {
              setLoginMode('student');
              setAuthError('');
            }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: loginMode === 'student' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              border: 'none',
              borderBottom: loginMode === 'student' ? '2px solid #38bdf8' : '2px solid transparent',
              color: loginMode === 'student' ? '#38bdf8' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <User size={15} />
            <span>Applicant / Member</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMode('admin');
              setAuthError('');
            }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: loginMode === 'admin' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: loginMode === 'admin' ? '2px solid var(--primary)' : '2px solid transparent',
              color: loginMode === 'admin' ? '#a5b4fc' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <KeyRound size={15} />
            <span>Coordinator / Admin</span>
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.75rem', textAlign: 'center' }}>
          {/* Error Banner */}
          {authError && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                color: '#fda4af',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1.25rem',
                textAlign: 'left'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{authError}</span>
            </div>
          )}

          {/* MODE 1: STUDENT / APPLICANT */}
          {loginMode === 'student' && (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Sign in to view and track your recruitment status, test schedules, and personal candidate profile.
              </p>

              {/* Google Sign-in */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ background: '#fff', borderRadius: '50%', padding: '2px' }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isLoading ? 'Verifying...' : 'Sign in with @klu.ac.in'}</span>
              </button>

              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'var(--bg-secondary)',
                    padding: '0 8px',
                    fontSize: '0.72rem',
                    color: 'var(--text-dim)'
                  }}
                >
                  OR VERIFY WITH UNIVERSITY EMAIL
                </span>
              </div>

              {/* Direct university email form */}
              <form onSubmit={handleEmailSubmit}>
                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    University Email ID
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-dim)'
                      }}
                    />
                    <input
                      type="email"
                      required
                      placeholder="e.g. 2300030018@klu.ac.in"
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
                >
                  <span>Continue to Tracker</span>
                </button>
              </form>
            </div>
          )}

          {/* MODE 2: COORDINATOR / ADMIN */}
          {loginMode === 'admin' && (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Authorized coordinators and faculty advisors can unlock the central CMS dashboard below:
              </p>

              <form onSubmit={handlePasscodeSubmit}>
                <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Coordinator Master Passcode
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-dim)'
                      }}
                    />
                    <input
                      type="password"
                      required
                      placeholder="Enter passcode (default: scrs2026)"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
                      autoFocus
                    />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Default passcode: <code>scrs2026</code> or <code>admin</code>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}
                >
                  <span>Unlock Admin Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div style={{ position: 'relative', margin: '1rem 0' }}>
                <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'var(--bg-secondary)',
                    padding: '0 8px',
                    fontSize: '0.72rem',
                    color: 'var(--text-dim)'
                  }}
                >
                  OR
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}
              >
                Sign in with Official Admin Gmail
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
