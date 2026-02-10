import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, type ListData } from '../api';
import { useAuth } from '../context/AuthContext';
import ListRenderer from '../components/ListRenderer';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ListViewPage() {
  const { username, slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [list, setList] = useState<ListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const owner = username || '';

  useEffect(() => {
    if (!owner || !slug) return;
    setLoading(true);
    api.getList(owner, slug)
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [owner, slug]);

  const handleDelete = async () => {
    if (!confirm('Delete this list? This cannot be undone.')) return;
    await api.deleteList(owner, slug!);
    navigate('/');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="empty-state"><p>{error}</p></div>;
  if (!list) return <div className="empty-state"><p>List not found</p></div>;

  const isOwner = user?.username === list.owner;

  return (
    <div>
      <div className="list-view-header">
        <div className="list-view-title">{list.meta.title}</div>
        {list.meta.description && (
          <div className="list-view-desc">{list.meta.description}</div>
        )}
        <div className="list-view-meta">
          {list.owner !== '_anonymous' && (
            <Link to={`/u/${list.owner}`}>@{list.owner}</Link>
          )}
          <span>{list.meta.category}</span>
          <span>Updated {timeAgo(list.meta.updated)}</span>
        </div>
        {list.meta.tags.length > 0 && (
          <div className="tag-list" style={{ marginTop: 12 }}>
            {list.meta.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        {isOwner && (
          <div className="list-view-actions">
            <Link to={`/u/${list.owner}/${list.slug}/edit`} className="btn btn-sm">Edit</Link>
            <button onClick={handleDelete} className="btn btn-sm btn-danger">Delete</button>
          </div>
        )}
      </div>

      <ListRenderer content={list.content} />
    </div>
  );
}
