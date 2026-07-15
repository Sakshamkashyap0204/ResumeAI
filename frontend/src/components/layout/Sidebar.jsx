import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiQuillPenLine,
  RiHistoryLine,
  RiBookmarkLine,
  RiUserLine,
  RiSettings3Line,
  RiLogoutBoxLine,
  RiSparklingLine,
} from 'react-icons/ri';
import { useAuth } from '../../store/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Generate', icon: RiSparklingLine, end: true },
  { to: '/dashboard/history', label: 'History', icon: RiHistoryLine },
  { to: '/dashboard/saved', label: 'Saved', icon: RiBookmarkLine },
  { to: '/dashboard/profile', label: 'Profile', icon: RiUserLine },
  { to: '/dashboard/settings', label: 'Settings', icon: RiSettings3Line },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-1)]">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <RiQuillPenLine className="text-white text-sm" />
          </div>
          <span className="font-semibold text-[var(--color-text-primary)] tracking-tight">
            Muse
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm
              transition-colors duration-150 group
              ${isActive
                ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon className={`text-base shrink-0 ${isActive ? 'text-[var(--color-accent)]' : ''}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{user?.name}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-error)] transition-colors duration-150"
        >
          <RiLogoutBoxLine className="text-base" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
