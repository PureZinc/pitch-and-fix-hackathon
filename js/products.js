// Utils
const findRelatedProducts = async (product) => {
  try {
    const products = await getProducts();
    if (!products) {
        console.error("No products found for related products search");
        return [];
    }
    const relatedProducts = products.filter(
        p => p.id !== product.id
        && p.tags.split(', ').some(tag => product.tags.split(', ').includes(tag))
    );
    return relatedProducts.slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

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
    const relatedProductsGrid = document.querySelector(".related-product-grid");
    const wishListProductsGrid = document.querySelector(".wishlist-product-grid");
    const cartProductGrid = document.querySelector(".cart-product-grid")

    // Render subcomponents
    const productQuantity = (product) => product.variants[0].inventory_quantity ? `
        <div class="stock-status in-stock">
            <span class="quantity-label">Quantity:</span>
            <span class="quantity-value">${product.variants[0].inventory_quantity}</span>
        </div>
    ` : '<div class="stock-status out-of-stock">Out of Stock</div>';

    const productRating = (product) => product.rating ? `
        <div class="product-rating">
            ${Array.from({ length: 5 }, (_, i) => i < Math.floor(product.rating) ? '<i class="fas fa-star"></i>' : (i < product.rating ? '<i class="fas fa-star-half-alt"></i>' : '<i class="far fa-star"></i>')).join('')}
            <span class="rating-count">(${product.ratingCount})</span>
        </div>
    ` : "";

    const productTag = (product) => {
        const firstTag = product.tags ? product.tags.split(',')[0] : null;
        return firstTag ? `<div class="product-tag">${firstTag}</div>` : ''
    };

    const productPrice = (product) => `
        <div class="product-price">
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
            <span class="current-price">$${product.variants[0].price}</span>
        </div>
    `

    const productCard = (product) => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image ? product.image.src : '../images/placeholder.jpg'}" alt="${product.title}">
                ${productTag(product)}
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.title}</h3>
                ${productPrice(product)}
                ${productRating(product)}
                ${productQuantity(product)}
                ${product.variants[0].inventory_quantity
                    ? `<button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>`
                    : ''
                }
            </div>
        </div>
    `

    const cardsSkeleton = (count) => {
        return Array.from({ length: count }, () => `
            <div class="product-card skeleton">
                <div class="product-image skeleton"></div>
                <div class="product-details">
                    <h3 class="product-title skeleton"></h3>
                    <div class="product-price skeleton"></div>
                    <div class="product-rating skeleton"></div>
                    <button class="add-to-cart-btn skeleton"></button>
                </div>
            </div>
        `).join('');
    }

    // Fetch products from backend
    if (productGrid) productGrid.innerHTML = cardsSkeleton(4);
    if (featuredProductGrid) featuredProductGrid.innerHTML = cardsSkeleton(4);
    if (relatedProductsGrid) relatedProductsGrid.innerHTML = cardsSkeleton(4);
    if (wishListProductsGrid) wishListProductsGrid.innerHTML = cardsSkeleton(4);

    getProducts().then((products) => {
        if (products) {
            // Render products
            if (productGrid) productGrid.innerHTML = products
                .filter(product => {
                    const tagFilter = window.location.hash.substring(1);
                    if (tagFilter) {
                        const productTags = product.tags.split(', ').map(tag => tag.trim().toLowerCase());
                        return productTags.includes(tagFilter);
                    }
                    return true;
                })
                .map(product => productCard(product)).join('');

            if (featuredProductGrid) featuredProductGrid.innerHTML = products
                .filter(product => {
                    const productTags = product.tags.split(', ');
                    return productTags.includes("featured");
                })
                .map(product => productCard(product)).join('');
            
            if (recentlyViewedGrid) {
                const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
                recentlyViewedGrid.innerHTML = recentlyViewed.map(product => productCard(product)).join('');
            };

            if (relatedProductsGrid) {
                const productId = window.location.hash.substring(1);
                getProductId(productId).then(product => {
                    findRelatedProducts(product).then(relatedProducts => {
                        relatedProductsGrid.innerHTML = relatedProducts.map(product => productCard(product)).join('');
                    });
                });
            }

            if (wishListProductsGrid) {
                const wishListProducts = products.filter(product => isInWishlist(product.id));
                wishListProductsGrid.innerHTML = wishListProducts.map(product => productCard(product)).join('');
            }

            if (cartProductGrid) {
                console.log(cart, products);
                const cartProducts = products.filter(product => cart.some(item => parseInt(item.id) === product.id));
                console.log(cartProducts);
                cartProductGrid.innerHTML = cartProducts.map(product => productCard(product)).join('');
            }

            renderEventListeners();
        } else {
            console.error("No products found");
        }
    });
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
                addToCart(productId, 1);
                return;
            };

            // if product tag is clicked, do not redirect
            if (event.target.classList.contains("product-tag")) {
                const tag = event.target.innerText.toLowerCase();
                window.location.hash = tag;
                window.location.reload();
                return;
            };

            // Link to product detail page
            const productId = this.getAttribute("data-product-id");

            // Add to recently viewed products
            getProductId(productId)
                .then(product => {
                    if (product) {
                        addToRecentlyViewed(product);
                    } else {
                        console.error("Product not found:", productId);
                    }
                    window.location.href = `/pages/product-detail.html#${productId}`;
                })
                .catch(error => console.error("Error fetching product:", error));
        });
    });

    const allProductsButton = document.getElementById('all-products-button');
    if (allProductsButton) allProductsButton.addEventListener('click', function () {
        window.location.href = '/pages/products.html';
    });
}