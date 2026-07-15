import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
