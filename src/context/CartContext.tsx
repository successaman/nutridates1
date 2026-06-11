'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nutri_dates_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Failed to load cart from localStorage:', err);
    }
  }, []);

  // Save cart to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem('nutri_dates_cart', JSON.stringify(cart));
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // Find item with same ID and Size
      const existingIdx = prev.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );

      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }

      return [...prev, newItem];
    });
    // Open drawer automatically on add
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
