const products = [
    {
        id: 1,
        name: "Neon Cybernetic Pro",
        price: 49.99,
        image: "./images/tshirt_black_design.png"
    },
    {
        id: 2,
        name: "Abstract Minimal",
        price: 39.99,
        image: "./images/tshirt_white_minimal.png"
    },
    {
        id: 3,
        name: "Urban Streetwear V2",
        price: 54.99,
        image: "./images/tshirt_blue_streetwear.png"
    }
];

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const cartCount = document.querySelector('.cart-count');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// Render Products
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card glass">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/400x500/1a1a1a/FFF?text=T-Shirt'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to Cart Logic
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Animation feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Added!";
    btn.style.background = "hsl(var(--secondary))";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
    }, 1000);
};

function updateCartCount() {
    cartCount.innerText = cart.length;

    // Bounce animation
    cartCount.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}
