import React, { useState, useEffect } from 'react';
import ClubNavbar from './components/ClubNavbar';
import HeroOfficial from './components/HeroOfficial';
import HomeHighlights from './components/HomeHighlights';
import AboutSection from './components/AboutSection';
import PastEventsSection from './components/PastEventsSection';
import UpcomingEventsSection from './components/UpcomingEventsSection';
import TeamSection from './components/TeamSection';
import HiringSection from './components/HiringSection';
import ContactSection from './components/ContactSection';
import AdminCmsDashboard from './components/AdminCmsDashboard';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';

import { initFirebase } from './services/firebase';
import { getCurrentUser, subscribeToAuth, signOutParticipant } from './services/auth';
import { getClubCmsData, subscribeToClubData } from './services/clubCmsService';

export default function App() {
  // Navigation active tab: 'home' | 'about' | 'past-events' | 'upcoming-events' | 'team' | 'hiring' | 'contact' | 'admin'
  const [activeTab, setActiveTab] = useState('home');

  // Hiring specific sub-routing states
  const [hiringSubTab, setHiringSubTab] = useState('overview'); // 'overview' | 'roles' | 'apply' | 'tracker'
  const [selectedDomain, setSelectedDomain] = useState('');
  const [trackerQuery, setTrackerQuery] = useState('');

  // Authentication
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // Club CMS Dynamic Data
  const [cmsData, setCmsData] = useState(getClubCmsData());

  // Sync with URL Hash on Mount & Window hashchange
  useEffect(() => {
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

  // Update hash when tab changes
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    window.location.hash = `#${tabKey}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct trigger to Apply from anywhere on site
  const handleApplyClick = (domain = '') => {
    if (domain) setSelectedDomain(domain);
    setHiringSubTab('apply');
    setActiveTab('hiring');
    window.location.hash = '#hiring-apply';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct trigger to Track Application
  const handleTrackClick = (refId = '') => {
    if (refId) setTrackerQuery(refId);
    setHiringSubTab('tracker');
    setActiveTab('hiring');
    window.location.hash = '#hiring-tracker';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login success routing
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
      window.location.hash = '#admin';
    } else {
      setActiveTab('hiring');
      setHiringSubTab('tracker');
      window.location.hash = '#hiring-tracker';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOutParticipant();
    setCurrentUser(null);
    setActiveTab('home');
    window.location.hash = '#home';
  };

  return (
    <div className="app-root">
      {/* Sticky Official Navbar */}
      <ClubNavbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main>
        {/* 1. HOME SECTION */}
        {activeTab === 'home' && (
          <>
            <HeroOfficial
              homepageData={cmsData.homepage}
              onNavigate={handleTabChange}
            />
            <HomeHighlights
              homepageData={cmsData.homepage}
              upcomingEvents={cmsData.upcomingEvents}
              pastEvents={cmsData.pastEvents}
              teamMembers={cmsData.teamMembers}
              onNavigate={handleTabChange}
              onApplyClick={() => handleApplyClick()}
            />
          </>
        )}

        {/* 2. ABOUT SECTION */}
        {activeTab === 'about' && (
          <AboutSection
            aboutData={cmsData.aboutContent}
            onExploreEvents={() => handleTabChange('upcoming-events')}
            onJoinClick={() => handleApplyClick()}
          />
        )}

        {/* 3. PAST EVENTS SECTION */}
        {activeTab === 'past-events' && (
          <PastEventsSection
            pastEvents={cmsData.pastEvents}
          />
        )}

        {/* 4. UPCOMING EVENTS SECTION */}
        {activeTab === 'upcoming-events' && (
          <UpcomingEventsSection
            upcomingEvents={cmsData.upcomingEvents}
          />
        )}

        {/* 5. TEAM SECTION */}
        {activeTab === 'team' && (
          <TeamSection
            teamMembers={cmsData.teamMembers}
          />
        )}

        {/* 6. HIRING SECTION (Preserves & Integrates Existing Recruitment System) */}
        {activeTab === 'hiring' && (
          <HiringSection
            initialSubTab={hiringSubTab}
            initialDomain={selectedDomain}
            initialTrackerQuery={trackerQuery}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onNavigateToAdmin={() => handleTabChange('admin')}
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

      {/* Unified Login Modal for Organization Verification */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Modernized Official Footer */}
      <Footer onNavigate={handleTabChange} />
    </div>
  );
}
