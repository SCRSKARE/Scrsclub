import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Globe,
  Share2,
  CheckCircle,
  Clock,
  ChevronDown
} from 'lucide-react';

export default function ContactSection({ contactInfo }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 900);
  };

  const faqs = [
    {
      q: 'Who can attend SCRS workshops and hackathons?',
      a: 'All SCRS events, bootcamps, and hackathons are open to students across all branches and years at KL University and participating universities. Some events are also open nationwide.'
    },
    {
      q: 'How do I join the SCRS Core Team or Coordinator body?',
      a: 'We conduct our flagship annual coordinator recruitment cycle every semester. Head over to our "Hiring" section to view open wings and apply directly.'
    },
    {
      q: 'Can I propose a technical workshop or paper presentation?',
      a: 'Absolutely! Send us a message using the contact form below or visit Room 304 in the SAC to discuss research collaboration with our technical leads.'
    },
    {
      q: 'How can external organizations or companies sponsor SCRS events?',
      a: 'We welcome tech companies and alumni sponsors! Reach out to us at scrs@klu.ac.in or connect with our Corporate & PR Coordinator team.'
    }
  ];

  return (
    <section id="contact" style={{ padding: '5rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#06b6d4',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <Mail size={15} />
            <span>Connect & Collaborate</span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Get in <span className="gradient-text">Touch with Us</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Have a question about upcoming hackathons, research collaborations, or coordinator recruitments?
            Drop us a message or visit our club room at KL University.
          </p>
        </div>

        {/* Contact Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem'
          }}
        >
          {/* Left: Contact Info & Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              className="card"
              style={{
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)'
              }}
            >
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem' }}>Official Headquarters</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Location</div>
                    <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600, lineHeight: 1.5 }}>
                      {contactInfo?.room || 'Room 304, 3rd Floor, Student Activity Center (SAC)'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {contactInfo?.campus || 'KL University Green Fields Campus'}, {contactInfo?.city || 'Vaddeswaram, AP'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: '#06b6d4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Email</div>
                    <a
                      href={`mailto:${contactInfo?.email || 'scrs@klu.ac.in'}`}
                      style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: 600 }}
                    >
                      {contactInfo?.email || 'scrs@klu.ac.in'}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Contact Number</div>
                    <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>
                      {contactInfo?.phone || '+91 98765 43210'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Operating Hours</div>
                    <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>
                      Monday – Saturday: 04:30 PM – 07:30 PM IST
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Official Community Handles
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a
                    href={contactInfo?.linkedin || 'https://linkedin.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                  >
                    <Share2 size={14} />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={contactInfo?.github || 'https://github.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                  >
                    <Globe size={14} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={contactInfo?.discord || 'https://discord.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                  >
                    <MessageSquare size={14} />
                    <span>Discord</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div
            className="card"
            style={{
              padding: '2.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card)'
            }}
          >
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>Send Us an Inquiry</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Fill in your details below and our team will get back to you within 24 hours.
            </p>

            {submitted ? (
              <div
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center'
                }}
              >
                <CheckCircle size={44} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>Message Dispatched!</h4>
                <p style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>
                  Thank you for reaching out. We have received your inquiry and our coordinators will respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@klu.ac.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hackathon Inquiry / Research Proposal"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you'd like to collaborate on..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-control"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>Frequently Asked Questions</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Quick answers about club operations, member eligibility, and sponsorships.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      color="var(--text-muted)"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease'
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.25rem 1.5rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.925rem',
                        lineHeight: 1.7,
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: '0.75rem'
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
