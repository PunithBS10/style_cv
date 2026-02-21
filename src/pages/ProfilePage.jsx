import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, User, Key, LogOut, Trash2, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
    const { user, signOut, updatePassword, deleteAccount } = useAuth();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={16} /> Change Password
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
        </div>
    );
}
