import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, type ListData } from '../api';
import ListRenderer from '../components/ListRenderer';

export default function AnonListPage() {
  const { slug } = useParams();
  const [list, setList] = useState<ListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    api.getList('_anonymous', slug)
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="empty-state"><p>{error}</p></div>;
  if (!list) return <div className="empty-state"><p>List not found</p></div>;

  return (
    <div>
      <div className="list-view-header">
        <div className="list-view-title">{list.meta.title}</div>
        {list.meta.description && <div className="list-view-desc">{list.meta.description}</div>}
        <div className="list-view-meta">
          <span>{list.meta.category}</span>
        </div>
        {list.meta.tags.length > 0 && (
          <div className="tag-list" style={{ marginTop: 12 }}>
            {list.meta.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <ListRenderer content={list.content} />
    </div>
  );
}
