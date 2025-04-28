// Main JavaScript for ShopEase

// Global web data
const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "images/category1.jpg",
    description: "Explore the latest in electronics",
    link: "/pages/categories.html#electronics"
  },
  {
    id: 2,
    name: "Clothing",
    image: "images/category2.jpg",
    description: "Discover trendy clothing options",
    link: "/pages/categories.html#clothing"
  },
  {
    id: 3,
    name: "Home & Kitchen",
    image: "images/category3.jpg",
    description: "Upgrade your home and kitchen essentials",
    link: "/pages/categories.html#home"
  },
  {
    id: 4,
    name: "Sports & Outdoors",
    image: "images/category4.jpg",
    description: "Gear up for sports and outdoor adventures",
    link: "/pages/categories.html#sports"
  }
];

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        image: "/images/product1.jpg",
        tag: "Sale",
        originalPrice: 120,
        price: 99.99,
        rating: 4.5,
        ratingCount: 42,
        featured: true,
        categories: [1, 2]
    },
    {
        id: 2,
        name: "Smart Watch",
        image: "/images/product2.jpg",
        tag: null,
        price: 199.99,
        rating: 4,
        ratingCount: 28,
      featured: true,
        categories: [1, 4]
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        image: "/images/product3.jpg",
        tag: "New",
        price: 79.99,
        rating: 3.5,
        ratingCount: 17,
        featured: true,
        categories: [1, 4]
    },
    {
        id: 4,
        name: "Laptop Bag",
        image: "",
        tag: null,
        price: 49.99,
        rating: 5,
        ratingCount: 35,
        featured: true,
        categories: [2, 3]
    },
    {
      id: 5,
      name: "Gaming Mouse",
      image: "/images/product5.jpg",
      tag: "Hot",
      price: 59.99,
      rating: 4.8,
      ratingCount: 50,
      featured: false,
      categories: [1]
    },
    {
      id: 6,
      name: "Portable Charger",
      image: "/images/product6.jpg",
      tag: null,
      price: 29.99,
      rating: 4.2,
      ratingCount: 20,
      featured: false,
      categories: [1, 3]
    },
    {
      id: 7,
      name: "Desk Lamp",
      image: "/images/product7.jpg",
      tag: "Eco",
      price: 39.99,
      rating: 4.6,
      ratingCount: 15,
      featured: false,
      categories: [3]
    }
];

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the site
  initializeSite();

  // Show cart count on load
  updateCartCount();

  // Setup event listeners
  setupEventListeners();
});

// Initialize site functionality
function initializeSite() {
  console.log("ShopEase site initialized");

  const cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", toggleCart);
  }

  // Setup newsletter form
  setupNewsletterForm();
}

// Setup event listeners for the site
function setupEventListeners() {
  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      // Get product details
      const productId = this.dataset.productId;
      const productName = this.dataset.productName;
      const productPrice = this.dataset.productPrice;

      addToCart(productId, productName, productPrice);

      // Show success message
      showMessage("Product added to cart!", "success");
    });
  });

  // Setup mobile menu toggle
}

// Show message to user
function showMessage(message, type) {
  // Create message element
  const messageElement = document.createElement("div");
  messageElement.className = `message ${type}`;
  messageElement.textContent = message;

  // Add to body
  document.body.appendChild(messageElement);

  // Remove after 3 seconds
  setTimeout(() => {
    messageElement.remove();
  });
}

// Setup newsletter form
function setupNewsletterForm() {
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterSuccess = document.getElementById("newsletter-success");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailInput = document.getElementById("newsletter-email");
      const email = emailInput.value;

      // Simulate subscription
      setTimeout(() => {
        emailInput.value = "";
        newsletterSuccess.textContent = "Thank you for subscribing!";
      }, 1000);
    });
  }
}

// Tab navigation for product pages
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.dataset.tab;

      // Remove active class from all tabs and content
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });

      // Add active class to current tab and content
      this.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });
}

// Change main product image when thumbnail is clicked
function changeMainImage(thumbnail) {
  const mainImage = document.getElementById("main-product-img");
  mainImage.src = thumbnail.src;

  // Update active class
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.classList.remove("active");
  });

  thumbnail.classList.add("active");
}

function changeMainImg(thumbnail) {
  // Function intentionally left incomplete
  console.log("Wrong function called");
}

// Other general site functions...
