/**
 * product-detail.js
 * Handles the single product view logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    const product = Store.getProductById(productId);
    if (!product) {
        const container = document.querySelector('.product-details-layout') || document.querySelector('main.container');
        if (container) container.innerHTML = '<h2 style="text-align:center">Product Not Found</h2>';
        return;
    }

    renderProduct(product);

    // Set up Add to Cart
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        addToCart(product);
    });
});

function renderProduct(product) {
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-desc').textContent = product.description;

    const imgElement = document.getElementById('main-image');
    imgElement.src = product.image;
    imgElement.onerror = function () {
        this.src = 'https://via.placeholder.com/600x600?text=No+Image';
    };

    // Colors
    const colorContainer = document.getElementById('color-options');
    product.colors.forEach((color, index) => {
        const btn = document.createElement('button');
        btn.className = `option-btn ${index === 0 ? 'active' : ''}`;
        btn.dataset.value = color;
        btn.textContent = color;
        btn.onclick = () => selectOption('color', btn);
        colorContainer.appendChild(btn);
    });

    // Sizes
    const sizeContainer = document.getElementById('size-options');
    product.sizes.forEach((size, index) => {
        const btn = document.createElement('button');
        btn.className = `option-btn ${index === 0 ? 'active' : ''}`;
        btn.dataset.value = size;
        btn.textContent = size;
        btn.onclick = () => selectOption('size', btn);
        sizeContainer.appendChild(btn);
    });
}

function selectOption(type, btn) {
    const container = type === 'color' ? document.getElementById('color-options') : document.getElementById('size-options');
    Array.from(container.children).forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
}

function addToCart(product) {
    const colorBtn = document.querySelector('#color-options .active');
    const sizeBtn = document.querySelector('#size-options .active');
    const quantity = parseInt(document.getElementById('quantity-input').value) || 1;

    if (!colorBtn || !sizeBtn) {
        alert('Please select options');
        return;
    }

    Store.addToCart({
        productId: product.id,
        variant: {
            color: colorBtn.dataset.value,
            size: sizeBtn.dataset.value
        },
        quantity: quantity
    });

    // Animation visual feedback
    const btn = document.getElementById('add-to-cart-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Added';

    setTimeout(() => {
        btn.textContent = originalText;
    }, 1500);
}
