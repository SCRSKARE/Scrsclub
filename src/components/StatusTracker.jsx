import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  ArrowRight,
  Sparkles,
  Building,
  ShieldCheck,
  Ticket,
  Printer
} from 'lucide-react';
import {
  lookupApplication,
  getApplicationsForEmail,
  getRegistrationsForEmail
} from '../services/db';
import {
  getCurrentUser,
  subscribeToAuth,
  signOutParticipant
} from '../services/auth';

export default function StatusTracker({ initialQuery = '', onNavigateToApply, onOpenLoginModal, onNavigateToAdmin }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [userApplications, setUserApplications] = useState([]);
  const [userEventPasses, setUserEventPasses] = useState([]);
  const [isLoadingUserApps, setIsLoadingUserApps] = useState(false);

  // Manual Reference ID search
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [manualResult, setManualResult] = useState(null);
  const [manualSearched, setManualSearched] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);

  const loadUserData = useCallback(async (email) => {
    setIsLoadingUserApps(true);
    try {
      const apps = await getApplicationsForEmail(email);
      setUserApplications(apps);
      const passes = await getRegistrationsForEmail(email);
      setUserEventPasses(passes);
    } catch (e) {
      console.error('Failed to load data for user:', e);
    } finally {
      setIsLoadingUserApps(false);
    }
  }, []);

  const handleManualSearch = useCallback(async (valToSearch) => {
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
  }, [queryInput]);

  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      loadUserData(currentUser.email);
    } else {
      setUserApplications([]);
      setUserEventPasses([]);
    }
  }, [currentUser, loadUserData]);

  useEffect(() => {
    if (initialQuery) {
      setQueryInput(initialQuery);
      handleManualSearch(initialQuery);
    }
  }, [initialQuery, handleManualSearch]);

  const handlePrintPass = (app) => {
    const printWindow = window.open('', '_blank', 'width=800,height=650');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SCRS Coordinator Application Pass - ${app.trackingId}</title>
        <style>
          body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0b1329; color: #fff; padding: 2rem; margin: 0; }
          .pass-card { border: 2px solid #38bdf8; border-radius: 16px; padding: 2rem; max-width: 600px; margin: 0 auto; background: #0f172a; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .pass-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .pass-title { font-size: 1.4rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; }
          .pass-badge { background: #38bdf822; color: #38bdf8; border: 1px solid #38bdf844; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem; }
          .label { font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
          .val { font-size: 1rem; font-weight: 600; color: #f8fafc; margin-top: 0.25rem; }
          .code { font-family: monospace; font-size: 1.2rem; color: #38bdf8; font-weight: 800; background: rgba(56, 189, 248, 0.1); padding: 0.4rem 0.8rem; border-radius: 6px; display: inline-block; margin-top: 0.25rem; }
          .footer { font-size: 0.78rem; color: #64748b; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 1rem; text-align: center; }
          @media print {
            body { background: #fff; color: #000; padding: 0; }
            .pass-card { border-color: #000; background: #fff; color: #000; box-shadow: none; }
            .pass-title { color: #000; }
            .pass-badge { border-color: #000; color: #000; background: #eee; }
            .val, .label { color: #000; }
            .code { color: #000; background: #eee; }
          }
        </style>
      </head>
      <body>
        <div class="pass-card">
          <div class="pass-header">
            <div>
              <div class="pass-title">SCRS Club Official Pass</div>
              <div style="font-size:0.85rem; color:#94a3b8; margin-top:0.2rem;">Annual Coordinator Recruitment 2026-27</div>
            </div>
            <div class="pass-badge">${app.status === 'accepted' ? 'APPROVED' : app.status === 'rejected' ? 'REJECTED' : 'UNDER REVIEW'}</div>
          </div>
          <div class="grid">
            <div>
              <div class="label">Applicant Name</div>
              <div class="val">${app.fullName}</div>
            </div>
            <div>
              <div class="label">Reference ID</div>
              <div class="code">${app.trackingId}</div>
            </div>
            <div>
              <div class="label">University Roll / ID</div>
              <div class="val">${app.rollNumber || 'N/A'}</div>
            </div>
            <div>
              <div class="label">Target Role</div>
              <div class="val">${app.role || app.domain}</div>
            </div>
            <div>
              <div class="label">Branch & Year</div>
              <div class="val">${app.branch || 'N/A'} • ${app.year || ''}</div>
            </div>
            <div>
              <div class="label">Email Address</div>
              <div class="val">${app.email}</div>
            </div>
          </div>
          <div class="footer">
            Official Student Community & Research Society (SCRS) Recruitment Verification Pass.<br/>
            Issued for verified KLU applicant. Present this slip during interview / onboarding calls.
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStageStatus = (status, stageIndex) => {
    const order = {
      'pending': 1,
      'accepted': 2,
      'rejected': 2
    };

    const currentStage = order[status] ?? 0;
    if (stageIndex < currentStage) return 'completed';
    if (stageIndex === currentStage) return 'active';
    return 'upcoming';
  };

  const renderApplicationCard = (app) => (
    <div key={app.id || app.trackingId} style={{ animation: 'modalEnter 0.25s ease', marginBottom: '2rem' }}>
      {/* Applicant Card Summary */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '1.5rem',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge-status ${app.status === 'accepted' ? 'accepted' : app.status === 'rejected' ? 'rejected' : 'pending'}`} style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}>
              {app.status === 'accepted' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Under Review'}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handlePrintPass(app)}
              title="Print Application Slip"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              <Printer size={14} />
              <span>Print Slip</span>
            </button>
          </div>
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
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#818cf8" />
          <span>Role Application Progress</span>
        </h4>

        <div className="stage-pipeline">
          {/* Stage 1 */}
          <div className={`pipeline-step ${getStageStatus(app.status, 0)}`}>
            <div className="pipeline-step-dot">
              <CheckCircle2 size={16} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              1. Application Submitted
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Your application has been received and registered under your verified @klu.ac.in account.
            </div>
          </div>

          {/* Stage 2 */}
          <div className={`pipeline-step ${getStageStatus(app.status, 1)}`}>
            <div className="pipeline-step-dot">
              <CheckCircle2 size={16} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              2. Core Coordinator Evaluation
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Domain leads and faculty advisors review your skills, experience, and initiative pitch.
            </div>
          </div>

          {/* Stage 3 */}
          <div className={`pipeline-step ${getStageStatus(app.status, 2)}`}>
            <div className="pipeline-step-dot">
              <CheckCircle2 size={16} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              3. Final Decision
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {app.status === 'accepted' ? (
                <span style={{ color: '#34d399', fontWeight: 600 }}>
                  🎉 Congratulations! Your application has been Approved! You are appointed as an SCRS Coordinator. Watch your KLU email inbox for onboarding details.
                </span>
              ) : app.status === 'rejected' ? (
                <span style={{ color: '#fb7185' }}>
                  Thank you for your interest. Your application was not selected for this tenure. We encourage you to participate in club activities and reapply in future drives.
                </span>
              ) : (
                'Your application is currently under review by the recruitment board. Final results will be updated here.'
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
            <span>KLU Student Portal</span>
          </div>
          <h2 className="section-title">My Status & Event Passes</h2>
          <p className="section-description">
            Track your SCRS club role applications and access your registered event passes.
          </p>
        </div>

        {/* LOGGED IN USER */}
        {currentUser ? (
          <div>
            {/* Admin Banner if Admin */}
            {currentUser.role === 'admin' && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <ShieldCheck size={32} color="#fbbf24" style={{ marginInline: 'auto', marginBottom: '0.5rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Logged in as Administrator ({currentUser.email})
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                  You have full privileges to manage events, team coordinators, and evaluate role applications.
                </p>
                <button className="btn btn-primary" onClick={onNavigateToAdmin}>
                  <span>Open Admin Portal</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Profile Bar */}
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
                  onClick={() => loadUserData(currentUser.email)}
                  title="Refresh records"
                >
                  Refresh Data
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={async () => {
                    await signOutParticipant();
                    setCurrentUser(null);
                    setUserApplications([]);
                    setUserEventPasses([]);
                  }}
                  style={{ color: '#fb7185' }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: EVENT REGISTRATION PASSES */}
            {userEventPasses.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Ticket size={20} color="#34d399" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Registered Event Passes</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {userEventPasses.map((pass) => (
                    <div
                      key={pass.id}
                      style={{
                        background: 'rgba(11, 23, 46, 0.95)',
                        border: '1px dashed rgba(56, 189, 248, 0.4)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        position: 'relative'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '12px'
                      }}>
                        {pass.status || 'Confirmed'}
                      </span>

                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem', paddingRight: '4rem' }}>
                        {pass.eventTitle}
                      </h4>

                      <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginBottom: '0.85rem' }}>
                        📅 {pass.eventDate} ({pass.eventTime})
                      </div>

                      <div style={{
                        background: 'rgba(6, 13, 27, 0.6)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '0.75rem',
                        fontSize: '0.82rem'
                      }}>
                        <div style={{ color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.7rem' }}>Pass Code</div>
                        <code style={{ fontSize: '1.1rem', color: '#fbbf24', fontWeight: 800 }}>{pass.passId}</code>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <strong>Venue:</strong> {pass.eventVenue}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: CLUB ROLE APPLICATIONS */}
            {isLoadingUserApps ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                Loading records...
              </div>
            ) : userApplications.length > 0 ? (
              <div>
                <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Your Role Applications</h3>
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
                padding: '2.5rem 2rem',
                textAlign: 'center'
              }}>
                <AlertCircle size={36} color="#fbbf24" style={{ marginInline: 'auto', marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  No Role Application Found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', marginInline: 'auto', marginBottom: '1.5rem' }}>
                  You are logged in, but you haven't applied for a club coordinator position yet.
                </p>
                {onNavigateToApply && (
                  <button className="btn btn-primary btn-sm" onClick={onNavigateToApply}>
                    <span>Apply for Coordinator Role</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
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
              Sign In to View Application & Event Passes
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Sign in with your official <strong>@klu.ac.in</strong> university account to track your coordinator screening status and view event entry tickets.
            </p>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onOpenLoginModal}
              style={{ width: '100%', marginBottom: '1.5rem', padding: '0.9rem' }}
            >
              <LogIn size={18} />
              <span>Sign In with @klu.ac.in Account</span>
            </button>

            {/* Quick Ref ID search */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', textAlign: 'left' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>
                Or search application with Reference ID:
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
