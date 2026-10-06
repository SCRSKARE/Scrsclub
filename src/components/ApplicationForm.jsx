import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Clock,
  Send,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { DOMAINS } from '../data/rolesData';
import { submitApplication } from '../services/db';
import { getCurrentUser, isKluEmail } from '../services/auth';
import PhotoInput from './PhotoInput';

export default function ApplicationForm({ initialDomain = '', onNavigateToTracker }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check if participant is logged in with @klu.ac.in
  const loggedInUser = getCurrentUser();

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal & Academic
    fullName: loggedInUser?.displayName || '',
    email: loggedInUser?.email || '',
    phone: '',
    rollNumber: '',
    branch: '',
    year: '2nd Year',
    photoUrl: loggedInUser?.photoURL || '',

    // Step 2: Role & Wing
    role: initialDomain || DOMAINS[0].title,
    secondaryRole: '',
    skills: '',

    // Step 3: Experience & Links
    portfolioUrl: '',
    linkedinUrl: '',
    experience: '',

    // Step 4: Motivation & Availability
    whyJoin: '',
    initiativeIdea: '',
    weeklyHours: '8-10 hours/week'
  });

  useEffect(() => {
    if (initialDomain) {
      setFormData(prev => ({ ...prev, role: initialDomain }));
    }
  }, [initialDomain]);

  useEffect(() => {
    if (loggedInUser) {
      setFormData(prev => ({
        ...prev,
        email: prev.email || loggedInUser.email || '',
        fullName: prev.fullName || loggedInUser.displayName || '',
        photoUrl: prev.photoUrl || loggedInUser.photoURL || ''
      }));
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const validateStep = (step) => {
    setErrorMessage('');
    if (step === 1) {
      if (!formData.fullName.trim()) return 'Please enter your full name.';
      const cleanEmail = formData.email.trim().toLowerCase();
      if (!cleanEmail || !isKluEmail(cleanEmail)) {
        return 'Please provide your official university email ending with @klu.ac.in (e.g. 2300030042@klu.ac.in).';
      }
      if (!formData.phone.trim() || formData.phone.length < 8) return 'Please provide a valid contact number.';
      if (!formData.rollNumber.trim()) return 'Please provide your Roll / Student ID number.';
      if (!formData.branch.trim()) return 'Please enter your branch/department.';
    } else if (step === 2) {
      if (!formData.role) return 'Please select your target role.';
      if (!formData.skills.trim()) return 'Please mention a few skills or tools you are familiar with.';
    }
    return '';
  };

  const handleNext = () => {
    const err = validateStep(currentStep);
    if (err) {
      setErrorMessage(err);
      return;
    }
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setErrorMessage('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep(2);
    if (err) {
      setErrorMessage(err);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        track: 'Coordinator',
        domain: formData.role,
        secondaryDomain: formData.secondaryRole
      };
      const result = await submitApplication(payload);
      setSubmittedData(result);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (confettiErr) {
        console.log('Confetti effect:', confettiErr);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Failed to submit application. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTrackingId = () => {
    if (!submittedData?.trackingId) return;
    navigator.clipboard.writeText(submittedData.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submittedData) {
    return (
      <div className="section">
        <div className="container">
          <div className="application-portal-box success-screen">
            <div className="success-icon-wrap">
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Application Submitted Successfully!
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '540px', marginInline: 'auto', fontSize: '1rem', lineHeight: 1.6 }}>
              Thank you, <strong>{submittedData.fullName}</strong>! Your application for <strong>{submittedData.role || submittedData.domain}</strong> has been registered with your official university account:
            </p>
            <div style={{ color: '#38bdf8', fontWeight: 700, marginBlock: '0.5rem', fontSize: '1.05rem' }}>
              {submittedData.email}
            </div>

            <div className="tracking-badge-box">
              <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', fontWeight: 700 }}>
                Your Unique Application Reference ID
              </span>
              <div className="tracking-code">{submittedData.trackingId}</div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCopyTrackingId}
                style={{ marginTop: '0.5rem' }}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Reference ID'}</span>
              </button>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              maxWidth: '540px',
              marginInline: 'auto',
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                Next Steps for KLU Participants:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <li>• You can now sign in using your <strong>{submittedData.email}</strong> Google / Email account to view your live screening status.</li>
                <li>• Our core coordinators will review your profile within 48-72 hours.</li>
                <li>• Shortlisted candidates will see interview room and time slots posted in the tracker.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onNavigateToTracker(submittedData.trackingId)}
              >
                <LogIn size={18} />
                <span>Log In to Participant Portal</span>
              </button>

              <button
                className="btn btn-secondary btn-lg"
                onClick={() => {
                  setSubmittedData(null);
                  setCurrentStep(1);
                  setFormData({
                    fullName: '',
                    email: loggedInUser?.email || '',
                    phone: '',
                    rollNumber: '',
                    branch: '',
                    year: '2nd Year',
                    role: DOMAINS[0].title,
                    secondaryRole: '',
                    skills: '',
                    portfolioUrl: '',
                    linkedinUrl: '',
                    experience: '',
                    whyJoin: '',
                    initiativeIdea: '',
                    weeklyHours: '8-10 hours/week'
                  });
                }}
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="section" id="apply-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Recruitment Application</span>
          <h2 className="section-title">Apply for Coordinator Role</h2>
          <p className="section-description">
            Complete the 2 steps below. Please use your official university email (<code>@klu.ac.in</code>) so you can log in to check your interview calls and application status.
          </p>
        </div>

        <div className="application-portal-box">
          {/* Stepper Navigation */}
          <div className="stepper-nav">
            {[
              { num: 1, label: 'Profile' },
              { num: 2, label: 'Role Selection' }
            ].map(step => (
              <div
                key={step.num}
                className={`step-node ${currentStep === step.num ? 'active' : ''} ${currentStep > step.num ? 'completed' : ''}`}
                onClick={() => {
                  if (step.num < currentStep) setCurrentStep(step.num);
                }}
              >
                <div className="step-circle">
                  {currentStep > step.num ? <Check size={18} /> : step.num}
                </div>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              color: '#fda4af',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.75rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1: Personal & Academic Details */}
            {currentStep === 1 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Candidate Profile & Academic Information
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Please share your basic contact details and current university registration.
                </p>

                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label className="form-label" htmlFor="fullName">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Aarav Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group col-span-2">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                      <label className="form-label" htmlFor="email" style={{ marginBottom: 0 }}>
                        KLU Institutional Email <span className="req">*</span>
                      </label>
                      <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                        Must end with @klu.ac.in
                      </span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="e.g. 2300030042@klu.ac.in"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      WhatsApp / Phone Number <span className="req">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="rollNumber">
                      Roll Number / Student ID <span className="req">*</span>
                    </label>
                    <input
                      id="rollNumber"
                      name="rollNumber"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 2300030042"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="branch">
                      Branch / Department <span className="req">*</span>
                    </label>
                    <input
                      id="branch"
                      name="branch"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Computer Science, AI & DS, ECE, Mechanical..."
                      value={formData.branch}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="year">
                      Year of Study <span className="req">*</span>
                    </label>
                    <select
                      id="year"
                      name="year"
                      className="form-select"
                      value={formData.year}
                      onChange={handleChange}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                    </select>
                  </div>

                  <div className="col-span-2" style={{ marginTop: '0.5rem' }}>
                    <PhotoInput
                      value={formData.photoUrl}
                      onChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
                      label="Applicant Profile Photo (Optional)"
                      placeholder="https://example.com/profile-photo.jpg"
                      shape="circle"
                      helpText=""
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Role Selection & Skills */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Target Coordinator Role & Wing
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Select the coordinator position you wish to apply for and list your relevant skills.
                </p>

                {/* Primary Role */}
                <div className="form-group">
                  <label className="form-label" htmlFor="role">
                    Target Role <span className="req">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    {DOMAINS.map(d => (
                      <option key={d.id} value={d.title}>
                        {d.title} ({d.wing})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Domain Preview Card */}
                {(() => {
                  const activeDomain = DOMAINS.find(d => d.title === formData.role) || DOMAINS[0];
                  return (
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--border-light)',
                      borderLeft: `4px solid ${activeDomain.color || '#38bdf8'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: activeDomain.color || '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {activeDomain.wing} Overview
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBlock: '0.35rem 0.5rem', color: 'var(--text-main)' }}>
                        {activeDomain.tagline}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                        {activeDomain.description}
                      </p>
                      {activeDomain.responsibilities && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                          <strong style={{ color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>Key Responsibilities:</strong>
                          <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {activeDomain.responsibilities.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {activeDomain.recommendedSkills && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>Recommended:</span>
                          {activeDomain.recommendedSkills.map((s, i) => (
                            <span key={i} style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-main)', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Secondary Role */}
                <div className="form-group">
                  <label className="form-label" htmlFor="secondaryRole">
                    Secondary Role Preference (Optional)
                  </label>
                  <select
                    id="secondaryRole"
                    name="secondaryRole"
                    className="form-select"
                    value={formData.secondaryRole}
                    onChange={handleChange}
                  >
                    <option value="">None (Focus solely on primary role)</option>
                    {DOMAINS.filter(d => d.title !== formData.role).map(d => (
                      <option key={d.id} value={d.title}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skills */}
                <div className="form-group">
                  <label className="form-label" htmlFor="skills">
                    Core Technical / Creative / Soft Skills <span className="req">*</span>
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    className="form-input"
                    placeholder="e.g. React, Node.js, Python, Figma, Video Editing, Event Management, Public Speaking"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              {currentStep > 1 ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePrev}
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>
              ) : <div />}

              {currentStep < 2 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
