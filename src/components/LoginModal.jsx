import React, { useState } from 'react';
import { X, AlertCircle, Building } from 'lucide-react';
import { signInWithGoogleKlu } from '../services/auth';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setAuthError('');
    setIsLoading(true);
    try {
      const user = await signInWithGoogleKlu();
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      console.error(err);
      setAuthError(err.message || 'Google sign-in failed. Please try again.');
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
        <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                SCRS Member Login
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, margin: 0 }}>
                Google Account (@klu.ac.in)
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.75rem', textAlign: 'center' }}>
          {authError && (
            <div style={{
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
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{authError}</span>
            </div>
          )}

          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Sign in securely with your official KLU Google account to view your recruitment status and access authorized administration tools.
          </p>

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
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
            }}
          >
            <span>{isLoading ? 'Verifying...' : 'Continue with Google'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
