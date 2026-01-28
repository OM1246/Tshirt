/**
 * app.js
 * Global logic: Navbar, Cart Count, Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
});

function initNavbar() {
    const nav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

function updateCartCount() {
    const cart = Store.getCart(); // From store.js
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}


