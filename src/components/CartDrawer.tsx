import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

interface CartDrawerProps {
  onNavigate: (page: Page) => void;
}

export function CartDrawer({ onNavigate }: CartDrawerProps) {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      onNavigate('login');
    } else {
      onNavigate('checkout');
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0B1628] border-l border-white/10 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-5 w-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Your Cart</h2>
            <span className="text-sm text-[#A7B1C6]">({items.length} items)</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#A7B1C6] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-[#A7B1C6]/30 mb-4" />
              <p className="text-[#A7B1C6] mb-2">Your cart is empty</p>
              <p className="text-sm text-[#A7B1C6]/60">Add products or services to get started</p>
              <Button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('products');
                }}
                className="mt-6 bg-white text-[#050B14] hover:bg-white/90"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-[#050B14] rounded-xl p-4 border border-white/5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-sm text-[#A7B1C6] capitalize">{item.type}</p>
                    {item.bookingDetails && (
                      <p className="text-xs text-[#A7B1C6]/70 mt-1">
                        Booking: {new Date(item.bookingDetails.preferredDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-[#A7B1C6] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  {item.type === 'product' ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded bg-white/5 text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded bg-white/5 text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-[#A7B1C6]">Service</span>
                  )}
                  <span className="text-white font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#A7B1C6]">Subtotal</span>
              <span className="text-white font-semibold">${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span className="text-white font-medium">Total</span>
              <span className="text-white font-bold">${getTotalPrice().toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-white text-[#050B14] hover:bg-white/90 font-medium py-3"
            >
              Proceed to Checkout
            </Button>
            <button
              onClick={clearCart}
              className="w-full text-sm text-[#A7B1C6] hover:text-white transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
