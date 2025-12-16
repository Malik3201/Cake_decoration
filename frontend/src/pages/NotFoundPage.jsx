import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-slate-900 mb-2">404</h1>
        <p className="text-slate-600 mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_12px_26px_rgba(244,114,182,0.45)] hover:bg-[hsl(340,82%,40%)] transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

