import React from 'react';
import { Shield, Award, Users, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROLE_HIGHLIGHTS } from '../data/rolesData';

export default function HiringTracks({ onApplyClick }) {
  const iconList = [Rocket, Award, Users, Shield];

  return (
    <section className="section" id="role-overview-section" style={{ paddingTop: '1.5rem' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Leadership Journey</span>
          <h2 className="section-title">Why Become an SCRS Coordinator?</h2>
          <p className="section-description">
            Step up to lead the university’s premier research and technology society. Gain unparalleled executive management experience while guiding a thriving community.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {ROLE_HIGHLIGHTS.map((item, idx) => {
            const Icon = iconList[idx] || Shield;
            return (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)' }}>
              Open to 1st, 2nd & 3rd Year Students
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.35rem' }}>
              Ready to take the lead?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px' }}>
              Select your preferred domain below and submit your application in under 3 minutes.
            </p>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={onApplyClick}
          >
            <span>Apply for Role</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
