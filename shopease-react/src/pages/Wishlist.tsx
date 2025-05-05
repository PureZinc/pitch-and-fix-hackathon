import { EmptyProductGrid } from "../components/ProductGrid";
import type { Product } from "../components/ProductGrid";

import { useState, useEffect } from "react";
import { getProducts } from "../services/useBackend";

import { useWishlist } from "../services/wishlistService";

export default function Wishlist() {
    const wishlistContext = useWishlist();
    const { wishList, isInWishlist } = wishlistContext;
    const [wishListItems, setWishListItems] = useState<Product[]>([]);

    console.log(wishList);

    useEffect(() => {
        getProducts()
            .then((products) => {
                console.log(products.map((p: Product) => p.id.toString()));
                if (wishList) {
                    const filteredProducts = products.filter((product: Product) => isInWishlist(product.id.toString()));
                    setWishListItems(filteredProducts);
                }
            });
    }, []);

  return (
    <main>
      <section className="wishlist">
        <h1>Wishlist</h1>
        <div className="wishlist-product-grid">
            <EmptyProductGrid products={wishListItems} />
        </div>
      </section>
    </main>
  )
}
