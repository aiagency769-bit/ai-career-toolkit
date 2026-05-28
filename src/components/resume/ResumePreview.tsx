import React from 'react'
import type { ResumeData } from '../../types'
import { formatDate, skillLevelToPercent } from '../../lib/utils'

interface Props { resume: ResumeData }

export const ResumePreview: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills, certifications, languages } = resume

  if (resume.template === 'modern' || resume.template === 'tech') return <ModernTemplate resume={resume} />
  if (resume.template === 'minimal') return <MinimalTemplate resume={resume} />
  if (resume.template === 'creative') return <CreativeTemplate resume={resume} />
  if (resume.template === 'government') return <GovernmentTemplate resume={resume} />
  return <ModernTemplate resume={resume} />
}

const ModernTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills, certifications, languages } = resume
  return (
    <div id="resume-preview" className="resume-preview bg-white text-gray-900 max-w-[794px] mx-auto" style={{ fontFamily: 'Inter, sans-serif', minHeight: '1122px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4040cf, #6172f3)', padding: '40px 48px', color: 'white' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{p.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: 15, marginTop: 6, marginBottom: 16, opacity: 0.9, fontWeight: 500 }}>{p.title || 'Professional Title'}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: 12, opacity: 0.85 }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>LinkedIn: {p.linkedin}</span>}
          {p.github && <span>GitHub: {p.github}</span>}
          {p.website && <span>🌐 {p.website}</span>}
        </div>
      </div>

      <div style={{ padding: '32px 48px' }}>
        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: 28 }}>
            <SectionHeader title="PROFESSIONAL SUMMARY" color="#4040cf" />
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#374151', marginTop: 10 }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <SectionHeader title="EXPERIENCE" color="#4040cf" />
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{exp.position}</div>
                    <div style={{ fontSize: 13, color: '#4040cf', fontWeight: 600 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', marginLeft: 16 }}>
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6, lineHeight: 1.6 }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ marginTop: 6, paddingLeft: 16, fontSize: 12, lineHeight: 1.8, color: '#374151' }}>
                    {exp.achievements.map((a, i) => a && <li key={i}>{a}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <SectionHeader title="EDUCATION" color="#4040cf" />
            {education.map((edu) => (
              <div key={edu.id} style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div style={{ fontSize: 13, color: '#4040cf', fontWeight: 600 }}>{edu.institution}</div>
                  {edu.gpa && <div style={{ fontSize: 12, color: '#6b7280' }}>GPA: {edu.gpa}</div>}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', marginLeft: 16 }}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <SectionHeader title="SKILLS" color="#4040cf" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 10 }}>
              {skills.map((skill) => (
                <span key={skill.id} style={{ padding: '4px 12px', borderRadius: 20, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: 12, fontWeight: 600 }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <SectionHeader title="CERTIFICATIONS" color="#4040cf" />
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{cert.name}</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{cert.issuer} · {formatDate(cert.date)}</span>
              </div>
            ))}
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <SectionHeader title="LANGUAGES" color="#4040cf" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 10 }}>
              {languages.map((lang) => (
                <div key={lang.id} style={{ padding: '4px 12px', borderRadius: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: 12, fontWeight: 600 }}>
                  {lang.name} — {lang.proficiency}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

const MinimalTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills } = resume
  return (
    <div id="resume-preview" className="resume-preview" style={{ background: 'white', padding: '48px', fontFamily: 'Inter, sans-serif', maxWidth: 794 }}>
      <div style={{ borderBottom: '2px solid #111', paddingBottom: 20, marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: -1 }}>{p.fullName || 'Your Name'}</h1>
        <p style={{ color: '#555', margin: '6px 0 12px', fontSize: 15 }}>{p.title}</p>
        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#666' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
        </div>
      </div>
      {summary && <p style={{ fontSize: 13, lineHeight: 1.8, color: '#444', marginBottom: 24 }}>{summary}</p>}
      {experience.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: 6, marginBottom: 14, color: '#333' }}>Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 14 }}>{exp.position} @ {exp.company}</strong>
                <span style={{ fontSize: 12, color: '#888' }}>{formatDate(exp.startDate)} – {exp.current ? 'Now' : formatDate(exp.endDate)}</span>
              </div>
              {exp.achievements.map((a, i) => a && <div key={i} style={{ fontSize: 12, color: '#555', marginTop: 4 }}>• {a}</div>)}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: 6, marginBottom: 14, color: '#333' }}>Education</h2>
          {education.map(edu => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div><strong style={{ fontSize: 14 }}>{edu.degree}</strong> <span style={{ fontSize: 13, color: '#555' }}>— {edu.institution}</span></div>
              <span style={{ fontSize: 12, color: '#888' }}>{formatDate(edu.endDate)}</span>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: 6, marginBottom: 14, color: '#333' }}>Skills</h2>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>{skills.map(s => s.name).join(' · ')}</p>
        </div>
      )}
    </div>
  )
}

const CreativeTemplate: React.FC<Props> = ({ resume }) => {
  return <ModernTemplate resume={{ ...resume, template: 'modern' }} />
}

const GovernmentTemplate: React.FC<Props> = ({ resume }) => {
  const { personalInfo: p, summary, experience, education, skills } = resume
  return (
    <div id="resume-preview" className="resume-preview" style={{ background: 'white', padding: '40px 48px', fontFamily: 'Times New Roman, serif', maxWidth: 794 }}>
      <div style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{p.fullName || 'CANDIDATE NAME'}</h1>
        <p style={{ fontSize: 13, margin: '8px 0', color: '#333' }}>Application for Government Position</p>
        <div style={{ fontSize: 12, color: '#444', display: 'flex', justifyContent: 'center', gap: 24 }}>
          {p.email && <span>Email: {p.email}</span>}
          {p.phone && <span>Phone: {p.phone}</span>}
          {p.location && <span>Address: {p.location}</span>}
        </div>
      </div>
      {summary && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #333', paddingBottom: 4, marginBottom: 10 }}>Objective</h3>
          <p style={{ fontSize: 12, lineHeight: 1.8 }}>{summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #333', paddingBottom: 4, marginBottom: 10 }}>Employment History</h3>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 13 }}>{exp.position}</strong>
                <span style={{ fontSize: 12 }}>{formatDate(exp.startDate)} to {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <div style={{ fontSize: 12, color: '#333' }}>{exp.company}, {exp.location}</div>
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #333', paddingBottom: 4, marginBottom: 10 }}>Educational Qualifications</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                {['Degree', 'Field', 'Institution', 'Year'].map(h => (
                  <th key={h} style={{ border: '1px solid #ddd', padding: '6px 10px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {education.map((edu) => (
                <tr key={edu.id}>
                  <td style={{ border: '1px solid #ddd', padding: '6px 10px' }}>{edu.degree}</td>
                  <td style={{ border: '1px solid #ddd', padding: '6px 10px' }}>{edu.field}</td>
                  <td style={{ border: '1px solid #ddd', padding: '6px 10px' }}>{edu.institution}</td>
                  <td style={{ border: '1px solid #ddd', padding: '6px 10px' }}>{formatDate(edu.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ marginTop: 40, fontSize: 12 }}>
        <p>I hereby declare that all the information mentioned above is true and correct to the best of my knowledge.</p>
        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between' }}>
          <div>Date: _______________</div>
          <div>Signature: _______________</div>
        </div>
      </div>
    </div>
  )
}

const SectionHeader: React.FC<{ title: string; color?: string }> = ({ title, color = '#4040cf' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
    <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color, margin: 0 }}>{title}</h2>
    <div style={{ flex: 1, height: 1, background: `${color}30` }} />
  </div>
)
