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
  RiChat3Line,
  RiAddLine,
  RiCloseLine,
  RiSearchLine,
} from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { chatApi } from '../../api/chat.api';
import { useAuth } from '../../store/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Generate', icon: RiSparklingLine, end: true },
  { to: '/dashboard/chat', label: 'Chat', icon: RiChat3Line },
  { to: '/dashboard/history', label: 'History', icon: RiHistoryLine },
  { to: '/dashboard/saved', label: 'Saved', icon: RiBookmarkLine },
  { to: '/dashboard/profile', label: 'Profile', icon: RiUserLine },
  { to: '/dashboard/settings', label: 'Settings', icon: RiSettings3Line },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [showAllChats, setShowAllChats] = useState(false);
  const [chatSearch, setChatSearch] = useState('');

  const loadConversations = async () => {
    try {
      const { data } = await chatApi.getConversations();
      const nextConversations = data.data.conversations;
      setConversations(nextConversations);
      if (nextConversations.length <= 6) {
        setShowAllChats(false);
        setChatSearch('');
      }
    } catch {
      setConversations([]);
    }
  };

  useEffect(() => {
    loadConversations();
    window.addEventListener('chat-updated', loadConversations);
    return () => window.removeEventListener('chat-updated', loadConversations);
  }, []);

  const handleNewChat = async () => {
    try {
      const { data } = await chatApi.createConversation();
      await loadConversations();
      navigate(`/dashboard/chat/${data.data.conversation._id}`);
    } catch {
      toast.error('Unable to start a new chat');
    }
  };

  const handleDeleteChat = async (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await chatApi.deleteConversation(id);
      await loadConversations();
      if (window.location.pathname.includes(id)) navigate('/dashboard/chat');
      toast.success('Chat deleted');
    } catch {
      toast.error('Unable to delete this chat');
    }
  };

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
        <button
          type="button"
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 px-3 py-2 mb-3 rounded-[var(--radius-md)] text-sm font-medium bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
        >
          <RiAddLine className="text-base" />
          New Chat
        </button>
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
        <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recent chats</span>
            {conversations.length > 6 && (
              <button type="button" onClick={() => setShowAllChats((value) => !value)} className="text-xs text-[var(--color-accent)] hover:underline">
                {showAllChats ? 'Show less' : 'See all'}
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            {(showAllChats ? conversations.filter((conversation) => conversation.title.toLowerCase().includes(chatSearch.toLowerCase())) : conversations.slice(0, 6)).map((conversation) => (
              <div key={conversation._id} className="group flex items-center">
                <NavLink
                  to={`/dashboard/chat/${conversation._id}`}
                  className={({ isActive }) => `flex items-center gap-2 flex-1 min-w-0 px-3 py-2 rounded-[var(--radius-md)] text-xs ${isActive ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]'}`}
                >
                  <RiChat3Line className="shrink-0 text-sm" />
                  <span className="truncate">{conversation.title}</span>
                </NavLink>
                <button type="button" onClick={(event) => handleDeleteChat(event, conversation._id)} className="hidden group-hover:block p-1 text-[var(--color-text-muted)] hover:text-[var(--color-error)]" title="Delete chat" aria-label={`Delete ${conversation.title}`}>
                  <RiCloseLine />
                </button>
              </div>
            ))}
          </div>
          {showAllChats && (
            <div className="relative mt-2">
              <RiSearchLine className="absolute left-2 top-2 text-xs text-[var(--color-text-muted)]" />
              <input value={chatSearch} onChange={(event) => setChatSearch(event.target.value)} placeholder="Search chats" className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] py-1.5 pl-7 pr-2 text-xs text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
            </div>
          )}
        </div>
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
