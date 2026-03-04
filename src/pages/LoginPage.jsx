import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isResetMode, setIsResetMode] = useState(false);

    const { signIn, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (isResetMode) {
            try {
                const { error: resetError } = await resetPassword(email);
                if (resetError) throw resetError;
                setMessage('Password reset email sent! Please check your inbox.');
            } catch (err) {
                setError(err.message || 'Failed to send reset email');
            } finally {
                setLoading(false);
            }
            return;
        }

        try {
            const { error: signInError } = await signIn(email, password);
            if (signInError) throw signInError;
            // On success, AuthContext will update and redirect could be handled, or navigate directly
            navigate('/upload');
        } catch (err) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: 460, marginTop: '2rem' }}>
            {isResetMode ? (
                <div className="card">
                    <button
                        className="btn btn-ghost"
                        onClick={() => { setIsResetMode(false); setError(''); setMessage(''); }}
                        style={{ padding: '0.4rem', marginBottom: '1rem' }}
                    >
                        <ArrowLeft size={16} /> Back to Sign In
                    </button>
                    <h1 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Reset Password</h1>
                    <p className="section-subtitle" style={{ marginBottom: '2rem' }}>Enter your email address and we'll send you a link to reset your password.</p>

                    {error && (
                        <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}
                    {message && (
                        <div className="success-message" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
                            <CheckCircle2 size={14} /> {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', justifyContent: 'center' }}
                            disabled={loading || !email}
                        >
                            {loading ? (
                                <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                            ) : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="card">
                    <h1 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome back</h1>
                    <p className="section-subtitle" style={{ marginBottom: '2rem' }}>Sign in to continue to StyleCV</p>

                    {error && (
                        <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                                <button
                                    type="button"
                                    onClick={() => { setIsResetMode(true); setError(''); }}
                                    style={{
                                        background: 'none', border: 'none',
                                        color: 'var(--accent)', fontSize: '0.85rem',
                                        cursor: 'pointer', outline: 'none',
                                        fontWeight: 500, padding: 0
                                    }}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', justifyContent: 'center' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
