import { Link } from "react-router-dom";

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
            <div className="cart-container">
            <div className="cart-icon">
                <i className="fas fa-shopping-cart"></i>
                <span className="cart-count">0</span>
            </div>
            <div className="cart-dropdown" style={{ display: 'none' }}>
                <div className="cart-items"></div>
                <div className="cart-total">
                <p>
                    Total: $<span id="cart-total-amount">0.00</span>
                </p>
                </div>
                <Link to="/checkout">
                    <button id="checkout-btn" className="checkout-btn">
                        Checkout
                    </button>
                </Link>
            </div>
            </div>
        </header>
    );
};

export default Header;