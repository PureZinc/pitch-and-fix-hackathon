// Product handling and cart management

document.addEventListener("DOMContentLoaded", function () {
    renderProducts();
    renderEventListeners();
});

function renderProducts() {
    // Get HTML Elements
    const productGrid = document.querySelector(".product-grid");
    const featuredProductGrid = document.querySelector(".featured-product-grid");
    const recentlyViewedGrid = document.querySelector(".recently-viewed-grid");

    // Render subcomponents
    const productRating = (product) => `
        <div class="product-rating">
            ${Array.from({ length: 5 }, (_, i) => i < Math.floor(product.rating) ? '<i class="fas fa-star"></i>' : (i < product.rating ? '<i class="fas fa-star-half-alt"></i>' : '<i class="far fa-star"></i>')).join('')}
            <span class="rating-count">(${product.ratingCount})</span>
        </div>
    `

    const productTag = (product) => product.tag ? `<div class="product-tag">${product.tag}</div>` : '';

    const productPrice = (product) => `
        <div class="product-price">
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
            <span class="current-price">$${product.price}</span>
        </div>
    `

    const productCard = (product) => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}">
                ${productTag(product)}
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                ${productPrice(product)}
                ${productRating(product)}
                <button class="add-to-cart-btn" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">Add to Cart</button>
            </div>
        </div>
    `

    // Render products
    if (productGrid) productGrid.innerHTML = products.map(product => productCard(product)).join('');
    if (featuredProductGrid) featuredProductGrid.innerHTML = products.filter(product => product.featured).map(product => productCard(product)).join('');
    if (recentlyViewedGrid) {
        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        recentlyViewedGrid.innerHTML = recentlyViewed.map(product => productCard(product)).join('');
    }
}


function renderEventListeners() {
    function addToRecentlyViewed(product) {
        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        if (!recentlyViewed.some(p => p.id === product.id)) {
            if (recentlyViewed.length >= 4) recentlyViewed.shift(); // Remove the oldest item to maintain max length of 4
            recentlyViewed.push(product);
            localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
        }
    }

    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach(card => {
        card.addEventListener("click", function (event) {
            // if add-to-cart-btn is clicked, do not redirect
            if (event.target.classList.contains("add-to-cart-btn")) {
                // Instead, add to cart and return
                const product = this.querySelector(".add-to-cart-btn");
                const productId = product.getAttribute("data-product-id");
                const productName = product.getAttribute("data-product-name");
                const productPrice = parseFloat(product.getAttribute("data-product-price"));
                addToCart(productId, productName, productPrice);
                return;
            };

            // Link to product detail page
            const productId = this.querySelector(".add-to-cart-btn").getAttribute("data-product-id");
            window.location.href = `/pages/product-detail.html#${productId}`;
            

            // Add to recently viewed products
            const product = products.find(p => p.id == productId);
            if (product) {
                addToRecentlyViewed(product);
            }
        });
    });
}