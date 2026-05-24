import { useContext } from "react";
import { CartContext } from "./cartContextValue";

export const useCart = () => {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used within CartProvider");
  }
  return cart;
};
