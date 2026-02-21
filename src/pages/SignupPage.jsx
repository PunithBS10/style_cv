import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader, AlertCircle } from 'lucide-react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setSuccessMessage('');
            setLoading(true);
            const { error: signUpError } = await signUp(email, password);
            if (signUpError) throw signUpError;

            setSuccessMessage('Account created! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to create an account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: 460, marginTop: '2rem' }}>
            <div className="card">
                <h1 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create an account</h1>
                <p className="section-subtitle" style={{ marginBottom: '2rem' }}>Start building your professional CV</p>

                {error && (
                    <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                {successMessage && (
                    <div className="success-message" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        {successMessage}
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
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</>
                        ) : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
}
