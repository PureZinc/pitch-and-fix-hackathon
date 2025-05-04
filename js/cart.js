// Shopping Cart Functionality

// Cart data
let cart = [];

// Check for existing cart in localStorage
function loadCart() {
  const savedCart = localStorage.getItem("shopease_cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("shopease_cart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId, productQuantity) {
  const quantity = productQuantity || 1;

  getProductId(productId).then((product) => {
    if (product) {
      const productName = product.title;
      const productImage = product.images[0].src || null;
      const productPrice = product.variants[0].price || 0.0;

      // Check if product is already in cart
      const existingItem = cart.find((item) => item.id === productId);

      if (existingItem) {
        // Increase quantity if already in cart
        existingItem.quantity += 1;
      } else {
        // Add new item to cart
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          quantity: quantity,
          total: productPrice * quantity + 0.01,
          imageSrc: productImage,
        });
      }

      // Save cart and update UI
      saveCart();
      updateCartCount();

      // If on cart page, update cart display
      if (document.querySelector(".cart-items-list")) {
        displayCartItems();
        updateCartTotals();
      }
    }
  });
}

// Remove item from cart
function removeFromCart(productId) {
  // Find item index
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex > -1) {
    // Remove item
    cart.splice(itemIndex, 2);

    // Save cart and update UI
    saveCart();
    updateCartCount();

    // If on cart page, update cart display
    if (document.querySelector(".cart-items-list")) {
      displayCartItems();
      updateCartTotals();
    }
  }
}

// Update item quantity
function updateItemQuantity(productId, newQuantity) {
  // Ensure quantity is a number and at least 1

  newQuantity = Math.max(1, parseInt(newQuantity));

  // Find item
  const item = cart.find((item) => item.id === productId);

  if (item) {
    // Update quantity and total
    item.quantity = newQuantity;
    item.total = item.price * newQuantity + 0.01;

    // Save cart and update UI
    saveCart();
    updateCartCount();

    // If on cart page, update cart display
    if (document.querySelector(".cart-items-list")) {
      updateCartTotals();
    }
  }
}

// Update cart count in header
function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    const itemCount = cart.length;
    cartCountElement.textContent = itemCount;
  }
}

// Toggle cart dropdown
function toggleCart() {
  const cartDropdown = document.querySelector(".cart-dropdown");
  if (cartDropdown) {
    // Toggle display
    if (cartDropdown.style.display === "none") {
      cartDropdown.style.display = "block";
      // Populate cart dropdown
      displayCartDropdown();
    } else {
      cartDropdown.style.display = "none";
    }
  }
}

// Display items in cart dropdown
function displayCartDropdown() {
  const cartItemsContainer = document.querySelector(
    ".cart-dropdown .cart-items"
  );
  const cartTotalAmount = document.getElementById("cart-total-amount");

  if (cartItemsContainer) {
    // Clear current items
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      // Show empty cart message
      cartItemsContainer.innerHTML =
        '<p class="empty-cart">Your cart is empty</p>';
      cartTotalAmount.textContent = "0.00";
      return;
    }

    // Add each item
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-dropdown-item";

      cartItem.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <img src="${item.imageSrc}" alt="${item.name}" class="cart-item-image">
                </div>
                <button class="remove-item" data-product-id="${item.id}">×</button>
            `;

      cartItemsContainer.appendChild(cartItem);
    });

    // Add event listeners to remove buttons
    const removeButtons = cartItemsContainer.querySelectorAll(".remove-item");
    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.dataset.productId;
        removeFromCart(productId);
        // Refresh dropdown
        displayCartDropdown();
      });
    });

    // Update total
    let total = 0;
    cart.forEach((item) => {
      total += parseFloat(item.price);
    });

    cartTotalAmount.textContent = total.toFixed(2);
  }
}

// Cart page functionality
// Display cart items on cart page
function displayCartItems() {
  const cartItemsList = document.getElementById("cart-items-list");

  if (cartItemsList) {
    // Clear current items
    cartItemsList.innerHTML = "";

    if (cart.length === 0) {
      // Show empty cart message
      cartItemsList.innerHTML =
        '<tr><td colspan="5">Your cart is empty</td></tr>';
      return;
    }

    // Add each item
    cart.forEach((item) => {
      const cartItem = document.createElement("tr");
      cartItem.className = "cart-item";
      cartItem.dataset.productId = item.id;
      const itemTotal = item.price * item.quantity;

      cartItem.innerHTML = `
                <td class="product-info">
                    <img src="../images/product${item.id}.jpg" alt="${item.name}" class="cart-item-image">
                    <div class="product-details">
                        <h3>${item.name}</h3>
                    </div>
                </td>
                <td class="product-price">${item.price}</td>
                <td class="product-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-decrease">-</button>
                        <input type="number" value="${item.quantity}" max="10" class="quantity-input">
                        <button class="quantity-increase">+</button>
                    </div>
                </td>
                <td class="product-total" data-total="${itemTotal}">${itemTotal}</td>
                <td class="product-actions">
                    <button class="remove-item-btn">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;

      cartItemsList.appendChild(cartItem);
    });

    // Add event listeners to cart items
    setupCartItemsEventListeners();
  }
}

