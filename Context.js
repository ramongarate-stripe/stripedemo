import { useState, createContext } from "react";

export const Context = createContext();

export function ContextProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState({});

  const addToCart = (id) => {
    if (!cart[id]) {
      setCart({ ...cart, [id]: 1 });
    } else {
      setCart({ ...cart, [id]: cart[id] + 1 });
    }
  };

  const value = {
    customer,
    setCustomer,
    cart,
    addToCart,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
