import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type ListSummary, type SampleAccount } from '../api';
import { useAuth } from '../context/AuthContext';
import ListCard from '../components/ListCard';

export default function HomePage() {
  const { user, sampleLogin } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [samples, setSamples] = useState<SampleAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getLists(),
      api.getSampleAccounts(),
    ]).then(([listsRes, samplesRes]) => {
      setLists(listsRes.lists);
      setSamples(samplesRes.accounts);
    }).finally(() => setLoading(false));
  }, []);

  const handleSampleLogin = async (username: string) => {
    await sampleLogin(username);
    navigate('/');
    // Refresh lists to show sidebar
    window.location.reload();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="hero">
        <h1>Curated lists, beautifully shared</h1>
        <p>Create and share lists of events, restaurants, books, practitioners, and anything else worth collecting.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Link to="/new" className="btn btn-primary">Create a List</Link>
          <Link to="/explore" className="btn">Explore Lists</Link>
        </div>
      </div>

      {!user && samples.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div className="section-title" style={{ textAlign: 'center' }}>Try it out</div>
          <div className="sample-accounts">
            {samples.map((s) => (
              <button key={s.username} className="sample-btn" onClick={() => handleSampleLogin(s.username)}>
                <div className="sample-avatar">{s.displayName[0]}</div>
                Try as {s.displayName}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="section-title">Recent Lists</div>
      <div className="list-grid">
        {lists.map((list) => (
          <ListCard key={`${list.owner}/${list.slug}`} list={list} />
        ))}
      </div>

      {lists.length === 0 && (
        <div className="empty-state">
          <p>No lists yet. Be the first to create one!</p>
          <Link to="/new" className="btn btn-primary">Create a List</Link>
        </div>
      )}
    </div>
  );
}
