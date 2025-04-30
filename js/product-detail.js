// Product Detail Page Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Render product details
  renderProductDetails();

  // Initialize product detail functionality
  initializeProductDetail();

  // Setup tab navigation
  setupTabNavigation();

  // Setup quantity controls
  setupQuantityControls();

  // Setup add to cart button
  setupAddToCart();

  // Setup color selection
  setupColorSelection();
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
function renderProductDetails() {
  const productIdHash = window.location.hash;
  const productId = productIdHash.substring(1);

  getBackend(`/products/${productId}`).then((product) => {
    if (product) {
      mountComponents(product);
    } else {
      console.error("Product not found");
    }
  });
    
  const productDetail = {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    originalPrice: 120.0,
    discount: 17,
    description:
      "Experience crystal clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design for all-day listening.",
    features: [
      "Active noise cancellation",
      "Bluetooth 5.0 connectivity",
      "30-hour battery life",
      "Comfortable memory foam ear cushions",
      "Built-in microphone for calls",
      "Quick charging (3 hours playback from 15 minutes charge)",
    ],
    colors: [
      { name: "black", colorCode: "#000" },
      { name: "white", colorCode: "#fff", border: "1px solid #ddd" },
      { name: "blue", colorCode: "#0078d4" },
    ],
    stockStatus: "In Stock",
    sku: "WH-100-BLK",
    categories: [
      { name: "Electronics", link: "categories.html#electronics" },
      { name: "Audio", link: "categories.html#audio" },
    ],
    images: [
      { src: "../images/product1.jpg", alt: "Wireless Headphones - Front" },
      { src: "../images/product1-side.jpg", alt: "Wireless Headphones - Side" },
      { src: "../images/product1-back.jpg", alt: "Wireless Headphones - Back" },
      { src: "../images/product1-case.jpg", alt: "Wireless Headphones - Case" },
    ],
  };

  const mountComponents = (productDetails) => {
    const productImageComponent = (product) => `
        <div class="main-image">
            <img
                id="main-product-img"
                src="${product.image}"
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
    productInfo.querySelector(".product-title").textContent = productDetails.title;
    productInfo.querySelector(".product-price .sale-price").textContent = `$${productDetails.variants[0].price}`;
    productInfo.querySelector(".product-description").innerHTML = productDetails.body_html;
    productInfo.querySelector(".product-rating").innerHTML = productRatingComponent(productDetails);

    const addToCartButton = productInfo.querySelector(".purchase-actions button");
    addToCartButton.dataset.productId = productDetails.id;
    addToCartButton.dataset.productName = productDetails.title;
    addToCartButton.dataset.productPrice = productDetails.variants[0].price;
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
      quantityInput.value = currentValue + 1;
    });
  }

  if (quantityInput) {
    quantityInput.addEventListener("change", function () {
      // Ensure value is at least 1
      if (this.value < 1) {
        this.value = 1;
      }
    });
  }
}

// Setup add to cart button
function setupAddToCart() {
  const addToCartBtn = document.getElementById("add-to-cart");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      // Get product details
      const productId = this.dataset.productId;
      const productName = this.dataset.productName;
      const productPrice = this.dataset.productPrice;

      // Get selected color
      const selectedColor = getSelectedColor();

      // Get quantity
      const quantity = parseInt(document.getElementById("quantity").value);

      // Add to cart
      addToCart(productId, productName, productPrice);

      // Show success message
      showAddToCartMessage();
    });
  }
}

// Get selected color
function getSelectedColor() {
  const selectedColorElement = document.querySelector(".color-option.selected");

  if (selectedColorElement) {
    return selectedColorElement.dataset.color;
  }

  return null;
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

// Setup color selection
function setupColorSelection() {
  const colorOptions = document.querySelectorAll(".color-option");

  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      colorOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      this.classList.add("selected");
    });
  });
}
