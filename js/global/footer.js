const Footer = document.querySelector('footer');

const footerLinks = [
    {
        title: "Shop",
        links: [
            { text: "All Products", url: "/pages/products.html" },
            { text: "Categories", url: "/pages/categories.html" },
            { text: "Deals", url: "/pages/deals.html" },
            { text: "New Arrivals", url: "/pages/new-arrivals.html" }
        ]
    },
    {
        title: "Customer Service",
        links: [
            { text: "Contact Us", url: "/pages/contact.html" },
            { text: "FAQ", url: "/pages/faq.html" },
            { text: "Shipping & Returns", url: "/pages/shipping.html" },
            { text: "Terms & Conditions", url: "/pages/terms.html" }
        ]
    },
    {
        title: "About Us",
        links: [
            { text: "Our Story", url: "/pages/about.html" },
            { text: "Blog", url: "/pages/blog.html" },
            { text: "Careers", url: "/pages/careers.html" },
            { text: "Partners", url: "/pages/partners.html" }
        ]
    },
    {
        title: "Follow Us",
        links: [
            { text: "Facebook", iconClassName:"fab fa-facebook-f", url:"#"},
            { text: "Twitter", iconClassName:"fab fa-twitter", url:"#"},
            { text: "Instagram", iconClassName:"fab fa-instagram", url:"#"},
            { text: "Pinterest", iconClassName:"fab fa-pinterest", url:"#"},
        ]
    }
];

function mountFooter() {
    Footer.innerHTML = `
        <div class="footer-columns">
            ${footerLinks.map(column => `
                <div class="footer-column">
                    <h3>${column.title}</h3>
                    <ul>
                        ${column.links.map(link => `
                            <li><a href="${link.url}">${link.iconClassName ? `<i class="${link.iconClassName}"></i>` : ''}${link.text}</a></li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 ShopEase. All Rights Reserved.</p>
        </div>
    `;
}

mountFooter();