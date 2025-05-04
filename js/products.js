// Utils
const getProducts = async () => {
  try {
    const data = await getBackend("/products");
    if (!data) {
        console.error("No products found");
        return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

const getProductId = async (id) => {
  try {
    const data = await getBackend(`/products/${id}`);
    if (!data) {
        console.error("No product found with ID:", id);
        return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

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

    // Render subcomponents
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
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.title}">
                ${productTag(product)}
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.title}</h3>
                ${productPrice(product)}
                ${productRating(product)}
                <button class="add-to-cart-btn" data-product-id="${product.id}" data-product-name="${product.title}" data-product-price="${product.variants[0].price}">Add to Cart</button>
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

    getProducts().then((products) => {
        if (products) {
            // Render products
            if (productGrid) productGrid.innerHTML = products.map(product => productCard(product)).join('');

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
                const productName = product.getAttribute("data-product-name");
                const productPrice = parseFloat(product.getAttribute("data-product-price"));
                addToCart(productId, productName, productPrice);
                return;
            };

            // Link to product detail page
            const productId = this.querySelector(".add-to-cart-btn").getAttribute("data-product-id");

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
}