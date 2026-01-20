import { useState, useCallback } from "react";
import { CartItem } from "../types/product.types";

const CART_STORAGE_KEY = "cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const saveCart = useCallback((items: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    setCart(items);
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      const existingItem = cart.find((c) => c._id === item._id);
      if (existingItem) {
        const updated = cart.map((c) =>
          c._id === item._id ? { ...c, qty: c.qty + item.qty } : c,
        );
        saveCart(updated);
      } else {
        saveCart([...cart, item]);
      }
    },
    [cart, saveCart],
  );

  const updateQty = useCallback(
    (productId: string, qty: number) => {
      if (qty <= 0) {
        removeItem(productId);
      } else {
        const updated = cart.map((c) =>
          c._id === productId ? { ...c, qty } : c,
        );
        saveCart(updated);
      }
    },
    [cart, saveCart],
  );

  const removeItem = useCallback(
    (productId: string) => {
      saveCart(cart.filter((c) => c._id !== productId));
    },
    [cart, saveCart],
  );

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  }, [cart]);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.qty, 0);
  }, [cart]);

  return {
    cart,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
};
