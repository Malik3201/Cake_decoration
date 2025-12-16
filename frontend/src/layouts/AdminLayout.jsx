import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/sales', label: 'Sales' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/ai-settings', label: 'AI Settings' },
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,99%)] text-slate-800">
      <div className="flex">
        <aside className="w-64 bg-white border-r border-pink-100 min-h-screen p-4 hidden md:flex md:flex-col">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-full bg-[hsl(340,82%,72%)] flex items-center justify-center shadow-sm text-white font-bold">
              DB
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-wide text-slate-900">DecoraBake</span>
              <span className="text-xs text-slate-500">Admin</span>
            </div>
          </Link>
          <nav className="space-y-1 flex-1">
            {navItems.map(item => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                    active
                      ? 'bg-pink-50 text-[hsl(340,82%,45%)]'
                      : 'text-slate-600 hover:bg-pink-50 hover:text-[hsl(340,82%,45%)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {/* Logout button */}
          <div className="pt-4 border-t border-pink-100 mt-4">
            <div className="text-xs text-slate-500 mb-2 px-3">
              {user?.name || 'Admin'}
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition text-left"
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 min-h-screen">
          <div className="md:hidden sticky top-0 z-20 bg-white border-b border-pink-100 px-4 py-3 flex items-center justify-between">
            <span className="font-semibold text-slate-900">Admin</span>
            <div className="flex items-center gap-3">
              <Link to="/" className="text-xs text-[hsl(340,82%,45%)]">
                Store
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-red-500"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
