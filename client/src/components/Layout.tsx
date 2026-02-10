import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <UserMenu />
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
