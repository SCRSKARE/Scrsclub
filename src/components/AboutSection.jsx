import React from 'react';
import {
  Sparkles,
  BookOpen,
  Target,
  Trophy,
  Brain,
  Cpu,
  Users,
  Award,
  Calendar,
  Quote,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function AboutSection({ aboutData, onExploreEvents, onJoinClick }) {
  const faculty = aboutData?.facultyAdvisor || {};
  const milestones = aboutData?.milestones || [];

  const pillars = [
    {
      icon: Brain,
      title: 'Soft Computing & AI Research',
      color: '#38bdf8',
      desc: 'Encouraging student scholars to publish in IEEE/Scopus conferences, delve into neural networks, fuzzy systems, and bio-inspired algorithms.'
    },
    {
      icon: Cpu,
      title: 'Full-Stack Systems & Open Source',
      color: '#a855f7',
      desc: 'Building scalable campus-wide web portals, mobile utilities, microservices, and robotics stacks through collaborative GitHub sprints.'
    },
    {
      icon: Trophy,
      title: 'Competitive Coding & Hackathons',
      color: '#f59e0b',
      desc: 'Organizing HackSCRS (South India\'s premier 36-hr hackathon) and weekly algorithmic face-offs to sharpen technical speed and problem-solving.'
    },
    {
      icon: Users,
      title: 'Community Mentorship & Outreach',
      color: '#10b981',
      desc: 'Peer-led bootcamps for first- and second-year students, mock technical interviews, resume roasts, and industry alumni connect talks.'
    }
  ];

  return (
    <section id="about" style={{ padding: '5rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: 'var(--primary)',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <Sparkles size={15} />
            <span>Identity & Heritage</span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            About <span className="gradient-text">SCRS Club</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Student Community & Research Society at KL University is a student-driven ecosystem uniting computer
            scientists, builders, researchers, and event architects.
          </p>
        </div>

        {/* Mission & Vision Bento Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem'
          }}
        >
          {/* Mission */}
          <div
            className="card"
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              background: 'linear-gradient(135deg, rgba(18, 26, 44, 0.8) 0%, rgba(10, 16, 30, 0.95) 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                color: 'var(--primary)'
              }}
            >
              <Target size={24} />
            </div>

            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.75rem' }}>Our Mission</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {aboutData?.mission ||
                'To foster an inspiring ecosystem where undergraduate and postgraduate scholars bridge the frontier between theoretical computing, engineering craftsmanship, and open research.'}
            </p>
          </div>

          {/* Vision */}
          <div
            className="card"
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              background: 'linear-gradient(135deg, rgba(18, 26, 44, 0.8) 0%, rgba(10, 16, 30, 0.95) 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                color: '#06b6d4'
              }}
            >
              <BookOpen size={24} />
            </div>

            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.75rem' }}>Our Vision</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {aboutData?.vision ||
                'To be recognized as a premier national collegiate center of technical excellence, recognized for impactful publications, top-tier hackathon champions, and ethical engineering leaders.'}
            </p>
          </div>
        </div>

        {/* 4 Pillars Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>Core Pillars of Excellence</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              How SCRS drives multidisciplinary growth and career acceleration.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)'
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: `rgba(${pillar.color === '#38bdf8' ? '56, 189, 248' : pillar.color === '#a855f7' ? '168, 85, 247' : pillar.color === '#f59e0b' ? '245, 158, 11' : '16, 185, 129'}, 0.12)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: pillar.color,
                      marginBottom: '1rem'
                    }}
                  >
                    <IconComp size={22} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.5rem' }}>{pillar.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Faculty Advisor Spotlight */}
        {faculty && (
          <div
            className="card"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              background: 'linear-gradient(135deg, rgba(20, 30, 52, 0.75) 0%, rgba(12, 18, 34, 0.95) 100%)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              marginBottom: '4rem'
            }}
          >
            <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)' }}>
              <img
                src={faculty.photoUrl}
                alt={faculty.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                <Quote size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Faculty Advisor's Message</span>
              </div>
              <blockquote
                style={{
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: '#e2e8f0',
                  lineHeight: 1.7,
                  marginBottom: '1.25rem'
                }}
              >
                "{faculty.quote}"
              </blockquote>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{faculty.name}</div>
              <div style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 600 }}>{faculty.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{faculty.department}</div>
            </div>
          </div>
        )}

        {/* Milestones / Timeline */}
        {milestones.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>Our Journey & Milestones</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                The trajectory of SCRS through years of student determination and leadership.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)'
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      marginBottom: '0.5rem',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    {m.year}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>{m.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
