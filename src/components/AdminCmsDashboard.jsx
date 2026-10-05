import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Home,
  Calendar,
  Clock,
  Users,
  Trophy,
  FileText,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Eye,
  LogOut,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

import {
  getClubCmsData,
  subscribeToClubData,
  updateHomepageContent,
  addPastEvent,
  updatePastEvent,
  deletePastEvent,
  reorderPastEvents,
  addUpcomingEvent,
  updateUpcomingEvent,
  deleteUpcomingEvent,
  reorderUpcomingEvents,
  moveUpcomingToPast,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
  updateAboutContent,
  updateContactInfo,
  resetCmsToDefault,
  compressImageFile
} from '../services/clubCmsService';

import AdminPortal from './AdminPortal'; // Existing hiring admin portal!
import { getCurrentUser, subscribeToAuth, signOutParticipant } from '../services/auth';

export default function AdminCmsDashboard({ onOpenLoginModal, onNavigateToWebsite }) {
  // Auth state
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);

  // Active Admin Tab: 'overview' | 'homepage' | 'past-events' | 'upcoming-events' | 'team' | 'about-contact' | 'recruitment'
  const [adminTab, setAdminTab] = useState('overview');

  // CMS Data
  const [cmsData, setCmsData] = useState(getClubCmsData());
  const [toastMessage, setToastMessage] = useState('');

  // Past Event Form Modal
  const [showPastModal, setShowPastModal] = useState(false);
  const [editingPastEvent, setEditingPastEvent] = useState(null);
  const [pastFormData, setPastFormData] = useState({
    title: '',
    category: 'Hackathon',
    date: '',
    venue: '',
    attendance: '',
    bannerUrl: '',
    shortDescription: '',
    fullDescription: '',
    galleryImages: [],
    winners: []
  });

  // Upcoming Event Form Modal
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [editingUpcomingEvent, setEditingUpcomingEvent] = useState(null);
  const [upcomingFormData, setUpcomingFormData] = useState({
    title: '',
    category: 'Technical Workshop',
    date: '',
    time: '',
    venue: '',
    bannerUrl: '',
    description: '',
    importantInfo: '',
    registrationLink: '',
    registrationDeadline: '',
    isRegistrationOpen: true
  });

  // Move Upcoming to Past Modal
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [eventToMove, setEventToMove] = useState(null);
  const [moveDetails, setMoveDetails] = useState({
    attendance: '350+ Participants',
    fullDescription: '',
    winnerName: '',
    winnerPrize: '1st Place Champion',
    winnerProject: '',
    winnerPhoto: ''
  });

  // Team Member Form Modal
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    designation: '',
    wing: 'Technical Wing',
    bio: '',
    photoUrl: '',
    linkedin: '',
    github: '',
    email: '',
    isCore: false
  });

  // Homepage form
  const [homeForm, setHomeForm] = useState(cmsData.homepage);

  // About & Contact form
  const [aboutForm, setAboutForm] = useState(cmsData.aboutContent);
  const [contactForm, setContactForm] = useState(cmsData.contactInfo);

  // Image upload loading indicator
  const [uploadingImage, setUploadingImage] = useState(false);

  // Auth subscriber
  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // CMS subscriber
  useEffect(() => {
    const unsub = subscribeToClubData((data) => {
      setCmsData(data);
      setHomeForm(data.homepage);
      setAboutForm(data.aboutContent);
      setContactForm(data.contactInfo);
    });
    return () => unsub();
  }, []);

  const isAuthorized = (currentUser && currentUser.role === 'admin') || pinUnlocked;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === 'scrs2026' || pinInput.trim() === 'admin') {
      setPinUnlocked(true);
      setPinError('');
      showToast('Welcome, Administrator!');
    } else {
      setPinError('Invalid passcode. Use "scrs2026" or "admin".');
    }
  };

  // Generic image upload handler (reads file, compresses, sets form state)
  const handleImageUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const compressedDataUrl = await compressImageFile(file, 1200, 800, 0.85);
      callback(compressedDataUrl);
      showToast('Image uploaded and optimized successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to process image file.');
    } finally {
      setUploadingImage(false);
    }
  };

  // ---------------- PAST EVENTS HANDLERS ----------------
  const openAddPastModal = () => {
    setEditingPastEvent(null);
    setPastFormData({
      title: '',
      category: 'Hackathon',
      date: '',
      venue: 'SAC Central Auditorium, KLU',
      attendance: '400+ Participants',
      bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      shortDescription: '',
      fullDescription: '',
      galleryImages: [],
      winners: []
    });
    setShowPastModal(true);
  };

  const openEditPastModal = (event) => {
    setEditingPastEvent(event);
    setPastFormData({
      title: event.title || '',
      category: event.category || 'Hackathon',
      date: event.date || '',
      venue: event.venue || '',
      attendance: event.attendance || '',
      bannerUrl: event.bannerUrl || '',
      shortDescription: event.shortDescription || '',
      fullDescription: event.fullDescription || '',
      galleryImages: event.galleryImages || [],
      winners: event.winners || []
    });
    setShowPastModal(true);
  };

  const handleSavePastEvent = (e) => {
    e.preventDefault();
    if (editingPastEvent) {
      updatePastEvent(editingPastEvent.id, pastFormData);
      showToast('Past event updated successfully!');
    } else {
      addPastEvent(pastFormData);
      showToast('New past event published!');
    }
    setShowPastModal(false);
  };

  const handleDeletePastEvent = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deletePastEvent(id);
      showToast('Past event removed.');
    }
  };

  const handleMovePastOrder = (idx, direction) => {
    const list = [...cmsData.pastEvents];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    reorderPastEvents(list);
    showToast('Event reordered.');
  };

  // Add winner to past event draft
  const handleAddWinnerDraft = () => {
    const newWinner = {
      id: 'w-' + Date.now(),
      name: 'Winning Team / Participant',
      prize: '1st Place Champion',
      teamMembers: '',
      projectTitle: '',
      photoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      description: ''
    };
    setPastFormData(prev => ({ ...prev, winners: [...prev.winners, newWinner] }));
  };

  const handleUpdateWinnerDraft = (wIdx, field, value) => {
    setPastFormData(prev => {
      const updated = [...prev.winners];
      updated[wIdx] = { ...updated[wIdx], [field]: value };
      return { ...prev, winners: updated };
    });
  };

  const handleRemoveWinnerDraft = (wIdx) => {
    setPastFormData(prev => ({
      ...prev,
      winners: prev.winners.filter((_, idx) => idx !== wIdx)
    }));
  };

  // Add gallery image URL to draft
  const handleAddGalleryImageDraft = (url) => {
    if (!url) return;
    setPastFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, url]
    }));
  };

  // ---------------- UPCOMING EVENTS HANDLERS ----------------
  const openAddUpcomingModal = () => {
    setEditingUpcomingEvent(null);
    setUpcomingFormData({
      title: '',
      category: 'Technical Workshop',
      date: '2026-11-20',
      time: '10:00 AM – 04:00 PM IST',
      venue: 'SAC Seminar Hall 201, KLU',
      bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      description: '',
      importantInfo: '',
      registrationLink: 'https://forms.gle/demo-scrs',
      registrationDeadline: '',
      isRegistrationOpen: true
    });
    setShowUpcomingModal(true);
  };

  const openEditUpcomingModal = (event) => {
    setEditingUpcomingEvent(event);
    setUpcomingFormData({
      title: event.title || '',
      category: event.category || 'Workshop',
      date: event.date || '',
      time: event.time || '',
      venue: event.venue || '',
      bannerUrl: event.bannerUrl || '',
      description: event.description || '',
      importantInfo: event.importantInfo || '',
      registrationLink: event.registrationLink || '',
      registrationDeadline: event.registrationDeadline || '',
      isRegistrationOpen: event.isRegistrationOpen !== false
    });
    setShowUpcomingModal(true);
  };

  const handleSaveUpcomingEvent = (e) => {
    e.preventDefault();
    if (editingUpcomingEvent) {
      updateUpcomingEvent(editingUpcomingEvent.id, upcomingFormData);
      showToast('Upcoming event updated!');
    } else {
      addUpcomingEvent(upcomingFormData);
      showToast('Upcoming event added to calendar!');
    }
    setShowUpcomingModal(false);
  };

  const handleDeleteUpcomingEvent = (id, title) => {
    if (window.confirm(`Are you sure you want to cancel and delete "${title}"?`)) {
      deleteUpcomingEvent(id);
      showToast('Upcoming event deleted.');
    }
  };

  const handleMoveUpcomingOrder = (idx, direction) => {
    const list = [...cmsData.upcomingEvents];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    reorderUpcomingEvents(list);
    showToast('Upcoming event reordered.');
  };

  const openMoveToPastModal = (event) => {
    setEventToMove(event);
    setMoveDetails({
      attendance: '450+ Participants',
      fullDescription: event.description,
      winnerName: 'Grand Champion Team',
      winnerPrize: '₹50,000 & Trophy',
      winnerProject: 'Autonomous AI Assistant',
      winnerPhoto: event.bannerUrl
    });
    setShowMoveModal(true);
  };

  const handleExecuteMoveToPast = () => {
    if (!eventToMove) return;
    const winners = moveDetails.winnerName ? [{
      id: 'w-' + Date.now(),
      name: moveDetails.winnerName,
      prize: moveDetails.winnerPrize,
      projectTitle: moveDetails.winnerProject,
      photoUrl: moveDetails.winnerPhoto
    }] : [];

    moveUpcomingToPast(eventToMove.id, {
      attendance: moveDetails.attendance,
      fullDescription: moveDetails.fullDescription,
      winners: winners
    });

    setShowMoveModal(false);
    showToast(`Successfully moved "${eventToMove.title}" into Past Events!`);
  };

  // ---------------- TEAM MEMBERS HANDLERS ----------------
  const openAddTeamModal = () => {
    setEditingMember(null);
    setTeamFormData({
      name: '',
      designation: 'Wing Coordinator',
      wing: 'Technical Wing',
      bio: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      linkedin: '',
      github: '',
      email: '',
      isCore: false
    });
    setShowTeamModal(true);
  };

  const openEditTeamModal = (member) => {
    setEditingMember(member);
    setTeamFormData({
      name: member.name || '',
      designation: member.designation || '',
      wing: member.wing || 'Technical Wing',
      bio: member.bio || '',
      photoUrl: member.photoUrl || '',
      linkedin: member.linkedin || '',
      github: member.github || '',
      email: member.email || '',
      isCore: Boolean(member.isCore)
    });
    setShowTeamModal(true);
  };

  const handleSaveTeamMember = (e) => {
    e.preventDefault();
    if (editingMember) {
      updateTeamMember(editingMember.id, teamFormData);
      showToast('Team member updated!');
    } else {
      addTeamMember(teamFormData);
      showToast('New team member added to directory!');
    }
    setShowTeamModal(false);
  };

  const handleDeleteTeamMember = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from team?`)) {
      deleteTeamMember(id);
      showToast('Team member removed.');
    }
  };

  const handleMoveTeamOrder = (idx, direction) => {
    const list = [...cmsData.teamMembers];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    reorderTeamMembers(list);
    showToast('Team list reordered.');
  };

  // ---------------- HOMEPAGE CMS HANDLERS ----------------
  const handleSaveHomepage = (e) => {
    e.preventDefault();
    updateHomepageContent(homeForm);
    showToast('Homepage content saved and live!');
  };

  // ---------------- ABOUT & CONTACT HANDLERS ----------------
  const handleSaveAbout = (e) => {
    e.preventDefault();
    updateAboutContent(aboutForm);
    showToast('About section updated!');
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    updateContactInfo(contactForm);
    showToast('Contact info updated!');
  };

  // Reset all CMS data
  const handleResetCms = () => {
    if (window.confirm('Reset all CMS content (events, team, homepage) to official defaults? This cannot be undone.')) {
      resetCmsToDefault();
      showToast('CMS successfully reset to defaults.');
    }
  };

  // ---------------- RENDER AUTH WALL IF NOT AUTHORIZED ----------------
  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div
          className="card"
          style={{
            maxWidth: '460px',
            width: '100%',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              color: 'var(--primary)'
            }}
          >
            <Lock size={30} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            SCRS Admin Suite
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Protected administrator access. Manage events, gallery photos, winners, team members, and recruitment applications.
          </p>

          {/* Passcode Login Form */}
          <form onSubmit={handlePinSubmit} style={{ marginBottom: '1.75rem' }}>
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Admin Master Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode (default: scrs2026 or admin)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="form-control"
                autoFocus
              />
              {pinError && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                  {pinError}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Unlock size={16} />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-secondary)', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              OR AUTHENTICATE WITH
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenLoginModal}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <ShieldCheck size={16} color="#10b981" />
            <span>Sign in with @klu.ac.in Admin Email</span>
          </button>
        </div>
      </div>
    );
  }

  // ---------------- AUTHORIZED DASHBOARD VIEW ----------------
  return (
    <div className="admin-cms-root" style={{ minHeight: '90vh', padding: '2rem 0 5rem 0' }}>
      <div className="container">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 1300,
              background: '#10b981',
              color: '#fff',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <CheckCircle size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Admin Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.25rem 1.75rem',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  SCRS Content Management & Admin Suite
                </h1>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700 }}>
                  ACTIVE SESSION
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Logged in as: {currentUser?.email || 'Authorized Administrator (PIN Mode)'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onNavigateToWebsite?.('home')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <Eye size={15} />
              <span>Preview Live Site</span>
            </button>

            <button
              onClick={handleResetCms}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#f59e0b' }}
              title="Reset all content to defaults"
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={() => {
                setPinUnlocked(false);
                signOutParticipant();
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#f43f5e' }}
            >
              <LogOut size={14} />
              <span>Lock / Logout</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            padding: '6px',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem'
          }}
        >
          {[
            { key: 'overview', label: 'Overview', icon: Home },
            { key: 'homepage', label: 'Homepage CMS', icon: Sparkles },
            { key: 'past-events', label: `Past Events (${cmsData.pastEvents.length})`, icon: Trophy },
            { key: 'upcoming-events', label: `Upcoming Events (${cmsData.upcomingEvents.length})`, icon: Calendar },
            { key: 'team', label: `Team Members (${cmsData.teamMembers.length})`, icon: Users },
            { key: 'about-contact', label: 'About & Contact', icon: FileText },
            { key: 'recruitment', label: 'Recruitment Applications', icon: ShieldCheck, highlight: true }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setAdminTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                  background: isActive
                    ? 'var(--primary)'
                    : tab.highlight
                    ? 'rgba(16, 185, 129, 0.12)'
                    : 'transparent',
                  color: isActive
                    ? '#fff'
                    : tab.highlight
                    ? '#34d399'
                    : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ---------------- 1. TAB: OVERVIEW ---------------- */}
        {adminTab === 'overview' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
              }}
            >
              <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
                <div style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Trophy size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Past Flagship Events</span>
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
                  {cmsData.pastEvents.length}
                </div>
                <button
                  onClick={() => setAdminTab('past-events')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <span>Manage Past Events & Winners</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
                <div style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Calendar size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Upcoming Events</span>
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
                  {cmsData.upcomingEvents.length}
                </div>
                <button
                  onClick={() => setAdminTab('upcoming-events')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <span>Manage Upcoming & Registrations</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
                <div style={{ color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Users size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Team Profiles</span>
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
                  {cmsData.teamMembers.length}
                </div>
                <button
                  onClick={() => setAdminTab('team')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <span>Manage Team Directory</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
                <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Recruitment Applications</span>
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
                  Live System
                </div>
                <button
                  onClick={() => setAdminTab('recruitment')}
                  style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <span>Review Candidate Submissions</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div
              className="card"
              style={{
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                background: 'linear-gradient(135deg, rgba(20, 30, 52, 0.7) 0%, rgba(12, 18, 34, 0.9) 100%)'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1rem' }}>
                Quick Publishing Actions
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <button
                  onClick={openAddPastModal}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Plus size={16} />
                  <span>Publish New Past Event & Winners</span>
                </button>

                <button
                  onClick={openAddUpcomingModal}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Plus size={16} />
                  <span>Schedule Upcoming Event</span>
                </button>

                <button
                  onClick={openAddTeamModal}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Plus size={16} />
                  <span>Add Team Member</span>
                </button>

                <button
                  onClick={() => setAdminTab('homepage')}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Edit2 size={16} />
                  <span>Edit Homepage Copy & Stats</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 2. TAB: HOMEPAGE CMS ---------------- */}
        {adminTab === 'homepage' && (
          <div
            className="card"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card)'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
              Edit Homepage Content
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Update the hero banner, headlines, statistics counters, and club introduction displayed to visitors.
            </p>

            <form onSubmit={handleSaveHomepage}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Hero Status Pill Badge
                </label>
                <input
                  type="text"
                  value={homeForm.heroBadge}
                  onChange={(e) => setHomeForm({ ...homeForm, heroBadge: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Hero Main Headline
                </label>
                <input
                  type="text"
                  value={homeForm.heroHeadline}
                  onChange={(e) => setHomeForm({ ...homeForm, heroHeadline: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Hero Subtitle Narrative
                </label>
                <textarea
                  rows={3}
                  value={homeForm.heroSubtitle}
                  onChange={(e) => setHomeForm({ ...homeForm, heroSubtitle: e.target.value })}
                  className="form-control"
                />
              </div>

              {/* Stats Counters Grid */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Live Club Statistics Counters
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Active Members</span>
                    <input
                      type="text"
                      value={homeForm.stats?.members || ''}
                      onChange={(e) => setHomeForm({ ...homeForm, stats: { ...homeForm.stats, members: e.target.value } })}
                      className="form-control"
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Events & Bootcamps</span>
                    <input
                      type="text"
                      value={homeForm.stats?.events || ''}
                      onChange={(e) => setHomeForm({ ...homeForm, stats: { ...homeForm.stats, events: e.target.value } })}
                      className="form-control"
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Research Papers</span>
                    <input
                      type="text"
                      value={homeForm.stats?.papers || ''}
                      onChange={(e) => setHomeForm({ ...homeForm, stats: { ...homeForm.stats, papers: e.target.value } })}
                      className="form-control"
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Hackathon Awards</span>
                    <input
                      type="text"
                      value={homeForm.stats?.awards || ''}
                      onChange={(e) => setHomeForm({ ...homeForm, stats: { ...homeForm.stats, awards: e.target.value } })}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Club Intro Box */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Club Introduction Heading
                </label>
                <input
                  type="text"
                  value={homeForm.introTitle}
                  onChange={(e) => setHomeForm({ ...homeForm, introTitle: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Club Introduction Narrative
                </label>
                <textarea
                  rows={4}
                  value={homeForm.introText}
                  onChange={(e) => setHomeForm({ ...homeForm, introText: e.target.value })}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
              >
                Save Homepage Modifications
              </button>
            </form>
          </div>
        )}

        {/* ---------------- 3. TAB: PAST EVENTS CMS ---------------- */}
        {adminTab === 'past-events' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Past Events & Winners Manager</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Add previous hackathons, upload galleries, celebrate champions, or reorder event priority.
                </p>
              </div>

              <button
                onClick={openAddPastModal}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} />
                <span>Add Past Event</span>
              </button>
            </div>

            {/* List of Past Events */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cmsData.pastEvents.map((event, idx) => (
                <div
                  key={event.id}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      style={{ width: '70px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontWeight: 600 }}>
                        {event.category || 'Event'}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: '4px 0 2px 0' }}>
                        {event.title}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {event.date} • {event.venue} • {event.winners?.length || 0} Winners Listed • {event.galleryImages?.length || 1} Photos
                      </div>
                    </div>
                  </div>

                  {/* Actions & Ordering */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleMovePastOrder(idx, 'up')}
                      disabled={idx === 0}
                      className="btn btn-secondary btn-sm"
                      style={{ opacity: idx === 0 ? 0.3 : 1 }}
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      onClick={() => handleMovePastOrder(idx, 'down')}
                      disabled={idx === cmsData.pastEvents.length - 1}
                      className="btn btn-secondary btn-sm"
                      style={{ opacity: idx === cmsData.pastEvents.length - 1 ? 0.3 : 1 }}
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      onClick={() => openEditPastModal(event)}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Edit2 size={14} />
                      <span>Edit & Gallery</span>
                    </button>

                    <button
                      onClick={() => handleDeletePastEvent(event.id, event.title)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#f43f5e' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 4. TAB: UPCOMING EVENTS CMS ---------------- */}
        {adminTab === 'upcoming-events' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Upcoming Events & Registrations</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Manage scheduled summits, countdown timers, venue updates, and registration links.
                </p>
              </div>

              <button
                onClick={openAddUpcomingModal}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} />
                <span>Create Upcoming Event</span>
              </button>
            </div>

            {/* List of Upcoming Events */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cmsData.upcomingEvents.map((event, idx) => (
                <div
                  key={event.id}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      style={{ width: '70px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', fontWeight: 600 }}>
                          {event.category}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: event.isRegistrationOpen ? '#34d399' : '#f59e0b', fontWeight: 700 }}>
                          {event.isRegistrationOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: '4px 0 2px 0' }}>
                        {event.title}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {event.date} • {event.time} • {event.venue}
                      </div>
                    </div>
                  </div>

                  {/* Actions & 1-Click Move to Past */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleMoveUpcomingOrder(idx, 'up')}
                      disabled={idx === 0}
                      className="btn btn-secondary btn-sm"
                      style={{ opacity: idx === 0 ? 0.3 : 1 }}
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      onClick={() => handleMoveUpcomingOrder(idx, 'down')}
                      disabled={idx === cmsData.upcomingEvents.length - 1}
                      className="btn btn-secondary btn-sm"
                      style={{ opacity: idx === cmsData.upcomingEvents.length - 1 ? 0.3 : 1 }}
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      onClick={() => openMoveToPastModal(event)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        borderColor: 'rgba(245, 158, 11, 0.4)',
                        color: '#fbbf24',
                        background: 'rgba(245, 158, 11, 0.1)'
                      }}
                      title="Conclude event and transfer to Past Events gallery"
                    >
                      <Trophy size={14} />
                      <span>Mark Completed & Move to Past</span>
                    </button>

                    <button
                      onClick={() => openEditUpcomingModal(event)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteUpcomingEvent(event.id, event.title)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#f43f5e' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 5. TAB: TEAM CMS ---------------- */}
        {adminTab === 'team' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Team & Coordinators Directory</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Manage club leadership profiles, wing designations, bios, and social links.
                </p>
              </div>

              <button
                onClick={openAddTeamModal}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} />
                <span>Add Team Member</span>
              </button>
            </div>

            {/* List of Team Members */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cmsData.teamMembers.map((member, idx) => (
                <div
                  key={member.id}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: 0 }}>
                          {member.name}
                        </h4>
                        {member.isCore && (
                          <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.25)', color: '#a5b4fc', fontWeight: 700 }}>
                            CORE LEAD
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {member.designation} • <span style={{ color: 'var(--text-muted)' }}>{member.wing}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleMoveTeamOrder(idx, 'up')}
                      disabled={idx === 0}
                      className="btn btn-secondary btn-sm"
                      style={{ opacity: idx === 0 ? 0.3 : 1 }}
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      onClick={() => handleMoveTeamOrder(idx, 'down')}
                      disabled={idx === cmsData.teamMembers.length - 1}
                      className="btn btn-secondary btn-sm"
                      style={{ opacity: idx === cmsData.teamMembers.length - 1 ? 0.3 : 1 }}
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      onClick={() => openEditTeamModal(member)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTeamMember(member.id, member.name)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#f43f5e' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 6. TAB: ABOUT & CONTACT CMS ---------------- */}
        {adminTab === 'about-contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            {/* About CMS */}
            <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1rem' }}>Edit About Details</h3>
              <form onSubmit={handleSaveAbout}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Mission Statement</label>
                  <textarea
                    rows={3}
                    value={aboutForm.mission}
                    onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Vision Statement</label>
                  <textarea
                    rows={3}
                    value={aboutForm.vision}
                    onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Faculty Advisor Name</label>
                  <input
                    type="text"
                    value={aboutForm.facultyAdvisor?.name || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, facultyAdvisor: { ...aboutForm.facultyAdvisor, name: e.target.value } })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Faculty Advisor Quote</label>
                  <textarea
                    rows={3}
                    value={aboutForm.facultyAdvisor?.quote || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, facultyAdvisor: { ...aboutForm.facultyAdvisor, quote: e.target.value } })}
                    className="form-control"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save About Changes</button>
              </form>
            </div>

            {/* Contact CMS */}
            <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1rem' }}>Edit Contact Info</h3>
              <form onSubmit={handleSaveContact}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Club Room / Building</label>
                  <input
                    type="text"
                    value={contactForm.room}
                    onChange={(e) => setContactForm({ ...contactForm, room: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Official Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Contact Phone</label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Discord Server Link</label>
                  <input
                    type="text"
                    value={contactForm.discord}
                    onChange={(e) => setContactForm({ ...contactForm, discord: e.target.value })}
                    className="form-control"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Contact Changes</button>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- 7. TAB: RECRUITMENT APPLICATIONS (INTEGRATED) ---------------- */}
        {adminTab === 'recruitment' && (
          <div>
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <CheckCircle size={20} color="#10b981" />
              <div style={{ fontSize: '0.875rem', color: '#a7f3d0' }}>
                <strong>Recruitment System Integrated:</strong> Review applicant profiles, domain filters, interview schedules, ratings, and export full CSVs without modifying the underlying database.
              </div>
            </div>

            <AdminPortal onOpenLoginModal={onOpenLoginModal} />
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT PAST EVENT ================= */}
      {showPastModal && (
        <div className="modal-backdrop" onClick={() => setShowPastModal(false)} style={{ zIndex: 1250 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.25rem' }}>
              {editingPastEvent ? 'Edit Past Event' : 'Add New Past Event'}
            </h3>

            <form onSubmit={handleSavePastEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Event Title *</label>
                  <input
                    type="text"
                    required
                    value={pastFormData.title}
                    onChange={(e) => setPastFormData({ ...pastFormData, title: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Category</label>
                  <input
                    type="text"
                    value={pastFormData.category}
                    onChange={(e) => setPastFormData({ ...pastFormData, category: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Hackathon, Symposium"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Date</label>
                  <input
                    type="text"
                    value={pastFormData.date}
                    onChange={(e) => setPastFormData({ ...pastFormData, date: e.target.value })}
                    className="form-control"
                    placeholder="e.g. October 18–19, 2025"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Venue</label>
                  <input
                    type="text"
                    value={pastFormData.venue}
                    onChange={(e) => setPastFormData({ ...pastFormData, venue: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Attendance Stats</label>
                  <input
                    type="text"
                    value={pastFormData.attendance}
                    onChange={(e) => setPastFormData({ ...pastFormData, attendance: e.target.value })}
                    className="form-control"
                    placeholder="e.g. 600+ Attendees"
                  />
                </div>
              </div>

              {/* Banner Image URL + File Upload */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Banner Image (URL or Upload Local Image)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={pastFormData.bannerUrl}
                    onChange={(e) => setPastFormData({ ...pastFormData, bannerUrl: e.target.value })}
                    className="form-control"
                    placeholder="https://..."
                    style={{ flex: 1 }}
                  />
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={14} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageUpload(e, (url) => setPastFormData(prev => ({ ...prev, bannerUrl: url })))}
                    />
                  </label>
                </div>
                {pastFormData.bannerUrl && (
                  <img
                    src={pastFormData.bannerUrl}
                    alt="Preview"
                    style={{ height: '100px', width: '100%', objectFit: 'cover', borderRadius: '6px' }}
                  />
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Short Summary</label>
                <textarea
                  rows={2}
                  value={pastFormData.shortDescription}
                  onChange={(e) => setPastFormData({ ...pastFormData, shortDescription: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Full Event Narrative & Details</label>
                <textarea
                  rows={4}
                  value={pastFormData.fullDescription}
                  onChange={(e) => setPastFormData({ ...pastFormData, fullDescription: e.target.value })}
                  className="form-control"
                />
              </div>

              {/* Gallery Images Manager */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                    Event Gallery Photos ({pastFormData.galleryImages?.length || 0})
                  </label>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Plus size={14} />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageUpload(e, (url) => handleAddGalleryImageDraft(url))}
                    />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' }}>
                  {pastFormData.galleryImages?.map((img, gIdx) => (
                    <div key={gIdx} style={{ position: 'relative', height: '65px', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => setPastFormData(prev => ({ ...prev, galleryImages: prev.galleryImages.filter((_, idx) => idx !== gIdx) }))}
                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#f43f5e', cursor: 'pointer', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Winners Manager */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Trophy size={16} />
                    <span>Winners / Champions ({pastFormData.winners?.length || 0})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddWinnerDraft}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                  >
                    + Add Winner
                  </button>
                </div>

                {pastFormData.winners?.map((w, wIdx) => (
                  <div key={w.id || wIdx} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.25)', borderRadius: '6px', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <input
                        type="text"
                        placeholder="Winner / Team Name"
                        value={w.name}
                        onChange={(e) => handleUpdateWinnerDraft(wIdx, 'name', e.target.value)}
                        className="form-control"
                        style={{ fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Prize / Standing"
                        value={w.prize}
                        onChange={(e) => handleUpdateWinnerDraft(wIdx, 'prize', e.target.value)}
                        className="form-control"
                        style={{ fontSize: '0.8rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveWinnerDraft(wIdx)}
                        style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Winning Project Title"
                      value={w.projectTitle || ''}
                      onChange={(e) => handleUpdateWinnerDraft(wIdx, 'projectTitle', e.target.value)}
                      className="form-control"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowPastModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT UPCOMING EVENT ================= */}
      {showUpcomingModal && (
        <div className="modal-backdrop" onClick={() => setShowUpcomingModal(false)} style={{ zIndex: 1250 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.25rem' }}>
              {editingUpcomingEvent ? 'Edit Upcoming Event' : 'Schedule New Upcoming Event'}
            </h3>

            <form onSubmit={handleSaveUpcomingEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Event Name *</label>
                  <input
                    type="text"
                    required
                    value={upcomingFormData.title}
                    onChange={(e) => setUpcomingFormData({ ...upcomingFormData, title: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Category</label>
                  <input
                    type="text"
                    value={upcomingFormData.category}
                    onChange={(e) => setUpcomingFormData({ ...upcomingFormData, category: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={upcomingFormData.date}
                    onChange={(e) => setUpcomingFormData({ ...upcomingFormData, date: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Time</label>
                  <input
                    type="text"
                    value={upcomingFormData.time}
                    onChange={(e) => setUpcomingFormData({ ...upcomingFormData, time: e.target.value })}
                    className="form-control"
                    placeholder="e.g. 10:00 AM – 04:00 PM IST"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Venue / Location</label>
                  <input
                    type="text"
                    value={upcomingFormData.venue}
                    onChange={(e) => setUpcomingFormData({ ...upcomingFormData, venue: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Banner Image URL + File Upload */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Banner Image (URL or File Upload)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={upcomingFormData.bannerUrl}
                    onChange={(e) => setUpcomingFormData({ ...upcomingFormData, bannerUrl: e.target.value })}
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={14} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageUpload(e, (url) => setUpcomingFormData(prev => ({ ...prev, bannerUrl: url })))}
                    />
                  </label>
                </div>
                {upcomingFormData.bannerUrl && (
                  <img src={upcomingFormData.bannerUrl} alt="Preview" style={{ height: '90px', width: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Description & Agenda</label>
                <textarea
                  rows={3}
                  value={upcomingFormData.description}
                  onChange={(e) => setUpcomingFormData({ ...upcomingFormData, description: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Important Guidelines / Prerequisites</label>
                <input
                  type="text"
                  value={upcomingFormData.importantInfo}
                  onChange={(e) => setUpcomingFormData({ ...upcomingFormData, importantInfo: e.target.value })}
                  className="form-control"
                  placeholder="e.g. Bring your laptops; Git installed"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Registration Form Link</label>
                  <input
                    type="text"
                    value={upcomingFormData.registrationLink}
                    onChange={(e) => setUpcomingFormData({ ...upcomingFormData, registrationLink: e.target.value })}
                    className="form-control"
                    placeholder="https://forms.gle/..."
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="isRegOpen"
                    checked={upcomingFormData.isRegistrationOpen}
                    onChange={(e) => setUpcomingFormData({ ...upcomingFormData, isRegistrationOpen: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="isRegOpen" style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer' }}>
                    Registrations Open
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowUpcomingModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Upcoming Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: 1-CLICK MOVE TO PAST ================= */}
      {showMoveModal && eventToMove && (
        <div className="modal-backdrop" onClick={() => setShowMoveModal(false)} style={{ zIndex: 1250 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', marginBottom: '0.5rem' }}>
              <Trophy size={20} />
              <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                Conclude & Move to Past Events
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Moving <strong>{eventToMove.title}</strong> from Upcoming Events into the Past Events Hall of Fame. Enter completion & winner details below:
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Total Attendance / Participation</label>
              <input
                type="text"
                value={moveDetails.attendance}
                onChange={(e) => setMoveDetails({ ...moveDetails, attendance: e.target.value })}
                className="form-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Grand Champion / Winner Name</label>
                <input
                  type="text"
                  value={moveDetails.winnerName}
                  onChange={(e) => setMoveDetails({ ...moveDetails, winnerName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Prize Awarded</label>
                <input
                  type="text"
                  value={moveDetails.winnerPrize}
                  onChange={(e) => setMoveDetails({ ...moveDetails, winnerPrize: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Winning Project / Solution</label>
              <input
                type="text"
                value={moveDetails.winnerProject}
                onChange={(e) => setMoveDetails({ ...moveDetails, winnerProject: e.target.value })}
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setShowMoveModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteMoveToPast}
                className="btn btn-primary"
                style={{ background: '#f59e0b', borderColor: '#f59e0b', color: '#000', fontWeight: 700 }}
              >
                Confirm Move to Past Events
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT TEAM MEMBER ================= */}
      {showTeamModal && (
        <div className="modal-backdrop" onClick={() => setShowTeamModal(false)} style={{ zIndex: 1250 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.25rem' }}>
              {editingMember ? 'Edit Team Member' : 'Add Team Member'}
            </h3>

            <form onSubmit={handleSaveTeamMember}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={teamFormData.name}
                    onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Designation / Title *</label>
                  <input
                    type="text"
                    required
                    value={teamFormData.designation}
                    onChange={(e) => setTeamFormData({ ...teamFormData, designation: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Club President, Tech Lead"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Wing / Division</label>
                  <select
                    value={teamFormData.wing}
                    onChange={(e) => setTeamFormData({ ...teamFormData, wing: e.target.value })}
                    className="form-control"
                  >
                    <option value="Executive Board">Executive Board</option>
                    <option value="Technical Wing">Technical Wing</option>
                    <option value="Research Wing">Research Wing</option>
                    <option value="Design & Media">Design & Media</option>
                    <option value="Events & Operations">Events & Operations</option>
                    <option value="PR & Corporate">PR & Corporate</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="isCoreCheck"
                    checked={teamFormData.isCore}
                    onChange={(e) => setTeamFormData({ ...teamFormData, isCore: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="isCoreCheck" style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer' }}>
                    Mark as Core Executive Lead
                  </label>
                </div>
              </div>

              {/* Photo Upload */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Profile Photo (URL or Upload Image)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={teamFormData.photoUrl}
                    onChange={(e) => setTeamFormData({ ...teamFormData, photoUrl: e.target.value })}
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={14} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageUpload(e, (url) => setTeamFormData(prev => ({ ...prev, photoUrl: url })))}
                    />
                  </label>
                </div>
                {teamFormData.photoUrl && (
                  <img src={teamFormData.photoUrl} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Short Bio</label>
                <textarea
                  rows={2}
                  value={teamFormData.bio}
                  onChange={(e) => setTeamFormData({ ...teamFormData, bio: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>LinkedIn</label>
                  <input
                    type="text"
                    value={teamFormData.linkedin}
                    onChange={(e) => setTeamFormData({ ...teamFormData, linkedin: e.target.value })}
                    className="form-control"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>GitHub</label>
                  <input
                    type="text"
                    value={teamFormData.github}
                    onChange={(e) => setTeamFormData({ ...teamFormData, github: e.target.value })}
                    className="form-control"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Email</label>
                  <input
                    type="email"
                    value={teamFormData.email}
                    onChange={(e) => setTeamFormData({ ...teamFormData, email: e.target.value })}
                    className="form-control"
                    placeholder="name@klu.ac.in"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowTeamModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
