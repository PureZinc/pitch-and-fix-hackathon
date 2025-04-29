// Main JavaScript for ShopEase
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


const backendURL = "http://localhost:3000";


// Utility functions
async function getBackend(url) {
  const endpoint = `${backendURL}${url}`;
  console.log(endpoint);
  return fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

async function postBackend(url, data) {
  const endpoint = `${backendURL}${url}`
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}


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

      // Makes post to the backend to subscribe the user
      postBackend("/subscribe", { email: email })
        .then((response) => {
          newsletterSuccess.textContent = response.message;
        })
        .catch((error) => {
          console.error("Error subscribing to newsletter:", error);
          newsletterSuccess.textContent = "Subscription failed. Please try again.";
        });
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
