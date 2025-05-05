import NewsletterForm from "../components/newsletterForm";
import ProductGrid from "../components/ProductGrid";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to ShopEase</h1>
                    <p>Find the best products at the best prices</p>
                    <Link to="/products" className="cta-button">
                        Shop Now
                    </Link>
                </div>
            </section>

            <section className="featured-products">
                <h2>Featured Products</h2>
                <ProductGrid filter="featured" />
            </section>

            <section className="categories">
                <h2>Shop by Category</h2>
                <div className="category-grid"></div>
            </section>

            <NewsletterForm />
        </>
    );
};

export default Home;
