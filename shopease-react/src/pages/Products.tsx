import ProductGrid from "../components/ProductGrid";

const Products = () => {
    return (
        <main>
            <section className="products">
                <h1>Products <button id="all-products-button">All</button></h1>
                <ProductGrid filter={null} />
            </section>
        </main>
    );
}

export default Products;