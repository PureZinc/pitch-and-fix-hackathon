// Product handling and cart management

document.addEventListener("DOMContentLoaded", function () {
    renderProducts();
    renderEventListeners();
});

function renderProducts() {
    // Get HTML Elements
    const productGrid = document.querySelector(".product-grid");
    const featuredProductGrid = document.querySelector(".featured-product-grid");

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
}


function renderEventListeners() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.getAttribute("data-product-id");
            const productName = this.getAttribute("data-product-name");
            const productPrice = parseFloat(this.getAttribute("data-product-price"));
            addToCart(productId, productName, productPrice);
        });
    });

    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach(card => {
        card.addEventListener("click", function () {
            const productId = this.querySelector(".add-to-cart-btn").getAttribute("data-product-id");
            window.location.href = `pages/product-detail.html#${productId}`;
        });
    });
}