import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Shield,
  AlertCircle,
  LogIn,
  LogOut,
  ArrowRight,
  Sparkles,
  Building,
  ShieldCheck
} from 'lucide-react';
import {
  lookupApplication,
  getApplicationsForEmail
} from '../services/db';
import {
  getCurrentUser,
  subscribeToAuth,
  signOutParticipant
} from '../services/auth';

export default function StatusTracker({ initialQuery = '', onNavigateToApply, onOpenLoginModal, onNavigateToAdmin }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [userApplications, setUserApplications] = useState([]);
  const [isLoadingUserApps, setIsLoadingUserApps] = useState(false);

  // Manual Reference ID search
  const [activeTabMode, setActiveTabMode] = useState('auth'); // 'auth' | 'refId'
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [manualResult, setManualResult] = useState(null);
  const [manualSearched, setManualSearched] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      loadUserApplications(currentUser.email);
    } else {
      setUserApplications([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (initialQuery) {
      setQueryInput(initialQuery);
      setActiveTabMode('refId');
      handleManualSearch(initialQuery);
    }
  }, [initialQuery]);

  const loadUserApplications = async (email) => {
    setIsLoadingUserApps(true);
    try {
      const apps = await getApplicationsForEmail(email);
      setUserApplications(apps);
    } catch (e) {
      console.error('Failed to load apps for user:', e);
    } finally {
      setIsLoadingUserApps(false);
    }
  };

  const handleManualSearch = async (valToSearch) => {
    const q = (valToSearch || queryInput).trim();
    if (!q) return;

    setIsManualLoading(true);
    setManualSearched(true);
    try {
      const data = await lookupApplication(q);
      setManualResult(data);
    } catch (e) {
      console.error(e);
      setManualResult(null);
    } finally {
      setIsManualLoading(false);
    }
  };

  const getStageStatus = (status, stageIndex) => {
    const order = {
      'pending': 1,
      'shortlisted': 2,
      'interview_scheduled': 2,
      'accepted': 3,
      'rejected': 3
    };

    const currentStage = order[status] ?? 0;
    if (stageIndex < currentStage) return 'completed';
    if (stageIndex === currentStage) return 'active';
    return 'upcoming';
  };

  const renderApplicationCard = (app) => (
    <div key={app.id || app.trackingId} style={{ animation: 'modalEnter 0.25s ease', marginBottom: '2.5rem' }}>
      {/* Applicant Card Summary */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{app.fullName}</h3>
              <span className="badge-status" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.72rem' }}>
                @klu.ac.in Verified
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {app.rollNumber} • {app.branch} • {app.year}
            </p>
          </div>

          <span className={`badge-status ${app.status}`} style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}>
            {app.status?.replace('_', ' ')}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          fontSize: '0.88rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Target Role</span>
            <strong style={{ color: '#818cf8' }}>
              {app.role || app.domain}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Applied On</span>
            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Reference ID</span>
            <code style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{app.trackingId}</code>
          </div>
        </div>
      </div>

      {/* STAGES PIPELINE */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#818cf8" />
          <span>Recruitment Milestones</span>
        </h4>

        <div className="stage-pipeline">
          {/* Stage 1 */}
          <div className={`pipeline-step ${getStageStatus(app.status, 0)}`}>
            <div className="pipeline-step-dot">
              <CheckCircle2 size={16} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              1. Application Received
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Your application data has been logged with your verified university credentials.
            </div>
          </div>

          {/* Stage 2 */}
          <div className={`pipeline-step ${getStageStatus(app.status, 1)}`}>
            <div className="pipeline-step-dot">
              <CheckCircle2 size={16} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              2. Profile Screening & Review
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Domain coordinators evaluate candidate skills, answers & portfolio.
            </div>
          </div>

          {/* Stage 3 */}
          <div className={`pipeline-step ${getStageStatus(app.status, 2)}`}>
            <div className="pipeline-step-dot">
              <CheckCircle2 size={16} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              3. Interview & Interaction
            </div>

            {app.interviewDetails ? (
              <div style={{
                marginTop: '0.75rem',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                fontSize: '0.88rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 700 }}>
                  <Calendar size={16} />
                  <span>Date: {app.interviewDetails.date} at {app.interviewDetails.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <MapPin size={16} color="#38bdf8" />
                  <span>Venue: {app.interviewDetails.mode}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <User size={16} />
                  <span>Interviewer: {app.interviewDetails.interviewer}</span>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Shortlisted candidates will receive interview room & time assignments here.
              </div>
            )}
          </div>

          {/* Stage 4 */}
          <div className={`pipeline-step ${getStageStatus(app.status, 3)}`}>
            <div className="pipeline-step-dot">
              <CheckCircle2 size={16} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              4. Final Appointment
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {app.status === 'accepted' ? (
                <span style={{ color: '#34d399', fontWeight: 600 }}>
                  🎉 Congratulations! You have been appointed as an SCRS Coordinator! Watch your KLU inbox for onboarding schedules.
                </span>
              ) : app.status === 'rejected' ? (
                <span style={{ color: '#fb7185' }}>
                  Thank you for your application. We encourage you to participate in upcoming workshops and reapply in future tenures.
                </span>
              ) : (
                'Final selection decisions will be published following the interview rounds.'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="section" id="tracker-section">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="section-header">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.95rem',
            color: '#38bdf8',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Building size={14} />
            <span>KLU Student Recruitment Portal</span>
          </div>
          <h2 className="section-title">Application Status & Interview Tracker</h2>
          <p className="section-description">
            View your screening progress, scheduled interviews, and coordinator offers for the 2026-27 tenure.
          </p>
        </div>

        {/* LOGGED IN USER */}
        {currentUser ? (
          <div>
            {/* If logged in as admin, provide quick jump to admin panel */}
            {currentUser.role === 'admin' ? (
              <div style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <ShieldCheck size={36} color="#fbbf24" style={{ marginInline: 'auto', marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Logged in as Coordinator Board Admin ({currentUser.email})
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  You have administrative privileges to review all applicants, schedule interviews, and manage selections.
                </p>
                <button className="btn btn-primary" onClick={onNavigateToAdmin}>
                  <span>Open Coordinator Review Panel</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              /* Participant user profile bar */
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--gradient-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: '#fff'
                  }}>
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'K'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{currentUser.displayName}</span>
                      <CheckCircle2 size={16} color="#34d399" />
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => loadUserApplications(currentUser.email)}
                    title="Refresh application data"
                  >
                    Refresh
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={async () => {
                      await signOutParticipant();
                      setCurrentUser(null);
                      setUserApplications([]);
                    }}
                    style={{ color: '#fb7185' }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Applications for participant */}
            {currentUser.role !== 'admin' && (
              isLoadingUserApps ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                  Loading your application records...
                </div>
              ) : userApplications.length > 0 ? (
                <div>
                  <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Your Registered Applications</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {userApplications.length} Application{userApplications.length > 1 ? 's' : ''} Found
                    </span>
                  </div>
                  {userApplications.map(app => renderApplicationCard(app))}
                </div>
              ) : (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px dashed var(--border-light)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '3rem 2rem',
                  textAlign: 'center'
                }}>
                  <AlertCircle size={40} color="#fbbf24" style={{ marginInline: 'auto', marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    No Application Found for {currentUser.email}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '480px', marginInline: 'auto', marginBottom: '1.75rem' }}>
                    You are logged in, but you haven't applied for a coordinator position yet. Ready to apply?
                  </p>
                  {onNavigateToApply && (
                    <button className="btn btn-primary btn-lg" onClick={onNavigateToApply}>
                      <span>Apply for Coordinator Role</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          /* NOT LOGGED IN */
          <div className="tracker-box" style={{ maxWidth: '580px', padding: '2.5rem', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginInline: 'auto',
              marginBottom: '1.25rem'
            }}>
              <LogIn size={26} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Sign In to View Application Status
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Please sign in with your official <strong>@klu.ac.in</strong> organization Gmail account to access your live application screening and interview schedules.
            </p>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onOpenLoginModal}
              style={{ width: '100%', marginBottom: '1.5rem', padding: '0.9rem' }}
            >
              <LogIn size={18} />
              <span>Sign In with @klu.ac.in Gmail</span>
            </button>

            {/* Quick Ref ID search toggle */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', textAlign: 'left' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>
                Or search directly with Reference ID:
              </span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleManualSearch();
                }}
                className="tracker-search-bar"
                style={{ marginBottom: '1rem' }}
              >
                <div style={{ position: 'relative', flexGrow: 1 }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="SCRS-2026-XXXX..."
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Search size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                </div>
                <button type="submit" className="btn btn-secondary" disabled={isManualLoading}>
                  <span>Search</span>
                </button>
              </form>

              {manualResult && renderApplicationCard(manualResult)}

              {manualSearched && !manualResult && !isManualLoading && (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#fb7185', fontSize: '0.85rem' }}>
                  No application found for ID: {queryInput}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
