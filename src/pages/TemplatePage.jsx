import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import { tailorCVForJob } from '../services/openaiService';
import { ArrowRight, ArrowLeft, Loader, Sparkles, Check } from 'lucide-react';

const templates = [
    {
        id: 'executive',
        name: 'Executive',
        desc: 'Two-column sidebar layout with accent borders. Great for experienced professionals.',
        accent: '#f5c518',
        layoutPreview: 'sidebar',
    },
    {
        id: 'modern',
        name: 'Modern Minimal',
        desc: 'Clean single-column with teal accents and skill chips. Ideal for tech & creative roles.',
        accent: '#0d9488',
        layoutPreview: 'single',
    },
    {
        id: 'classic',
        name: 'Classic Professional',
        desc: 'Traditional layout with navy blue & gold. Perfect for corporate & senior positions.',
        accent: '#1e3a5f',
        layoutPreview: 'classic',
    },
];

function MiniPreview({ template }) {
    const a = template.accent;
    if (template.layoutPreview === 'sidebar') {
        return (
            <div className="template-preview-inner">
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: a }} />
                <div style={{ position: 'absolute', left: 3, top: 0, bottom: 0, width: '36%', background: '#2d2d3f' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#555', margin: '10px auto 5px' }} />
                    {[38, 28, 45, 32].map((w, i) => <div key={i} style={{ height: 2.5, background: 'rgba(255,255,255,0.2)', margin: '3px 6px', width: `${w}%` }} />)}
                </div>
                <div style={{ position: 'absolute', left: '40%', top: 10, right: 6 }}>
                    <div style={{ height: 5, background: '#e5e7eb', width: '75%', marginBottom: 3 }} />
                    <div style={{ height: 2.5, background: '#d1d5db', width: '45%', marginBottom: 6 }} />
                    {[88, 82, 68, 78, 62].map((w, i) => <div key={i} style={{ height: 1.5, background: '#e5e7eb', margin: '2.5px 0', width: `${w}%` }} />)}
                </div>
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 3, background: a }} />
            </div>
        );
    }
    if (template.layoutPreview === 'single') {
        return (
            <div className="template-preview-inner">
                <div style={{ textAlign: 'center', paddingTop: 12 }}>
                    <div style={{ height: 6, background: a, width: '50%', margin: '0 auto 3px', borderRadius: 1 }} />
                    <div style={{ height: 2.5, background: '#d1d5db', width: '30%', margin: '0 auto 4px' }} />
                    <div style={{ height: 1.5, background: a, width: 22, margin: '3px auto 8px', borderRadius: 1 }} />
                </div>
                <div style={{ padding: '0 10px' }}>
                    {[88, 82, 72, 78].map((w, i) => <div key={i} style={{ height: 1.5, background: '#e5e7eb', margin: '2.5px 0', width: `${w}%` }} />)}
                    <div style={{ height: 3, background: a, width: '28%', margin: '6px 0 3px', borderRadius: 1, opacity: 0.3 }} />
                    {[68, 82, 60].map((w, i) => <div key={i} style={{ height: 1.5, background: '#e5e7eb', margin: '2.5px 0', width: `${w}%` }} />)}
                    <div style={{ display: 'flex', gap: 3, marginTop: 6, flexWrap: 'wrap' }}>
                        {[25, 32, 20, 28].map((w, i) => <div key={i} style={{ height: 8, background: `${a}18`, borderRadius: 2, width: w }} />)}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="template-preview-inner">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: a }} />
            <div style={{ textAlign: 'center', paddingTop: 12 }}>
                <div style={{ height: 7, background: a, width: '55%', margin: '0 auto 3px', borderRadius: 1 }} />
                <div style={{ height: 1, background: '#c8a84e', width: 15, margin: '3px auto' }} />
                <div style={{ height: 2.5, background: '#d1d5db', width: '30%', margin: '3px auto 6px' }} />
            </div>
            <div style={{ padding: '0 10px' }}>
                <div style={{ height: 2.5, background: a, width: '32%', marginBottom: 3 }} />
                {[82, 88, 72, 78].map((w, i) => <div key={i} style={{ height: 1.5, background: '#e5e7eb', margin: '2.5px 0', width: `${w}%` }} />)}
                <div style={{ height: 2.5, background: a, width: '36%', margin: '6px 0 3px' }} />
                {[68, 78, 62].map((w, i) => <div key={i} style={{ height: 1.5, background: '#e5e7eb', margin: '2.5px 0', width: `${w}%` }} />)}
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: a }} />
        </div>
    );
}

export default function TemplatePage() {
    const navigate = useNavigate();
    const { cvData, selectedTemplate, setSelectedTemplate, setTailoredData, jobDescription, setCurrentStep } = useCV();
    const [tailoring, setTailoring] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        try {
            setError('');
            setTailoring(true);

            if (jobDescription && jobDescription.trim().length > 20) {
                const tailored = await tailorCVForJob(cvData, jobDescription);
                setTailoredData(tailored);
            } else {
                setTailoredData(null);
            }

            setCurrentStep(3);
            navigate('/preview');
        } catch (err) {
            console.error('Tailoring error:', err);
            setError(err.message || 'AI tailoring failed. Proceeding with original data.');
            setTailoredData(null);
            setTimeout(() => {
                setCurrentStep(3);
                navigate('/preview');
            }, 1500);
        } finally {
            setTailoring(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: 820 }}>
            <h1 className="section-title">Choose a template</h1>
            <p className="section-subtitle">
                Each template is ATS-compatible and optimized for professional presentation.
            </p>

            <div className="template-grid">
                {templates.map((t) => (
                    <div
                        key={t.id}
                        className={`card template-card ${selectedTemplate === t.id ? 'card-selected' : ''}`}
                        onClick={() => setSelectedTemplate(t.id)}
                    >
                        <div className="template-preview">
                            <MiniPreview template={t} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            {selectedTemplate === t.id && <Check size={14} style={{ color: 'var(--accent)' }} />}
                            <span className="template-name">{t.name}</span>
                        </div>
                        <p className="template-desc">{t.desc}</p>
                    </div>
                ))}
            </div>

            {error && <div className="error-message" style={{ marginTop: '0.75rem' }}>{error}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <button className="btn btn-ghost" onClick={() => { setCurrentStep(1); navigate('/input'); }}>
                    <ArrowLeft size={14} /> Back
                </button>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleGenerate}
                    disabled={tailoring}
                >
                    {tailoring ? (
                        <>
                            <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                            {jobDescription ? 'Tailoring...' : 'Generating...'}
                        </>
                    ) : (
                        <>
                            <Sparkles size={14} />
                            Generate PDF <ArrowRight size={14} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
