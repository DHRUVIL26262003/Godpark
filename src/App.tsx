import { useState, Suspense, lazy } from 'react';
import { Layout } from '@/components/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { SecurityProvider } from '@/contexts/SecurityContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Activity } from 'lucide-react';
import './App.css';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })));
const ProductsPage = lazy(() => import('@/pages/ProductsPage').then(module => ({ default: module.ProductsPage })));
const ServicesPage = lazy(() => import('@/pages/ServicesPage').then(module => ({ default: module.ServicesPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then(module => ({ default: module.ContactPage })));
const AccountPage = lazy(() => import('@/pages/AccountPage').then(module => ({ default: module.AccountPage })));
const SIEMPage = lazy(() => import('@/pages/SIEMPage').then(module => ({ default: module.SIEMPage })));

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing' | 'siem';

function LoadingFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#050B14]">
      <div className="flex flex-col items-center gap-4">
        <Activity className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-sm font-mono text-[#A7B1C6] animate-pulse">INITIALIZING SYSTEM...</p>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'products':
        return <ProductsPage />;
      case 'services':
        return <ServicesPage />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'checkout':
        return <CheckoutPage onNavigate={setCurrentPage} />;
      case 'contact':
        return <ContactPage />;
      case 'account':
        return <AccountPage onNavigate={setCurrentPage} />;
      case 'siem':
        return <SIEMPage />;
      case 'pricing':
        return <HomePage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <SecurityProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
              <Suspense fallback={<LoadingFallback />}>
                {renderPage()}
              </Suspense>
            </Layout>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SecurityProvider>
  );
}

export default App;
