"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (product: Product) => void;

  removeFromCart: (id: string) => void;

  increaseQty: (id: string) => void;

  decreaseQty: (id: string) => void;

  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart
  useEffect(() => {

    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

  }, []);

  // Save cart
  useEffect(() => {

    localStorage.setItem("cart", JSON.stringify(cart));

  }, [cart]);

  // Add to cart
  const addToCart = (product: Product) => {

    setCart((prev) => {

      const exist = prev.find(
        (item) => item._id === product._id
      );

      if (exist) {

        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );

      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];

    });

  };

  // Remove
  const removeFromCart = (id: string) => {

    setCart((prev) =>
      prev.filter((item) => item._id !== id)
    );

  };

  // Increase qty
  const increaseQty = (id: string) => {

    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

  };

  // Decrease qty
  const decreaseQty = (id: string) => {

    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity:
                item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }
          : item
      )
    );

  };

  // Clear cart
  const clearCart = () => {

    setCart([]);

  };

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >

      {children}

    </CartContext.Provider>

  );

}

export function useCart() {

  const context = useContext(CartContext);

  if (!context) {

    throw new Error(
      "useCart must be used inside CartProvider"
    );

  }

  return context;

}