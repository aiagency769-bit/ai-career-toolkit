import React from 'react'
import type { ResumeData } from '../../types'
import { formatDate } from '../../lib/utils'

interface Props { resume: ResumeData }

export const ResumePreview: React.FC<Props> = ({ resume }) => {
  switch (resume.template) {
    case 'minimal':     return <MinimalTemplate resume={resume} />
    case 'creative':    return <CreativeTemplate resume={resume} />
    case 'corporate':   return <CorporateTemplate resume={resume} />
    case 'executive':   return <ExecutiveTemplate resume={resume} />
    case 'fresher':     return <FresherTemplate resume={resume} />
    case 'government':  return <GovernmentTemplate resume={resume} />
    case 'tech':        return <TechTemplate resume={resume} />
    default:            return <ModernTemplate resume={resume} />
  }
}

// ─── Shared Helpers ────────────────────────────────────────────────────────────

const SectionDivider: React.FC<{ title: string; color?: string }> = ({ title, color = '#4f46e5' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, marginTop: 22 }}>
    <h2 style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', color, margin: 0, whiteSpace: 'nowrap' }}>{title}</h2>
    <div style={{ flex: 1, height: 1.5, background: `${color}30` }} />
  </div>
)

// ─── MODERN TEMPLATE ────────────────────────────────────────────────────────────

const ModernTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills, certifications, languages, projects, awards, references } = resume
  const accent = '#4f46e5'
  return (
    <div id="resume-preview" style={{ background: 'white', fontFamily: "'Inter', 'Helvetica Neue', sans-serif", maxWidth: 794, minHeight: 1122, color: '#1a1a2e' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${accent} 0%, #7c3aed 100%)`, padding: '40px 48px 32px', color: 'white' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>{p.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: 15, marginTop: 6, marginBottom: 18, opacity: 0.9, fontWeight: 500 }}>{p.title || 'Professional Title'}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: 11.5, opacity: 0.88 }}>
          {p.email    && <span>✉ {p.email}</span>}
          {p.phone    && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.github   && <span>⚡ {p.github}</span>}
          {p.website  && <span>🌐 {p.website}</span>}
        </div>
      </div>

      <div style={{ padding: '28px 48px 40px' }}>
        {summary && (
          <section>
            <SectionDivider title="Professional Summary" color={accent} />
            <p style={{ fontSize: 12.5, lineHeight: 1.75, color: '#374151' }}>{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <SectionDivider title="Experience" color={accent} />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#111827' }}>{exp.position}</div>
                    <div style={{ fontSize: 12.5, color: accent, fontWeight: 600 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap', marginLeft: 16, marginTop: 2 }}>
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && <p style={{ fontSize: 12, color: '#6b7280', marginTop: 5, lineHeight: 1.6 }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ margin: '5px 0 0', paddingLeft: 16, fontSize: 12, lineHeight: 1.85, color: '#374151' }}>
                    {exp.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section>
            <SectionDivider title="Education" color={accent} />
            {education.map(edu => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#111827' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div style={{ fontSize: 12.5, color: accent, fontWeight: 600 }}>{edu.institution}</div>
                  {edu.gpa && <div style={{ fontSize: 11.5, color: '#6b7280' }}>GPA: {edu.gpa}</div>}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap', marginLeft: 16 }}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </div>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <SectionDivider title="Skills" color={accent} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 4 }}>
              {skills.map(s => (
                <span key={s.id} style={{ padding: '4px 12px', borderRadius: 20, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: 11.5, fontWeight: 600 }}>
                  {s.name}
                  {s.level && s.level !== 'Intermediate' && <span style={{ opacity: 0.6, fontWeight: 400 }}> · {s.level}</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <SectionDivider title="Projects" color={accent} />
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>
                    {proj.name}
                    {proj.url && <span style={{ fontSize: 11, color: accent, fontWeight: 400, marginLeft: 8 }}>{proj.url}</span>}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{formatDate(proj.startDate ?? '')} – {formatDate(proj.endDate ?? '')}</div>
                  )}
                </div>
                {proj.description && <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0', lineHeight: 1.6 }}>{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
                    {proj.technologies.map((t, i) => (
                      <span key={i} style={{ fontSize: 11, padding: '2px 8px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 12, color: '#374151' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <SectionDivider title="Certifications" color={accent} />
            {certifications.map(cert => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{cert.name}</span>
                  <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>— {cert.issuer}</span>
                </div>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{formatDate(cert.date)}</span>
              </div>
            ))}
          </section>
        )}

        <div style={{ display: 'flex', gap: 40 }}>
          {languages.length > 0 && (
            <section style={{ flex: 1 }}>
              <SectionDivider title="Languages" color={accent} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {languages.map(lang => (
                  <span key={lang.id} style={{ padding: '4px 12px', borderRadius: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: 11.5, fontWeight: 600 }}>
                    {lang.name} — {lang.proficiency}
                  </span>
                ))}
              </div>
            </section>
          )}
          {awards.length > 0 && (
            <section style={{ flex: 1 }}>
              <SectionDivider title="Awards" color={accent} />
              {awards.map(award => (
                <div key={award.id} style={{ marginBottom: 7 }}>
                  <div style={{ fontWeight: 600, fontSize: 12.5, color: '#111827' }}>{award.title}</div>
                  <div style={{ fontSize: 11.5, color: '#6b7280' }}>{award.issuer} · {formatDate(award.date)}</div>
                  {award.description && <div style={{ fontSize: 11.5, color: '#6b7280' }}>{award.description}</div>}
                </div>
              ))}
            </section>
          )}
        </div>

        {references.length > 0 && (
          <section>
            <SectionDivider title="References" color={accent} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {references.map(ref => (
                <div key={ref.id} style={{ flex: '1 1 200px' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{ref.name}</div>
                  <div style={{ fontSize: 12, color: accent }}>{ref.title} · {ref.company}</div>
                  <div style={{ fontSize: 11.5, color: '#6b7280' }}>{ref.email}</div>
                  {ref.phone && <div style={{ fontSize: 11.5, color: '#6b7280' }}>{ref.phone}</div>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ─── MINIMAL TEMPLATE ───────────────────────────────────────────────────────────

const MinimalTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages, awards } = resume
  return (
    <div id="resume-preview" style={{ background: 'white', padding: '52px 56px', fontFamily: "'Helvetica Neue', Arial, sans-serif", maxWidth: 794, minHeight: 1122 }}>
      <div style={{ borderBottom: '2.5px solid #111', paddingBottom: 20, marginBottom: 28 }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, margin: 0, letterSpacing: -1.5, color: '#000' }}>{p.fullName || 'Your Name'}</h1>
        <p style={{ color: '#555', margin: '6px 0 14px', fontSize: 14, fontWeight: 500 }}>{p.title}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 11.5, color: '#666' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </div>

      {summary && <p style={{ fontSize: 12.5, lineHeight: 1.85, color: '#444', marginBottom: 24 }}>{summary}</p>}

      {experience.length > 0 && (
        <MinSection title="Experience">
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 13.5 }}>{exp.position} — {exp.company}</strong>
                <span style={{ fontSize: 11, color: '#888' }}>{formatDate(exp.startDate)} – {exp.current ? 'Now' : formatDate(exp.endDate)}</span>
              </div>
              {exp.location && <div style={{ fontSize: 11.5, color: '#888', marginTop: 2 }}>{exp.location}</div>}
              {exp.description && <p style={{ fontSize: 12, color: '#555', margin: '5px 0 0', lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements.filter(Boolean).map((a, i) => (
                <div key={i} style={{ fontSize: 12, color: '#444', marginTop: 3 }}>• {a}</div>
              ))}
            </div>
          ))}
        </MinSection>
      )}

      {education.length > 0 && (
        <MinSection title="Education">
          {education.map(edu => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <strong style={{ fontSize: 13.5 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</strong>
                <span style={{ fontSize: 12.5, color: '#555', marginLeft: 6 }}>— {edu.institution}</span>
                {edu.gpa && <span style={{ fontSize: 11.5, color: '#888', marginLeft: 6 }}>GPA {edu.gpa}</span>}
              </div>
              <span style={{ fontSize: 11, color: '#888' }}>{formatDate(edu.endDate)}</span>
            </div>
          ))}
        </MinSection>
      )}

      {skills.length > 0 && (
        <MinSection title="Skills">
          <p style={{ fontSize: 12.5, color: '#444', lineHeight: 1.85 }}>{skills.map(s => s.name).join('  ·  ')}</p>
        </MinSection>
      )}

      {projects.length > 0 && (
        <MinSection title="Projects">
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: 10 }}>
              <strong style={{ fontSize: 13 }}>{proj.name}</strong>
              {proj.url && <span style={{ fontSize: 11, color: '#777', marginLeft: 8 }}>{proj.url}</span>}
              {proj.description && <p style={{ fontSize: 12, color: '#555', margin: '3px 0 0', lineHeight: 1.6 }}>{proj.description}</p>}
              {proj.technologies.length > 0 && <div style={{ fontSize: 11.5, color: '#888', marginTop: 2 }}>{proj.technologies.join(', ')}</div>}
            </div>
          ))}
        </MinSection>
      )}

      {certifications.length > 0 && (
        <MinSection title="Certifications">
          {certifications.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12.5 }}>
              <span>{c.name} — <em>{c.issuer}</em></span>
              <span style={{ color: '#888', fontSize: 11 }}>{formatDate(c.date)}</span>
            </div>
          ))}
        </MinSection>
      )}

      {languages.length > 0 && (
        <MinSection title="Languages">
          <p style={{ fontSize: 12.5, color: '#444' }}>{languages.map(l => `${l.name} (${l.proficiency})`).join('  ·  ')}</p>
        </MinSection>
      )}

      {awards.length > 0 && (
        <MinSection title="Awards">
          {awards.map(a => (
            <div key={a.id} style={{ marginBottom: 6, fontSize: 12.5 }}>
              <strong>{a.title}</strong> — {a.issuer} <span style={{ color: '#888', fontSize: 11 }}>({formatDate(a.date)})</span>
            </div>
          ))}
        </MinSection>
      )}
    </div>
  )
}

const MinSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 22 }}>
    <h2 style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0', paddingBottom: 5, marginBottom: 12, color: '#333', margin: '0 0 12px' }}>{title}</h2>
    {children}
  </div>
)

// ─── CREATIVE TEMPLATE ──────────────────────────────────────────────────────────

const CreativeTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages, awards } = resume
  const accent = '#7c3aed'
  const sidebar = '#1e1b4b'
  return (
    <div id="resume-preview" style={{ background: 'white', fontFamily: "'Inter', sans-serif", maxWidth: 794, minHeight: 1122, display: 'flex' }}>
      {/* Left sidebar */}
      <div style={{ width: 240, background: sidebar, color: 'white', padding: '40px 24px', flexShrink: 0 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #ec4899)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, marginBottom: 16, color: 'white' }}>
          {(p.fullName || 'U').charAt(0)}
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', lineHeight: 1.2 }}>{p.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 24, fontWeight: 500 }}>{p.title}</p>

        <SideSection title="Contact">
          {p.email && <SideItem icon="✉" text={p.email} />}
          {p.phone && <SideItem icon="📞" text={p.phone} />}
          {p.location && <SideItem icon="📍" text={p.location} />}
          {p.linkedin && <SideItem icon="🔗" text={p.linkedin} />}
          {p.github && <SideItem icon="⚡" text={p.github} />}
          {p.website && <SideItem icon="🌐" text={p.website} />}
        </SideSection>

        {skills.length > 0 && (
          <SideSection title="Skills">
            {skills.map(s => (
              <div key={s.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span>{s.name}</span>
                  <span style={{ opacity: 0.5 }}>{s.level}</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
                  <div style={{ height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${accent}, #ec4899)`, width: `${skillPct(s.level)}%` }} />
                </div>
              </div>
            ))}
          </SideSection>
        )}

        {languages.length > 0 && (
          <SideSection title="Languages">
            {languages.map(l => (
              <div key={l.id} style={{ fontSize: 11, marginBottom: 5 }}>
                <span style={{ fontWeight: 600 }}>{l.name}</span>
                <span style={{ opacity: 0.55, marginLeft: 6 }}>{l.proficiency}</span>
              </div>
            ))}
          </SideSection>
        )}

        {certifications.length > 0 && (
          <SideSection title="Certifications">
            {certifications.map(c => (
              <div key={c.id} style={{ fontSize: 11, marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <div style={{ opacity: 0.55 }}>{c.issuer} · {formatDate(c.date)}</div>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '40px 36px' }}>
        {summary && (
          <div style={{ marginBottom: 24 }}>
            <CreativeHeader title="About Me" accent={accent} />
            <p style={{ fontSize: 12.5, lineHeight: 1.8, color: '#374151' }}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <CreativeHeader title="Experience" accent={accent} />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 16, paddingLeft: 14, borderLeft: `3px solid ${accent}20` }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: '#111827' }}>{exp.position}</div>
                <div style={{ fontSize: 12, color: accent, fontWeight: 600, marginBottom: 3 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 5 }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                {exp.description && <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{exp.description}</p>}
                {exp.achievements.filter(Boolean).map((a, i) => <div key={i} style={{ fontSize: 12, color: '#374151', marginTop: 3 }}>▸ {a}</div>)}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <CreativeHeader title="Education" accent={accent} />
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 12, paddingLeft: 14, borderLeft: `3px solid ${accent}20` }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                <div style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{edu.institution}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{formatDate(edu.endDate)}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <CreativeHeader title="Projects" accent={accent} />
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: 12, paddingLeft: 14, borderLeft: `3px solid ${accent}20` }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{proj.name} {proj.url && <span style={{ fontSize: 11, color: accent, fontWeight: 400 }}>{proj.url}</span>}</div>
                {proj.description && <p style={{ fontSize: 12, color: '#6b7280', margin: '3px 0', lineHeight: 1.6 }}>{proj.description}</p>}
                {proj.technologies.length > 0 && <div style={{ fontSize: 11.5, color: '#9ca3af' }}>{proj.technologies.join(' · ')}</div>}
              </div>
            ))}
          </div>
        )}

        {awards.length > 0 && (
          <div>
            <CreativeHeader title="Awards" accent={accent} />
            {awards.map(a => (
              <div key={a.id} style={{ marginBottom: 10, paddingLeft: 14, borderLeft: `3px solid ${accent}20` }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{a.title}</div>
                <div style={{ fontSize: 11.5, color: accent }}>{a.issuer} · {formatDate(a.date)}</div>
                {a.description && <p style={{ fontSize: 12, color: '#6b7280', margin: '3px 0' }}>{a.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const SideSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.45, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 5, marginBottom: 10 }}>{title}</div>
    {children}
  </div>
)

const SideItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 7, fontSize: 10.5, opacity: 0.8 }}>
    <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
    <span style={{ wordBreak: 'break-all', lineHeight: 1.5 }}>{text}</span>
  </div>
)

const CreativeHeader: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
    <div style={{ width: 18, height: 18, borderRadius: 4, background: accent }} />
    <h2 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, margin: 0, color: '#111827' }}>{title}</h2>
  </div>
)

// ─── CORPORATE TEMPLATE ────────────────────────────────────────────────────────

const CorporateTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages, awards, references } = resume
  const accent = '#1e40af'
  return (
    <div id="resume-preview" style={{ background: 'white', fontFamily: "'Georgia', serif", maxWidth: 794, minHeight: 1122 }}>
      {/* Top bar */}
      <div style={{ background: accent, height: 6 }} />
      <div style={{ padding: '36px 52px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${accent}`, paddingBottom: 20, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#0f172a', letterSpacing: -0.5 }}>{p.fullName || 'Your Name'}</h1>
            <p style={{ fontSize: 14, color: accent, margin: '6px 0 0', fontWeight: 600 }}>{p.title}</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11.5, color: '#374151', lineHeight: 1.9 }}>
            {p.email && <div>{p.email}</div>}
            {p.phone && <div>{p.phone}</div>}
            {p.location && <div>{p.location}</div>}
            {p.linkedin && <div>{p.linkedin}</div>}
          </div>
        </div>

        {summary && (
          <div style={{ marginBottom: 22 }}>
            <CorpHeader title="Executive Summary" accent={accent} />
            <p style={{ fontSize: 12.5, lineHeight: 1.8, color: '#374151', fontStyle: 'italic' }}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <CorpHeader title="Professional Experience" accent={accent} />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>{exp.position}</div>
                  <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                </div>
                <div style={{ fontSize: 12.5, color: accent, fontWeight: 600, marginBottom: 5 }}>{exp.company}{exp.location ? ` | ${exp.location}` : ''}</div>
                {exp.description && <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.65, margin: '0 0 4px' }}>{exp.description}</p>}
                {exp.achievements.filter(Boolean).map((a, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#374151', marginTop: 3, paddingLeft: 12 }}>• {a}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 22 }}>
          {education.length > 0 && (
            <div>
              <CorpHeader title="Education" accent={accent} />
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{edu.institution}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{formatDate(edu.endDate)}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <CorpHeader title="Core Competencies" accent={accent} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skills.map(s => (
                  <span key={s.id} style={{ fontSize: 11.5, padding: '3px 10px', background: '#eff6ff', border: `1px solid ${accent}30`, borderRadius: 4, color: accent, fontWeight: 600 }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {projects.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <CorpHeader title="Key Projects" accent={accent} />
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{proj.name}</div>
                {proj.description && <p style={{ fontSize: 12, color: '#475569', margin: '3px 0', lineHeight: 1.6 }}>{proj.description}</p>}
                {proj.technologies.length > 0 && <div style={{ fontSize: 11.5, color: '#64748b' }}>Technologies: {proj.technologies.join(', ')}</div>}
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <CorpHeader title="Certifications" accent={accent} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px' }}>
              {certifications.map(c => (
                <span key={c.id} style={{ fontSize: 12 }}>▪ {c.name} ({c.issuer}, {formatDate(c.date)})</span>
              ))}
            </div>
          </div>
        )}

        {(languages.length > 0 || awards.length > 0) && (
          <div style={{ display: 'flex', gap: 32 }}>
            {languages.length > 0 && (
              <div style={{ flex: 1 }}>
                <CorpHeader title="Languages" accent={accent} />
                <div style={{ fontSize: 12 }}>{languages.map(l => `${l.name} (${l.proficiency})`).join(' · ')}</div>
              </div>
            )}
            {awards.length > 0 && (
              <div style={{ flex: 1 }}>
                <CorpHeader title="Honours & Awards" accent={accent} />
                {awards.map(a => <div key={a.id} style={{ fontSize: 12, marginBottom: 5 }}>▪ {a.title} — {a.issuer} ({formatDate(a.date)})</div>)}
              </div>
            )}
          </div>
        )}

        {references.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <CorpHeader title="References" accent={accent} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              {references.map(ref => (
                <div key={ref.id} style={{ flex: '1 1 200px' }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5 }}>{ref.name}</div>
                  <div style={{ fontSize: 12, color: accent }}>{ref.title}, {ref.company}</div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>{ref.email}{ref.phone ? ` · ${ref.phone}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ background: accent, height: 4, marginTop: 24 }} />
    </div>
  )
}

const CorpHeader: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <div style={{ borderBottom: `1px solid ${accent}40`, marginBottom: 10, paddingBottom: 4 }}>
    <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: accent, margin: 0 }}>{title}</h2>
  </div>
)

// ─── EXECUTIVE TEMPLATE ─────────────────────────────────────────────────────────

const ExecutiveTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages, awards, references } = resume
  const gold = '#b45309'
  const dark = '#0f172a'
  return (
    <div id="resume-preview" style={{ background: 'white', fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", maxWidth: 794, minHeight: 1122 }}>
      {/* Header */}
      <div style={{ background: dark, padding: '44px 52px 32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${gold}, #fbbf24)` }} />
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: 1, textTransform: 'uppercase' }}>{p.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: 13, color: gold, margin: '8px 0 20px', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 400 }}>{p.title}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>✆ {p.phone}</span>}
          {p.location && <span>◈ {p.location}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
          {p.website && <span>⌀ {p.website}</span>}
        </div>
      </div>

      <div style={{ padding: '32px 52px 44px' }}>
        {summary && (
          <div style={{ background: '#fffbeb', border: `1px solid ${gold}30`, borderLeft: `4px solid ${gold}`, padding: '16px 20px', marginBottom: 26, borderRadius: 4 }}>
            <p style={{ fontSize: 12.5, lineHeight: 1.85, color: '#374151', margin: 0, fontStyle: 'italic' }}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: 26 }}>
            <ExecHeader title="Leadership Experience" gold={gold} />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: dark }}>{exp.position}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 0.5 }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                </div>
                <div style={{ fontSize: 12.5, color: gold, fontWeight: 700, marginBottom: 8, letterSpacing: 0.3 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                {exp.description && <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, margin: '0 0 6px' }}>{exp.description}</p>}
                {exp.achievements.filter(Boolean).map((a, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#374151', marginTop: 4, paddingLeft: 14, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: gold }}>◆</span>{a}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 32 }}>
          <div>
            {education.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <ExecHeader title="Education" gold={gold} />
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: dark }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                    <div style={{ fontSize: 12.5, color: gold, fontWeight: 600 }}>{edu.institution}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{formatDate(edu.endDate)}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
            {projects.length > 0 && (
              <div>
                <ExecHeader title="Notable Projects" gold={gold} />
                {projects.map(proj => (
                  <div key={proj.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{proj.name}</div>
                    {proj.description && <p style={{ fontSize: 12, color: '#475569', margin: '3px 0', lineHeight: 1.6 }}>{proj.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {skills.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <ExecHeader title="Expertise" gold={gold} />
                {skills.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <div style={{ width: 6, height: 6, background: gold, borderRadius: '50%', flexShrink: 0 }} />
                    <span style={{ fontSize: 12 }}>{s.name}</span>
                  </div>
                ))}
              </div>
            )}
            {certifications.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <ExecHeader title="Certifications" gold={gold} />
                {certifications.map(c => (
                  <div key={c.id} style={{ fontSize: 12, marginBottom: 6 }}>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: 11 }}>{c.issuer}</div>
                  </div>
                ))}
              </div>
            )}
            {languages.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <ExecHeader title="Languages" gold={gold} />
                {languages.map(l => <div key={l.id} style={{ fontSize: 12, marginBottom: 4 }}>{l.name} — <span style={{ color: '#94a3b8' }}>{l.proficiency}</span></div>)}
              </div>
            )}
            {awards.length > 0 && (
              <div>
                <ExecHeader title="Awards" gold={gold} />
                {awards.map(a => (
                  <div key={a.id} style={{ fontSize: 12, marginBottom: 6 }}>
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: 11 }}>{a.issuer} · {formatDate(a.date)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {references.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <ExecHeader title="References" gold={gold} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {references.map(ref => (
                <div key={ref.id} style={{ flex: '1 1 180px', padding: '12px 16px', border: `1px solid ${gold}30`, borderRadius: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5 }}>{ref.name}</div>
                  <div style={{ fontSize: 12, color: gold }}>{ref.title}, {ref.company}</div>
                  <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{ref.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ExecHeader: React.FC<{ title: string; gold: string }> = ({ title, gold }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
    <div style={{ width: 20, height: 1.5, background: gold }} />
    <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: gold, margin: 0 }}>{title}</h2>
    <div style={{ flex: 1, height: 1.5, background: `${gold}30` }} />
  </div>
)

// ─── FRESHER TEMPLATE ───────────────────────────────────────────────────────────

const FresherTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages, awards } = resume
  const accent = '#059669'
  const light = '#ecfdf5'
  return (
    <div id="resume-preview" style={{ background: 'white', fontFamily: "'Inter', 'Segoe UI', sans-serif", maxWidth: 794, minHeight: 1122 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${accent}, #0d9488)`, padding: '36px 48px 28px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, flexShrink: 0 }}>
            {(p.fullName || 'U').charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{p.fullName || 'Your Name'}</h1>
            <p style={{ fontSize: 13.5, margin: '5px 0 12px', opacity: 0.9 }}>{p.title || 'Fresh Graduate'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 11 }}>
              {p.email && <span>✉ {p.email}</span>}
              {p.phone && <span>📞 {p.phone}</span>}
              {p.location && <span>📍 {p.location}</span>}
              {p.github && <span>⚡ {p.github}</span>}
              {p.linkedin && <span>🔗 {p.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 48px 40px' }}>
        {summary && (
          <div style={{ background: light, border: `1px solid ${accent}30`, borderRadius: 8, padding: '14px 18px', marginBottom: 22 }}>
            <p style={{ fontSize: 12.5, lineHeight: 1.8, color: '#064e3b', margin: 0 }}>{summary}</p>
          </div>
        )}

        {education.length > 0 && (
          <section style={{ marginBottom: 22 }}>
            <FreshHeader title="Education" accent={accent} />
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div style={{ fontSize: 12.5, color: accent, fontWeight: 600 }}>{edu.institution}</div>
                  {edu.gpa && <div style={{ fontSize: 11.5, color: '#6b7280' }}>CGPA/GPA: {edu.gpa}</div>}
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}</div>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section style={{ marginBottom: 22 }}>
            <FreshHeader title="Technical Skills" accent={accent} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {skills.map(s => (
                <span key={s.id} style={{ padding: '5px 14px', borderRadius: 20, background: light, border: `1px solid ${accent}40`, color: '#064e3b', fontSize: 12, fontWeight: 600 }}>
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section style={{ marginBottom: 22 }}>
            <FreshHeader title="Projects" accent={accent} />
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: 14, padding: '12px 14px', background: '#f9fafb', borderRadius: 8, borderLeft: `4px solid ${accent}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{proj.name}</div>
                  {proj.url && <span style={{ fontSize: 11, color: accent }}>{proj.url}</span>}
                </div>
                {proj.description && <p style={{ fontSize: 12, color: '#6b7280', margin: '5px 0', lineHeight: 1.65 }}>{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                    {proj.technologies.map((t, i) => <span key={i} style={{ fontSize: 11, padding: '2px 8px', background: `${accent}15`, color: accent, borderRadius: 10, fontWeight: 600 }}>{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {experience.length > 0 && (
          <section style={{ marginBottom: 22 }}>
            <FreshHeader title="Internships & Experience" accent={accent} />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{exp.position}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                </div>
                <div style={{ fontSize: 12.5, color: accent, fontWeight: 600 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                {exp.description && <p style={{ fontSize: 12, color: '#6b7280', margin: '5px 0 0', lineHeight: 1.6 }}>{exp.description}</p>}
                {exp.achievements.filter(Boolean).map((a, i) => <div key={i} style={{ fontSize: 12, color: '#374151', marginTop: 3 }}>• {a}</div>)}
              </div>
            ))}
          </section>
        )}

        <div style={{ display: 'flex', gap: 32 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}>
              <FreshHeader title="Certifications" accent={accent} />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: 7 }}>
                  <div style={{ fontWeight: 600, fontSize: 12.5 }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: '#9ca3af' }}>{c.issuer} · {formatDate(c.date)}</div>
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <FreshHeader title="Languages" accent={accent} />
              {languages.map(l => (
                <div key={l.id} style={{ fontSize: 12, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600 }}>{l.name}</span> — <span style={{ color: '#9ca3af' }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}
          {awards.length > 0 && (
            <div style={{ flex: 1 }}>
              <FreshHeader title="Awards" accent={accent} />
              {awards.map(a => (
                <div key={a.id} style={{ fontSize: 12, marginBottom: 6 }}>
                  <div style={{ fontWeight: 600 }}>{a.title}</div>
                  <div style={{ color: '#9ca3af', fontSize: 11 }}>{a.issuer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const FreshHeader: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
    <div style={{ width: 4, height: 18, background: accent, borderRadius: 2 }} />
    <h2 style={{ fontSize: 13, fontWeight: 800, color: '#111827', margin: 0 }}>{title}</h2>
  </div>
)

// ─── TECH TEMPLATE ──────────────────────────────────────────────────────────────

const TechTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages, awards } = resume
  const accent = '#06b6d4'
  const bg = '#0f172a'
  const card = '#1e293b'
  return (
    <div id="resume-preview" style={{ background: bg, fontFamily: "'Courier New', 'SF Mono', monospace", maxWidth: 794, minHeight: 1122, color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ padding: '36px 48px 24px', borderBottom: `1px solid ${accent}30` }}>
        <div style={{ fontSize: 11, color: accent, marginBottom: 6, letterSpacing: 1 }}>// resume.json</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: 'white' }}>{p.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: 13, color: accent, margin: '6px 0 16px' }}>$ {p.title || 'Developer'}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 11, color: '#94a3b8' }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>☎ {p.phone}</span>}
          {p.location && <span>⌘ {p.location}</span>}
          {p.github && <span>⚡ {p.github}</span>}
          {p.linkedin && <span>↗ {p.linkedin}</span>}
          {p.website && <span>⊙ {p.website}</span>}
        </div>
      </div>

      <div style={{ padding: '24px 48px 40px' }}>
        {summary && (
          <div style={{ background: card, border: `1px solid ${accent}30`, borderRadius: 6, padding: '14px 18px', marginBottom: 22 }}>
            <div style={{ fontSize: 10, color: accent, marginBottom: 6, letterSpacing: 1 }}>/* ABOUT */</div>
            <p style={{ fontSize: 12, lineHeight: 1.8, color: '#cbd5e1', margin: 0 }}>{summary}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <TechHeader title="SKILLS" accent={accent} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {skills.map(s => (
                <span key={s.id} style={{ padding: '4px 12px', borderRadius: 4, background: `${accent}15`, border: `1px solid ${accent}40`, color: accent, fontSize: 11.5, fontFamily: 'monospace' }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <TechHeader title="EXPERIENCE" accent={accent} />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 16, background: card, border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 6, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: 'white' }}>{exp.position}</div>
                    <div style={{ fontSize: 12, color: accent }}>{exp.company}{exp.location ? ` — ${exp.location}` : ''}</div>
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748b', fontFamily: 'monospace' }}>{formatDate(exp.startDate)} → {exp.current ? 'now' : formatDate(exp.endDate)}</div>
                </div>
                {exp.description && <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.65 }}>{exp.description}</p>}
                {exp.achievements.filter(Boolean).map((a, i) => (
                  <div key={i} style={{ fontSize: 11.5, color: '#cbd5e1', marginTop: 4 }}>&gt; {a}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <TechHeader title="PROJECTS" accent={accent} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {projects.map(proj => (
                <div key={proj.id} style={{ background: card, border: `1px solid ${accent}30`, borderRadius: 6, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>{proj.name}</div>
                    {proj.url && <span style={{ fontSize: 10.5, color: accent }}>{proj.url}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize: 11.5, color: '#94a3b8', margin: '5px 0', lineHeight: 1.6 }}>{proj.description}</p>}
                  {proj.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                      {proj.technologies.map((t, i) => <span key={i} style={{ fontSize: 10, padding: '1px 7px', background: `${accent}15`, color: accent, borderRadius: 3 }}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          {education.length > 0 && (
            <div>
              <TechHeader title="EDUCATION" accent={accent} />
              {education.map(edu => (
                <div key={edu.id} style={{ background: card, borderRadius: 6, padding: '10px 14px', marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5, color: 'white' }}>{edu.degree}{edu.field ? ` / ${edu.field}` : ''}</div>
                  <div style={{ fontSize: 12, color: accent }}>{edu.institution}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{formatDate(edu.endDate)}{edu.gpa ? ` · ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </div>
          )}

          <div>
            {certifications.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <TechHeader title="CERTIFICATIONS" accent={accent} />
                {certifications.map(c => (
                  <div key={c.id} style={{ fontSize: 12, marginBottom: 6, color: '#cbd5e1' }}>
                    <span style={{ color: accent }}>▸</span> {c.name} <span style={{ color: '#64748b', fontSize: 11 }}>({c.issuer})</span>
                  </div>
                ))}
              </div>
            )}
            {languages.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <TechHeader title="LANGUAGES" accent={accent} />
                {languages.map(l => <div key={l.id} style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}><span style={{ color: accent }}>▸</span> {l.name} <span style={{ color: '#64748b' }}>({l.proficiency})</span></div>)}
              </div>
            )}
            {awards.length > 0 && (
              <div>
                <TechHeader title="AWARDS" accent={accent} />
                {awards.map(a => (
                  <div key={a.id} style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 6 }}>
                    <div><span style={{ color: accent }}>★</span> {a.title}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{a.issuer} · {formatDate(a.date)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const TechHeader: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
    <span style={{ color: accent, fontSize: 12 }}>{'>'}</span>
    <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 2.5, color: '#94a3b8', margin: 0 }}>{title}</h2>
    <div style={{ flex: 1, height: 1, background: `${accent}20` }} />
  </div>
)

// ─── GOVERNMENT TEMPLATE ────────────────────────────────────────────────────────

const GovernmentTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills, certifications, languages, awards, references } = resume
  return (
    <div id="resume-preview" style={{ background: 'white', padding: '40px 52px', fontFamily: "'Times New Roman', Times, serif", maxWidth: 794, minHeight: 1122, color: '#1a1a1a' }}>
      <div style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: 18, marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 6px' }}>{p.fullName || 'CANDIDATE NAME'}</h1>
        <p style={{ fontSize: 13, margin: '0 0 10px', color: '#333' }}>{p.title || 'Application for Government Position'}</p>
        <div style={{ fontSize: 12, color: '#444', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 24 }}>
          {p.email && <span>Email: {p.email}</span>}
          {p.phone && <span>Phone: {p.phone}</span>}
          {p.location && <span>Address: {p.location}</span>}
        </div>
      </div>

      {summary && (
        <GovSection title="Objective / Personal Statement">
          <p style={{ fontSize: 12.5, lineHeight: 1.85 }}>{summary}</p>
        </GovSection>
      )}

      {experience.length > 0 && (
        <GovSection title="Employment History">
          {experience.map((exp, idx) => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: 13 }}>{exp.position}</strong>
                <span style={{ fontSize: 12 }}>{formatDate(exp.startDate)} to {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <div style={{ fontSize: 12.5 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              {exp.description && <p style={{ fontSize: 12, lineHeight: 1.65, margin: '5px 0 0' }}>{exp.description}</p>}
              {exp.achievements.filter(Boolean).map((a, i) => (
                <div key={i} style={{ fontSize: 12, paddingLeft: 14, marginTop: 3 }}>({String.fromCharCode(97 + i)}) {a}</div>
              ))}
            </div>
          ))}
        </GovSection>
      )}

      {education.length > 0 && (
        <GovSection title="Educational Qualifications">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                {['Sr.', 'Degree/Certificate', 'Field of Study', 'Institution', 'Year', 'Result/GPA'].map(h => (
                  <th key={h} style={{ border: '1px solid #ccc', padding: '7px 10px', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {education.map((edu, idx) => (
                <tr key={edu.id}>
                  <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{edu.degree}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{edu.field}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{edu.institution}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{formatDate(edu.endDate)}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{edu.gpa || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GovSection>
      )}

      {skills.length > 0 && (
        <GovSection title="Skills & Competencies">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 24px' }}>
            {skills.map(s => <span key={s.id} style={{ fontSize: 12 }}>• {s.name} ({s.level})</span>)}
          </div>
        </GovSection>
      )}

      {certifications.length > 0 && (
        <GovSection title="Certificates & Trainings">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                {['Sr.', 'Certificate', 'Issuing Authority', 'Date'].map(h => (
                  <th key={h} style={{ border: '1px solid #ccc', padding: '6px 10px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certifications.map((c, idx) => (
                <tr key={c.id}>
                  <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{c.name}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{c.issuer}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{formatDate(c.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GovSection>
      )}

      {languages.length > 0 && (
        <GovSection title="Language Proficiency">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 32px' }}>
            {languages.map(l => <span key={l.id} style={{ fontSize: 12 }}>• {l.name} — {l.proficiency}</span>)}
          </div>
        </GovSection>
      )}

      {awards.length > 0 && (
        <GovSection title="Awards & Honours">
          {awards.map(a => (
            <div key={a.id} style={{ marginBottom: 7, fontSize: 12 }}>
              <strong>{a.title}</strong> — {a.issuer} ({formatDate(a.date)})
              {a.description && <span style={{ color: '#555' }}> — {a.description}</span>}
            </div>
          ))}
        </GovSection>
      )}

      {references.length > 0 && (
        <GovSection title="References">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {references.map(ref => (
              <div key={ref.id} style={{ flex: '1 1 200px', fontSize: 12 }}>
                <strong>{ref.name}</strong><br />
                {ref.title}, {ref.company}<br />
                {ref.email}<br />
                {ref.phone}
              </div>
            ))}
          </div>
        </GovSection>
      )}

      <div style={{ marginTop: 40, fontSize: 12 }}>
        <p>I hereby declare that all information provided above is true and correct to the best of my knowledge and belief.</p>
        <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between' }}>
          <div>Date: _______________</div>
          <div>Place: _______________</div>
          <div>Signature: _______________</div>
        </div>
      </div>
    </div>
  )
}

const GovSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 22 }}>
    <h3 style={{ fontSize: 13.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid #000', paddingBottom: 5, marginBottom: 12 }}>{title}</h3>
    {children}
  </div>
)

// ─── Utilities ─────────────────────────────────────────────────────────────────

const skillPct = (level: string): number => {
  switch (level) {
    case 'Expert':       return 95
    case 'Advanced':     return 80
    case 'Intermediate': return 60
    default:             return 40
  }
}
