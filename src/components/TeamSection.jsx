import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Building,
  Sparkles,
  Award,
  GraduationCap,
  Users,
  User
} from 'lucide-react';
import { getTeamMembers, subscribeToTeamMembers, isFacultyMember } from '../services/db';

export default function TeamSection({ onNavigateToApply }) {
  const [team, setTeam] = useState(getTeamMembers());
  const [categoryTab, setCategoryTab] = useState('ALL'); // 'ALL' | 'FACULTY' | 'CLUB'
  const [selectedClubDomain, setSelectedClubDomain] = useState('ALL');

  useEffect(() => {
    const unsub = subscribeToTeamMembers((members) => {
      setTeam(members);
    });
    return () => unsub();
  }, []);

  const facultyMembers = team.filter(isFacultyMember);
  const clubMembers = team.filter(m => !isFacultyMember(m));

  const clubDomainsList = ['ALL', ...new Set(clubMembers.map(m => m.domain || 'Coordinator'))];

  const filteredClubMembers = selectedClubDomain === 'ALL'
    ? clubMembers
    : clubMembers.filter(m => m.domain === selectedClubDomain);

  return (
    <section className="section" id="team-section">
      <div className="container">
        {/* Main Section Header */}
        <div className="section-header">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.95rem',
            color: 'var(--primary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Building size={14} />
            <span>KARE Student Chapter Leadership</span>
          </div>
          <h2 className="section-title">Coordinators & Advisory Board</h2>
          <p className="section-description">
            Meet the faculty mentors providing academic direction and the student coordinators driving soft computing research, hackathons, and technical initiatives.
          </p>
        </div>

        {/* Master Category Options Pill Bar (Faculty Coordinators & Club Coordinators) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem'
        }}>
          <button
            className={`filter-btn ${categoryTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setCategoryTab('ALL')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              border: categoryTab === 'ALL' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: categoryTab === 'ALL' ? 'var(--primary)' : 'var(--bg-card)',
              color: categoryTab === 'ALL' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: categoryTab === 'ALL' ? 'var(--shadow-glow)' : 'none'
            }}
          >
            <Users size={15} />
            <span>All Leadership ({team.length})</span>
          </button>

          <button
            className={`filter-btn ${categoryTab === 'FACULTY' ? 'active' : ''}`}
            onClick={() => setCategoryTab('FACULTY')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              border: categoryTab === 'FACULTY' ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
              background: categoryTab === 'FACULTY' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-card)',
              color: categoryTab === 'FACULTY' ? '#fbbf24' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: categoryTab === 'FACULTY' ? '0 0 15px rgba(245, 158, 11, 0.35)' : 'none'
            }}
          >
            <GraduationCap size={16} color={categoryTab === 'FACULTY' ? '#fbbf24' : undefined} />
            <span>Faculty Coordinators ({facultyMembers.length})</span>
          </button>

          <button
            className={`filter-btn ${categoryTab === 'CLUB' ? 'active' : ''}`}
            onClick={() => setCategoryTab('CLUB')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              border: categoryTab === 'CLUB' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
              background: categoryTab === 'CLUB' ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-card)',
              color: categoryTab === 'CLUB' ? '#38bdf8' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: categoryTab === 'CLUB' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <Sparkles size={15} color={categoryTab === 'CLUB' ? '#38bdf8' : undefined} />
            <span>Club Coordinators ({clubMembers.length})</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* 1. FACULTY COORDINATORS SECTION (Placed Above Club Coordinators) */}
        {/* ================================================================= */}
        {(categoryTab === 'ALL' || categoryTab === 'FACULTY') && (
          <div style={{ marginBottom: categoryTab === 'ALL' ? '4.5rem' : '2rem' }}>
            {/* Faculty Sub-header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1rem'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#fbbf24',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.35rem'
                }}>
                  <Award size={15} />
                  <span>Academic Mentors & Chapter Advisors</span>
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Faculty Coordinators
                </h3>
              </div>
              <span style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                padding: '0.3rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {facultyMembers.length} {facultyMembers.length === 1 ? 'Faculty Advisor' : 'Faculty Advisors'}
              </span>
            </div>

            {facultyMembers.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                background: 'rgba(15, 23, 42, 0.3)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-muted)',
                maxWidth: '520px',
                marginInline: 'auto'
              }}>
                <GraduationCap size={36} style={{ marginBottom: '0.5rem', opacity: 0.6, color: '#fbbf24' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                  No Faculty Coordinators Listed
                </div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
                  Faculty coordinators and mentors can be added through the Admin Portal.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {facultyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="glass-card"
                    style={{
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                      transition: 'transform 0.25s ease, border-color 0.25s ease'
                    }}
                  >
                    {/* Faculty Badge Icon */}
                    <span style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#fbbf24',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <GraduationCap size={12} />
                      <span>Faculty</span>
                    </span>

                    {/* Profile Image with Gold Ring */}
                    <div style={{
                      width: '110px',
                      height: '110px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid #f59e0b',
                      boxShadow: '0 0 24px rgba(245, 158, 11, 0.4)',
                      marginBottom: '1.25rem',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <User size={46} color="#fbbf24" />
                      )}
                    </div>

                    {/* Domain Tag */}
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.65rem',
                      marginBottom: '0.65rem',
                      borderRadius: '12px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      color: '#fbbf24',
                      fontWeight: 700,
                      border: '1px solid rgba(245, 158, 11, 0.25)'
                    }}>
                      {member.domain || 'Faculty Advisor'}
                    </span>

                    {/* Name & Role */}
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                      {member.name}
                    </h3>
                    <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.85rem' }}>
                      {member.role}
                    </p>

                    {/* Bio */}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '1.25rem', flexGrow: 1 }}>
                      {member.bio || 'Guiding soft computing innovation, student projects, and academic excellence.'}
                    </p>

                    {/* Contact Strip */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem',
                      width: '100%',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '1rem',
                      fontSize: '0.82rem'
                    }}>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
                          title={member.email}
                        >
                          <Mail size={14} color="#38bdf8" />
                          <span>Email</span>
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
                          title={member.phone}
                        >
                          <Phone size={14} color="#34d399" />
                          <span>Call</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. CLUB COORDINATORS SECTION (Placed Below Faculty Coordinators) */}
        {/* ================================================================= */}
        {(categoryTab === 'ALL' || categoryTab === 'CLUB') && (
          <div>
            {/* Club Coordinators Sub-header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1rem'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--primary)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.35rem'
                }}>
                  <Sparkles size={15} />
                  <span>Student Chapter Officers & Domain Leads</span>
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Club Coordinators
                </h3>
              </div>
              <span style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                padding: '0.3rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {filteredClubMembers.length} Student Coordinators
              </span>
            </div>

            {/* Domain Filter Pills for Club Coordinators */}
            {clubDomainsList.length > 2 && (
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginBottom: '2rem'
              }}>
                {clubDomainsList.map(dom => (
                  <button
                    key={dom}
                    className={`filter-btn ${selectedClubDomain === dom ? 'active' : ''}`}
                    onClick={() => setSelectedClubDomain(dom)}
                    style={{
                      padding: '0.4rem 0.95rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: selectedClubDomain === dom ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      background: selectedClubDomain === dom ? 'rgba(0, 119, 182, 0.18)' : 'var(--bg-card)',
                      color: selectedClubDomain === dom ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {dom === 'ALL' ? 'All Club Domains' : dom}
                  </button>
                ))}
              </div>
            )}

            {filteredClubMembers.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3.5rem 1.5rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                maxWidth: '540px',
                marginInline: 'auto',
                color: 'var(--text-muted)'
              }}>
                <User size={40} style={{ marginBottom: '0.75rem', opacity: 0.6, color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  No Club Coordinators Found
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  There are currently no student club coordinators matching this domain in the database.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.75rem'
              }}>
                {filteredClubMembers.map((member) => (
                  <div
                    key={member.id}
                    className="glass-card"
                    style={{
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      transition: 'transform 0.25s ease, border-color 0.25s ease'
                    }}
                  >
                    {/* Profile Image */}
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid var(--primary)',
                      boxShadow: '0 0 20px var(--primary-glow)',
                      marginBottom: '1.25rem',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <User size={40} color="var(--primary)" />
                      )}
                    </div>

                    {/* Tag */}
                    <span className="skill-tag" style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.65rem',
                      marginBottom: '0.65rem',
                      borderRadius: '12px'
                    }}>
                      {member.domain || 'Club Coordinator'}
                    </span>

                    {/* Name & Role */}
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                      {member.name}
                    </h3>
                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.85rem' }}>
                      {member.role}
                    </p>

                    {/* Bio */}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem', flexGrow: 1 }}>
                      {member.bio}
                    </p>

                    {/* Contact Strip */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem',
                      width: '100%',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '1rem',
                      fontSize: '0.82rem'
                    }}>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                          title={member.email}
                        >
                          <Mail size={14} color="#38bdf8" />
                          <span>Email</span>
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                          title={member.phone}
                        >
                          <Phone size={14} color="#34d399" />
                          <span>Call</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recruitment Banner Call to Action */}
        <div style={{
          marginTop: '4.5rem',
          background: 'var(--gradient-brand)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Want to join the SCRS Coordinator Board?
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', maxWidth: '600px', marginInline: 'auto', marginBottom: '1.5rem' }}>
            Applications are currently open for 2026-27 Technical, Events, Media, Corporate & PR Coordinators.
          </p>
          <button className="btn btn-secondary btn-lg" onClick={onNavigateToApply} style={{ background: '#fff', color: '#0b2545', fontWeight: 800 }}>
            <span>Apply for Club Roles</span>
          </button>
        </div>
      </div>
    </section>
  );
}
