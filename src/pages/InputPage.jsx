import { useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import { ArrowRight, ArrowLeft, Plus, Trash2, Briefcase, GraduationCap, User, Wrench, Award, Heart, FileText, Globe } from 'lucide-react';

export default function InputPage() {
    const navigate = useNavigate();
    const {
        cvData, updatePersonalInfo, updateSkills,
        addExperience, updateExperience, removeExperience,
        addProject, updateProject, removeProject,
        addEducation, updateEducation, removeEducation,
        updateCertifications, addCertification, removeCertification,
        updateHobbies, addHobby, removeHobby,
        setJobDescription, jobDescription, setCurrentStep,
    } = useCV();

    const p = cvData.personalInfo || {};
    const exp = cvData.experience || [];
    const proj = cvData.projects || [];
    const edu = cvData.education || [];
    const skills = cvData.skills || {};
    const certs = cvData.certifications || [''];
    const hobbies = cvData.hobbies || [''];

    const handleContinue = () => {
        setCurrentStep(2);
        navigate('/templates');
    };

    const addBullet = (expIndex) => {
        const updated = [...(exp[expIndex].bullets || []), ''];
        updateExperience(expIndex, 'bullets', updated);
    };

    const updateBullet = (expIndex, bulletIndex, value) => {
        const updated = [...(exp[expIndex].bullets || [])];
        updated[bulletIndex] = value;
        updateExperience(expIndex, 'bullets', updated);
    };

    const removeBullet = (expIndex, bulletIndex) => {
        const updated = (exp[expIndex].bullets || []).filter((_, i) => i !== bulletIndex);
        updateExperience(expIndex, 'bullets', updated);
    };

    const addProjBullet = (projIndex) => {
        const updated = [...(proj[projIndex].bullets || []), ''];
        updateProject(projIndex, 'bullets', updated);
    };

    const updateProjBullet = (projIndex, bulletIndex, value) => {
        const updated = [...(proj[projIndex].bullets || [])];
        updated[bulletIndex] = value;
        updateProject(projIndex, 'bullets', updated);
    };

    const removeProjBullet = (projIndex, bulletIndex) => {
        const updated = (proj[projIndex].bullets || []).filter((_, i) => i !== bulletIndex);
        updateProject(projIndex, 'bullets', updated);
    };

    return (
        <div className="page-container" style={{ maxWidth: 720 }}>
            <h1 className="section-title">Your details</h1>
            <p className="section-subtitle">
                Fill in what's relevant. All fields are optional.
            </p>

            {/* PERSONAL INFO */}
            <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label"><User size={12} /> Personal</span>
                <div className="section-divider-line" />
            </div>
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" value={p.fullName || ''} onChange={e => updatePersonalInfo('fullName', e.target.value)} placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Job Title</label>
                        <input className="form-input" value={p.title || ''} onChange={e => updatePersonalInfo('title', e.target.value)} placeholder="Software Engineer" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-input" value={p.email || ''} onChange={e => updatePersonalInfo('email', e.target.value)} placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input className="form-input" value={p.phone || ''} onChange={e => updatePersonalInfo('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input className="form-input" value={p.location || ''} onChange={e => updatePersonalInfo('location', e.target.value)} placeholder="New York, NY" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">LinkedIn</label>
                        <input className="form-input" value={p.linkedin || ''} onChange={e => updatePersonalInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">GitHub</label>
                        <input className="form-input" value={p.github || ''} onChange={e => updatePersonalInfo('github', e.target.value)} placeholder="github.com/johndoe" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Portfolio</label>
                        <input className="form-input" value={p.portfolio || ''} onChange={e => updatePersonalInfo('portfolio', e.target.value)} placeholder="johndoe.com" />
                    </div>
                </div>
                <div className="form-group" style={{ marginTop: '0.25rem' }}>
                    <label className="form-label">Professional Summary</label>
                    <textarea className="form-textarea" value={p.summary || ''} onChange={e => updatePersonalInfo('summary', e.target.value)} placeholder="Brief summary of your background and career goals..." rows={3} />
                </div>
            </div>

            {/* EXPERIENCE */}
            <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label"><Briefcase size={12} /> Experience</span>
                <div className="section-divider-line" />
            </div>
            {exp.map((e, i) => (
                <div className="card" key={e.id || i} style={{ marginBottom: '0.75rem', position: 'relative' }}>
                    <button className="btn btn-danger" onClick={() => removeExperience(i)} style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                        <Trash2 size={12} />
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                            <label className="form-label">Job Title</label>
                            <input className="form-input" value={e.jobTitle || ''} onChange={ev => updateExperience(i, 'jobTitle', ev.target.value)} placeholder="Senior Developer" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Company</label>
                            <input className="form-input" value={e.company || ''} onChange={ev => updateExperience(i, 'company', ev.target.value)} placeholder="Google" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input className="form-input" value={e.startDate || ''} onChange={ev => updateExperience(i, 'startDate', ev.target.value)} placeholder="Jan 2022" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input className="form-input" value={e.endDate || ''} onChange={ev => updateExperience(i, 'endDate', ev.target.value)} placeholder="Present" />
                        </div>
                    </div>
                    <div style={{ marginTop: '0.25rem' }}>
                        <label className="form-label">Key achievements</label>
                        {(e.bullets || ['']).map((b, bi) => (
                            <div key={bi} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                <input className="form-input" value={b} onChange={ev => updateBullet(i, bi, ev.target.value)} placeholder="Describe an achievement..." style={{ flex: 1 }} />
                                {(e.bullets || []).length > 1 && (
                                    <button className="btn btn-ghost" onClick={() => removeBullet(i, bi)} style={{ padding: '0.3rem', color: 'var(--error)' }}><Trash2 size={13} /></button>
                                )}
                            </div>
                        ))}
                        <button className="btn btn-ghost" onClick={() => addBullet(i)} style={{ fontSize: '0.78rem' }}><Plus size={13} /> Add bullet</button>
                    </div>
                </div>
            ))}
            <button className="btn btn-secondary" onClick={addExperience} style={{ marginBottom: '1rem' }}>
                <Plus size={14} /> Add Experience
            </button>

            {/* PROJECTS */}
            <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label"><FileText size={12} /> Projects</span>
                <div className="section-divider-line" />
            </div>
            {proj.map((p, i) => (
                <div className="card" key={p.id || i} style={{ marginBottom: '0.75rem', position: 'relative' }}>
                    <button className="btn btn-danger" onClick={() => removeProject(i)} style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                        <Trash2 size={12} />
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                            <label className="form-label">Project Name</label>
                            <input className="form-input" value={p.name || ''} onChange={ev => updateProject(i, 'name', ev.target.value)} placeholder="E-commerce App" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Technologies Used</label>
                            <input className="form-input" value={p.technologies || ''} onChange={ev => updateProject(i, 'technologies', ev.target.value)} placeholder="React, Node.js, MongoDB" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input className="form-input" value={p.startDate || ''} onChange={ev => updateProject(i, 'startDate', ev.target.value)} placeholder="Jan 2022" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input className="form-input" value={p.endDate || ''} onChange={ev => updateProject(i, 'endDate', ev.target.value)} placeholder="Present" />
                        </div>
                    </div>
                    <div style={{ marginTop: '0.25rem' }}>
                        <label className="form-label">Key achievements / Info</label>
                        {(p.bullets || ['']).map((b, bi) => (
                            <div key={bi} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                <input className="form-input" value={b} onChange={ev => updateProjBullet(i, bi, ev.target.value)} placeholder="Describe the project..." style={{ flex: 1 }} />
                                {(p.bullets || []).length > 1 && (
                                    <button className="btn btn-ghost" onClick={() => removeProjBullet(i, bi)} style={{ padding: '0.3rem', color: 'var(--error)' }}><Trash2 size={13} /></button>
                                )}
                            </div>
                        ))}
                        <button className="btn btn-ghost" onClick={() => addProjBullet(i)} style={{ fontSize: '0.78rem' }}><Plus size={13} /> Add bullet</button>
                    </div>
                </div>
            ))}
            <button className="btn btn-secondary" onClick={addProject} style={{ marginBottom: '1rem' }}>
                <Plus size={14} /> Add Project
            </button>

            {/* EDUCATION */}
            <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label"><GraduationCap size={12} /> Education</span>
                <div className="section-divider-line" />
            </div>
            {edu.map((e, i) => (
                <div className="card" key={e.id || i} style={{ marginBottom: '0.75rem', position: 'relative' }}>
                    <button className="btn btn-danger" onClick={() => removeEducation(i)} style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                        <Trash2 size={12} />
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                            <label className="form-label">Degree</label>
                            <input className="form-input" value={e.degree || ''} onChange={ev => updateEducation(i, 'degree', ev.target.value)} placeholder="B.Sc. Computer Science" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Institution</label>
                            <input className="form-input" value={e.institution || ''} onChange={ev => updateEducation(i, 'institution', ev.target.value)} placeholder="MIT" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Graduation Date</label>
                            <input className="form-input" value={e.graduationDate || ''} onChange={ev => updateEducation(i, 'graduationDate', ev.target.value)} placeholder="2022" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">GPA (optional)</label>
                            <input className="form-input" value={e.gpa || ''} onChange={ev => updateEducation(i, 'gpa', ev.target.value)} placeholder="3.8/4.0" />
                        </div>
                    </div>
                </div>
            ))}
            <button className="btn btn-secondary" onClick={addEducation} style={{ marginBottom: '1rem' }}>
                <Plus size={14} /> Add Education
            </button>

            {/* SKILLS */}
            <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label"><Wrench size={12} /> Skills</span>
                <div className="section-divider-line" />
            </div>
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                        <label className="form-label">Programming Languages</label>
                        <input className="form-input" value={skills.programmingLanguages || ''} onChange={e => updateSkills('programmingLanguages', e.target.value)} placeholder="JavaScript, Python, Java" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Frameworks & Tools</label>
                        <input className="form-input" value={skills.frameworks || ''} onChange={e => updateSkills('frameworks', e.target.value)} placeholder="React, Node.js, Docker" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">DevOps & Cloud</label>
                        <input className="form-input" value={skills.devops || ''} onChange={e => updateSkills('devops', e.target.value)} placeholder="AWS, CI/CD, Terraform" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Databases</label>
                        <input className="form-input" value={skills.databases || ''} onChange={e => updateSkills('databases', e.target.value)} placeholder="PostgreSQL, MongoDB, Redis" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Other</label>
                    <input className="form-input" value={skills.other || ''} onChange={e => updateSkills('other', e.target.value)} placeholder="Agile, Scrum, Team Leadership" />
                </div>
            </div>

            {/* CERTIFICATIONS */}
            <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label"><Award size={12} /> Certifications</span>
                <div className="section-divider-line" />
            </div>
            <div className="card" style={{ marginBottom: '1rem' }}>
                {certs.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        <input className="form-input" value={c} onChange={e => updateCertifications(i, e.target.value)} placeholder="AWS Solutions Architect" style={{ flex: 1 }} />
                        {certs.length > 1 && (
                            <button className="btn btn-ghost" onClick={() => removeCertification(i)} style={{ padding: '0.3rem', color: 'var(--error)' }}><Trash2 size={13} /></button>
                        )}
                    </div>
                ))}
                <button className="btn btn-ghost" onClick={addCertification} style={{ fontSize: '0.78rem' }}><Plus size={13} /> Add certification</button>
            </div>

            {/* LANGUAGES */}
            <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label"><Globe size={12} /> Languages</span>
                <div className="section-divider-line" />
            </div>
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Spoken Languages</label>
                    <input className="form-input" value={skills.languages || ''} onChange={e => updateSkills('languages', e.target.value)} placeholder="English, Kannada, Hindi" />
                </div>
            </div>

            {/* HOBBIES */}
            <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label"><Heart size={12} /> Interests</span>
                <div className="section-divider-line" />
            </div>
            <div className="card" style={{ marginBottom: '1rem' }}>
                {hobbies.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        <input className="form-input" value={h} onChange={e => updateHobbies(i, e.target.value)} placeholder="Photography, Hiking, Reading" style={{ flex: 1 }} />
                        {hobbies.length > 1 && (
                            <button className="btn btn-ghost" onClick={() => removeHobby(i)} style={{ padding: '0.3rem', color: 'var(--error)' }}><Trash2 size={13} /></button>
                        )}
                    </div>
                ))}
                <button className="btn btn-ghost" onClick={addHobby} style={{ fontSize: '0.78rem' }}><Plus size={13} /> Add interest</button>
            </div>

            {/* JOB DESCRIPTION */}
            <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label"><FileText size={12} /> Target Job</span>
                <div className="section-divider-line" />
            </div>
            <div className="card" style={{
                marginBottom: '1.5rem',
                borderColor: 'var(--primary)',
                boxShadow: '0 4px 20px -4px rgba(0, 212, 255, 0.15), 0 0 0 1px rgba(0, 212, 255, 0.3)'
            }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ color: 'var(--primary)' }}>
                        Paste the job description (optional — enables AI tailoring)
                    </label>
                    <textarea
                        className="form-textarea"
                        value={jobDescription || ''}
                        onChange={e => setJobDescription(e.target.value)}
                        placeholder="Paste the full job posting here..."
                        rows={4}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <button className="btn btn-ghost" onClick={() => { setCurrentStep(0); navigate('/upload'); }}>
                    <ArrowLeft size={14} /> Back
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleContinue}>
                    Choose template <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}
