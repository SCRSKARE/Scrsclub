import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Star,
  ExternalLink,
  Eye,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Mail,
  Phone,
  LogIn
} from 'lucide-react';
import {
  fetchApplications,
  subscribeToApplications,
  updateApplication
} from '../services/db';
import { getCurrentUser, subscribeToAuth, signOutParticipant } from '../services/auth';
import { DOMAINS } from '../data/rolesData';

export default function AdminPortal({ onOpenLoginModal }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);

  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Interview modal state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    mode: 'Offline (Club Room 304, SAC)',
    interviewer: ''
  });

  // Track auth state
  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const isAuthorized = (currentUser && currentUser.role === 'admin') || pinUnlocked;

  // Subscribe to real-time applications
  useEffect(() => {
    if (isAuthorized) {
      const unsub = subscribeToApplications((apps) => {
        setApplications(apps);
      });
      return () => unsub();
    }
  }, [isAuthorized]);

  const handlePinLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === 'scrs2026' || pinInput.trim() === 'admin') {
      setPinUnlocked(true);
      setPinError('');
    } else {
      setPinError('Invalid coordinator passcode.');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    await updateApplication(appId, { status: newStatus });
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleRatingChange = async (appId, rating) => {
    await updateApplication(appId, { rating });
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => ({ ...prev, rating }));
    }
  };

  const handleSaveNotes = async (appId, notes) => {
    await updateApplication(appId, { notes });
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => ({ ...prev, notes }));
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    await updateApplication(selectedApp.id, {
      status: 'interview_scheduled',
      interviewDetails: interviewForm
    });

    setSelectedApp(prev => ({
      ...prev,
      status: 'interview_scheduled',
      interviewDetails: interviewForm
    }));

    setShowInterviewModal(false);
  };

  const handleExportCsv = () => {
    if (!applications.length) return;

    const headers = [
      'Ref ID', 'Full Name', 'Email', 'Phone', 'Roll No', 'Branch', 'Year',
      'Target Role', 'Skills', 'Portfolio', 'Status', 'Rating', 'Applied At'
    ];

    const rows = applications.map(app => [
      app.trackingId,
      `"${app.fullName}"`,
      app.email,
      app.phone,
      app.rollNumber,
      `"${app.branch}"`,
      app.year,
      `"${app.role || app.domain}"`,
      `"${(app.skills || '').replace(/"/g, '""')}"`,
      app.portfolioUrl || '',
      app.status,
      app.rating || 0,
      app.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SCRS_Coordinators_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchesSearch =
      app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.trackingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.skills?.toLowerCase().includes(searchQuery.toLowerCase());

    const appRole = app.role || app.domain;
    const matchesRole = roleFilter === 'ALL' || appRole === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'interview_scheduled').length;
  const acceptedCount = applications.filter(a => a.status === 'accepted').length;

  // NOT AUTHORIZED VIEW
  if (!isAuthorized) {
    return (
      <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '460px' }}>
          <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginInline: 'auto',
              marginBottom: '1.25rem',
              color: '#f59e0b'
            }}>
              <ShieldCheck size={28} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Coordinator Review Panel
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
              Restricted portal for SCRS Core Coordinators & Faculty Evaluators.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1.25rem', padding: '0.8rem' }}
              onClick={onOpenLoginModal}
            >
              <LogIn size={16} />
              <span>Sign In with Admin Account</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBlock: '1.25rem',
              color: 'var(--text-dim)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span style={{ paddingInline: '0.75rem' }}>or use coordinator passcode</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            <form onSubmit={handlePinLogin}>
              <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <input
                  id="pin"
                  type="password"
                  className="form-input"
                  placeholder="Enter coordinator passcode..."
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                />
              </div>

              {pinError && (
                <div style={{ color: '#fb7185', fontSize: '0.82rem', marginBottom: '1rem', textAlign: 'left' }}>
                  {pinError}
                </div>
              )}

              <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
                <Unlock size={16} />
                <span>Unlock with Passcode</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container container">
      {/* Admin Header */}
      <div className="admin-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Recruitment Dashboard</h1>
            <span className="badge-status accepted" style={{ fontSize: '0.75rem' }}>
              Admin Verified
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Review applicants, schedule interviews, and finalize appointments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCsv}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="admin-stats-bar">
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Total Applicants</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalCount}</div>
        </div>
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Pending Review</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>{pendingCount}</div>
        </div>
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Shortlisted</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>{shortlistedCount}</div>
        </div>
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Interview Scheduled</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc' }}>{interviewCount}</div>
        </div>
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Appointed</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{acceptedCount}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="admin-filters-bar">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="form-input"
            placeholder="Search name, roll no, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Role Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            {DOMAINS.map(d => (
              <option key={d.id} value={d.title}>{d.title}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="table-container">
        <table className="app-table">
          <thead>
            <tr>
              <th>Ref ID</th>
              <th>Applicant</th>
              <th>Target Role</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Rating</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                  No applications match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredApps.map(app => (
                <tr key={app.id}>
                  <td>
                    <code style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.82rem' }}>
                      {app.trackingId}
                    </code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{app.fullName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {app.rollNumber} • {app.branch} • {app.year}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#818cf8' }}>
                      {app.role || app.domain}
                    </div>
                    {app.secondaryDomain && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        2nd: {app.secondaryDomain}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{
                      maxWidth: '220px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }} title={app.skills}>
                      {app.skills}
                    </div>
                  </td>
                  <td>
                    <span className={`badge-status ${app.status}`}>
                      {app.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={14}
                          color={star <= (app.rating || 0) ? '#f59e0b' : '#334155'}
                          fill={star <= (app.rating || 0) ? '#f59e0b' : 'none'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRatingChange(app.id, star)}
                        />
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedApp(app)}
                    >
                      <Eye size={14} />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FULL CANDIDATE DOSSIER MODAL */}
      {selectedApp && (
        <div className="modal-backdrop" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedApp.fullName}</h3>
                  <code style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{selectedApp.trackingId}</code>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedApp.rollNumber} • {selectedApp.branch} • {selectedApp.year}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge-status ${selectedApp.status}`}>
                  {selectedApp.status?.replace('_', ' ')}
                </span>
                <button className="modal-close-btn" onClick={() => setSelectedApp(null)}>
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            <div className="modal-body">
              {/* Contact info strip */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.88rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Mail size={15} color="#38bdf8" />
                  <a href={`mailto:${selectedApp.email}`} style={{ color: 'var(--text-main)', textDecoration: 'underline' }}>
                    {selectedApp.email}
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Phone size={15} color="#34d399" />
                  <a href={`tel:${selectedApp.phone}`} style={{ color: 'var(--text-main)' }}>
                    {selectedApp.phone}
                  </a>
                </div>
                {selectedApp.portfolioUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <ExternalLink size={15} color="#c084fc" />
                    <a href={selectedApp.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#c084fc', textDecoration: 'underline' }}>
                      Portfolio / Work Link
                    </a>
                  </div>
                )}
              </div>

              {/* Preferences Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Target Role</span>
                  <strong style={{ color: '#818cf8' }}>
                    {selectedApp.role || selectedApp.domain}
                  </strong>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Weekly Commitment</span>
                  <span>{selectedApp.weeklyHours}</span>
                </div>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Candidate Skills
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {(selectedApp.skills || '').split(',').map((s, idx) => (
                    <span key={idx} className="skill-tag" style={{ color: 'var(--text-main)', background: 'rgba(99, 102, 241, 0.12)' }}>
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Why do you want to become a Coordinator?
                </span>
                <p style={{ background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {selectedApp.whyJoin || 'Not provided'}
                </p>
              </div>

              {/* Initiative Idea */}
              {selectedApp.initiativeIdea && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Proposed Project or Initiative
                  </span>
                  <p style={{ background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {selectedApp.initiativeIdea}
                  </p>
                </div>
              )}

              {/* Experience */}
              {selectedApp.experience && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Past Experience / Contributions
                  </span>
                  <p style={{ background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {selectedApp.experience}
                  </p>
                </div>
              )}

              {/* Scheduled Interview Card */}
              {selectedApp.interviewDetails && (
                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontWeight: 700, color: '#c084fc', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} />
                    <span>Interview Scheduled</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    <div><strong>Date & Time:</strong> {selectedApp.interviewDetails.date} ({selectedApp.interviewDetails.time})</div>
                    <div><strong>Venue:</strong> {selectedApp.interviewDetails.mode}</div>
                    <div><strong>Interviewer:</strong> {selectedApp.interviewDetails.interviewer}</div>
                  </div>
                </div>
              )}

              {/* Evaluation: Rating & Notes */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <label className="form-label">Reviewer Rating</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={20}
                        color={star <= (selectedApp.rating || 0) ? '#f59e0b' : '#334155'}
                        fill={star <= (selectedApp.rating || 0) ? '#f59e0b' : 'none'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRatingChange(selectedApp.id, star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="eval-notes">
                    Internal Evaluator Notes
                  </label>
                  <textarea
                    id="eval-notes"
                    className="form-textarea"
                    rows={3}
                    placeholder="Candidate strengths, interview feedback, domain fit..."
                    value={selectedApp.notes || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedApp(prev => ({ ...prev, notes: val }));
                      handleSaveNotes(selectedApp.id, val);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
                  onClick={() => handleStatusChange(selectedApp.id, 'shortlisted')}
                >
                  Mark Shortlisted
                </button>

                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}
                  onClick={() => {
                    setInterviewForm({
                      date: new Date().toISOString().slice(0, 10),
                      time: '04:00 PM',
                      mode: 'Offline (Club Room 304, SAC)',
                      interviewer: 'Core Board & Faculty'
                    });
                    setShowInterviewModal(true);
                  }}
                >
                  <Calendar size={14} />
                  <span>Schedule Interview</span>
                </button>

                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}
                  onClick={() => handleStatusChange(selectedApp.id, 'accepted')}
                >
                  <CheckCircle size={14} />
                  <span>Accept / Appoint</span>
                </button>

                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}
                  onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                >
                  <XCircle size={14} />
                  <span>Reject</span>
                </button>
              </div>

              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedApp(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW SUB-MODAL */}
      {showInterviewModal && selectedApp && (
        <div className="modal-backdrop" style={{ zIndex: 250 }} onClick={() => setShowInterviewModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Schedule Interview</h3>
              <button className="modal-close-btn" onClick={() => setShowInterviewModal(false)}>
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview}>
              <div className="modal-body">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Applicant: <strong>{selectedApp.fullName}</strong> ({selectedApp.role || selectedApp.domain})
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="int-date">Interview Date</label>
                  <input
                    id="int-date"
                    type="date"
                    className="form-input"
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="int-time">Interview Time</label>
                  <input
                    id="int-time"
                    type="text"
                    className="form-input"
                    placeholder="e.g. 04:30 PM"
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="int-mode">Venue / Platform</label>
                  <input
                    id="int-mode"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Offline (Club Room 304, SAC) or Google Meet link"
                    value={interviewForm.mode}
                    onChange={(e) => setInterviewForm(prev => ({ ...prev, mode: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="int-interviewer">Interviewer(s)</label>
                  <input
                    id="int-interviewer"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Club President & Tech Lead"
                    value={interviewForm.interviewer}
                    onChange={(e) => setInterviewForm(prev => ({ ...prev, interviewer: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInterviewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Notify Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
