import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import ModernMinimalTemplate from '../templates/ModernMinimalTemplate';
import ClassicProfessionalTemplate from '../templates/ClassicProfessionalTemplate';
import { ArrowLeft, Download, RefreshCw, Eye, Loader, Edit } from 'lucide-react';

const templateMap = {
    executive: ExecutiveTemplate,
    modern: ModernMinimalTemplate,
    classic: ClassicProfessionalTemplate,
};

const templateNames = {
    executive: 'Executive',
    modern: 'Modern Minimal',
    classic: 'Classic Professional',
};

export default function PreviewPage() {
    const navigate = useNavigate();
    const { tailoredData, cvData, selectedTemplate, setCurrentStep } = useCV();

    const finalData = tailoredData || cvData;
    const TemplateComponent = templateMap[selectedTemplate] || ExecutiveTemplate;

    const pdfDocument = useMemo(
        () => <TemplateComponent data={finalData} />,
        [finalData, selectedTemplate]
    );

    const fileName = `${(finalData.personalInfo?.fullName || 'cv').replace(/\s+/g, '_')}_CV.pdf`;

    const handleBack = () => {
        setCurrentStep(2);
        navigate('/templates');
    };

    const handleStartOver = () => {
        setCurrentStep(0);
        navigate('/');
    };

    return (
        <div className="page-container" style={{ maxWidth: 960 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.15rem' }}>
                        Your CV is ready
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                        Template: <strong>{templateNames[selectedTemplate]}</strong>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-ghost" onClick={() => { setCurrentStep(1); navigate('/input'); }}>
                        <Edit size={14} /> Edit details
                    </button>
                    <button className="btn btn-ghost" onClick={handleBack}>
                        <ArrowLeft size={14} /> Change template
                    </button>
                    <button className="btn btn-secondary" onClick={handleStartOver}>
                        <RefreshCw size={14} /> Start over
                    </button>
                </div>
            </div>

            {/* Download */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                padding: '1rem',
                background: 'var(--bg-white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
            }}>
                <PDFDownloadLink document={pdfDocument} fileName={fileName}>
                    {({ loading }) => (
                        <button className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download size={14} />
                                    Download PDF
                                </>
                            )}
                        </button>
                    )}
                </PDFDownloadLink>
            </div>

            {/* Preview */}
            <div>
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
                    Preview
                </div>
                <BlobProvider document={pdfDocument}>
                    {({ blob, url, loading, error }) => {
                        if (loading) {
                            return (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: 500,
                                    background: 'var(--bg-white)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius)',
                                    gap: '0.75rem',
                                }}>
                                    <div className="loader-spinner" />
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        Rendering preview...
                                    </p>
                                </div>
                            );
                        }

                        if (error) {
                            return (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: 250,
                                    background: 'var(--bg-white)',
                                    border: '1px solid #fecaca',
                                    borderRadius: 'var(--radius)',
                                    gap: '0.5rem',
                                    padding: '1.5rem',
                                }}>
                                    <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>
                                        Preview failed. You can still download using the button above.
                                    </p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                        {error.message || 'Unknown error'}
                                    </p>
                                </div>
                            );
                        }

                        if (url) {
                            return (
                                <iframe
                                    src={url}
                                    style={{
                                        width: '100%',
                                        height: 680,
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius)',
                                        background: '#f5f5f5',
                                    }}
                                    title="CV Preview"
                                />
                            );
                        }

                        return null;
                    }}
                </BlobProvider>
            </div>
        </div>
    );
}
