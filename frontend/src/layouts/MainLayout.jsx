import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { SearchIcon, CartIcon, InstagramIcon, FacebookIcon } from '../utils/icons.jsx';

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[hsl(0,0%,99%)] text-slate-800 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-pink-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-[hsl(340,82%,72%)] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">DB</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-wide text-slate-900">DecoraBake</span>
              <span className="text-xs text-slate-500">Cakes • Treats • Moments</span>
            </div>
          </Link>

          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cakes, cupcakes, occasions..."
                className="w-full rounded-full border border-pink-100 bg-slate-50 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white shadow-sm"
              />
              <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3 text-sm">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-[hsl(340,82%,45%)]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-full bg-[hsl(340,82%,45%)] text-white text-xs font-medium shadow-sm hover:bg-[hsl(340,82%,40%)]"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3 text-xs text-slate-600">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-full bg-pink-50 text-[hsl(340,82%,45%)] font-medium border border-pink-100"
                  >
                    Admin
                  </Link>
                )}
                <Link to="/orders" className="hover:text-[hsl(340,82%,45%)]">
                  Orders
                </Link>
                <Link to="/profile" className="hover:text-[hsl(340,82%,45%)]">
                  {user.name?.split(' ')[0] || 'Profile'}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-slate-400 hover:text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-pink-50 text-[hsl(340,82%,35%)] shadow-sm hover:bg-pink-100 transition"
            >
              <CartIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 rounded-full bg-[hsl(340,82%,55%)] text-white text-[10px] flex items-center justify-center px-1 shadow">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="px-4 pb-3 md:hidden border-t border-pink-50 bg-white/90">
          <input
            type="text"
            placeholder="Search cakes, cupcakes, occasions..."
            className="w-full rounded-full border border-pink-100 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white shadow-sm"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-pink-100 bg-white">
        <div className="max-w-6xl mx-auto px  -4 py-10 grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">DecoraBake</h3>
            <p className="text-sm text-slate-500">
              Handcrafted cakes and sweet moments for every celebration. Baked
              fresh daily with love.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Shop</h4>
            <ul className="space-y-1 text-sm text-slate-500">
              <li>
                <Link to="/category/cakes" className="hover:text-[hsl(340,82%,45%)]">
                  Cakes
                </Link>
              </li>
              <li>
                <Link to="/category/cupcakes" className="hover:text-[hsl(340,82%,45%)]">
                  Cupcakes
                </Link>
              </li>
              <li>
                <Link to="/category/occasion/birthdays" className="hover:text-[hsl(340,82%,45%)]">
                  Birthday Specials
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Contact</h4>
            <ul className="space-y-1 text-sm text-slate-500">
              <li>Email: hello@decorabake.com.au</li>
              <li>Phone: +61 (02) 9123 4567</li>
              <li>Mon-Sat: 9:00 AM - 6:00 PM AEST</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Follow us</h4>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="hover:text-[hsl(340,82%,45%)] transition">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-[hsl(340,82%,45%)] transition">
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-pink-50 py-4">
          <p className="text-center text-xs text-slate-400">
            © {new Date().getFullYear()} DecoraBake. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;


