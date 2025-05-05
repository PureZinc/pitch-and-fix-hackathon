type FooterLink = 
    | { text: string; url: string }
    | { text: string; iconClassName: string; url: string };

const footerLinks: { title: string; links: FooterLink[] }[] = [
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
            { text: "Facebook", iconClassName: "fab fa-facebook-f", url: "#" },
            { text: "Twitter", iconClassName: "fab fa-twitter", url: "#" },
            { text: "Instagram", iconClassName: "fab fa-instagram", url: "#" },
            { text: "Pinterest", iconClassName: "fab fa-pinterest", url: "#" },
        ]
    }
];

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="footer-columns">
                {footerLinks.map((column, index) => (
                    <div className="footer-column" key={index}>
                        <h3>{column.title}</h3>
                        <ul>
                            {column.links.map((link, linkIndex) => (
                                <li key={linkIndex}>
                                    <a href={link.url}>
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 ShopEase. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;