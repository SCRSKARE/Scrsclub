import React, { useState } from 'react';
import {
  Users,
  Mail,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';

function LinkedInIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0 0-3.18 1.59 1.59 0 0 0 0 3.18m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function GitHubIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function TeamSection({ teamMembers = [] }) {
  const [selectedWing, setSelectedWing] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique wings
  const wings = ['ALL', ...Array.from(new Set(teamMembers.map(m => m.wing).filter(Boolean)))];

  const filteredMembers = teamMembers.filter(member => {
    const matchesWing = selectedWing === 'ALL' || member.wing === selectedWing;
    const matchesSearch =
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWing && matchesSearch;
  });

  return (
    <section id="team" style={{ padding: '5rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(168, 85, 247, 0.12)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#c084fc',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <Users size={15} />
            <span>The Minds Behind SCRS</span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Meet Our <span className="gradient-text">Leadership & Team</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            A passionate collective of student engineers, researchers, designers, and organizers dedicated to fostering
            excellence across KL University.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '3rem',
            padding: '1.25rem',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(12px)'
          }}
        >
          {/* Wings filter tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {wings.map(wing => (
              <button
                key={wing}
                onClick={() => setSelectedWing(wing)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: selectedWing === wing ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: selectedWing === wing ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                  color: selectedWing === wing ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {wing}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)'
              }}
            />
            <input
              type="text"
              placeholder="Search team member or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{
                paddingLeft: '38px',
                fontSize: '0.875rem',
                backgroundColor: 'rgba(15, 23, 42, 0.7)'
              }}
            />
          </div>
        </div>

        {/* Team Grid */}
        {filteredMembers.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Users size={48} color="var(--text-dim)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No team members found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try clearing filters or search queries.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'transform 0.3s ease, border-color 0.3s ease'
                }}
              >
                {/* Photo Header */}
                <div
                  style={{
                    position: 'relative',
                    height: '240px',
                    width: '100%',
                    overflow: 'hidden',
                    background: '#0d1322'
                  }}
                >
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)'
                    }}
                  />

                  {/* Core Badge */}
                  {member.isCore && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          background: 'rgba(99, 102, 241, 0.35)',
                          color: '#a5b4fc',
                          border: '1px solid rgba(99, 102, 241, 0.5)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backdropFilter: 'blur(8px)'
                        }}
                      >
                        <ShieldCheck size={12} />
                        Core Lead
                      </span>
                    </div>
                  )}

                  {/* Wing Pill */}
                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '1.25rem', zIndex: 2 }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-main)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        border: '1px solid var(--border-subtle)',
                        backdropFilter: 'blur(6px)'
                      }}
                    >
                      {member.wing || 'Club Member'}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div style={{ padding: '1.25rem 1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                    {member.name}
                  </h3>

                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {member.designation}
                  </div>

                  {member.bio && (
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                        marginBottom: '1.25rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {member.bio}
                    </p>
                  )}

                  {/* Social Links Footer */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}
                  >
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#38bdf8',
                          transition: 'all 0.2s ease'
                        }}
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <LinkedInIcon size={15} />
                      </a>
                    )}

                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          transition: 'all 0.2s ease'
                        }}
                        aria-label={`${member.name} GitHub`}
                      >
                        <GitHubIcon size={15} />
                      </a>
                    )}

                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#f59e0b',
                          transition: 'all 0.2s ease'
                        }}
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
