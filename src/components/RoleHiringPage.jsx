import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import HiringTracks from './HiringTracks';
import DomainsDirectory from './DomainsDirectory';
import TimelineAndFaq from './TimelineAndFaq';
import ApplicationForm from './ApplicationForm';

export default function RoleHiringPage({
  onNavigateToTracker,
  initialDomain = '',
  openFormDirectly = false
}) {
  const [selectedDomain, setSelectedDomain] = useState(initialDomain || '');
  const [showFormDirectly, setShowFormDirectly] = useState(openFormDirectly || Boolean(initialDomain));

  useEffect(() => {
    if (initialDomain) {
      setSelectedDomain(initialDomain);
      setShowFormDirectly(true);
    } else if (openFormDirectly) {
      setShowFormDirectly(true);
    } else {
      setShowFormDirectly(false);
    }
  }, [initialDomain, openFormDirectly]);

  const handleApplyClick = (domain = '') => {
    if (domain) setSelectedDomain(domain);
    setShowFormDirectly(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="role-hiring-page">
      {!showFormDirectly ? (
        <>
          {/* Recruitment Hero */}
          <Hero
            onApplyClick={() => handleApplyClick()}
            onTrackClick={onNavigateToTracker}
          />

          {/* Hiring Leadership Overview */}
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
      ) : (
        <div style={{ paddingTop: '2rem' }}>
          <div className="container" style={{ marginBottom: '1.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowFormDirectly(false)}
            >
              ← Back to Role Directory
            </button>
          </div>
          <ApplicationForm
            initialDomain={selectedDomain}
            onNavigateToTracker={onNavigateToTracker}
          />
        </div>
      )}
    </div>
  );
}
