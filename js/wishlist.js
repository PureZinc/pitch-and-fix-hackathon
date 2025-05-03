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

function addToWishlist(product) {
    if (!wishList.some(item => item.id === product.id)) {
        wishList.push(product);
        saveWishList();
    }
}

function removeFromWishlist(productId) {
    wishList = wishList.filter(item => item.id !== productId);
    saveWishList();
} 

function clearWishlist() {
    wishList = [];
    saveWishList();
}

function isInWishlist(productId) {
    return wishList.some(item => item.id === productId);
}


document.addEventListener("DOMContentLoaded", function () {
  loadWishList();
});