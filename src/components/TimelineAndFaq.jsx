import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, HelpCircle, CheckCircle } from 'lucide-react';
import { TIMELINE, FAQS } from '../data/rolesData';

export default function TimelineAndFaq() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <>
      {/* Timeline Section */}
      <section className="section" id="timeline-section" style={{ background: 'rgba(15, 23, 42, 0.35)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Recruitment Schedule</span>
            <h2 className="section-title">Hiring Process & Key Dates</h2>
            <p className="section-description">
              Mark these milestones on your calendar. All communication and status notifications happen dynamically via this portal.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            position: 'relative'
          }}>
            {TIMELINE.map((item, index) => (
              <div
                key={index}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  borderTop: index === 0 ? '3px solid #10b981' : '3px solid #6366f1'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: index === 0 ? '#34d399' : '#818cf8',
                    letterSpacing: '0.05em'
                  }}>
                    Step 0{index + 1}
                  </span>
                  {index === 0 && (
                    <span className="badge-status accepted" style={{ fontSize: '0.7rem' }}>
                      Active
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {item.title}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '0.25rem' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" id="faq-section">
        <div className="container" style={{ maxWidth: '840px' }}>
          <div className="section-header">
            <span className="section-eyebrow">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">
              Everything you need to know about eligibility, tracks, and the interview format.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="glass-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    borderColor: isOpen ? 'var(--border-light)' : 'var(--border-subtle)'
                  }}
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {faq.q}
                    </h3>
                    <button style={{ color: 'var(--text-dim)' }}>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {isOpen && (
                    <p style={{
                      marginTop: '1rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      fontSize: '0.94rem',
                      lineHeight: 1.6
                    }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
