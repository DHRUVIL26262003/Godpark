import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CartItem } from '@/types';
import { db } from '@/lib/database';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    setItems(prev => {
      // Check if item already exists (for products only)
      if (item.type === 'product') {
        const existingItem = prev.find(i => i.itemId === item.itemId && i.type === 'product');
        if (existingItem) {
          const product = db.getProductById(item.itemId);
          if (product && product.type === 'physical') {
            const newQuantity = existingItem.quantity + item.quantity;
            if (newQuantity > product.stockQuantity) {
              toast.error(`Only ${product.stockQuantity} items available in stock`);
              return prev;
            }
          }
          const updatedQuantity = existingItem.quantity + item.quantity;
          toast.success('Updated quantity in cart');
          return prev.map(i => 
            i.id === existingItem.id 
              ? { ...i, quantity: updatedQuantity }
              : i
          );
        }
      }
      
      toast.success('Added to cart');
      return [...prev, { ...item, id: `cart-${Date.now()}` }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.info('Removed from cart');
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item && item.type === 'product') {
        const product = db.getProductById(item.itemId);
        if (product && product.type === 'physical' && quantity > product.stockQuantity) {
          toast.error(`Only ${product.stockQuantity} items available`);
          return prev;
        }
      }
      return prev.map(i => i.id === id ? { ...i, quantity } : i);
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
