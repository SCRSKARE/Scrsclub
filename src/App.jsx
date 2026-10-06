import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ClubHome from './components/ClubHome';
import RoleHiringPage from './components/RoleHiringPage';
import EventsSection from './components/EventsSection';
import TeamSection from './components/TeamSection';
import StatusTracker from './components/StatusTracker';
import AdminPortal from './components/AdminPortal';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import { initFirebase } from './services/firebase';
import { purgeLegacySampleData } from './services/db';
import { getCurrentUser, subscribeToAuth, signOutParticipant } from './services/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'events' | 'team' | 'apply' | 'tracker' | 'admin'
  const [trackerQuery, setTrackerQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [selectedDomainForApply, setSelectedDomainForApply] = useState('');
  const [openFormForApply, setOpenFormForApply] = useState(false);

  useEffect(() => {
    purgeLegacySampleData();
    initFirebase();
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
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
    <div className="app-root">
      {/* Sticky Navigation */}
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

        {activeTab === 'events' && (
          <EventsSection
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
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
      </main>

      {/* Unified Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
