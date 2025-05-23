import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";

// Define types for the cart item and context
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
    imageSrc: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Omit<CartItem, "quantity" | "total">, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateItemQuantity: (productId: string, newQuantity: number) => void;
    isInCart: (productId: string) => boolean;
}

// Cart Context for Global State Management
const CartContext = React.createContext<CartContextType | null>(null);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const getCartFromLocalStorage = () => {
        const savedCart = localStorage.getItem("shopease_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    }

    const [cart, setCart] = useState<CartItem[]>(getCartFromLocalStorage());

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("shopease_cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("shopease_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Omit<CartItem, "quantity" | "total">, quantity = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
                        : item
                );
            } else {
                return [
                    ...prevCart,
                    {
                        ...product,
                        quantity,
                        total: product.price * quantity,
                    },
                ];
            }
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateItemQuantity = (productId: string, newQuantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
                    : item
            )
        );
    };

    const isInCart = (productId: string) => {
        productId = productId.toString();
        return cart.some(item => item.id === productId);
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateItemQuantity, isInCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = React.useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};