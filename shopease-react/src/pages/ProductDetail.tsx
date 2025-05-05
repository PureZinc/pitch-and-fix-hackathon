import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/useBackend";
import NewsletterForm from "../components/newsletterForm";
import StarRating from "../components/StarRating";


const MainProductDetails: React.FC<{productId: string}> = ({productId}) => {
    const [product, setProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [productStock, setProductStock] = useState(0);

    useEffect(() => {
        getProductById(productId).then((productData) => {
            if (productData) {
                setProduct(productData);
                setProductStock(productData.variants[0].inventory_quantity);
            } else {
                console.error("Product not found");
            }
        });
    }, []);

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= productStock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            // addToCart(product.id, quantity);
            // showAddToCartMessage();
        }
    };

    const handleWishlistToggle = () => {
        // if (product) {
        //     if (isInWishlist(product.id)) {
        //         removeFromWishlist(product.id);
        //     } else {
        //         addToWishlist(product.id);
        //     }
        // }
    };

    const ProductMeta = () => {
        if (!product) return <></>;

        const stockStatus =
            productStock > 0 ? `${productStock} In Stock` : "Out of Stock";
        const stockClass = productStock > 0 ? "in-stock" : "out-of-stock";
        const SKU = product.variants[0].sku || "WH-100-BLK";
        const categories: string[] = (product.tags || "Audio, Headphones")
            .split(", ")
            .filter((cat: string) => cat !== "featured");

        return (
            <div className="product-meta">
                <p className={`stock-status ${stockClass}`}>{stockStatus}</p>
                <p className="sku">SKU: {SKU}</p>
                <p className="categories">
                    Categories:{" "}
                    {categories.map((cat, index) => (
                        <a
                            key={index}
                            href="/products"
                        >
                            {cat}
                        </a>
                    ))}
                </p>
            </div>
        );
    };

    const PurchaseActions = () => {
        if (!product) return <></>;
        const isInWishlist = (id: string) => true;

        return (
            <div className="purchase-actions">
                {productStock > 0 && (
                    <>
                        <button
                            id="add-to-cart"
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                        <button id="buy-now" className="buy-now-btn">
                            Buy Now
                        </button>
                        <button
                            id="add-to-wishlist"
                            className="wishlist-btn"
                            onClick={handleWishlistToggle}
                        >
                            {isInWishlist(product.id) ? (
                                <>
                                    <i className="fas fa-heart"></i>
                                    <span>Remove from Wishlist</span>
                                </>
                            ) : (
                                <>
                                    <i className="far fa-heart"></i>
                                    <span>Add to Wishlist</span>
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>
        );
    };

    return (
        <main className="product-detail-container">
            {product && (
                <>
                    <div className="product-images">
                        <div className="main-image">
                            <img
                                id="main-product-img"
                                src={product.image?.src || ""}
                                alt={product.title}
                            />
                        </div>
                    </div>
                    <div className="product-info">
                        <h1 className="product-title">{product.title}</h1>
                        <div className="product-rating">
                            <StarRating rating={product.variants[0].rating} />
                            <span className="rating-count">(42 reviews)</span>
                        </div>
                        <div className="product-price">
                            <span className="sale-price">
                                ${product.variants[0].price}
                            </span>
                        </div>
                        <div
                            className="product-description"
                            dangerouslySetInnerHTML={{ __html: product.body_html }}
                        />
                        <div className="quantity-selector">
                            <h3>Quantity:</h3>
                            <div className="quantity-controls">
                                <button
                                    id="decrease-quantity"
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) =>
                                        handleQuantityChange(parseInt(e.target.value) || 1)
                                    }
                                />
                                <button
                                    id="increase-quantity"
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <PurchaseActions />
                        <ProductMeta />
                    </div>
                </>
            )}
        </main>
    );
};

const ProductTabs: React.FC = () => {
    const Description = () => {
        return (
            <div id="description" className="tab-content active">
                <h2>Product Description</h2>
                <p>
                    Our Wireless Headphones deliver an exceptional audio experience
                    with advanced features like active noise cancellation to block out
                    distractions, allowing you to focus on your music, podcasts or
                    calls.
                </p>
                <p>
                    The premium build quality ensures durability while the memory foam
                    ear cushions provide comfort for extended listening sessions. With
                    30 hours of battery life, you can enjoy your favorite content all
                    day without needing to recharge.
                </p>
                <p>
                    Compatible with all Bluetooth devices, these headphones also
                    include a detachable cable for wired listening when needed.
                </p>
            </div>
        );
    }

    const Specifications = () => {
        return (
            <div id="specifications" className="tab-content">
                <h2>Technical Specifications</h2>
                <table className="specs-table">
                    <tbody>
                        <tr>
                            <th>Driver Size</th>
                            <td>40mm</td>
                        </tr>
                        <tr>
                            <th>Frequency Response</th>
                            <td>20Hz - 20kHz</td>
                        </tr>
                        <tr>
                            <th>Impedance</th>
                            <td>32 Ohms</td>
                        </tr>
                        <tr>
                            <th>Bluetooth Version</th>
                            <td>5.0</td>
                        </tr>
                        <tr>
                            <th>Battery Life</th>
                            <td>30 hours (ANC on), 40 hours (ANC off)</td>
                        </tr>
                        <tr>
                            <th>Charging Time</th>
                            <td>2 hours</td>
                        </tr>
                        <tr>
                            <th>Weight</th>
                            <td>250g</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    const Reviews = () => {
        const reviews = [
            {
                name: "John D.",
                date: "March 15, 2025",
                rating: 5,
                title: "Excellent sound quality!",
                content:
                    "I've been using these headphones for a month now and I'm impressed with the sound quality and noise cancellation. Battery life is also excellent - I only need to charge once a week with daily use.",
            },
            {
                name: "Emma S.",
                date: "February 28, 2025",
                rating: 4,
                title: "Comfortable but a bit heavy",
                content:
                    "The sound quality is fantastic and I love the noise cancellation feature, but they get a bit heavy after wearing them for a few hours. Overall, still a great purchase for the price!",
            },
            {
                name: "Michael T.",
                date: "March 3, 2025",
                rating: 3.5,
                title: "Good, but could be better",
                content:
                    "The noise cancellation is impressive and the sound quality is good, but the app is a bit buggy. The build quality is solid though, and they're comfortable to wear for long periods.",
            },
        ]

        const ratingPercentages = [65, 25, 8, 2, 0] // The percentages of each rating from 5 to 1 stars

        return (
            <div id="reviews" className="tab-content">
                <h2>Customer Reviews</h2>
                <div className="review-summary">
                    <div className="average-rating">
                        <span className="rating-number">4.5</span>
                        <div className="stars">
                            <StarRating rating={4.5} />
                        </div>
                        <span className="total-reviews">Based on {reviews.length} reviews</span>
                    </div>
                    <div className="rating-breakdown">
                        {ratingPercentages.map((percentage, index) => (
                            <div key={index} className="rating-bar">
                                <span className="rating-level">{5 - index} Star</span>
                                <div className="progress-bar">
                                    <div
                                        className="progress"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="rating-percent">{percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="user-reviews">
                    {reviews.map((review, index) => (
                        <div key={index} className="review">
                            <div className="review-header">
                                <div className="reviewer-name">{review.name}</div>
                                <div className="review-date">{review.date}</div>
                            </div>
                            <div className="review-rating">
                                <StarRating rating={review.rating} />
                            </div>
                            <div className="review-title">{review.title}</div>
                            <div className="review-content">
                                <p>{review.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const Shipping = () => {
        return (
            <div id="shipping" className="tab-content">
                <h2>Shipping & Returns</h2>
                <div className="shipping-info">
                    <h3>Shipping Information</h3>
                    <p>
                        We offer free standard shipping on all orders over $50. Orders
                        typically ship within 1-2 business days of ordering. Delivery
                        times vary by location:
                    </p>
                    <ul>
                        <li>
                            Standard Shipping (Free for orders over $50): 3-5 business
                            days
                        </li>
                        <li>Express Shipping ($10): 2-3 business days</li>
                        <li>
                            Next Day Shipping ($20): 1 business day (order must be placed
                            before 2pm EST)
                        </li>
                    </ul>
                </div>
                <div className="returns-info">
                    <h3>Return Policy</h3>
                    <p>
                        We want you to be completely satisfied with your purchase. If
                        you're not happy with your item, you may return it within 30
                        days of delivery for a full refund or exchange.
                    </p>
                    <p>To be eligible for a return, the item must be:</p>
                    <ul>
                        <li>In the original packaging</li>
                        <li>Unused and in the same condition you received it</li>
                        <li>Accompanied by the original receipt or proof of purchase</li>
                    </ul>
                    <p>
                        Please note that shipping costs for returns are the
                        responsibility of the customer unless the item was received
                        damaged or we sent the wrong item.
                    </p>
                </div>
                <div className="warranty-info">
                    <h3>Warranty</h3>
                    <p>
                        All electronic products come with a standard 1-year
                        manufacturer's warranty covering defects in materials and
                        workmanship. Extended warranty options are available at
                        checkout.
                    </p>
                    <p>
                        For warranty claims, please contact our support team at:
                        <ul>
                            <li>
                                Email:{" "}
                                <a href="mailto:support@shopease.com">
                                    support@shopease.com
                                </a>
                            </li>
                            <li>Phone: 1-800-555-1234</li>
                            <li>
                                Address: 123 ShopEase Lane, Tech City, TX 75001
                            </li>
                        </ul>
                    </p>
                </div>
            </div>
        )
    }

    const handleTabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        const tabId = target.getAttribute("data-tab");

        if (tabId) {
            const tabs = document.querySelectorAll(".tab-content");
            tabs.forEach((tab) => {
                if (tab.id === tabId) {
                    tab.classList.add("active");
                } else {
                    tab.classList.remove("active");
                }
            });

            const buttons = document.querySelectorAll(".tab-btn");
            buttons.forEach((button) => {
                if (button === target) {
                    button.classList.add("active");
                } else {
                    button.classList.remove("active");
                }
            });
        }
    };

    const tabs = {
        "description": "Description",
        "specifications": "Specifications",
        "reviews": "Reviews",
        "shipping": "Shipping & Returns",
    }

    return (
        <div className="product-tabs">
            {Object.entries(tabs).map(([id, name], index) => (
                <button
                    key={index}
                    className={`tab-btn ${index === 0 ? "active" : ""}`}
                    data-tab={id}
                    onClick={handleTabClick}
                >
                    {name}
                </button>
            ))}
            <div className="tabs-content">
                <Description />
                <Specifications />
                <Reviews />
                <Shipping />
            </div>
        </div>
    );
}

const ProductDetail: React.FC = () => {
    const { id } = useParams();

    return (
        <>
            <MainProductDetails productId={id || '1'} /> 
            <ProductTabs />
            <NewsletterForm />
        </>
    );
};

export default ProductDetail;
