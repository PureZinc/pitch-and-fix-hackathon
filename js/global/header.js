const Header = document.querySelector('header');


function mountHeader() {

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/pages/products.html' },
        { name: 'Categories', href: '/pages/categories.html' },
        { name: 'Blog', href: '/pages/blog.html' },
        { name: 'Contact', href: '/pages/contact.html' }
    ]

    Header.innerHTML = `
        <div class="logo-container">
            <img
                src="../images/ShopEase-logo.svg"
                alt="ShopEase Logo"
                class="logo"
            />
        </div>
        <nav class="main-nav">
            <ul id="nav-items">
                ${navLinks.map(link => `<li class="nav-item"><a href="${link.href}">${link.name}</a></li>`).join('')}
            </ul>
        </nav>
        <div class="cart-container">
            <div class="cart-icon">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count">0</span>
            </div>
            <div class="cart-dropdown" style="display: none">
                <div class="cart-items"></div>
                <div class="cart-total">
                    <p>Total: $<span id="cart-total-amount">0.00</span></p>
                </div>
                <button class="checkout-btn">Checkout</button>
            </div>
        </div>
    `;
}

mountHeader();