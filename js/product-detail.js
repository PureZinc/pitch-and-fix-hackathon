// Product Detail Page Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Render product details
  renderProductDetails();

  // Initialize product detail functionality
  initializeProductDetail();

  // Setup tab navigation
  setupTabNavigation();
});

// Initialize product detail functionality
function initializeProductDetail() {
  console.log("Product detail page initialized");

  // Setup thumbnail gallery
  setupThumbnailGallery();
}

// Setup thumbnail gallery
function setupThumbnailGallery() {
  const thumbnails = document.querySelectorAll(".thumbnail");

  thumbnails.forEach((thumbnail) => {});
}

// Setup Values
let productStock = 0  // Initialize product stock
function renderProductDetails() {
  const productIdHash = window.location.hash;
  const productId = productIdHash.substring(1);

  getBackend(`/products/${productId}`).then((product) => {
    if (product) {
      productStock = product.variants[0].inventory_quantity;
      mountComponents(product);
    } else {
      console.error("Product not found");
    }
  });
  
  const mountComponents = (productDetails) => {
    const productImageComponent = (product) => `
        <div class="main-image">
            <img
                id="main-product-img"
                src="${product.image ? product.image.src : ''}"
                alt="${product.title}"
            />
        </div>
        `;
    
    const productRatingComponent = (product) => `
        ${`<i class="fas fa-star"></i>`.repeat(4)}
        ${`<i class="fas fa-star-half-alt"></i>`}
        <span class="rating-count">(42 reviews)</span>
      `;

    const productImage = document.querySelector(".product-images");
    productImage.innerHTML = productImageComponent(productDetails);

    const productInfo = document.querySelector(".product-info");

    const productPrice = productInfo.querySelector(".product-price");

    productInfo.querySelector(".product-title").textContent = productDetails.title;

    productPrice.querySelector(".sale-price").textContent = `$${productDetails.variants[0].price}`;

    productInfo.querySelector(".product-description").innerHTML = productDetails.body_html;
    productInfo.querySelector(".product-rating").innerHTML = productRatingComponent(productDetails);

    setupPurchaseActions(productDetails);
    setupProductMeta(productDetails);
    setupQuantityControls();
  }
}

// Setup tab navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Get tab id from data attribute
      const tabId = this.getAttribute("data-tab");

      // Remove active class from all buttons and content
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to current button and content
      this.classList.add("active");

      const activeContent = document.getElementById(tabId);
      activeContent.classList.add("active");
    });
  });
}

// Setup quantity controls
function setupQuantityControls() {
  const decreaseBtn = document.getElementById("decrease-quantity");
  const increaseBtn = document.getElementById("increase-quantity");
  const quantityInput = document.getElementById("quantity");

  const stock = productStock;

  if (decreaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  }

  if (increaseBtn && quantityInput) {
    increaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue < productStock) {
        quantityInput.value = currentValue + 1;
      }
    });
  }

  if (quantityInput) {
    quantityInput.addEventListener("change", function () {
      // Ensure value is at least 1
      if (this.value < 1) {
        this.value = 1;
      }

      // Ensure value is not greater than stock
      if (this.value > stock) {
        this.value = stock;
      }
    });
  }
}

// Show add to cart success message
function showAddToCartMessage() {
  // Create message element
  const messageElement = document.createElement("div");
  messageElement.className = "add-to-cart-message";
  messageElement.textContent = "Product added to cart!";

  // Add to body
  document.body.appendChild(messageElement);

  // Show message
  setTimeout(() => {
    messageElement.classList.add("show");
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    messageElement.classList.remove("show");

    // Remove from DOM after animation
    setTimeout(() => {
      messageElement.remove();
    }, 300);
  });
}

function setupPurchaseActions(product) {
  const purchaseActions = document.getElementById("purchase-actions");

  purchaseActions.innerHTML = productStock > 0 ? `
    <button
      id="add-to-cart"
      class="add-to-cart-btn"
      data-product-id="${product.id}"
    >
      Add to Cart
    </button>
    <button id="buy-now" class="buy-now-btn">Buy Now</button>
    <button
      id="add-to-wishlist"
      class="wishlist-btn"
      data-product-id="${product.id}"
    >
      ${
        isInWishlist(product.id)
          ? `<i class="fas fa-heart"></i><span>Remove from Wishlist</span>`
          : `<i class="far fa-heart"></i><span>Add to Wishlist</span>`
      }
    </button>
  ` : ''

  const addToCartButton = purchaseActions.querySelector("#add-to-cart");
  const buyNowButton = purchaseActions.querySelector("#buy-now");
  const addToWishlistButton = purchaseActions.querySelector("#add-to-wishlist");

  addToCartButton.addEventListener("click", function () {
    const productId = this.dataset.productId;
    const quantity = parseInt(document.getElementById("quantity").value);

    // Add to cart logic here
    addToCart(productId, quantity);
    showAddToCartMessage();
  });

  addToWishlistButton.addEventListener("click", function () {
    const productId = this.dataset.productId;

    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      this.innerHTML = `<i class="far fa-heart"></i><span>Add to Wishlist</span>`;
    } else {
      addToWishlist(productId);
      this.innerHTML = `<i class="fas fa-heart"></i><span>Remove from Wishlist</span>`;
    }
  });
}

function setupProductMeta(product) {
  const productMeta = document.querySelector(".product-meta");

  const stock = productStock;
  const SKU = product.variants[0].sku || "WH-100-BLK";
  const tags = product.tags || "Audio, Headphones";
  const categories = tags.split(", ");

  const stockStatus = stock > 0 ? `<strong>${stock}</strong> In Stock` : "Out of Stock";
  const stockClass = stock > 0 ? "in-stock" : "out-of-stock";

  productMeta.innerHTML = `
    <p class="stock-status ${stockClass}">${stockStatus}</p>
    <p class="sku">SKU: ${SKU}</p>
    <p class="categories">
      Categories: ${categories.map(cat => cat !== 'featured' ? `<a href="/pages/products.html#${cat.toLowerCase()}">${cat}</a>` : '').join('')}
    </p>
  `;
}