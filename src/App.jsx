import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HiringTracks from './components/HiringTracks';
import DomainsDirectory from './components/DomainsDirectory';
import TimelineAndFaq from './components/TimelineAndFaq';
import ApplicationForm from './components/ApplicationForm';
import StatusTracker from './components/StatusTracker';
import AdminPortal from './components/AdminPortal';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import { initFirebase } from './services/firebase';
import { getCurrentUser, subscribeToAuth, signOutParticipant } from './services/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'apply' | 'tracker' | 'admin'
  const [selectedDomain, setSelectedDomain] = useState('');
  const [trackerQuery, setTrackerQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    initFirebase();
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const handleApplyClick = (domain = '') => {
    if (domain) setSelectedDomain(domain);
    setActiveTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackClick = (refId = '') => {
    if (refId) setTrackerQuery(refId);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('tracker');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOutParticipant();
    setCurrentUser(null);
    setActiveTab('home');
  };

  return (
    <div className="app-root">
      {/* Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main>
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onApplyClick={() => handleApplyClick()}
              onTrackClick={() => handleTrackClick()}
            />

            {/* Coordinator Leadership Overview */}
            <HiringTracks
              onApplyClick={() => handleApplyClick()}
            />

            {/* Wings & Role Directory */}
            <DomainsDirectory
              onSelectDomainForApply={(domTitle) => handleApplyClick(domTitle)}
            />

            {/* Timeline & FAQs */}
            <TimelineAndFaq />
          </>
        )}

        {activeTab === 'apply' && (
          <ApplicationForm
            initialDomain={selectedDomain}
            onNavigateToTracker={(refId) => handleTrackClick(refId)}
          />
        )}

        {activeTab === 'tracker' && (
          <StatusTracker
            initialQuery={trackerQuery}
            onNavigateToApply={() => handleApplyClick()}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onNavigateToAdmin={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}
      </main>

      {/* Unified Login Modal with Auto-Routing */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
