import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import ListViewPage from './pages/ListViewPage';
import ListEditPage from './pages/ListEditPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserPage from './pages/UserPage';
import AnonListPage from './pages/AnonListPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<DirectoryPage />} />
        <Route path="/new" element={<ListEditPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/list/:slug" element={<AnonListPage />} />
        <Route path="/u/:username" element={<UserPage />} />
        <Route path="/u/:username/:slug" element={<ListViewPage />} />
        <Route path="/u/:username/:slug/edit" element={<ListEditPage />} />
      </Route>
    </Routes>
  );
}
