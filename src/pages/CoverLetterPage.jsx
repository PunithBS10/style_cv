import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import { generateCoverLetter } from '../services/openaiService';
import CoverLetterTemplate from '../templates/CoverLetterTemplate';
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import { ArrowLeft, Wand2, Download, Eye, Loader, CheckCircle2, Save } from 'lucide-react';

export default function CoverLetterPage() {
    const { cvData } = useCV();
    const navigate = useNavigate();

    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // savedData drives the PDF; draftText is the editable body text
    const [savedData, setSavedData] = useState(null);
    const [draftBody, setDraftBody] = useState('');

    const hasPendingChanges = savedData && draftBody !== savedData.body;

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await generateCoverLetter(cvData, jobDescription);
            setSavedData(data);
            setDraftBody(data.body);
        } catch (err) {
            console.error(err);
            setError("Failed to generate cover letter. Ensure your API key is correct.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = () => {
        setSavedData({ ...savedData, body: draftBody });
    };

    // PDF only recalculates when savedData changes (on save button click)
    const pdfDocument = useMemo(
        () => <CoverLetterTemplate cvData={cvData} coverLetterData={savedData} />,
        [cvData, savedData]
    );

    const fileName = `${(cvData?.personalInfo?.fullName || 'cover_letter').replace(/\s+/g, '_')}_Cover_Letter.pdf`;

    if (!cvData) {
        return (
            <div className="page-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>No Resume Found</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Please create or load a resume first.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ maxWidth: 700, margin: '0 auto' }}>
            <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: '1rem', padding: '0.4rem' }}>
                <ArrowLeft size={16} /> Back
            </button>
            <h1 className="section-title">Cover Letter Generator</h1>
            <p className="section-subtitle">
                Our AI will analyze your CV and perfectly match it to this specific role.
            </p>

            {!savedData ? (
                /* ── Form Section ── */
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <div className="card">
                        {error && (
                            <div className="error-message" style={{ marginBottom: '1rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleGenerate}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">Job Description <span style={{ color: 'var(--error)' }}>*</span></label>
                                <p className="form-help" style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    Paste the full job description. Our AI will automatically extract the company, job title, and required skills to perfectly tailor your letter.
                                </p>
                                <textarea
                                    className="form-textarea"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job requirements here..."
                                    rows={10}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', justifyContent: 'center' }}
                                disabled={loading || !jobDescription}
                            >
                                {loading ? (
                                    <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                                ) : (
                                    <><Wand2 size={16} /> Generate Letter</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                /* ── Edit & Preview Section (Vertical Stack) ── */
                <div>
                    {/* Status bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem', fontWeight: 600 }}>
                            <CheckCircle2 color="var(--success)" size={18} /> Generated Successfully
                        </div>
                        <button className="btn btn-ghost" onClick={() => { setSavedData(null); setDraftBody(''); }}>
                            Regenerate
                        </button>
                    </div>

                    {/* Editor Card */}
                    <div className="card" style={{ marginBottom: '1rem' }}>
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Edit Letter Content</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                                {hasPendingChanges ? '● Unsaved changes' : 'All changes saved'}
                            </span>
                        </label>
                        <textarea
                            className="form-textarea"
                            value={draftBody}
                            onChange={(e) => setDraftBody(e.target.value)}
                            rows={14}
                            style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveChanges}
                            disabled={!hasPendingChanges}
                            style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
                        >
                            <Save size={14} /> Save Changes
                        </button>
                    </div>

                    {/* Download Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <PDFDownloadLink document={pdfDocument} fileName={fileName}>
                            {({ loading: pdfLoading }) => (
                                <button className="btn btn-primary btn-lg" disabled={pdfLoading}>
                                    {pdfLoading ? <Loader size={14} /> : <Download size={14} />} Download PDF
                                </button>
                            )}
                        </PDFDownloadLink>
                    </div>

                    {/* PDF Preview */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '0.5rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                    }}>
                        <Eye size={13} />
                        PDF Preview
                    </div>
                    <BlobProvider document={pdfDocument} key={JSON.stringify(savedData)}>
                        {({ url, loading: blobLoading, error: blobError }) => {
                            if (blobLoading) return <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Rendering preview...</div>;
                            if (blobError) {
                                console.error('PDF Render Error:', blobError);
                                return (
                                    <div className="card" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' }}>
                                        <strong>PDF Rendering Failed:</strong> {blobError.message || String(blobError)}
                                    </div>
                                );
                            }
                            if (url) {
                                return (
                                    <iframe
                                        src={url}
                                        title="Cover Letter Preview"
                                        style={{ width: '100%', height: 680, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: '#f5f5f5' }}
                                    />
                                );
                            }
                            return null;
                        }}
                    </BlobProvider>
                </div>
            )}
        </div>
    );
}
