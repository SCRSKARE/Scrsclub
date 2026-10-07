import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import ClubHome from './components/ClubHome';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

import { initFirebase } from './services/firebase';
import { purgeLegacySampleData } from './services/db';
import { getCurrentUser, subscribeToAuth, signOutParticipant } from './services/auth';

// Code-split heavy views for fast initial load
const EventsSection = lazy(() => import('./components/EventsSection'));
const TeamSection = lazy(() => import('./components/TeamSection'));
const RoleHiringPage = lazy(() => import('./components/RoleHiringPage'));
const StatusTracker = lazy(() => import('./components/StatusTracker'));
const AdminPortal = lazy(() => import('./components/AdminPortal'));

function SectionLoadingFallback() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      color: 'var(--text-muted, #94a3b8)',
      padding: '4rem 1rem'
    }}>
      <div style={{
        width: '42px',
        height: '42px',
        border: '3px solid rgba(56, 189, 248, 0.2)',
        borderTopColor: 'var(--primary, #38bdf8)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.03em' }}>
        Loading experience...
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  // Navigation active tab: 'home' | 'events' | 'team' | 'apply' | 'tracker' | 'admin'
  const [activeTab, setActiveTab] = useState('home');
  const [trackerQuery, setTrackerQuery] = useState('');
  const [selectedDomainForApply, setSelectedDomainForApply] = useState('');
  const [openFormForApply, setOpenFormForApply] = useState(false);

  // Authentication
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    purgeLegacySampleData();
    initFirebase();

    // Synchronize initial tab from URL hash
    const syncTabFromHash = () => {
      const rawHash = window.location.hash.replace('#', '').trim().toLowerCase();
      if (!rawHash) return;

      const [baseHash] = rawHash.split('?');

      if (['hiring', 'hiring-apply', 'apply-now', 'roles'].includes(baseHash)) {
        setActiveTab('apply');
      } else if (['tracker', 'hiring-tracker', 'status'].includes(baseHash)) {
        setActiveTab('tracker');
      } else if (['home', 'events', 'team', 'apply', 'tracker', 'admin'].includes(baseHash)) {
        setActiveTab(baseHash);
      }
    };

    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);

    const unsubAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
    });

    return () => {
      window.removeEventListener('hashchange', syncTabFromHash);
      unsubAuth();
    };
  }, []);

  const handleNavigate = (tab, options = {}) => {
    let targetId = null;
    let domain = '';
    let openForm = false;

    if (typeof options === 'string') {
      targetId = options;
    } else if (options && typeof options === 'object') {
      targetId = options.targetId || null;
      domain = options.domain || '';
      openForm = Boolean(options.openForm);
    }

    if (domain) {
      setSelectedDomainForApply(domain);
      setOpenFormForApply(true);
    } else if (openForm) {
      setOpenFormForApply(true);
    } else if (tab === 'apply') {
      setSelectedDomainForApply('');
      setOpenFormForApply(false);
    }

    setActiveTab(tab);
    window.location.hash = `#${tab}`;

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 120);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTrackClick = (refId = '') => {
    if (refId) setTrackerQuery(refId);
    handleNavigate('tracker');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      handleNavigate('admin');
    } else {
      handleNavigate('tracker');
    }
  };

  const handleSignOut = async () => {
    await signOutParticipant();
    setCurrentUser(null);
    handleNavigate('home');
  };

  return (
    <ErrorBoundary>
      <div className="app-root">
        {/* Sticky Official Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          currentUser={currentUser}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onSignOut={handleSignOut}
        />

        <main>
          {activeTab === 'home' && (
            <ClubHome
              onNavigate={handleNavigate}
            />
          )}

          <Suspense fallback={<SectionLoadingFallback />}>
            {activeTab === 'events' && (
              <EventsSection
                _onOpenLoginModal={() => setIsLoginModalOpen(true)}
                onNavigateToTracker={() => handleNavigate('tracker')}
              />
            )}

            {activeTab === 'team' && (
              <TeamSection
                onNavigateToApply={() => handleNavigate('apply')}
              />
            )}

            {activeTab === 'apply' && (
              <RoleHiringPage
                initialDomain={selectedDomainForApply}
                openFormDirectly={openFormForApply}
                onNavigateToTracker={(refId) => handleTrackClick(refId)}
              />
            )}

            {activeTab === 'tracker' && (
              <StatusTracker
                initialQuery={trackerQuery}
                onNavigateToApply={() => handleNavigate('apply')}
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
                onNavigateToAdmin={() => handleNavigate('admin')}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPortal
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
              />
            )}
          </Suspense>
        </main>

        {/* Organization / Student Auth Verification Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>
    </ErrorBoundary>
  );
}
