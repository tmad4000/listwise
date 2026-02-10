import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="user-menu">
        <Link to="/login" className="btn btn-sm">Log in</Link>
        <Link to="/signup" className="btn btn-sm btn-primary">Sign up</Link>
      </div>
    );
  }

  return (
    <div className="user-menu">
      <Link to={`/u/${user.username}`} className="user-name">
        {user.displayName}
      </Link>
      <div className="user-avatar">{user.displayName[0].toUpperCase()}</div>
      <button onClick={logout} className="btn btn-sm btn-ghost">Log out</button>
    </div>
  );
}
