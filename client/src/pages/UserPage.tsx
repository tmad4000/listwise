import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, type ListSummary } from '../api';
import ListCard from '../components/ListCard';

export default function UserPage() {
  const { username } = useParams();
  const owner = username || '';
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner) return;
    api.getUserLists(owner)
      .then(({ lists }) => setLists(lists))
      .finally(() => setLoading(false));
  }, [owner]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="profile-header">
        <div className="profile-avatar">{owner[0].toUpperCase()}</div>
        <div className="profile-info">
          <h1>@{owner}</h1>
          <p>{lists.length} public list{lists.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="list-grid">
        {lists.map((list) => (
          <ListCard key={`${list.owner}/${list.slug}`} list={list} />
        ))}
      </div>

      {lists.length === 0 && (
        <div className="empty-state">
          <p>No public lists yet.</p>
        </div>
      )}
    </div>
  );
}
