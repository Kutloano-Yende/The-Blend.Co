import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import RequireAdmin from './components/RequireAdmin';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Account from './pages/Account';
import ResetPassword from './pages/ResetPassword';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import InfoPage from './pages/InfoPage';
import { SHIPPING_INFO, RETURNS_INFO } from './data/products';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminComingSoon from './pages/admin/AdminComingSoon';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
        <WishlistProvider>
          <div className="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/account" element={<Account />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />
              <Route path="/shipping" element={<InfoPage title="Shipping" content={SHIPPING_INFO} />} />
              <Route path="/returns" element={<InfoPage title="Returns" content={RETURNS_INFO} />} />

              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<Navigate to="/admin/products" replace />} />
                <Route path="dashboard" element={<AdminComingSoon title="Dashboard" />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id" element={<AdminProductForm />} />
                <Route path="categories" element={<AdminComingSoon title="Categories" />} />
                <Route path="orders" element={<AdminComingSoon title="Orders" />} />
                <Route path="customers" element={<AdminComingSoon title="Customers" />} />
                <Route path="inventory" element={<AdminComingSoon title="Inventory" />} />
                <Route path="promotions" element={<AdminComingSoon title="Promotions" />} />
              </Route>
            </Routes>
          </div>
        </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
