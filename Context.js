import { useState, createContext } from "react";
import { DATA } from "./constants";

export const Context = createContext();

export function ContextProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState(
    DATA.map((item) => ({ ...item, quantity: 0 }))
  );

  const addToCart = (id) => {
    setCart(
      cart.map((item) => ({
        ...item,
        quantity: item.id === id ? item.quantity + 1 : item.quantity,
      }))
    );
  };

  const value = {
    customer,
    setCustomer,
    cart,
    addToCart,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
