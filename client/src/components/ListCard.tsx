import { Link } from 'react-router-dom';
import type { ListSummary } from '../api';

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

export default function ListCard({ list }: { list: ListSummary }) {
  const url = list.owner === '_anonymous' ? `/list/${list.slug}` : `/u/${list.owner}/${list.slug}`;

  return (
    <Link to={url} className="list-card">
      <div className="list-card-title">
        {list.title}
        {list.visibility === 'private' && <span className="visibility-badge private">Private</span>}
        {list.visibility === 'unlisted' && <span className="visibility-badge unlisted">Unlisted</span>}
      </div>
      {list.description && <div className="list-card-desc">{list.description}</div>}
      <div className="list-card-meta">
        {list.owner !== '_anonymous' && (
          <span className="list-card-author">@{list.owner}</span>
        )}
        <span>{list.category}</span>
        <span>{timeAgo(list.updated)}</span>
      </div>
      {list.tags.length > 0 && (
        <div className="tag-list" style={{ marginTop: 8 }}>
          {list.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
