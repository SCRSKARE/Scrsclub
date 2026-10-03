import React, { useState } from 'react';
import { ArrowRight, Code2, Palette, CalendarCheck2, Megaphone, Briefcase, PenTool, Sparkles } from 'lucide-react';
import { DOMAINS } from '../data/rolesData';
import DomainModal from './DomainModal';

const ICON_MAP = {
  Code2,
  Palette,
  CalendarCheck2,
  Megaphone,
  Briefcase,
  PenTool
};

export default function DomainsDirectory({ onSelectDomainForApply }) {
  const [selectedDomain, setSelectedDomain] = useState(null);

  return (
    <section className="section" id="roles-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Wings & Specializations</span>
          <h2 className="section-title">Open Coordinator Roles</h2>
          <p className="section-description">
            Discover where your passion and skills can make the highest impact. We are hiring Coordinators across all 6 specialized wings.
          </p>
        </div>

        <div className="domains-grid">
          {DOMAINS.map(domain => {
            const IconComponent = ICON_MAP[domain.icon] || Sparkles;
            return (
              <div key={domain.id} className="domain-card">
                <div
                  className="domain-icon-box"
                  style={{
                    background: domain.bgLight,
                    color: domain.color
                  }}
                >
                  <IconComponent size={24} />
                </div>

                <h3 className="domain-title" style={{ fontSize: '1.25rem' }}>{domain.title}</h3>
                <p className="domain-tagline">{domain.tagline}</p>

                <div className="domain-skills-wrap">
                  {domain.recommendedSkills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                  {domain.recommendedSkills.length > 3 && (
                    <span className="skill-tag">
                      +{domain.recommendedSkills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="domain-card-actions">
                  <button
                    className="domain-view-btn"
                    onClick={() => setSelectedDomain(domain)}
                  >
                    <span>View Role Scope</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectDomainForApply(domain.title)}
                  >
                    <span>Apply for Role</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Details Modal */}
      {selectedDomain && (
        <DomainModal
          domain={selectedDomain}
          onClose={() => setSelectedDomain(null)}
          onApplyDomain={(domTitle) => onSelectDomainForApply(domTitle)}
        />
      )}
    </section>
  );
}
