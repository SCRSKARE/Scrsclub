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
import { purgeLegacySampleData } from './services/db';
import { getCurrentUser, subscribeToAuth, signOutParticipant } from './services/auth';
import { getClubCmsData, subscribeToClubData } from './services/clubCmsService';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'apply' | 'tracker' | 'admin'
  const [selectedDomain, setSelectedDomain] = useState('');
  const [trackerQuery, setTrackerQuery] = useState('');

  // Authentication
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [selectedDomainForApply, setSelectedDomainForApply] = useState('');
  const [openFormForApply, setOpenFormForApply] = useState(false);

  // Club CMS Dynamic Data
  const [cmsData, setCmsData] = useState(getClubCmsData());

  // Sync with URL Hash on Mount & Window hashchange
  useEffect(() => {
    purgeLegacySampleData();
    initFirebase();

    const handleHashSync = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash) return;

      if (hash.startsWith('hiring-apply')) {
        setActiveTab('hiring');
        setHiringSubTab('apply');
      } else if (hash.startsWith('hiring-tracker')) {
        setActiveTab('hiring');
        setHiringSubTab('tracker');
      } else if (hash.startsWith('hiring-roles')) {
        setActiveTab('hiring');
        setHiringSubTab('roles');
      } else if (['home', 'about', 'past-events', 'upcoming-events', 'team', 'hiring', 'contact', 'admin'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);

    // Auth subscription
    const unsubAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
    });

    // Club CMS subscription
    const unsubCms = subscribeToClubData((data) => {
      setCmsData(data);
    });

    return () => {
      window.removeEventListener('hashchange', handleHashSync);
      unsubAuth();
      unsubCms();
    };
  }, []);

  const handleApplyClick = (domain = '') => {
    if (domain) setSelectedDomain(domain);
    setActiveTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct trigger to Track Application
  const handleTrackClick = (refId = '') => {
    if (refId) setTrackerQuery(refId);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login success routing
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('tracker');
    }
  };

  const handleSignOut = async () => {
    await signOutParticipant();
    setCurrentUser(null);
    setActiveTab('home');
  };

  return (
    <div className="app-root">
      {/* Sticky Official Navbar */}
      <ClubNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main>
        {/* 1. HOME SECTION */}
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

        {/* 7. CONTACT SECTION */}
        {activeTab === 'contact' && (
          <ContactSection
            contactInfo={cmsData.contactInfo}
          />
        )}

        {/* 8. ADMIN DASHBOARD & CMS */}
        {activeTab === 'admin' && (
          <AdminCmsDashboard
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onNavigateToWebsite={handleTabChange}
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
