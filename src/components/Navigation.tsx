import { useState, useEffect } from 'react';
import { Shield, Menu, X, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

interface NavigationProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export function Navigation({ onNavigate, currentPage }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, setIsCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', page: 'products' as Page },
    { name: 'Services', page: 'services' as Page },
    { name: 'Pricing', page: 'pricing' as Page },
    { name: 'Contact', page: 'contact' as Page },
  ];

  const isActive = (page: Page) => currentPage === page;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
          ? 'bg-[#050B14]/70 backdrop-blur-lg border-white/10 shadow-lg'
          : 'bg-transparent border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center space-x-2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <Shield className="relative h-8 w-8 text-white" />
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">Whitelines</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => onNavigate(link.page)}
                  className={`text-sm font-medium transition-all relative group ${isActive(link.page)
                    ? 'text-white'
                    : 'text-[#A7B1C6] hover:text-white'
                    }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-white transform origin-left transition-transform duration-300 ${isActive(link.page) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#A7B1C6] hover:text-white transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-white text-[#050B14] text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate('account')}
                    className="text-[#A7B1C6] hover:text-white hover:bg-white/5"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user?.name.split(' ')[0]}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => onNavigate('login')}
                  className="bg-white text-[#050B14] hover:bg-white/90 font-medium btn-shadow transition-transform hover:scale-105"
                >
                  Get a Quote
                </Button>
              )}
            </div>

            {/* Mobile Menu Button - Animated */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white relative group"
            >
              <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0, opacity: isMobileMenuOpen ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <X className="h-6 w-6" />
                </motion.div>
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#050B14]/98 backdrop-blur-2xl md:hidden pt-24"
          >
            <div className="flex flex-col items-center space-y-8 p-6">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    onNavigate(link.page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-3xl font-medium transition-all ${isActive(link.page) ? 'text-white' : 'text-[#A7B1C6] hover:text-white'
                    }`}
                >
                  {link.name}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-6 mt-8 pt-8 border-t border-white/10 w-48 justify-center"
              >
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative p-3 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-white text-[#050B14] text-xs font-bold rounded-full flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </motion.div>

              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex flex-col space-y-4 items-center">
                    {/* The SIEM link was here, but now it's part of navLinks */}
                    <Button
                      onClick={() => {
                        onNavigate('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-white text-[#050B14] hover:bg-white/90 font-medium px-10 py-6 text-lg rounded-full"
                    >
                      Sign In
                    </Button>
                  </div>
                </motion.div>
              )}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 px-8 py-4"
                  >
                    Logout
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
