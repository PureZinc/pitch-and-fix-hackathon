const getBlogs = async () => {
  try {
    const data = await getBackend("/blogs");
    if (!data) {
        console.error("No blogs found");
        return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", function () {
    renderBlogs();
});

function renderBlogs() {
    // Get HTML Elements
    const productGrid = document.querySelector(".product-grid");
    const featuredProductGrid = document.querySelector(".featured-product-grid");
    const recentlyViewedProductGrid = document.querySelector(".recently-viewed-product-grid");

    // Render subcomponents
    const productTag = (product) => {
        const firstTag = product.tags ? product.tags.split(',')[0] : null;
        return firstTag ? `<div class="product-tag">${firstTag}</div>` : '';
    };

    const productCard = (product) => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.title}">
                ${productTag(product)}
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-excerpt">${product.excerpt || ''}</p>
                <a href="/products/${product.id}" class="read-more-btn">Read More</a>
            </div>
        </div>
    `;

    const cardsSkeleton = (count) => {
        return Array.from({ length: count }, () => `
            <div class="product-card skeleton">
                <div class="product-image skeleton"></div>
                <div class="product-details">
                    <h3 class="product-title skeleton"></h3>
                    <p class="product-excerpt skeleton"></p>
                    <a class="read-more-btn skeleton"></a>
                </div>
            </div>
        `).join('');
    };

    // Fetch products from backend
    if (productGrid) productGrid.innerHTML = cardsSkeleton(4);
    if (featuredProductGrid) featuredProductGrid.innerHTML = cardsSkeleton(4);

    getBlogs().then((blogs) => {
        console.log(blogs);
        if (blogs) {
            // Render blogs
            if (productGrid) productGrid.innerHTML = blogs.map(product => productCard(product)).join('');
            if (featuredProductGrid) featuredProductGrid.innerHTML = blogs
                .filter(product => {
                    const productTags = product.tags.split(', ');
                    return productTags.includes("featured");
                })
                .map(product => productCard(product)).join('');
            if (recentlyViewedProductGrid) {
                const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewedProducts")) || [];
                recentlyViewedProductGrid.innerHTML = recentlyViewed.map(product => productCard(product)).join('');
            };
        } else {
            console.error("No products found");
        }
    });
}
