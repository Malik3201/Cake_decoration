
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminReportsPage from './pages/admin/AdminReportsPage.jsx';
import AdminAiSettingsPage from './pages/admin/AdminAiSettingsPage.jsx';
import AdminSalesPage from './pages/admin/AdminSalesPage.jsx';
import ChatbotWidget from './components/ChatbotWidget.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <ChatbotWidget />
      <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="category/:id" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout/success"
            element={
              <ProtectedRoute>
                <CheckoutSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin login (no layout) */}
        <Route path="admin/login" element={<LoginPage adminMode />} />

        {/* Admin routes with AdminLayout */}
        <Route
          element={
            <ProtectedRoute requireRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/products" element={<AdminProductsPage />} />
          <Route path="admin/categories" element={<AdminCategoriesPage />} />
          <Route path="admin/orders" element={<AdminOrdersPage />} />
          <Route path="admin/sales" element={<AdminSalesPage />} />
          <Route path="admin/reports" element={<AdminReportsPage />} />
          <Route path="admin/ai-settings" element={<AdminAiSettingsPage />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