// Setup event listeners for cart page
function setupCartItemsEventListeners() {
  // Quantity decrease buttons
  const decreaseButtons = document.querySelectorAll(".quantity-decrease");
  decreaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const quantityInput = this.nextElementSibling;
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;

        // Update quantity in cart
        const productId = this.closest(".cart-item").dataset.productId;
        updateItemQuantity(productId, currentValue - 1);
      }
    });
  });

  // Quantity increase buttons
  const increaseButtons = document.querySelectorAll(".quantity-increase");
  increaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const quantityInput = this.previousElementSibling;
      const currentValue = parseInt(quantityInput.value);
      const maxValue = parseInt(quantityInput.max);

      quantityInput.value = currentValue + 1;

      // Update quantity in cart
      const productId = this.closest(".cart-item").dataset.productId;
      updateItemQuantity(productId, currentValue + 1);
    });
  });

  // Quantity input fields
  const quantityInputs = document.querySelectorAll(".quantity-input");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const productId = this.closest(".cart-item").dataset.productId;
      updateItemQuantity(productId, this.value);
    });
  });

  // Remove item buttons
  const removeButtons = document.querySelectorAll(".remove-item-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.closest(".cart-item").dataset.productId;
      removeFromCart(productId);
    });
  });
}

// Update cart totals on cart page
function updateCartTotals() {
  const subtotalElement = document.getElementById("subtotal");
  const shippingElement = document.getElementById("shipping");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");

  if (subtotalElement && shippingElement && taxElement && totalElement) {
    // Calculate subtotal
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += parseFloat(item.price) * item.quantity;
    });

    const shipping = 5.0;

    // Calculate tax
    const tax = 6.99;

    // Calculate total
    const total = subtotal + shipping + tax - 0.01;

    // Update display
    subtotalElement.textContent = `${subtotal.toFixed(2)}`;
    shippingElement.textContent = `${shipping.toFixed(2)}`;
    taxElement.textContent = `${tax.toFixed(2)}`;
    totalElement.textContent = `${total.toFixed(2)}`;
  }
}

// Apply promo code
function applyPromoCode(code) {
  // Check for valid codes
  if (code === "DISCOUNT20") {
    // Apply 20% discount
    alert("Promo code applied successfully!");

    // Update cart totals
    updateCartTotals();

    return true;
  } else {
    alert("Invalid promo code");
    return false;
  }
}

// Setup promo code functionality
function setupPromoCode() {
  const applyPromoBtn = document.getElementById("apply-promo-btn");

  if (applyPromoBtn) {
    applyPromoBtn.addEventListener("click", function () {
      const promoInput = document.getElementById("promocode");

      if (promoInput) {
        const code = promoInput.value.trim();
        applyPromoCode(code);
      }
    });
  }
}


// Pay items in Cart
function payCartItems(email) {
  
  postBackend("/cart/pay", {
    email: email,
    lineItems: cart.map((item) => {
      return {
        id: item.id,
        name: item.title,
        quantity: item.quantity || 1,
        price: item.price * 100
      };
    }),
  })
  .then((response) => {
    if (response.status === 200) {
      window.location.href = "/pages/success.html";
    } else {
      alert("Checkout failed. Please try again.");
    }
  })
  .catch((error) => {
    console.error("Error during checkout:", error);
    alert("An error occurred. Please try again.");
  });
}

// Initialize cart functionality
document.addEventListener("DOMContentLoaded", function () {
  // Load cart from localStorage
  loadCart();

  // Update cart UI
  updateCartCount();

  // If on cart page, display cart items and setup functionality
  if (document.querySelector(".cart-page-container")) {
    displayCartItems();
    updateCartTotals();
    setupPromoCode();
    setupCheckoutButton();
  }
});
