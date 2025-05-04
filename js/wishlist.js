//  Wishlist belongs as LocalStorage
//  Wishlist is a list of products that the user wants to buy in the future

let wishList = []  // List of product IDs

function loadWishList() {
    const wishlist = localStorage.getItem('wishlist');
    if (wishlist) {
        wishList = JSON.parse(wishlist);
    } else {
        wishList = [];
    }
}

function saveWishList() {
    localStorage.setItem('wishlist', JSON.stringify(wishList));
}

function addToWishlist(productId) {
    productId = productId.toString(); // Ensure productId is a string
    if (!wishList.some(itemId => itemId === productId)) {
        wishList.push(productId);
        saveWishList();
    }
}

function removeFromWishlist(productId) {
    productId = productId.toString(); // Ensure productId is a string
    wishList = wishList.filter(itemId => itemId !== productId);
    saveWishList();
} 

function clearWishlist() {
    wishList = [];
    saveWishList();
}

function isInWishlist(productId) {
    productId = productId.toString(); // Ensure productId is a string
    return wishList.some(itemId => itemId === productId);
}

document.addEventListener("DOMContentLoaded", function () {
    loadWishList();
});