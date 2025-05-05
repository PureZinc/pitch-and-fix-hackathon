import React, { createContext, useContext, useEffect, useState } from 'react';

interface WishlistContextType {
    wishList: string[];
    addToWishlist: (productId: string) => void;
    removeFromWishlist: (productId: string) => void;
    clearWishlist: () => void;
    isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const getWishList = (): string[] => {
        const storedWishlist = localStorage.getItem('wishlist');
        return storedWishlist ? JSON.parse(storedWishlist) : [];
    }

    const [wishList, setWishList] = useState<string[]>(getWishList());

    useEffect(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            setWishList(JSON.parse(storedWishlist));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishList));
    }, [wishList]);

    const addToWishlist = (productId: string) => {
        productId = productId.toString();
        if (!wishList.includes(productId)) {
            setWishList((prev) => [...prev, productId]);
        }
    };

    const removeFromWishlist = (productId: string) => {
        productId = productId.toString();
        setWishList((prev) => prev.filter((itemId) => itemId !== productId));
    };

    const clearWishlist = () => {
        setWishList([]);
    };

    const isInWishlist = (productId: string) => {
        productId = productId.toString();
        return wishList.includes(productId);
    };

    return (
        <WishlistContext.Provider
            value={{ wishList, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};