import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../services/cartService";
import { useNavigate } from "react-router-dom";


const Cart: React.FC = () => {
    const [cartOpen, setCartOpen] = useState(false);

    const cartContext = useCart();
    const { cart, removeFromCart } = cartContext;
    const nav = useNavigate();

    const CartDropdown: React.FC = () => {
        const goToCheckout = () => {
            nav("/checkout");
            setCartOpen(false);
        }
        
        return (
            <div className="cart-dropdown">
                <div className="cart-items">
                    {cart.length === 0 ? (
                        <p className="empty-cart">Your cart is empty</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="cart-dropdown-item">
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p>${item.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <img
                                        src={item.imageSrc}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />
                                </div>
                                <button onClick={() => removeFromCart(item.id)}>×</button>
                            </div>
                        ))
                    )}
                </div>
                <div className="cart-total">
                    Total: $
                    {cart.reduce((total, item) => total + item.total, 0).toFixed(2)}
                </div>
                <button id="checkout-btn" className="checkout-btn" onClick={goToCheckout}>
                    Checkout
                </button>
            </div>
        );
    };

    return (
        <div className="cart-container">
            <div className="cart-icon" onClick={() => setCartOpen(!cartOpen)}>
                <i className="fas fa-shopping-cart"></i>
                <span className="cart-count">{ cart.length }</span>
            </div>
            {cartOpen && <CartDropdown />}
        </div>
    );
}


const Header: React.FC = () => {
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Wishlist', href: '/wishlist' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header>
            <div className="logo-container">
                <img
                    src="/ShopEase-logo.svg"
                    alt="ShopEase Logo"
                    className="logo"
                />
            </div>
            <nav className="main-nav">
                <ul id="nav-items">
                    {navLinks.map((link, index) => (
                    <li key={index} className="nav-item">
                        <Link to={link.href}>{link.name}</Link>
                    </li>
                    ))}
                </ul>
            </nav>
            <Cart />
        </header>
    );
};

export default Header;