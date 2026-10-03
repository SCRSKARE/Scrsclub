import React from 'react';
import { X, CheckCircle, ArrowRight, Sparkles, Code2, Palette, CalendarCheck2, Megaphone, Briefcase, PenTool } from 'lucide-react';

const ICON_MAP = {
  Code2,
  Palette,
  CalendarCheck2,
  Megaphone,
  Briefcase,
  PenTool
};

export default function DomainModal({ domain, onClose, onApplyDomain }) {
  if (!domain) return null;
  const IconComponent = ICON_MAP[domain.icon] || Sparkles;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: domain.bgLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: domain.color
              }}
            >
              <IconComponent size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{domain.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{domain.wing}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Role Scope & Purpose
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {domain.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              padding: '0.2rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              Core Responsibilities
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {domain.responsibilities.map((resp, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  <CheckCircle size={16} color="#818cf8" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Skills */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Recommended Tooling & Skills
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {domain.recommendedSkills.map((skill, i) => (
                <span key={i} className="skill-tag" style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onApplyDomain(domain.title);
            }}
          >
            <span>Apply for this Role</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
