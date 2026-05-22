import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user && user.role === 'VENDOR') {
      // In a real backend, we'd fetch cart via Axios:
      // axios.get(`/api/carts?userId=${user.userId}`)
      // For instant wow, we load from localStorage and match simulated database items
      const localCart = localStorage.getItem(`cart_${user.userId}`);
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  const saveCart = (items) => {
    setCartItems(items);
    if (user) {
      localStorage.setItem(`cart_${user.userId}`, JSON.stringify(items));
    }
  };

  const addToCart = (product, quantity) => {
    const existingIndex = cartItems.findIndex(item => item.product.id === product.id);
    let newItems = [...cartItems];

    if (existingIndex > -1) {
      newItems[existingIndex].quantity += Number(quantity);
    } else {
      newItems.push({ product, quantity: Number(quantity) });
    }
    saveCart(newItems);
  };

  const updateQuantity = (productId, quantity) => {
    let newItems = cartItems.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Number(quantity) };
      }
      return item;
    }).filter(item => item.quantity > 0);
    saveCart(newItems);
  };

  const removeFromCart = (productId) => {
    let newItems = cartItems.filter(item => item.product.id !== productId);
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
