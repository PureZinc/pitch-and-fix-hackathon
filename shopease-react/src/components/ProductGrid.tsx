import React, {useState, useEffect} from 'react';
import { getProducts } from '../services/useBackend';
import { useNavigate } from 'react-router-dom';

export interface Product {
    id: number;
    title: string;
    image: { src: string };
    tags: string;
    rating?: number;
    ratingCount?: number;
    originalPrice?: number;
    variants: Array<{
        price: string; // Shopify API returns prices as strings
        inventory_quantity: number;
    }>;
}

export const ProductCard: React.FC<{product: Product}> = ({ product }) => {
    const ProductQuantity: React.FC<{ product: any }> = ({ product }) => (
        product.variants[0].inventory_quantity ? (
            <div className="stock-status in-stock">
                <span className="quantity-label">Quantity:</span>
                <span className="quantity-value">{product.variants[0].inventory_quantity}</span>
            </div>
        ) : (
            <div className="stock-status out-of-stock">Out of Stock</div>
        )
    );

    const ProductRating: React.FC<{ product: any }> = ({ product }) => (
        product.rating ? (
            <div className="product-rating">
                {Array.from({ length: 5 }, (_, i) => (
                    i < Math.floor(product.rating) ? (
                        <i key={i} className="fas fa-star"></i>
                    ) : (
                        i < product.rating ? (
                            <i key={i} className="fas fa-star-half-alt"></i>
                        ) : (
                            <i key={i} className="far fa-star"></i>
                        )
                    )
                ))}
                <span className="rating-count">({product.ratingCount})</span>
            </div>
        ) : null
    );

    const ProductTag: React.FC<{ product: any }> = ({ product }) => {
        const firstTag = product.tags ? product.tags.split(',')[0] : null;
        return firstTag ? <div className="product-tag">{firstTag}</div> : null;
    };

    const ProductPrice: React.FC<{ product: any }> = ({ product }) => (
        <div className="product-price">
            {product.originalPrice && <span className="original-price">${product.originalPrice}</span>}
            <span className="current-price">${product.variants[0].price}</span>
        </div>
    );

    const navigate = useNavigate();

    return (
        <div className="product-card">
            <div className="product-image" onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.image ? product.image.src : '../images/placeholder.jpg'} alt={product.title} />
                <ProductTag product={product} />
            </div>
            <div className="product-details">
                <h3 className="product-title">{product.title}</h3>
                <ProductPrice product={product} />
                <ProductRating product={product} />
                <ProductQuantity product={product} />
                {product.variants[0].inventory_quantity && 
                    <button className="add-to-cart-btn">Add to Cart</button>
                }
            </div>
        </div>
    );
}

const ProductGrid: React.FC<{ filter: string | null }> = ({ filter }) => {
    const CardsSkeleton: React.FC<{ count: number }> = ({ count }) => {
        return (
            <>
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className="product-card skeleton">
                        <div className="product-image skeleton"></div>
                        <div className="product-details">
                            <h3 className="product-title skeleton"></h3>
                            <div className="product-price skeleton"></div>
                            <div className="product-rating skeleton"></div>
                            <button className="add-to-cart-btn skeleton"></button>
                        </div>
                    </div>
                ))}
            </>
        );
    };

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getProducts().then((fetchedProducts) => {
            if (filter) {
                const filteredProducts = fetchedProducts.filter(product => {
                    const productTags = product.tags.split(', ').map(tag => tag.trim().toLowerCase());
                    return productTags.includes(filter.toLowerCase());
                });
                setProducts(filteredProducts);
            } else {
                setProducts(fetchedProducts);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [filter]);

    return (
        <div className="product-grid">
            {loading ? (
                <CardsSkeleton count={4} />
            ) : (
                products.map(product => <ProductCard key={product.id} product={product} />)
            )}
        </div>
    );
}

export default ProductGrid;
