import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';
import { getUserResumes, deleteResume } from '../services/resumeService';
import { AlertCircle, CheckCircle2, User, Key, LogOut, Trash2, ArrowLeft, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function ProfilePage() {
    const { user, signOut, updatePassword, deleteAccount, unlockPremium, isPremium, recoveryMode, setRecoveryMode } = useAuth();
    const navigate = useNavigate();
    const { setCvData, setCurrentStep } = useCV();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [savedResumes, setSavedResumes] = useState([]);
    const [loadingResumes, setLoadingResumes] = useState(true);

    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');
    const [redeeming, setRedeeming] = useState(false);

    useEffect(() => {
        if (user) {
            loadResumes();
        }
        if (window.location.hash === '#premium') {
            setTimeout(() => {
                const el = document.getElementById('premium');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else if (recoveryMode || window.location.hash === '#password') {
            setTimeout(() => {
                const el = document.getElementById('password');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                if (recoveryMode && !message) {
                    setMessage("Please enter a new password to complete your reset.");
                }
            }, 100);
        }
    }, [user, recoveryMode]);

    const loadResumes = async () => {
        setLoadingResumes(true);
        try {
            const resumes = await getUserResumes(user.id);
            setSavedResumes(resumes);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingResumes(false);
        }
    };

    const handleDeleteResume = async (id) => {
        const confirmed = window.confirm("Delete this saved resume? This cannot be undone.");
        if (!confirmed) return;

        try {
            await deleteResume(id);
            setSavedResumes(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            setError("Failed to delete resume");
        }
    };

    const handleLoadResume = (resume) => {
        setCvData(resume.cv_data);
        setCurrentStep(1);
        navigate('/input');
    };

    if (!user) return null;

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        try {
            setLoading(true);
            const { error: updateError } = await updatePassword(password);
            if (updateError) throw updateError;

            setMessage('Password updated successfully!');
            setPassword('');
            setConfirmPassword('');
            if (recoveryMode) {
                setRecoveryMode(false);
            }
        } catch (err) {
            setError(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );
        if (!confirmed) return;

        try {
            await deleteAccount();
            navigate('/login');
        } catch (err) {
            setError('Failed to delete account');
        }
    };

    const handleRedeem = async (e) => {
        e.preventDefault();
        setPromoError('');
        setPromoSuccess('');
        setRedeeming(true);
        try {
            const success = await unlockPremium(promoCode.trim().toUpperCase());
            if (success) {
                setPromoSuccess('Premium unlocked successfully! You now have unlimited access.');
                setPromoCode('');
            } else {
                setPromoError('Invalid promo code. Please try again.');
            }
        } catch (err) {
            setPromoError(err.message || 'Failed to redeem code. Please try again.');
        } finally {
            setRedeeming(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ padding: '0.4rem' }}>
                    <ArrowLeft size={18} />
                </button>
                <h1 className="section-title" style={{ textAlign: 'left', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={24} color="var(--accent)" /> Profile Settings
                </h1>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Account Details
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Your current identifying information.
                </p>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input
                        type="text"
                        className="form-input"
                        value={user.email}
                        disabled
                        style={{ background: 'var(--bg-subtle)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                    />
                </div>
            </div>

            <div className="card" id="premium" style={{ marginBottom: '1.5rem', borderColor: 'var(--accent)', background: 'var(--accent-light)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)' }}>
                    <Sparkles size={16} /> Unlimited Premium Access
                </h3>
                {isPremium ? (
                    <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '0.5rem' }}>
                        <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                            <CheckCircle2 size={18} color="var(--success)" /> You have Unlimited Premium Access!
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>
                            Enjoy unlimited daily CV creations and unlimited saved CVs.
                        </p>
                    </div>
                ) : (
                    <>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Need more than 3 resumes per day? Upgrade to Premium for unlimited AI parsing, saving, and tailoring.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                            <a href="mailto:stylecv@gmail.com" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', height: '42px' }}>
                                Contact stylecv@gmail.com
                            </a>
                            <form onSubmit={handleRedeem} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter promo code..."
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        style={{ margin: 0, height: '42px' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-secondary" disabled={redeeming || !promoCode} style={{ height: '42px' }}>
                                    {redeeming ? 'Redeeming...' : 'Apply Code'}
                                </button>
                            </form>
                        </div>
                        {promoError && (
                            <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1rem', padding: '0.5rem' }}>
                                <AlertCircle size={14} /> {promoError}
                            </div>
                        )}
                        {promoSuccess && (
                            <div className="success-message" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1rem', padding: '0.5rem' }}>
                                <CheckCircle2 size={14} /> {promoSuccess}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={16} /> Saved Resumes
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Manage your previously parsed and saved CV details.
                </p>

                {loadingResumes ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
                ) : savedResumes.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You have no saved resumes.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {savedResumes.map(resume => (
                            <div key={resume.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleLoadResume(resume)}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>{resume.name} <ArrowRight size={14} color="var(--primary)" /></h4>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(resume.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <button className="btn btn-ghost" onClick={() => handleDeleteResume(resume.id)} style={{ color: 'var(--error)', padding: '0.4rem' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card" id="password" style={{ marginBottom: '1.5rem', borderColor: recoveryMode ? 'var(--accent)' : undefined }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={16} /> {recoveryMode ? 'Reset Your Password' : 'Change Password'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Update your password to keep your account secure.
                </p>

                {error && (
                    <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                {message && (
                    <div className="success-message" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                        <CheckCircle2 size={14} /> {message}
                    </div>
                )}

                <form onSubmit={handleUpdatePassword}>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !password}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            <div className="card" style={{ borderColor: 'var(--error-bg)', background: 'var(--error-bg)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--error)' }}>Danger Zone</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Irreversible and destructive actions. Proceed with caution.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary" onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LogOut size={16} /> Sign Out Everywhere
                    </button>
                    <button className="btn btn-danger" onClick={handleDeleteAccount} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Trash2 size={16} /> Delete Account
                    </button>
                </div>
            </div>
        </div >
    );
}
