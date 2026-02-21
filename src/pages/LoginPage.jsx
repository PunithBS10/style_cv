import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
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
                        <label className="form-label">Password</label>
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
        </div>
    );
}
