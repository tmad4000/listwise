import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';

export default function Layout() {
  useEffect(() => {
    const loader = document.createElement('script');
    loader.src = 'https://worldissuetracker.com/widget/wit-feedback.js';
    loader.defer = true;
    Object.assign(loader.dataset, { trackerSlug: 'listwise-feedback', app: 'Listwise', mode: 'feedback', mountSelector: '#wit-feedback-mount', trigger: 'tab', label: 'Send feedback' });
    document.body.appendChild(loader);
    return () => { loader.remove(); };
  }, []);
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <span id="wit-feedback-mount" />
          <UserMenu />
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
