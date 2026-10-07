import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('scrs_last_active_tab');
    } catch {
      // ignore storage access errors
    }
    window.location.hash = '#home';
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-main, #070b14)',
          color: '#f8fafc',
          padding: '2rem',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: 'var(--bg-card, #0f172a)',
            border: '1px solid var(--border-light, rgba(255, 255, 255, 0.1))',
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <AlertTriangle size={28} color="#ef4444" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Something unexpected occurred
            </h2>

            <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              The portal encountered a temporary issue. Your saved applications and data remain safe.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  background: 'var(--primary, #0284c7)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Home size={16} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
