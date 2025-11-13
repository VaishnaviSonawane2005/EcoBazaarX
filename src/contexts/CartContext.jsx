// src/contexts/CartContext.jsx
import { createContext, useContext, useState } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const id = product.productId ?? product.id;
      const existing = prev.find((it) => it.id === id);
      if (existing) {
        return prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity + quantity } : it));
      }
      // normalize stored shape
      return [...prev, {
        id,
        name: product.name,
        price: Number(product.price) || 0,
        imageUrl: product.imageUrl || product.image || '',
        carbonFootprint: Number(product.carbonFootprint) || 0,
        stockQuantity: product.stockQuantity ?? product.stock ?? 0,
        sellerName: product.postedBy?.username || product.sellerName || product.postedBy?.name || 'Unknown',
        quantity,
      }];
    });
  };

  const removeFromCart = (productId) => setItems((prev) => prev.filter((it) => it.id !== productId));

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) => prev.map((it) => (it.id === productId ? { ...it, quantity } : it)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + (i.quantity || 0), 0);
  const totalPrice = items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
  const totalCarbonFootprint = items.reduce((s, i) => s + (i.carbonFootprint || 0) * (i.quantity || 0), 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, totalCarbonFootprint,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
