import { useCallback, useEffect, useMemo, useState } from "react";
import { CartContext } from "./cartContextValue";
import {
  addCartItem,
  calculateCartTotals,
  decreaseCartItem,
  getPreviewCartItems,
  removeCartItem,
} from "./cartUtils";

const CART_STORAGE_KEY = "defilicious_cart_preview";

const readStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(parsedCart) && parsedCart.length > 0
      ? parsedCart
      : getPreviewCartItems();
  } catch {
    return getPreviewCartItems();
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addItem = useCallback((item) => {
    setItems((currentItems) => addCartItem(currentItems, item));
    setIsCartOpen(true);
  }, []);

  const increaseItem = useCallback((item) => {
    setItems((currentItems) => addCartItem(currentItems, item));
  }, []);

  const decreaseItem = useCallback((id) => {
    setItems((currentItems) => decreaseCartItem(currentItems, id));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((currentItems) => removeCartItem(currentItems, id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totals = useMemo(() => calculateCartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      totals,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart,
    }),
    [
      items,
      totals,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
