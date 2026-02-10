import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, type ListSummary } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [categories, setCategories] = useState<string[]>([]);
  const [myLists, setMyLists] = useState<ListSummary[]>([]);

  useEffect(() => {
    api.getCategories().then(({ categories }) => setCategories(categories));
  }, []);

  useEffect(() => {
    if (user) {
      api.getUserLists(user.username).then(({ lists }) => setMyLists(lists));
    } else {
      setMyLists([]);
    }
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">Listwise</Link>
      </div>

      <Link to="/new" className="new-list-btn">+ New List</Link>

      <div className="sidebar-section">
        <Link to="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
          <span className="sidebar-link-icon">🏠</span> Home
        </Link>
        <Link to="/explore" className={`sidebar-link ${isActive('/explore') ? 'active' : ''}`}>
          <span className="sidebar-link-icon">🔍</span> Explore
        </Link>
      </div>

      {categories.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-label">Categories</div>
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/explore?category=${cat}`}
              className={`sidebar-link ${location.search.includes(`category=${cat}`) ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">
                {cat === 'events' ? '🎪' : cat === 'food' ? '🍽️' : cat === 'wellness' ? '🧘' : cat === 'books' ? '📚' : cat === 'outdoors' ? '🏔️' : '📋'}
              </span>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </div>
      )}

      {user && myLists.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-label">My Lists</div>
          {myLists.map((list) => (
            <Link
              key={`${list.owner}/${list.slug}`}
              to={`/u/${list.owner}/${list.slug}`}
              className={`sidebar-link ${location.pathname === `/u/${list.owner}/${list.slug}` ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">📄</span>
              {list.title}
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}
