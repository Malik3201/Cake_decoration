import { Link } from 'react-router-dom';

const CheckoutSuccessPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
      <div className="mx-auto h-16 w-16 rounded-full bg-pink-50 flex items-center justify-center text-2xl">
        ✅
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">Order placed!</h1>
      <p className="text-sm text-slate-500 max-w-lg mx-auto">
        Thank you for your order. We’re preparing your bakes with care. You’ll
        receive an email confirmation shortly.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          to="/orders"
          className="inline-flex px-5 py-2.5 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_14px_30px_rgba(244,114,182,0.5)] hover:bg-[hsl(340,82%,40%)] transition"
        >
          View my orders
        </Link>
        <Link
          to="/"
          className="inline-flex px-5 py-2.5 rounded-full border border-pink-100 bg-white text-sm font-medium text-[hsl(340,82%,45%)] hover:bg-pink-50 transition"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;


