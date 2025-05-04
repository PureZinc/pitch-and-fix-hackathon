//  Wishlist belongs as LocalStorage
//  Wishlist is a list of products that the user wants to buy in the future

let wishList = []

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
    if (!wishList.some(itemId => itemId === productId)) {
        wishList.push(productId);
        saveWishList();
    }
}

function removeFromWishlist(productId) {
    wishList = wishList.filter(itemId => itemId !== productId);
    saveWishList();
} 

function clearWishlist() {
    wishList = [];
    saveWishList();
}

function isInWishlist(productId) {
    return wishList.some(itemId => itemId === productId);
}


document.addEventListener("DOMContentLoaded", function () {
  loadWishList();
});