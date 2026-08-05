import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-indigo-200 transition-shadow">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="text-gray-900 font-bold text-lg tracking-tight">
            Resume<span className="text-indigo-600">AI</span>
          </span>
        </Link>

        {user && (
          <>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
                Dashboard
              </Link>
              <Link to="/upload"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/upload') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
                New Analysis
              </Link>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                Sign out
              </button>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <div className="w-5 h-0.5 bg-gray-600 mb-1" />
              <div className="w-5 h-0.5 bg-gray-600 mb-1" />
              <div className="w-5 h-0.5 bg-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && user && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-3 space-y-1">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
          <Link to="/upload" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">New Analysis</Link>
          <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50">Sign out</button>
        </div>
      )}
    </nav>
  );
}
