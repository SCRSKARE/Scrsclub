import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import HiringTracks from './HiringTracks';
import DomainsDirectory from './DomainsDirectory';
import TimelineAndFaq from './TimelineAndFaq';
import ApplicationForm from './ApplicationForm';
import StatusTracker from './StatusTracker';
import {
  Shield,
  Layers,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function HiringSection({
  initialSubTab = 'overview', // 'overview' | 'apply' | 'tracker' | 'roles'
  initialDomain = '',
  initialTrackerQuery = '',
  onOpenLoginModal,
  onNavigateToAdmin
}) {
  const [subTab, setSubTab] = useState(initialSubTab);
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [trackerQuery, setTrackerQuery] = useState(initialTrackerQuery);

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (initialDomain) {
      setSelectedDomain(initialDomain);
    }
  }, [initialDomain]);

  useEffect(() => {
    if (initialTrackerQuery) {
      setTrackerQuery(initialTrackerQuery);
    }
  }, [initialTrackerQuery]);

  const handleApplyClick = (domain = '') => {
    if (domain) setSelectedDomain(domain);
    setSubTab('apply');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleTrackClick = (refId = '') => {
    if (refId) setTrackerQuery(refId);
    setSubTab('tracker');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <section id="hiring" style={{ padding: '3.5rem 0 5rem 0', minHeight: '85vh' }}>
      <div className="container">
        {/* Section Header / Portal Intro */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              fontSize: '0.825rem',
              fontWeight: 700,
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <span className="pulse-dot" style={{ backgroundColor: '#10b981' }}></span>
            <span>Official Coordinator Recruitment 2026-27</span>
          </div>

          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            SCRS <span className="gradient-text">Hiring Portal</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Become a core driver of technical workshops, research symposia, and flagship hackathons.
            Browse roles across 6 specialized wings, submit your application, or check your live interview status.
          </p>
        </div>

        {/* Sub-Navigation Navigation Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '3rem'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-light)',
              backdropFilter: 'blur(16px)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <button
              onClick={() => setSubTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                background: subTab === 'overview' ? 'var(--primary)' : 'transparent',
                color: subTab === 'overview' ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={16} />
              <span>Recruitment Overview</span>
            </button>

            <button
              onClick={() => setSubTab('roles')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                background: subTab === 'roles' ? 'var(--primary)' : 'transparent',
                color: subTab === 'roles' ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Layers size={16} />
              <span>Wings & Roles</span>
            </button>

            <button
              onClick={() => setSubTab('apply')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                background: subTab === 'apply' ? 'var(--primary)' : 'transparent',
                color: subTab === 'apply' ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <FileText size={16} />
              <span>Apply for Role</span>
            </button>

            <button
              onClick={() => setSubTab('tracker')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                background: subTab === 'tracker' ? 'var(--primary)' : 'transparent',
                color: subTab === 'tracker' ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Search size={16} />
              <span>Track Application</span>
            </button>
          </div>
        </div>

        {/* View 1: Overview */}
        {subTab === 'overview' && (
          <div>
            <Hero
              onApplyClick={() => handleApplyClick()}
              onTrackClick={() => handleTrackClick()}
            />
            <HiringTracks
              onApplyClick={() => handleApplyClick()}
            />
            <DomainsDirectory
              onSelectDomainForApply={(domTitle) => handleApplyClick(domTitle)}
            />
            <TimelineAndFaq />
          </div>
        )}

        {/* View 2: Roles Directory Only */}
        {subTab === 'roles' && (
          <div>
            <HiringTracks
              onApplyClick={() => handleApplyClick()}
            />
            <DomainsDirectory
              onSelectDomainForApply={(domTitle) => handleApplyClick(domTitle)}
            />
          </div>
        )}

        {/* View 3: Apply Form */}
        {subTab === 'apply' && (
          <ApplicationForm
            initialDomain={selectedDomain}
            onNavigateToTracker={(refId) => handleTrackClick(refId)}
          />
        )}

        {/* View 4: Status Tracker */}
        {subTab === 'tracker' && (
          <StatusTracker
            initialQuery={trackerQuery}
            onNavigateToApply={() => handleApplyClick()}
            onOpenLoginModal={onOpenLoginModal}
            onNavigateToAdmin={onNavigateToAdmin}
          />
        )}
      </div>
    </section>
  );
}
