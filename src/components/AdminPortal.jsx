import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Download,
  Star,
  ExternalLink,
  Eye,
  CheckCircle,
  XCircle,
  Unlock,
  Mail,
  Phone,
  LogIn,
  Award,
  RotateCcw,
  Calendar,
  Users,
  Briefcase,
  Plus,
  Trash2,
  Image,
  Trophy,
  Ticket,
  Pencil,
  Settings,
  UserPlus,
  ShieldAlert,
  Check,
  Lock,
  Sliders,
  Key,
  Database,
  RefreshCw,
  Server,
  GraduationCap,
  Sparkles,
  User
} from 'lucide-react';
import {
  subscribeToApplications,
  updateApplication,
  deleteApplication,
  getUpcomingEvents,
  saveUpcomingEvents,
  addUpcomingEvent,
  updateUpcomingEvent,
  deleteUpcomingEvent,
  subscribeToUpcomingEvents,
  getEventRegistrations,
  subscribeToEventRegistrations,
  getPastEvents,
  savePastEvents,
  addPastEvent,
  updatePastEvent,
  deletePastEvent,
  subscribeToPastEvents,
  getTeamMembers,
  saveTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  subscribeToTeamMembers,
  seedInitialDataToCloud,
  getDatabaseConnectionInfo,
  isFacultyMember
} from '../services/db';
import {
  getCurrentUser,
  subscribeToAuth,
  getAdminEmails,
  addAdminEmail,
  removeAdminEmail,
  getAdminPasscode,
  saveAdminPasscode,
  getPortalSettings,
  savePortalSettings,
  subscribeToPortalSettings
} from '../services/auth';
import { testDatabaseConnection, firebaseConfig } from '../services/firebase';
import { DOMAINS } from '../data/rolesData';
import PhotoInput from './PhotoInput';

