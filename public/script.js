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

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const productGrid = document.querySelector('.product-grid');
const cartCount = document.querySelector('.cart-count');

// Cursor Elements
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    initCursor();
    initScrollAnimations();
});

// Render Products
function renderProducts() {
    productGrid.innerHTML = products.map((product, index) => `
        <div class="product-card" style="transition-delay: ${index * 100}ms">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/400x500/1a1a1a/FFF?text=T-Shirt'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <span class="product-price">$${product.price}</span>
                <button class="add-to-cart magnetic" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');

    // update interactions for new elements
    updateMagneticElements();
}

// Custom Cursor Logic
function initCursor() {
    if (window.innerWidth < 768) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower using basic lerp
    setInterval(() => {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;

        follower.style.left = posX + 'px';
        follower.style.top = posY + 'px';
    }, 15);

    updateMagneticElements();
}

function updateMagneticElements() {
    const magneticEls = document.querySelectorAll('.magnetic, a, button');

    magneticEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            follower.style.transform = 'translate(-50%, -50%) scale(0)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Scroll Animations (Intersection Observer)
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.section-title, .product-card');
    elements.forEach(el => observer.observe(el));
}

// Add to Cart
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Temporary success state on button
    const btn = event.target;
    btn.innerText = "ADDED";
    btn.style.background = "white";
    btn.style.color = "black";

    setTimeout(() => {
        btn.innerText = "ADD TO CART";
        btn.style.background = "";
        btn.style.color = "";
    }, 1000);
};

function updateCartCount() {
    cartCount.innerText = cart.length;
    cartCount.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.5)' },
        { transform: 'scale(1)' }
    ], {
        duration: 300
    });
}
