import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type SampleAccount } from '../api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, sampleLogin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState<SampleAccount[]>([]);

  useEffect(() => {
    api.getSampleAccounts().then(({ accounts }) => setSamples(accounts));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleLogin = async (name: string) => {
    try {
      await sampleLogin(name);
      navigate('/');
      window.location.reload();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <h1>Log in to Listwise</h1>

      {error && <div className="form-error" style={{ marginBottom: 16, textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      {samples.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 12 }}>
            Or try a sample account
          </div>
          <div className="sample-accounts">
            {samples.map((s) => (
              <button key={s.username} className="sample-btn" onClick={() => handleSampleLogin(s.username)}>
                <div className="sample-avatar">{s.displayName[0]}</div>
                {s.displayName}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="auth-footer">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
