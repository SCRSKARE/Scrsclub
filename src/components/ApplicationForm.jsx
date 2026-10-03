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
    if (loggedInUser && loggedInUser.email && !formData.email) {
      setFormData(prev => ({
        ...prev,
        email: loggedInUser.email,
        fullName: prev.fullName || loggedInUser.displayName || ''
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
    } else if (step === 4) {
      if (!formData.whyJoin.trim() || formData.whyJoin.length < 20) {
        return 'Please write at least a couple of sentences on why you want to take up this coordinator role.';
      }
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
    const err = validateStep(4);
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
            Complete the 4 steps below. Please use your official university email (<code>@klu.ac.in</code>) so you can log in to check your interview calls and application status.
          </p>
        </div>

        <div className="application-portal-box">
          {/* Stepper Navigation */}
          <div className="stepper-nav">
            {[
              { num: 1, label: 'Profile' },
              { num: 2, label: 'Role Selection' },
              { num: 3, label: 'Experience' },
              { num: 4, label: 'Vision' }
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label" htmlFor="email">
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
                    <span className="form-hint">
                      This email will be used for your Firebase participant login to check live status and interview slots.
                    </span>
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
                      <option value="1st Year">1st Year (Freshers)</option>
                      <option value="2nd Year">2nd Year (Sophomores)</option>
                      <option value="3rd Year">3rd Year (Pre-final)</option>
                      <option value="4th Year">4th Year (Final Year)</option>
                      <option value="Postgraduate">Postgraduate / Masters</option>
                    </select>
                  </div>

                  <div className="form-group col-span-2">
                    <label className="form-label" htmlFor="branch">
                      Branch / Department <span className="req">*</span>
                    </label>
                    <input
                      id="branch"
                      name="branch"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Computer Science, AI & DS, ECE, Mechanical, Biotechnology..."
                      value={formData.branch}
                      onChange={handleChange}
                      required
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
                  <span className="form-hint">
                    Choose the primary wing where you want to lead initiatives and projects.
                  </span>
                </div>

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
                  <span className="form-hint">
                    Helpful if your skills span multiple areas (e.g. Tech + Design or Events + PR).
                  </span>
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
                  <span className="form-hint">
                    Separate skills with commas.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 3: Experience & Portfolios */}
            {currentStep === 3 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Portfolio, Profiles & Past Experience
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Showcase your work. A working portfolio, GitHub repo, or Behance profile helps us evaluate your practical abilities.
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="portfolioUrl">
                    GitHub / Portfolio / Behance / Google Drive Work Link
                  </label>
                  <input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://github.com/your-username or https://behance.net/..."
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                  />
                  <span className="form-hint">
                    For Tech & Creative Design roles, sharing your work is highly recommended.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="linkedinUrl">
                    LinkedIn Profile URL (Optional)
                  </label>
                  <input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://linkedin.com/in/your-profile"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="experience">
                    Prior Club, Project, or Event Leadership Experience (Optional)
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    className="form-textarea"
                    rows={4}
                    placeholder="Tell us about any projects you've created, teams you've led, hackathons you've participated in, or school/college clubs you were active in..."
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Motivation & Vision */}
            {currentStep === 4 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Vision, Motivation & Time Commitment
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Help us understand your enthusiasm and how you envision leading your chosen wing.
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="whyJoin">
                    Why do you want to become a Coordinator for SCRS? <span className="req">*</span>
                  </label>
                  <textarea
                    id="whyJoin"
                    name="whyJoin"
                    className="form-textarea"
                    rows={3}
                    placeholder="What excites you about leading this domain? What impact do you hope to make during your tenure?"
                    value={formData.whyJoin}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="initiativeIdea">
                    One project, workshop, or event you would like to initiate:
                  </label>
                  <textarea
                    id="initiativeIdea"
                    name="initiativeIdea"
                    className="form-textarea"
                    rows={3}
                    placeholder="e.g. A beginner AI boot-camp, a campus UI redesign sprint, an alumni speaker session, or an inter-college hackathon..."
                    value={formData.initiativeIdea}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="weeklyHours">
                    Expected Weekly Commitment <span className="req">*</span>
                  </label>
                  <select
                    id="weeklyHours"
                    name="weeklyHours"
                    className="form-select"
                    value={formData.weeklyHours}
                    onChange={handleChange}
                  >
                    <option value="6-8 hours/week">6 - 8 hours / week</option>
                    <option value="8-12 hours/week">8 - 12 hours / week (Standard Coordinator)</option>
                    <option value="12-16 hours/week">12 - 16 hours / week (Dedicated Lead)</option>
                  </select>
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

              {currentStep < 4 ? (
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
