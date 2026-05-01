import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "nl_cart_v1";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, size, quantity = 1) => {
    setItems((prev) => {
      const key = `${product.id}__${size}`;
      const idx = prev.findIndex((i) => `${i.product_id}__${i.size}` === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          size,
          quantity,
        },
      ];
    });
    setDrawerOpen(true);
  };

  const removeItem = (product_id, size) => {
    setItems((prev) => prev.filter((i) => !(i.product_id === product_id && i.size === size)));
  };

  const updateQty = (product_id, size, quantity) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product_id === product_id && i.size === size ? { ...i, quantity } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 7.99;
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + shipping + tax).toFixed(2);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return { subtotal: +subtotal.toFixed(2), shipping, tax, total, count };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clear, totals, drawerOpen, setDrawerOpen }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