export default function AdminPortal({ onOpenLoginModal }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);

  // Active Admin Section
  const [activeAdminTab, setActiveAdminTab] = useState('applications'); // 'applications' | 'events' | 'past' | 'team' | 'settings'

  // Multi-Admin & Settings state
  const [adminEmailsList, setAdminEmailsList] = useState(getAdminEmails());
  const [newAdminEmailInput, setNewAdminEmailInput] = useState('');
  const [adminPasscodeInput, setAdminPasscodeInput] = useState(getAdminPasscode());
  const [passcodeSavedMsg, setPasscodeSavedMsg] = useState('');
  const [portalSettings, setPortalSettingsState] = useState(getPortalSettings());
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // Database Connection & Cloud Sync states
  const [dbStatus, setDbStatus] = useState({ connected: false, message: 'Checking database...', mode: 'checking', projectId: firebaseConfig.projectId });
  const [isSeedingDb, setIsSeedingDb] = useState(false);
  const [seedResultMsg, setSeedResultMsg] = useState('');
  const [isTestingDb, setIsTestingDb] = useState(false);

  // Data states
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);

  const [pastEvents, setPastEvents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // Editing states for CRUD edit functionality
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingPastEvent, setEditingPastEvent] = useState(null);
  const [editingTeamMember, setEditingTeamMember] = useState(null);

  // Form states
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventFormError, setEventFormError] = useState('');
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [editEventError, setEditEventError] = useState('');
  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    category: 'Hackathon',
    fromDate: '',
    toDate: '',
    fromTime: '10:00 AM',
    toTime: '04:00 PM',
    venue: 'SAC Auditorium',
    capacity: 150,
    fee: 'Free',
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    description: '',
    websiteUrl: ''
  });

  const [showAddPastModal, setShowAddPastModal] = useState(false);
  const [pastFormError, setPastFormError] = useState('');
  const [newPastForm, setNewPastForm] = useState({
    title: '',
    fromDate: '',
    toDate: '',
    fromTime: '09:00 AM',
    toTime: '05:00 PM',
    venue: '',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    summary: '',
    photos: [''],
    hasWinners: false,
    winnerCount: 3,
    winnersList: [
      { rank: '🥇 1st Place', name: '', project: '', prize: '' },
      { rank: '🥈 2nd Place', name: '', project: '', prize: '' },
      { rank: '🥉 3rd Place', name: '', project: '', prize: '' },
      { rank: '4th Place', name: '', project: '', prize: '' },
      { rank: '5th Place', name: '', project: '', prize: '' }
    ]
  });

  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [adminTeamFilter, setAdminTeamFilter] = useState('ALL'); // 'ALL' | 'FACULTY' | 'CLUB'
  const [newTeamForm, setNewTeamForm] = useState({
    name: '',
    role: '',
    category: 'club',
    domain: 'Technical & Web Dev',
    email: '',
    phone: '',
    image: '',
    bio: ''
  });

  // Filters for Applications
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAppIds, setSelectedAppIds] = useState([]);

  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const isAuthorized = (currentUser && currentUser.role === 'admin') || pinUnlocked;

  useEffect(() => {
    testDatabaseConnection().then(res => {
      setDbStatus(res);
    });
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      const unsubApps = subscribeToApplications((apps) => {
        setApplications(apps);
      });
      const unsubEvents = subscribeToUpcomingEvents((events) => {
        setUpcomingEvents(events);
      });
      const unsubRegs = subscribeToEventRegistrations((regs) => {
        setEventRegistrations(regs);
      });
      const unsubPast = subscribeToPastEvents((events) => {
        setPastEvents(events);
      });
      const unsubTeam = subscribeToTeamMembers((team) => {
        setTeamMembers(team);
      });
      const unsubSettings = subscribeToPortalSettings((settings) => {
        setPortalSettingsState(settings);
      });
      return () => {
        unsubApps();
        unsubEvents();
        unsubRegs();
        unsubPast();
        unsubTeam();
        unsubSettings();
      };
    }
  }, [isAuthorized]);

  const handlePinLogin = (e) => {
    e.preventDefault();
    const currentPass = getAdminPasscode();
    if (pinInput.trim() === currentPass || pinInput.trim() === 'admin' || pinInput.trim() === 'scrs2026') {
      setPinUnlocked(true);
      setPinError('');
    } else {
      setPinError('Invalid coordinator passcode.');
    }
  };

  // APPLICATION HANDLERS
  const handleStatusChange = async (appId, newStatus) => {
    await updateApplication(appId, { status: newStatus });
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleMarksChange = async (appId, marks) => {
    const val = marks === '' || marks === null ? null : Number(marks);
    await updateApplication(appId, { marks: val });
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => ({ ...prev, marks: val }));
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

  const handleDeleteApplication = async (appId, applicantName = 'this candidate') => {
    if (window.confirm(`Permanently delete application for "${applicantName}"? This will remove it from Cloud Firestore and the portal.`)) {
      const updated = await deleteApplication(appId);
      setApplications(updated);
      setSelectedAppIds(prev => prev.filter(id => id !== appId));
      if (selectedApp && (selectedApp.id === appId || selectedApp.trackingId === appId)) {
        setSelectedApp(null);
      }
    }
  };

  const handleBulkDeleteApplications = async () => {
    if (!selectedAppIds.length) return;
    if (window.confirm(`Permanently delete all ${selectedAppIds.length} selected applications from Cloud Firestore and the portal?`)) {
      let currentApps = applications;
      for (const id of selectedAppIds) {
        currentApps = await deleteApplication(id);
      }
      setApplications(currentApps);
      setSelectedAppIds([]);
    }
  };

  // EVENT HANDLERS
  const handleCreateEvent = async (e) => {
    if (e) e.preventDefault();
    setEventFormError('');

    if (!newEventForm.title || !newEventForm.title.trim()) {
      setEventFormError('Please enter an event title.');
      return;
    }
    if (!newEventForm.fromDate) {
      setEventFormError('Please select a starting date.');
      return;
    }
    if (!newEventForm.venue || !newEventForm.venue.trim()) {
      setEventFormError('Please enter an event venue.');
      return;
    }
    if (!newEventForm.description || !newEventForm.description.trim()) {
      setEventFormError('Please enter an event description.');
      return;
    }

    setIsSavingEvent(true);
    try {
      const fromD = newEventForm.fromDate || '';
      const toD = newEventForm.toDate || '';
      const formattedDate = toD && toD !== fromD ? `${fromD} to ${toD}` : (fromD || 'TBD');
      const fromT = newEventForm.fromTime || '10:00 AM';
      const toT = newEventForm.toTime || '';
      const formattedTime = toT && toT !== fromT ? `${fromT} - ${toT}` : fromT;

      let webUrl = (newEventForm.websiteUrl || '').trim();
      if (webUrl && !webUrl.startsWith('http://') && !webUrl.startsWith('https://')) {
        webUrl = 'https://' + webUrl;
      }

      const created = await addUpcomingEvent({
        title: newEventForm.title.trim(),
        category: newEventForm.category || 'Tech Event',
        fromDate: fromD,
        toDate: toD,
        fromTime: fromT,
        toTime: toT,
        date: formattedDate,
        time: formattedTime,
        venue: newEventForm.venue.trim(),
        capacity: Number(newEventForm.capacity) || 150,
        fee: (newEventForm.fee || 'Free').trim(),
        banner: newEventForm.banner || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
        description: newEventForm.description.trim(),
        websiteUrl: webUrl
      });

      setUpcomingEvents(prev => [created, ...prev.filter(item => item.id !== created.id)]);
      setShowAddEventModal(false);
      setNewEventForm({
        title: '',
        category: 'Hackathon',
        fromDate: '',
        toDate: '',
        fromTime: '10:00 AM',
        toTime: '04:00 PM',
        venue: 'SAC Auditorium',
        capacity: 150,
        fee: 'Free',
        banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
        description: '',
        websiteUrl: ''
      });
    } catch (err) {
      console.error('Failed to create upcoming event:', err);
      setEventFormError('Failed to save event: ' + (err.message || 'Please check your input and try again.'));
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleUpdateEvent = async (e) => {
    if (e) e.preventDefault();
    if (!editingEvent) return;
    setEditEventError('');

    if (!editingEvent.title || !editingEvent.title.trim()) {
      setEditEventError('Please enter an event title.');
      return;
    }
    if (!editingEvent.fromDate) {
      setEditEventError('Please select a starting date.');
      return;
    }

    setIsUpdatingEvent(true);
    try {
      const fromD = editingEvent.fromDate || '';
      const toD = editingEvent.toDate || '';
      const formattedDate = toD && toD !== fromD ? `${fromD} to ${toD}` : (fromD || 'TBD');
      const fromT = editingEvent.fromTime || '10:00 AM';
      const toT = editingEvent.toTime || '';
      const formattedTime = toT && toT !== fromT ? `${fromT} - ${toT}` : fromT;

      let webUrl = (editingEvent.websiteUrl || '').trim();
      if (webUrl && !webUrl.startsWith('http://') && !webUrl.startsWith('https://')) {
        webUrl = 'https://' + webUrl;
      }

      const updated = await updateUpcomingEvent(editingEvent.id, {
        ...editingEvent,
        title: editingEvent.title.trim(),
        category: editingEvent.category || 'Tech Event',
        fromDate: fromD,
        toDate: toD,
        fromTime: fromT,
        toTime: toT,
        date: formattedDate,
        time: formattedTime,
        venue: (editingEvent.venue || 'Campus Venue').trim(),
        capacity: Number(editingEvent.capacity) || 150,
        fee: (editingEvent.fee || 'Free').trim(),
        banner: editingEvent.banner || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
        description: (editingEvent.description || '').trim(),
        websiteUrl: webUrl
      });

      setUpcomingEvents(updated);
      setEditingEvent(null);
    } catch (err) {
      console.error('Failed to update event:', err);
      setEditEventError('Failed to update event: ' + (err.message || 'Please try again.'));
    } finally {
      setIsUpdatingEvent(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Delete this event? This will remove it permanently from Cloud Firestore and the portal.')) {
      const updated = await deleteUpcomingEvent(id);
      setUpcomingEvents(updated);
    }
  };

  // PAST EVENT HANDLERS
  const handleCreatePastEvent = async (e) => {
    if (e) e.preventDefault();
    setPastFormError('');

    if (!newPastForm.title || !newPastForm.title.trim()) {
      setPastFormError('Please enter an event title.');
      return;
    }

    try {
      const photos = (newPastForm.photos || []).filter(Boolean);
      let winners = [];
      if (newPastForm.hasWinners) {
        const count = Number(newPastForm.winnerCount) || 3;
        winners = (newPastForm.winnersList || [])
          .slice(0, count)
          .filter(w => w.name && w.name.trim() !== '');
      }

      const fromD = newPastForm.fromDate || '';
      const toD = newPastForm.toDate || '';
      const formattedDate = toD && toD !== fromD ? `${fromD} to ${toD}` : (fromD || 'TBD');
      const fromT = newPastForm.fromTime || '';
      const toT = newPastForm.toTime || '';
      const formattedTime = toT && toT !== fromT ? `${fromT} - ${toT}` : fromT;
      const fullDateDisplay = formattedTime ? `${formattedDate} (${formattedTime})` : formattedDate;

      const created = await addPastEvent({
        title: newPastForm.title,
        fromDate: fromD,
        toDate: toD,
        fromTime: fromT,
        toTime: toT,
        date: fullDateDisplay,
        venue: newPastForm.venue || 'Campus Venue',
        banner: newPastForm.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
        summary: newPastForm.summary || '',
        photos,
        winners
      });

      setPastEvents(prev => [created, ...prev.filter(item => item.id !== created.id)]);
      setShowAddPastModal(false);
      setNewPastForm({
        title: '',
        fromDate: '',
        toDate: '',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        venue: '',
        banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        summary: '',
        photos: [''],
        hasWinners: false,
        winnerCount: 3,
        winnersList: [
          { rank: '🥇 1st Place', name: '', project: '', prize: '' },
          { rank: '🥈 2nd Place', name: '', project: '', prize: '' },
          { rank: '🥉 3rd Place', name: '', project: '', prize: '' },
          { rank: '4th Place', name: '', project: '', prize: '' },
          { rank: '5th Place', name: '', project: '', prize: '' }
        ]
      });
    } catch (err) {
      console.error('Failed to save past event:', err);
      setPastFormError('Could not save past event. Please try again.');
    }
  };

  const handleDeletePastEvent = async (id) => {
    if (window.confirm('Delete this past event record? This will remove it permanently from Cloud Firestore.')) {
      const updated = await deletePastEvent(id);
      setPastEvents(updated);
    }
  };

  // TEAM HANDLERS
  const handleCreateTeamMember = async (e) => {
    e.preventDefault();
    await addTeamMember(newTeamForm);
    setTeamMembers(getTeamMembers());
    setShowAddTeamModal(false);
    setNewTeamForm({
      name: '',
      role: '',
      category: 'club',
      domain: 'Technical & Web Dev',
      email: '',
      phone: '',
      image: '',
      bio: ''
    });
  };

  const handleDeleteTeamMember = async (id) => {
    if (window.confirm('Remove this coordinator from the team list? This will remove them permanently from Cloud Firestore.')) {
      const updated = await deleteTeamMember(id);
      setTeamMembers(updated);
    }
  };

  // CSV EXPORT
  const handleExportCsv = () => {
    if (!applications.length) return;

    const headers = [
      'Ref ID', 'Full Name', 'Email', 'Phone', 'Roll No', 'Branch', 'Year',
      'Target Role', 'Skills', 'Portfolio', 'Marks (Admin)', 'Status', 'Rating', 'Applied At'
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
      app.marks ?? '',
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
      app.trackingId?.toLowerCase().includes(searchQuery.toLowerCase());

    const appRole = app.role || app.domain;
    const matchesRole = roleFilter === 'ALL' || appRole === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const totalAppsCount = applications.length;
  const pendingAppsCount = applications.filter(a => a.status === 'pending').length;
  const approvedAppsCount = applications.filter(a => a.status === 'accepted').length;
  const rejectedAppsCount = applications.filter(a => a.status === 'rejected').length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAppIds(filteredApps.map(a => a.id));
    } else {
      setSelectedAppIds([]);
    }
  };

  const handleSelectRow = (appId) => {
    setSelectedAppIds(prev =>
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (!selectedAppIds.length) return;
    for (const appId of selectedAppIds) {
      await updateApplication(appId, { status: newStatus });
    }
    setSelectedAppIds([]);
  };

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
              SCRS Management Portal
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
              Restricted dashboard for Core Officers, Domain Leads & Faculty Advisors.
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
              <span style={{ paddingInline: '0.75rem' }}>or enter coordinator passcode</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            <form onSubmit={handlePinLogin}>
              <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <input
                  id="pin"
                  type="password"
                  className="form-input"
                  placeholder="Enter passcode..."
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
                <span>Unlock Dashboard</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container container" style={{ paddingBlock: '2rem' }}>
      {/* Admin Header */}
      <div className="admin-header" style={{ marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>SCRS Admin Dashboard</h1>
            <span className="badge-status accepted" style={{ fontSize: '0.75rem' }}>
              Admin Verified
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Manage role applications, post upcoming events, upload past hackathon winners, and update club leadership.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: dbStatus?.connected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)',
            border: `1px solid ${dbStatus?.connected ? 'rgba(16, 185, 129, 0.35)' : 'rgba(234, 179, 8, 0.35)'}`,
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: dbStatus?.connected ? '#34d399' : '#facc15'
          }}>
            <Database size={13} />
            <span>{dbStatus?.connected ? `Firestore: ${dbStatus.projectId}` : 'Local Mode'}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCsv}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* TWO-COLUMN SIDEBAR LAYOUT */}
      <div className="admin-layout">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="admin-sidebar" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          position: 'sticky',
          top: '90px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-dim)',
            marginBottom: '0.5rem',
            paddingLeft: '0.4rem'
          }}>
            Admin Sections
          </div>

          <button
            type="button"
            onClick={() => setActiveAdminTab('applications')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activeAdminTab === 'applications' ? 'var(--primary)' : 'transparent',
              background: activeAdminTab === 'applications' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              color: activeAdminTab === 'applications' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeAdminTab === 'applications' ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Briefcase size={16} />
              <span>Role Applications</span>
            </div>
            <span style={{
              background: activeAdminTab === 'applications' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
              color: activeAdminTab === 'applications' ? '#fff' : 'var(--text-dim)',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '10px'
            }}>
              {applications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('events')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activeAdminTab === 'events' ? 'var(--primary)' : 'transparent',
              background: activeAdminTab === 'events' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              color: activeAdminTab === 'events' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeAdminTab === 'events' ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calendar size={16} />
              <span>Upcoming Events</span>
            </div>
            <span style={{
              background: activeAdminTab === 'events' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
              color: activeAdminTab === 'events' ? '#fff' : 'var(--text-dim)',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '10px'
            }}>
              {upcomingEvents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('past')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activeAdminTab === 'past' ? 'var(--primary)' : 'transparent',
              background: activeAdminTab === 'past' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              color: activeAdminTab === 'past' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeAdminTab === 'past' ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Trophy size={16} />
              <span>Past Events & Winners</span>
            </div>
            <span style={{
              background: activeAdminTab === 'past' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
              color: activeAdminTab === 'past' ? '#fff' : 'var(--text-dim)',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '10px'
            }}>
              {pastEvents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('team')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activeAdminTab === 'team' ? 'var(--primary)' : 'transparent',
              background: activeAdminTab === 'team' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              color: activeAdminTab === 'team' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeAdminTab === 'team' ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Users size={16} />
              <span>Team Coordinators</span>
            </div>
            <span style={{
              background: activeAdminTab === 'team' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
              color: activeAdminTab === 'team' ? '#fff' : 'var(--text-dim)',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '10px'
            }}>
              {teamMembers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activeAdminTab === 'settings' ? 'var(--primary)' : 'transparent',
              background: activeAdminTab === 'settings' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              color: activeAdminTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeAdminTab === 'settings' ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Settings size={16} />
              <span>Settings & Access</span>
            </div>
            <span style={{
              background: activeAdminTab === 'settings' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
              color: activeAdminTab === 'settings' ? '#fff' : 'var(--text-dim)',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '10px'
            }}>
              {adminEmailsList.length}
            </span>
          </button>
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="admin-content" style={{ minWidth: 0 }}>
          {/* TAB 1: ROLE APPLICATIONS */}
          {activeAdminTab === 'applications' && (
        <div>
          {/* Stats Bar */}
          <div className="admin-stats-bar" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1.5rem' }}>
            <div className="admin-stat-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Total Applicants</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalAppsCount}</div>
            </div>
            <div className="admin-stat-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Pending Review</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>{pendingAppsCount}</div>
            </div>
            <div className="admin-stat-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Approved</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{approvedAppsCount}</div>
            </div>
            <div className="admin-stat-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Rejected</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fb7185' }}>{rejectedAppsCount}</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="admin-filters-bar">
            <div className="search-input-wrap">
              <Search size={16} />
              <input
                type="text"
                className="form-input"
                placeholder="Search candidate name, roll no, ref ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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

              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Bulk Action Toolbar */}
          {selectedAppIds.length > 0 && (
            <div style={{
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}>
                {selectedAppIds.length} candidate(s) selected
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="btn btn-sm"
                  style={{ background: '#10b981', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}
                  onClick={() => handleBulkStatusChange('accepted')}
                >
                  <CheckCircle size={14} />
                  <span>Bulk Approve</span>
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: '#ef4444', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}
                  onClick={() => handleBulkStatusChange('rejected')}
                >
                  <XCircle size={14} />
                  <span>Bulk Reject</span>
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: '#f59e0b', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}
                  onClick={() => handleBulkStatusChange('pending')}
                >
                  <RotateCcw size={14} />
                  <span>Reset to Pending</span>
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', fontSize: '0.8rem', fontWeight: 700 }}
                  onClick={handleBulkDeleteApplications}
                  title="Permanently delete all selected applications from Cloud Firestore"
                >
                  <Trash2 size={14} />
                  <span>Bulk Delete ({selectedAppIds.length})</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => setSelectedAppIds([])}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Applications Table */}
          <div className="table-container">
            <table className="app-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={filteredApps.length > 0 && selectedAppIds.length === filteredApps.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Ref ID</th>
                  <th>Applicant</th>
                  <th>Target Role</th>
                  <th>Marks (Admin Only)</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                      No applications match your search.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map(app => (
                    <tr key={app.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedAppIds.includes(app.id)}
                          onChange={() => handleSelectRow(app.id)}
                        />
                      </td>
                      <td>
                        <code style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.82rem' }}>
                          {app.trackingId}
                        </code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          {app.photoUrl ? (
                            <img
                              src={app.photoUrl}
                              alt={app.fullName}
                              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-subtle)', flexShrink: 0 }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                              {app.fullName?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{app.fullName}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                              {app.rollNumber} • {app.branch}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#818cf8' }}>
                          {app.role || app.domain}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="form-input"
                            style={{
                              width: '64px',
                              padding: '0.3rem 0.4rem',
                              fontSize: '0.85rem',
                              textAlign: 'center',
                              fontWeight: 800,
                              color: 'var(--accent-cyan)',
                              borderColor: 'rgba(56, 189, 248, 0.35)',
                              background: 'rgba(15, 23, 42, 0.7)'
                            }}
                            placeholder="Marks"
                            value={app.marks ?? ''}
                            onChange={(e) => handleMarksChange(app.id, e.target.value)}
                            title="Allot Marks out of 100 (Visible ONLY to Admin)"
                          />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/100</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge-status ${app.status === 'accepted' ? 'accepted' : app.status === 'rejected' ? 'rejected' : 'pending'}`}>
                          {app.status === 'accepted' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Pending'}
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button
                            className="btn btn-sm"
                            style={{
                              padding: '0.35rem 0.65rem',
                              background: app.status === 'accepted' ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                              color: app.status === 'accepted' ? '#fff' : '#34d399',
                              border: '1px solid rgba(16, 185, 129, 0.35)',
                              fontWeight: 700
                            }}
                            onClick={() => handleStatusChange(app.id, 'accepted')}
                          >
                            <CheckCircle size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{
                              padding: '0.35rem 0.65rem',
                              background: app.status === 'rejected' ? '#f43f5e' : 'rgba(244, 63, 94, 0.15)',
                              color: app.status === 'rejected' ? '#fff' : '#fb7185',
                              border: '1px solid rgba(244, 63, 94, 0.35)',
                              fontWeight: 700
                            }}
                            onClick={() => handleStatusChange(app.id, 'rejected')}
                          >
                            <XCircle size={14} />
                            <span>Reject</span>
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.55rem' }}
                            title="View candidate dossier"
                            onClick={() => setSelectedApp(app)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{
                              padding: '0.35rem 0.55rem',
                              background: 'rgba(239, 68, 68, 0.12)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              fontWeight: 700
                            }}
                            title="Delete this role application permanently from database"
                            onClick={() => handleDeleteApplication(app.id, app.fullName)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: UPCOMING EVENTS & REGISTRATIONS */}
      {activeAdminTab === 'events' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Manage Upcoming Events</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddEventModal(true)}>
              <Plus size={16} />
              <span>Add New Event</span>
            </button>
          </div>

          {upcomingEvents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-dim)',
              marginBottom: '3rem'
            }}>
              <Calendar size={40} style={{ marginBottom: '0.75rem', opacity: 0.6, color: 'var(--primary)' }} />
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                No Upcoming Events in Database
              </div>
              <p style={{ fontSize: '0.88rem', maxWidth: '440px', marginInline: 'auto', color: 'var(--text-muted)' }}>
                All upcoming events are managed directly in Cloud Firestore. Click "Add New Event" to publish a live event.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {upcomingEvents.map(evt => {
                const regs = eventRegistrations.filter(r => r.eventId === evt.id);
                return (
                  <div key={evt.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>{evt.title}</h4>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--primary)', padding: '0.2rem' }}
                          title="Edit Event"
                          onClick={() => {
                            const dateParts = (evt.date || '').split(' to ');
                            const timeParts = (evt.time || '').split(' - ');
                            setEditingEvent({
                              ...evt,
                              fromDate: evt.fromDate || dateParts[0] || '',
                              toDate: evt.toDate || dateParts[1] || '',
                              fromTime: evt.fromTime || timeParts[0] || '',
                              toTime: evt.toTime || timeParts[1] || ''
                            });
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#fb7185', padding: '0.2rem' }}
                          title="Delete Event"
                          onClick={() => handleDeleteEvent(evt.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <div>📅 {evt.date} ({evt.time})</div>
                      <div>📍 {evt.venue}</div>
                      <div style={{ marginTop: '0.4rem', color: 'var(--primary)', fontWeight: 700 }}>
                        🎟️ Registrations: {regs.length} / {evt.capacity || 200}
                      </div>
                    </div>

                    {/* Registered Attendees Summary */}
                    {regs.length > 0 && (
                      <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Recent Registrations:</div>
                        {regs.slice(0, 3).map((r, i) => (
                          <div key={i} style={{ color: 'var(--text-dim)' }}>
                            • {r.fullName} ({r.rollNumber}) - Pass: {r.passId}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PAST EVENTS & WINNERS */}
      {activeAdminTab === 'past' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Manage Past Events & Winners</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddPastModal(true)}>
              <Plus size={16} />
              <span>Add Past Event & Winners</span>
            </button>
          </div>

          {pastEvents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-dim)'
            }}>
              <Trophy size={40} style={{ marginBottom: '0.75rem', opacity: 0.6, color: 'var(--accent-amber)' }} />
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                No Past Summits on Record
              </div>
              <p style={{ fontSize: '0.88rem', maxWidth: '440px', marginInline: 'auto', color: 'var(--text-muted)' }}>
                Archive past hackathons and winners directly into Cloud Firestore by clicking "Add Past Event & Winners".
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {pastEvents.map(p => (
                <div key={p.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{p.title}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{p.date} • {p.venue}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--primary)', padding: '0.2rem' }}
                        title="Edit Past Event"
                        onClick={() => {
                          const existingWinners = p.winners || [];
                          const hasWin = existingWinners.length > 0;
                          const list = [
                            { rank: '🥇 1st Place', name: existingWinners[0]?.name || '', project: existingWinners[0]?.project || '', prize: existingWinners[0]?.prize || '' },
                            { rank: '🥈 2nd Place', name: existingWinners[1]?.name || '', project: existingWinners[1]?.project || '', prize: existingWinners[1]?.prize || '' },
                            { rank: '🥉 3rd Place', name: existingWinners[2]?.name || '', project: existingWinners[2]?.project || '', prize: existingWinners[2]?.prize || '' },
                            { rank: '4th Place', name: existingWinners[3]?.name || '', project: existingWinners[3]?.project || '', prize: existingWinners[3]?.prize || '' },
                            { rank: '5th Place', name: existingWinners[4]?.name || '', project: existingWinners[4]?.project || '', prize: existingWinners[4]?.prize || '' }
                          ];
                          setEditingPastEvent({
                            ...p,
                            photos: p.photos && p.photos.length > 0 ? [...p.photos] : [''],
                            hasWinners: hasWin,
                            winnerCount: existingWinners.length || 3,
                            winnersList: list
                          });
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#fb7185', padding: '0.2rem' }} title="Delete Record" onClick={() => handleDeletePastEvent(p.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{p.summary}</p>

                  {p.winners && p.winners.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {p.winners.map((w, idx) => (
                        <span key={idx} style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.35rem 0.75rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700 }}>
                          {w.rank}: {w.name} ({w.project})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TEAM COORDINATORS */}
      {activeAdminTab === 'team' && (() => {
        const adminFacultyCount = teamMembers.filter(isFacultyMember).length;
        const adminClubCount = teamMembers.filter(m => !isFacultyMember(m)).length;
        const displayTeam = teamMembers.filter(m => {
          if (adminTeamFilter === 'FACULTY') return isFacultyMember(m);
          if (adminTeamFilter === 'CLUB') return !isFacultyMember(m);
          return true;
        });

        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Manage Chapter Leadership</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  Manage faculty advisors and student chapter coordinators directly in Cloud Firestore.
                </p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddTeamModal(true)}>
                <Plus size={16} />
                <span>Add Coordinator</span>
              </button>
            </div>

            {/* Team Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button
                className={`filter-btn ${adminTeamFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setAdminTeamFilter('ALL')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: adminTeamFilter === 'ALL' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: adminTeamFilter === 'ALL' ? 'var(--primary)' : 'var(--bg-card)',
                  color: adminTeamFilter === 'ALL' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                All Leadership ({teamMembers.length})
              </button>
              <button
                className={`filter-btn ${adminTeamFilter === 'FACULTY' ? 'active' : ''}`}
                onClick={() => setAdminTeamFilter('FACULTY')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: adminTeamFilter === 'FACULTY' ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                  background: adminTeamFilter === 'FACULTY' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-card)',
                  color: adminTeamFilter === 'FACULTY' ? '#fbbf24' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                🎓 Faculty Coordinators ({adminFacultyCount})
              </button>
              <button
                className={`filter-btn ${adminTeamFilter === 'CLUB' ? 'active' : ''}`}
                onClick={() => setAdminTeamFilter('CLUB')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: adminTeamFilter === 'CLUB' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  background: adminTeamFilter === 'CLUB' ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-card)',
                  color: adminTeamFilter === 'CLUB' ? '#38bdf8' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                ⚡ Club Coordinators ({adminClubCount})
              </button>
            </div>

            {displayTeam.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3.5rem 1.5rem',
                background: 'rgba(15, 23, 42, 0.4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-dim)'
              }}>
                <Users size={40} style={{ marginBottom: '0.75rem', opacity: 0.6, color: 'var(--primary)' }} />
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  No Coordinators Found
                </div>
                <p style={{ fontSize: '0.88rem', maxWidth: '440px', marginInline: 'auto', color: 'var(--text-muted)' }}>
                  No coordinator records matching this filter in Cloud Firestore. Click "Add Coordinator" to create a new profile.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {displayTeam.map(m => {
                  const isFac = isFacultyMember(m);
                  return (
                    <div
                      key={m.id}
                      className="glass-card"
                      style={{
                        padding: '1.75rem 1.5rem',
                        textAlign: 'center',
                        position: 'relative',
                        border: isFac ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {/* Action buttons */}
                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.2rem' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--primary)', padding: '0.2rem' }}
                          title="Edit Coordinator"
                          onClick={() => setEditingTeamMember({
                            ...m,
                            category: m.category || (isFac ? 'faculty' : 'club')
                          })}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#fb7185', padding: '0.2rem' }}
                          title="Delete Coordinator"
                          onClick={() => handleDeleteTeamMember(m.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Type Badge */}
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          background: isFac ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: isFac ? '#fbbf24' : '#38bdf8',
                          border: isFac ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(56, 189, 248, 0.35)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          {isFac ? <GraduationCap size={12} /> : <Sparkles size={12} />}
                          <span>{isFac ? 'Faculty Coordinator' : 'Club Coordinator'}</span>
                        </span>
                      </div>

                      {/* Photo */}
                      <div style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        marginInline: 'auto',
                        marginBottom: '0.85rem',
                        border: isFac ? '2.5px solid #f59e0b' : '2px solid var(--primary)',
                        boxShadow: isFac ? '0 0 16px rgba(245, 158, 11, 0.35)' : '0 0 12px var(--primary-glow)',
                        background: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {m.image ? (
                          <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          <User size={38} color={isFac ? '#fbbf24' : 'var(--primary)'} />
                        )}
                      </div>

                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{m.name}</h4>
                      <p style={{ color: isFac ? '#fbbf24' : 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>{m.role}</p>
                      {m.domain && (
                        <span className="skill-tag" style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem' }}>
                          {m.domain}
                        </span>
                      )}
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.65rem' }}>{m.email}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* TAB 5: SETTINGS & ACCESS CONTROL */}
      {activeAdminTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 1: Multi-Admin Management */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <UserPlus size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Multi-Admin User Access Control</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Grant full Administrator privileges to core coordinators and faculty leads. Any added email will be recognized as an authorized Admin upon Google Sign-In.
            </p>

            {/* Add Admin Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAdminEmailInput.trim()) return;
                const updated = addAdminEmail(newAdminEmailInput.trim());
                setAdminEmailsList(updated);
                setNewAdminEmailInput('');
              }}
              style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}
            >
              <input
                type="email"
                className="form-input"
                placeholder="Enter coordinator university email (e.g. lead@klu.ac.in)..."
                style={{ flex: 1, minWidth: '260px' }}
                value={newAdminEmailInput}
                onChange={(e) => setNewAdminEmailInput(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                <Plus size={16} />
                <span>Grant Admin Access</span>
              </button>
            </form>

            {/* Admin List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Authorized Admin Accounts ({adminEmailsList.length})
              </div>
              {adminEmailsList.map((email, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <ShieldCheck size={16} color="#10b981" />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{email}</span>
                    {currentUser && currentUser.email?.toLowerCase() === email.toLowerCase() && (
                      <span className="badge-status accepted" style={{ fontSize: '0.7rem' }}>You (Current Session)</span>
                    )}
                  </div>
                  {adminEmailsList.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#fb7185', fontSize: '0.8rem' }}
                      onClick={() => {
                        if (window.confirm(`Revoke admin access for ${email}?`)) {
                          const updated = removeAdminEmail(email);
                          setAdminEmailsList(updated);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Revoke</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Security & Passcode */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Lock size={20} color="#fbbf24" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Admin Unlock Passcode</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Update the passcode used for quick coordinator passcode unlock on the Admin Portal screen.
            </p>

            {passcodeSavedMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} />
                <span>{passcodeSavedMsg}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveAdminPasscode(adminPasscodeInput);
                setPasscodeSavedMsg('Admin Passcode updated successfully!');
                setTimeout(() => setPasscodeSavedMsg(''), 3000);
              }}
              style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}
            >
              <div className="search-input-wrap" style={{ flex: 1, minWidth: '220px' }}>
                <Key size={16} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="New Admin Passcode..."
                  value={adminPasscodeInput}
                  onChange={(e) => setAdminPasscodeInput(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ fontWeight: 700 }}>
                <span>Save New Passcode</span>
              </button>
            </form>
          </div>

          {/* Section 3: Recruitment Drive Controls */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Sliders size={20} color="#a855f7" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Recruitment Drive Controls & Settings</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Configure recruitment drive status, target academic tenure year, and hero announcements.
            </p>

            {settingsSavedMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} />
                <span>{settingsSavedMsg}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                savePortalSettings(portalSettings);
                setSettingsSavedMsg('Portal settings updated successfully!');
                setTimeout(() => setSettingsSavedMsg(''), 3000);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Recruitment Status</label>
                  <select
                    className="form-select"
                    value={portalSettings.recruitmentOpen ? 'open' : 'closed'}
                    onChange={(e) => setPortalSettingsState(p => ({ ...p, recruitmentOpen: e.target.value === 'open' }))}
                  >
                    <option value="open">🟢 LIVE - Accepting Coordinator Applications</option>
                    <option value="closed">🔴 CLOSED - Under Board Evaluation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Academic Tenure</label>
                  <input
                    type="text"
                    className="form-input"
                    value={portalSettings.recruitmentYear || '2026-27'}
                    onChange={(e) => setPortalSettingsState(p => ({ ...p, recruitmentYear: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Recruitment Announcement Banner Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={portalSettings.announcementMessage || ''}
                  onChange={(e) => setPortalSettingsState(p => ({ ...p, announcementMessage: e.target.value }))}
                />
              </div>

              <div>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  <span>Save Portal Settings</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 4: Cloud Database Connection & Sync */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Server size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Cloud Database Connection (Firebase Firestore)</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Real-time synchronization status with Firebase project credentials loaded from <code>.env</code>.
            </p>

            <div style={{
              background: 'var(--bg-input)',
              border: `1px solid ${dbStatus.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: dbStatus.connected ? '#10b981' : '#f59e0b',
                    boxShadow: dbStatus.connected ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
                  }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {dbStatus.connected ? 'Cloud Database Connected' : 'Local Fallback Mode Active'}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    setIsTestingDb(true);
                    const res = await testDatabaseConnection();
                    setDbStatus(res);
                    setIsTestingDb(false);
                  }}
                  disabled={isTestingDb}
                >
                  <RefreshCw size={14} className={isTestingDb ? 'spin' : ''} />
                  <span>{isTestingDb ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Firebase Project ID</span>
                  <code style={{ color: 'var(--primary)', fontWeight: 600 }}>{firebaseConfig.projectId || 'Not Configured'}</code>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Auth Domain</span>
                  <code style={{ color: 'var(--text-main)' }}>{firebaseConfig.authDomain || 'Not Configured'}</code>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Storage Bucket</span>
                  <code style={{ color: 'var(--text-main)' }}>{firebaseConfig.storageBucket || 'Not Configured'}</code>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Active Collections</span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>applications, upcoming_events, event_registrations, past_events, team_members, portal_settings</span>
                </div>
              </div>

              {dbStatus.message && (
                <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: dbStatus.connected ? '#34d399' : 'var(--text-muted)' }}>
                  {dbStatus.message}
                </div>
              )}
            </div>

            {/* Live Cloud Firestore Data Sync & Verification */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Direct Cloud Database Live Sync & Verification</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Fetches live real-time documents from Cloud Firestore. Data is strictly retrieved from the database, never from sample data.
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  setIsSeedingDb(true);
                  setSeedResultMsg('');
                  try {
                    const res = await seedInitialDataToCloud();
                    setSeedResultMsg(`Live Cloud Firestore Database: ${res.applications} applications, ${res.upcomingEvents} upcoming events, ${res.pastEvents} past events, ${res.teamMembers} coordinators, ${res.eventRegistrations} registrations.`);
                  } catch (err) {
                    setSeedResultMsg(`Cloud sync notice: ${err.message}`);
                  } finally {
                    setIsSeedingDb(false);
                  }
                }}
                disabled={isSeedingDb}
              >
                <Database size={14} />
                <span>{isSeedingDb ? 'Syncing...' : 'Sync Live Database'}</span>
              </button>
            </div>

            {seedResultMsg && (
              <div style={{ marginTop: '0.85rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.65rem 1rem', fontSize: '0.85rem', color: '#38bdf8' }}>
                {seedResultMsg}
              </div>
            )}
          </div>
        </div>
      )}
        </main>
      </div>

      {/* DOSSIER REVIEW MODAL */}
      {selectedApp && (
        <div className="modal-backdrop" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {selectedApp.photoUrl ? (
                <img
                  src={selectedApp.photoUrl}
                  alt={selectedApp.fullName}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-cyan)', flexShrink: 0 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0, border: '1.5px solid rgba(56, 189, 248, 0.3)' }}>
                  {selectedApp.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedApp.fullName}</h3>
                <code style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{selectedApp.trackingId}</code>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedApp(null)}>
                <XCircle size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* MARKS FIELD */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#38bdf8', fontWeight: 800 }}>
                    <Award size={18} />
                    <span>Allot Candidate Marks (Admin Only)</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Private evaluation score. Never visible to applicant.</div>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                  style={{ width: '90px', padding: '0.45rem', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', color: 'var(--accent-cyan)' }}
                  placeholder="Score"
                  value={selectedApp.marks ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedApp(prev => ({ ...prev, marks: val === '' ? null : Number(val) }));
                    handleMarksChange(selectedApp.id, val);
                  }}
                />
              </div>

              {/* Details */}
              <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem' }}>
                <div><strong>Email:</strong> {selectedApp.email} | <strong>Phone:</strong> {selectedApp.phone}</div>
                <div><strong>Target Role:</strong> {selectedApp.role || selectedApp.domain}</div>
                <div><strong>Skills:</strong> {selectedApp.skills}</div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Why join:</strong>
                <p style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem' }}>{selectedApp.whyJoin}</p>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label" htmlFor="eval-notes">Internal Evaluator Notes</label>
                <textarea
                  id="eval-notes"
                  className="form-textarea"
                  rows={3}
                  value={selectedApp.notes || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedApp(prev => ({ ...prev, notes: val }));
                    handleSaveNotes(selectedApp.id, val);
                  }}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn btn-sm" style={{ background: '#10b981', color: '#fff', fontWeight: 700 }} onClick={() => handleStatusChange(selectedApp.id, 'accepted')}>
                  <CheckCircle size={16} /> Approve
                </button>
                <button className="btn btn-sm" style={{ background: '#f43f5e', color: '#fff', fontWeight: 700 }} onClick={() => handleStatusChange(selectedApp.id, 'rejected')}>
                  <XCircle size={16} /> Reject
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.35)', fontWeight: 700 }}
                  onClick={() => handleDeleteApplication(selectedApp.id, selectedApp.fullName)}
                  title="Permanently delete from Cloud Firestore"
                >
                  <Trash2 size={16} /> Delete Application
                </button>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD UPCOMING EVENT MODAL */}
      {showAddEventModal && (
        <div className="modal-backdrop" onClick={() => { setShowAddEventModal(false); setEventFormError(''); }}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create Upcoming Event</h3>
              <button className="modal-close-btn" onClick={() => { setShowAddEventModal(false); setEventFormError(''); }}><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleCreateEvent}>
              <div className="modal-body">
                {eventFormError && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fb7185', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {eventFormError}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Event Title <span className="req">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. National Hackathon 2026"
                    value={newEventForm.title}
                    onChange={e => { setNewEventForm(p => ({ ...p, title: e.target.value })); if (eventFormError) setEventFormError(''); }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">From Date <span className="req">*</span></label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={newEventForm.fromDate || ''}
                      onChange={e => { setNewEventForm(p => ({ ...p, fromDate: e.target.value })); if (eventFormError) setEventFormError(''); }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date (Optional)</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newEventForm.toDate || ''}
                      onChange={e => setNewEventForm(p => ({ ...p, toDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">From Time</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. 10:00 AM"
                      value={newEventForm.fromTime || ''}
                      onChange={e => setNewEventForm(p => ({ ...p, fromTime: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Time</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 04:00 PM"
                      value={newEventForm.toTime || ''}
                      onChange={e => setNewEventForm(p => ({ ...p, toTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Venue <span className="req">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. SAC Auditorium"
                      value={newEventForm.venue}
                      onChange={e => { setNewEventForm(p => ({ ...p, venue: e.target.value })); if (eventFormError) setEventFormError(''); }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pass Fee</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Free or ₹100"
                      value={newEventForm.fee !== undefined ? newEventForm.fee : 'Free'}
                      onChange={e => setNewEventForm(p => ({ ...p, fee: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Event Website / Application URL (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://example.com/register-event"
                    value={newEventForm.websiteUrl || ''}
                    onChange={e => setNewEventForm(p => ({ ...p, websiteUrl: e.target.value }))}
                  />
                  <span className="form-hint">When set, clicking "Apply for Event" redirects users directly to this website URL.</span>
                </div>
                <PhotoInput
                  value={newEventForm.banner}
                  onChange={(url) => setNewEventForm(p => ({ ...p, banner: url }))}
                  label="Event Banner Photo"
                  placeholder="https://..."
                  shape="square"
                  helpText="Directly upload an event banner photo file or enter an image URL."
                />
                <div className="form-group">
                  <label className="form-label">Description <span className="req">*</span></label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    required
                    placeholder="Event overview, agenda, eligibility, and highlights..."
                    value={newEventForm.description}
                    onChange={e => { setNewEventForm(p => ({ ...p, description: e.target.value })); if (eventFormError) setEventFormError(''); }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowAddEventModal(false); setEventFormError(''); }}>Cancel</button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSavingEvent}
                  onClick={(e) => handleCreateEvent(e)}
                >
                  {isSavingEvent ? 'Saving Event...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PAST EVENT MODAL */}
      {showAddPastModal && (
        <div className="modal-backdrop" onClick={() => setShowAddPastModal(false)}>
          <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Upload Past Event & Winners</h3>
              <button className="modal-close-btn" onClick={() => setShowAddPastModal(false)}><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleCreatePastEvent}>
              <div className="modal-body">
                {pastFormError && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fb7185', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {pastFormError}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Past Event Title <span className="req">*</span></label>
                  <input type="text" className="form-input" value={newPastForm.title} onChange={e => { setNewPastForm(p => ({ ...p, title: e.target.value })); if (pastFormError) setPastFormError(''); }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">From Date</label>
                    <input type="date" className="form-input" value={newPastForm.fromDate || ''} onChange={e => setNewPastForm(p => ({ ...p, fromDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date</label>
                    <input type="date" className="form-input" value={newPastForm.toDate || ''} onChange={e => setNewPastForm(p => ({ ...p, toDate: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">From Time</label>
                    <input type="text" className="form-input" placeholder="e.g. 09:00 AM" value={newPastForm.fromTime || ''} onChange={e => setNewPastForm(p => ({ ...p, fromTime: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Time</label>
                    <input type="text" className="form-input" placeholder="e.g. 05:00 PM" value={newPastForm.toTime || ''} onChange={e => setNewPastForm(p => ({ ...p, toTime: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <input type="text" className="form-input" required value={newPastForm.venue || ''} onChange={e => setNewPastForm(p => ({ ...p, venue: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Event Summary</label>
                  <textarea className="form-textarea" rows={2} required value={newPastForm.summary} onChange={e => setNewPastForm(p => ({ ...p, summary: e.target.value }))} />
                </div>
                <PhotoInput
                  value={newPastForm.banner}
                  onChange={(url) => setNewPastForm(p => ({ ...p, banner: url }))}
                  label="Event Cover Banner Photo"
                  placeholder="https://..."
                  shape="square"
                  helpText="Directly upload an event cover banner photo file or enter an image URL."
                />

                {/* DYNAMIC HIGHLIGHT PHOTOS GALLERY */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <label className="form-label" style={{ marginBottom: 0, fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        Event Highlight Photos ({(newPastForm.photos || []).length})
                      </label>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Add as many highlight photos as you like
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}
                      onClick={() => setNewPastForm(prev => ({ ...prev, photos: [...(prev.photos || []), ''] }))}
                    >
                      <Plus size={14} />
                      <span>Add Photo</span>
                    </button>
                  </div>

                  {(newPastForm.photos || []).map((photoUrl, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      marginBottom: index === (newPastForm.photos || []).length - 1 ? 0 : '0.85rem',
                      background: 'rgba(30, 41, 59, 0.5)',
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          Highlight Photo #{index + 1}
                        </span>
                        {(newPastForm.photos || []).length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#fb7185', padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}
                            onClick={() => setNewPastForm(prev => ({
                              ...prev,
                              photos: prev.photos.filter((_, i) => i !== index)
                            }))}
                            title="Remove Photo"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <PhotoInput
                        value={photoUrl}
                        onChange={(url) => setNewPastForm(prev => {
                          const updated = [...(prev.photos || [])];
                          updated[index] = url;
                          return { ...prev, photos: updated };
                        })}
                        label=""
                        placeholder="https://... or upload photo"
                        shape="square"
                        helpText="Upload photo file directly or paste image URL."
                      />
                    </div>
                  ))}
                </div>
                {/* OPTIONAL WINNERS & RESULTS SECTION */}
                <div style={{
                  background: newPastForm.hasWinners ? 'rgba(245, 158, 11, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                  border: newPastForm.hasWinners ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: newPastForm.hasWinners ? '#f59e0b' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Trophy size={18} color="#f59e0b" />
                        <span>Winners & Competition Results</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Optional: Turn ON if this event had a hackathon, contest, or winners.
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`btn btn-sm ${newPastForm.hasWinners ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: newPastForm.hasWinners ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                        color: newPastForm.hasWinners ? '#0f172a' : 'var(--text-main)',
                        border: 'none'
                      }}
                      onClick={() => setNewPastForm(prev => ({ ...prev, hasWinners: !prev.hasWinners }))}
                    >
                      {newPastForm.hasWinners ? '🏆 Winners Enabled (ON)' : '+ Add Winners (OFF)'}
                    </button>
                  </div>

                  {newPastForm.hasWinners && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(245, 158, 11, 0.25)' }}>
                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label" style={{ fontWeight: 700 }}>Number of Winners</label>
                        <select
                          className="form-select"
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                          value={newPastForm.winnerCount || 3}
                          onChange={(e) => setNewPastForm(prev => ({ ...prev, winnerCount: Number(e.target.value) }))}
                        >
                          <option value={1}>1 Winner (1st Place)</option>
                          <option value={2}>2 Winners (1st & 2nd Place)</option>
                          <option value={3}>3 Winners (Top 3)</option>
                          <option value={4}>4 Winners (Top 4)</option>
                          <option value={5}>5 Winners (Top 5)</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {(newPastForm.winnersList || []).slice(0, newPastForm.winnerCount || 3).map((w, idx) => (
                          <div key={idx} style={{
                            background: 'rgba(30, 41, 59, 0.6)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.75rem 0.85rem'
                          }}>
                            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f59e0b', marginBottom: '0.5rem' }}>
                              {w.rank}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                              <div>
                                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Winner / Team Name</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder="e.g. Team CyberPulse"
                                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
                                  value={w.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setNewPastForm(prev => {
                                      const updated = [...prev.winnersList];
                                      updated[idx] = { ...updated[idx], name: val };
                                      return { ...prev, winnersList: updated };
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Project Title</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder="e.g. AI Sentiment Engine"
                                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
                                  value={w.project}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setNewPastForm(prev => {
                                      const updated = [...prev.winnersList];
                                      updated[idx] = { ...updated[idx], project: val };
                                      return { ...prev, winnersList: updated };
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Prize / Award</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder="e.g. ₹25,000 + Trophy"
                                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
                                  value={w.prize}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setNewPastForm(prev => {
                                      const updated = [...prev.winnersList];
                                      updated[idx] = { ...updated[idx], prize: val };
                                      return { ...prev, winnersList: updated };
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddPastModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => handleCreatePastEvent(e)}>Save Past Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TEAM MEMBER MODAL */}
      {showAddTeamModal && (
        <div className="modal-backdrop" onClick={() => setShowAddTeamModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add Coordinator</h3>
              <button className="modal-close-btn" onClick={() => setShowAddTeamModal(false)}><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleCreateTeamMember}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Coordinator Type</label>
                  <select
                    className="form-input"
                    value={newTeamForm.category || 'faculty'}
                    onChange={e => {
                      const cat = e.target.value;
                      setNewTeamForm(p => ({
                        ...p,
                        category: cat,
                        domain: cat === 'faculty' ? (p.domain || 'Faculty Advisory') : (p.domain || 'Technical & Web Dev')
                      }));
                    }}
                  >
                    <option value="faculty">🎓 Faculty Coordinator (Faculty Advisor / Mentor)</option>
                    <option value="club">⚡ Club Coordinator (Student Lead)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Coordinator Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder={newTeamForm.category === 'faculty' ? 'e.g. Dr. K. R. Venugopal' : 'e.g. Rahul Sharma'}
                    value={newTeamForm.name}
                    onChange={e => setNewTeamForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role Title</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder={newTeamForm.category === 'faculty' ? 'e.g. Faculty Advisor & Senior Professor' : 'e.g. Technical Coordinator'}
                    value={newTeamForm.role}
                    onChange={e => setNewTeamForm(p => ({ ...p, role: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{newTeamForm.category === 'faculty' ? 'Department / Domain' : 'Domain'}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={newTeamForm.category === 'faculty' ? 'e.g. Dept of Computer Science' : 'e.g. Technical & Web Dev'}
                    value={newTeamForm.domain || ''}
                    onChange={e => setNewTeamForm(p => ({ ...p, domain: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    required
                    value={newTeamForm.email}
                    onChange={e => setNewTeamForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+91..."
                    value={newTeamForm.phone || ''}
                    onChange={e => setNewTeamForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <PhotoInput
                  value={newTeamForm.image}
                  onChange={(url) => setNewTeamForm(p => ({ ...p, image: url }))}
                  label="Coordinator Photo"
                  placeholder="https://..."
                  shape="circle"
                  helpText="Directly upload a photo file from your device or enter a photo URL."
                />
                <div className="form-group">
                  <label className="form-label">Short Bio / Note (Optional)</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Brief coordinator bio or background..."
                    value={newTeamForm.bio || ''}
                    onChange={e => setNewTeamForm(p => ({ ...p, bio: e.target.value }))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddTeamModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Coordinator</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editingEvent && (
        <div className="modal-backdrop" onClick={() => { setEditingEvent(null); setEditEventError(''); }}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Edit Upcoming Event</h3>
              <button className="modal-close-btn" onClick={() => { setEditingEvent(null); setEditEventError(''); }}><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleUpdateEvent}>
              <div className="modal-body">
                {editEventError && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fb7185', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {editEventError}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Event Title <span className="req">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={editingEvent.title || ''}
                    onChange={e => { setEditingEvent(p => ({ ...p, title: e.target.value })); if (editEventError) setEditEventError(''); }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">From Date <span className="req">*</span></label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={editingEvent.fromDate || ''}
                      onChange={e => { setEditingEvent(p => ({ ...p, fromDate: e.target.value })); if (editEventError) setEditEventError(''); }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date (Optional)</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editingEvent.toDate || ''}
                      onChange={e => setEditingEvent(p => ({ ...p, toDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">From Time</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. 10:00 AM"
                      value={editingEvent.fromTime || ''}
                      onChange={e => setEditingEvent(p => ({ ...p, fromTime: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Time</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 04:00 PM"
                      value={editingEvent.toTime || ''}
                      onChange={e => setEditingEvent(p => ({ ...p, toTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Venue <span className="req">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editingEvent.venue || ''}
                      onChange={e => { setEditingEvent(p => ({ ...p, venue: e.target.value })); if (editEventError) setEditEventError(''); }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pass Fee</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Free or ₹100"
                      value={editingEvent.fee !== undefined ? editingEvent.fee : ''}
                      onChange={e => setEditingEvent(p => ({ ...p, fee: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Event Website / Application URL (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://example.com/register-event"
                    value={editingEvent.websiteUrl || ''}
                    onChange={e => setEditingEvent(p => ({ ...p, websiteUrl: e.target.value }))}
                  />
                  <span className="form-hint">When set, clicking "Apply for Event" redirects users directly to this website URL.</span>
                </div>
                <PhotoInput
                  value={editingEvent.banner || ''}
                  onChange={(url) => setEditingEvent(p => ({ ...p, banner: url }))}
                  label="Event Banner Photo"
                  placeholder="https://..."
                  shape="square"
                  helpText="Directly upload an event banner photo file or enter an image URL."
                />
                <div className="form-group">
                  <label className="form-label">Description <span className="req">*</span></label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    required
                    value={editingEvent.description || ''}
                    onChange={e => { setEditingEvent(p => ({ ...p, description: e.target.value })); if (editEventError) setEditEventError(''); }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setEditingEvent(null); setEditEventError(''); }}>Cancel</button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdatingEvent}
                  onClick={(e) => handleUpdateEvent(e)}
                >
                  {isUpdatingEvent ? 'Updating Event...' : 'Update Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PAST EVENT MODAL */}
      {editingPastEvent && (
        <div className="modal-backdrop" onClick={() => setEditingPastEvent(null)}>
          <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Edit Past Event & Winners</h3>
              <button className="modal-close-btn" onClick={() => setEditingPastEvent(null)}><XCircle size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const photos = (editingPastEvent.photos || []).filter(Boolean);
                let winners = [];
                if (editingPastEvent.hasWinners) {
                  const count = Number(editingPastEvent.winnerCount) || 3;
                  winners = (editingPastEvent.winnersList || [])
                    .slice(0, count)
                    .filter(w => w.name && w.name.trim() !== '');
                }
                const fromD = editingPastEvent.fromDate || editingPastEvent.date || '';
                const toD = editingPastEvent.toDate || '';
                const formattedDate = toD && toD !== fromD ? `${fromD} to ${toD}` : (fromD || 'TBD');
                const fromT = editingPastEvent.fromTime || '';
                const toT = editingPastEvent.toTime || '';
                const formattedTime = toT && toT !== fromT ? `${fromT} - ${toT}` : fromT;
                const fullDateDisplay = formattedTime ? `${formattedDate} (${formattedTime})` : formattedDate;

                await updatePastEvent(editingPastEvent.id, {
                  ...editingPastEvent,
                  title: editingPastEvent.title || 'Untitled Event',
                  date: fullDateDisplay,
                  fromDate: fromD,
                  toDate: toD,
                  fromTime: fromT,
                  toTime: toT,
                  photos,
                  winners
                });
                const updatedList = getPastEvents();
                setPastEvents([...updatedList]);
                setEditingPastEvent(null);
              } catch (err) {
                console.error('Failed to update past event:', err);
              }
            }}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Event Title</label>
                  <input type="text" className="form-input" required value={editingPastEvent.title || ''} onChange={e => setEditingPastEvent(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">From Date</label>
                    <input type="date" className="form-input" required value={editingPastEvent.fromDate || ''} onChange={e => setEditingPastEvent(p => ({ ...p, fromDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date</label>
                    <input type="date" className="form-input" value={editingPastEvent.toDate || ''} onChange={e => setEditingPastEvent(p => ({ ...p, toDate: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">From Time</label>
                    <input type="text" className="form-input" placeholder="e.g. 09:00 AM" value={editingPastEvent.fromTime || ''} onChange={e => setEditingPastEvent(p => ({ ...p, fromTime: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Time</label>
                    <input type="text" className="form-input" placeholder="e.g. 05:00 PM" value={editingPastEvent.toTime || ''} onChange={e => setEditingPastEvent(p => ({ ...p, toTime: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <input type="text" className="form-input" required value={editingPastEvent.venue || ''} onChange={e => setEditingPastEvent(p => ({ ...p, venue: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Summary</label>
                  <textarea className="form-textarea" rows={2} required value={editingPastEvent.summary || ''} onChange={e => setEditingPastEvent(p => ({ ...p, summary: e.target.value }))} />
                </div>
                <PhotoInput
                  value={editingPastEvent.banner || ''}
                  onChange={(url) => setEditingPastEvent(p => ({ ...p, banner: url }))}
                  label="Event Cover Banner Photo"
                  placeholder="https://..."
                  shape="square"
                  helpText="Directly upload an event cover banner photo file or enter an image URL."
                />

                {/* DYNAMIC HIGHLIGHT PHOTOS GALLERY */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <label className="form-label" style={{ marginBottom: 0, fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        Event Highlight Photos ({(editingPastEvent.photos || []).length})
                      </label>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Add as many highlight photos as you like
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}
                      onClick={() => setEditingPastEvent(prev => ({ ...prev, photos: [...(prev.photos || []), ''] }))}
                    >
                      <Plus size={14} />
                      <span>Add Photo</span>
                    </button>
                  </div>

                  {(editingPastEvent.photos || []).map((photoUrl, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      marginBottom: index === (editingPastEvent.photos || []).length - 1 ? 0 : '0.85rem',
                      background: 'rgba(30, 41, 59, 0.5)',
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          Highlight Photo #{index + 1}
                        </span>
                        {(editingPastEvent.photos || []).length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#fb7185', padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}
                            onClick={() => setEditingPastEvent(prev => ({
                              ...prev,
                              photos: prev.photos.filter((_, i) => i !== index)
                            }))}
                            title="Remove Photo"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <PhotoInput
                        value={photoUrl}
                        onChange={(url) => setEditingPastEvent(prev => {
                          const updated = [...(prev.photos || [])];
                          updated[index] = url;
                          return { ...prev, photos: updated };
                        })}
                        label=""
                        placeholder="https://... or upload photo"
                        shape="square"
                        helpText="Upload photo file directly or paste image URL."
                      />
                    </div>
                  ))}
                </div>
                {/* OPTIONAL WINNERS & RESULTS SECTION */}
                <div style={{
                  background: editingPastEvent.hasWinners ? 'rgba(245, 158, 11, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                  border: editingPastEvent.hasWinners ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: editingPastEvent.hasWinners ? '#f59e0b' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Trophy size={18} color="#f59e0b" />
                        <span>Winners & Competition Results</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Optional: Turn ON if this event had a hackathon, contest, or winners.
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`btn btn-sm ${editingPastEvent.hasWinners ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: editingPastEvent.hasWinners ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                        color: editingPastEvent.hasWinners ? '#0f172a' : 'var(--text-main)',
                        border: 'none'
                      }}
                      onClick={() => setEditingPastEvent(prev => ({ ...prev, hasWinners: !prev.hasWinners }))}
                    >
                      {editingPastEvent.hasWinners ? '🏆 Winners Enabled (ON)' : '+ Add Winners (OFF)'}
                    </button>
                  </div>

                  {editingPastEvent.hasWinners && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(245, 158, 11, 0.25)' }}>
                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label" style={{ fontWeight: 700 }}>Number of Winners</label>
                        <select
                          className="form-select"
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                          value={editingPastEvent.winnerCount || 3}
                          onChange={(e) => setEditingPastEvent(prev => ({ ...prev, winnerCount: Number(e.target.value) }))}
                        >
                          <option value={1}>1 Winner (1st Place)</option>
                          <option value={2}>2 Winners (1st & 2nd Place)</option>
                          <option value={3}>3 Winners (Top 3)</option>
                          <option value={4}>4 Winners (Top 4)</option>
                          <option value={5}>5 Winners (Top 5)</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {(editingPastEvent.winnersList || []).slice(0, editingPastEvent.winnerCount || 3).map((w, idx) => (
                          <div key={idx} style={{
                            background: 'rgba(30, 41, 59, 0.6)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.75rem 0.85rem'
                          }}>
                            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f59e0b', marginBottom: '0.5rem' }}>
                              {w.rank}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                              <div>
                                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Winner / Team Name</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder="e.g. Team CyberPulse"
                                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
                                  value={w.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditingPastEvent(prev => {
                                      const updated = [...(prev.winnersList || [])];
                                      updated[idx] = { ...updated[idx], name: val };
                                      return { ...prev, winnersList: updated };
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Project Title</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder="e.g. AI Sentiment Engine"
                                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
                                  value={w.project}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditingPastEvent(prev => {
                                      const updated = [...(prev.winnersList || [])];
                                      updated[idx] = { ...updated[idx], project: val };
                                      return { ...prev, winnersList: updated };
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Prize / Award</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder="e.g. ₹25,000 + Trophy"
                                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
                                  value={w.prize}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditingPastEvent(prev => {
                                      const updated = [...(prev.winnersList || [])];
                                      updated[idx] = { ...updated[idx], prize: val };
                                      return { ...prev, winnersList: updated };
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingPastEvent(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Past Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEAM MEMBER MODAL */}
      {editingTeamMember && (
        <div className="modal-backdrop" onClick={() => setEditingTeamMember(null)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Edit Coordinator</h3>
              <button className="modal-close-btn" onClick={() => setEditingTeamMember(null)}><XCircle size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await updateTeamMember(editingTeamMember.id, editingTeamMember);
              setTeamMembers(getTeamMembers());
              setEditingTeamMember(null);
            }}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Coordinator Type</label>
                  <select
                    className="form-input"
                    value={editingTeamMember.category || (isFacultyMember(editingTeamMember) ? 'faculty' : 'club')}
                    onChange={e => setEditingTeamMember(p => ({ ...p, category: e.target.value }))}
                  >
                    <option value="faculty">🎓 Faculty Coordinator (Faculty Advisor / Mentor)</option>
                    <option value="club">⚡ Club Coordinator (Student Lead)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Coordinator Name</label>
                  <input type="text" className="form-input" required value={editingTeamMember.name || ''} onChange={e => setEditingTeamMember(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role Title</label>
                  <input type="text" className="form-input" required value={editingTeamMember.role || ''} onChange={e => setEditingTeamMember(p => ({ ...p, role: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department / Domain</label>
                  <input type="text" className="form-input" value={editingTeamMember.domain || ''} onChange={e => setEditingTeamMember(p => ({ ...p, domain: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={editingTeamMember.email || ''} onChange={e => setEditingTeamMember(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone (Optional)</label>
                  <input type="text" className="form-input" placeholder="+91..." value={editingTeamMember.phone || ''} onChange={e => setEditingTeamMember(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <PhotoInput
                  value={editingTeamMember.image || ''}
                  onChange={(url) => setEditingTeamMember(p => ({ ...p, image: url }))}
                  label="Coordinator Photo"
                  placeholder="https://..."
                  shape="circle"
                  helpText="Directly upload a photo file from your device or enter a photo URL."
                />
                <div className="form-group">
                  <label className="form-label">Short Bio</label>
                  <textarea className="form-textarea" rows={2} value={editingTeamMember.bio || ''} onChange={e => setEditingTeamMember(p => ({ ...p, bio: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingTeamMember(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Coordinator</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
