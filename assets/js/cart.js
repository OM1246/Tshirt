/**
 * cart.js
 * Handles cart rendering and actions.
 */

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    // Listen for external updates (in case multiple tabs or other interactions)
    window.addEventListener('cartUpdated', renderCart);

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', mockCheckout);
    }
});

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    const cart = Store.getCart();
    const products = Store.getProducts();

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 50px; color: var(--text-muted);"><h3>Cart is Empty</h3><a href="products.html" class="btn" style="margin-top:20px;">Start Shopping</a></div>';
        updateSummary(0);
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        // If it's a custom item, the product info is inside item itself mostly, otherwise look it up
        let product;
        if (item.isCustom) {
            product = item; // It has name, price, etc.
        } else {
            product = products.find(p => p.id == item.productId);
        }

        if (!product) return; // Should not happen

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';

        // Image source handling
        let imgSrc = product.image;
        if (item.variant?.customPreview) {
            imgSrc = item.variant.customPreview; // Use the custom design
        } else if (!imgSrc || imgSrc.includes('assets')) {
            // Fallback
            imgSrc = 'https://via.placeholder.com/100x100?text=Product';
        }

        div.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" class="cart-img" style="border-radius: var(--radius-sm);">
      <div class="cart-info" style="flex-grow:1;">
        <h3 style="font-size:1.1rem; font-weight:600; margin-bottom: 4px;">${product.name}</h3>
        <p style="color:var(--text-muted); font-size: 0.9rem; margin-bottom: 12px; font-family: var(--font-mono);">${item.variant.color} / ${item.variant.size}</p>
        <div class="cart-controls" style="display:flex; align-items:center; gap:12px;">
           <button class="btn btn-secondary" style="padding:4px 12px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" onclick="updateQty(${index}, -1)">-</button>
           <span style="font-weight:600; min-width: 20px; text-align: center;">${item.quantity}</span>
           <button class="btn btn-secondary" style="padding:4px 12px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" onclick="updateQty(${index}, 1)">+</button>
           <button onclick="removeItem(${index})" style="margin-left:auto; color: var(--accent-secondary); border:none; background:none; cursor:pointer; font-size:0.85rem; font-family: var(--font-mono); letter-spacing: 0.05em;">REMOVE</button>
        </div>
      </div>
      <div class="cart-price" style="font-weight:600; font-size: 1.1rem; color: var(--accent-success); font-family: var(--font-mono);">$${itemTotal.toFixed(2)}</div>
    `;
        container.appendChild(div);
    });

    updateSummary(total);
}

function updateSummary(total) {
    const sub = document.getElementById('subtotal');
    const tot = document.getElementById('total-price');
    if (sub) sub.textContent = `$${total.toFixed(2)}`;
    if (tot) tot.textContent = `$${total.toFixed(2)}`;
}

// Global scope for onclick handlers
window.updateQty = function (index, change) {
    const cart = Store.getCart();
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
        Store.updateCart(cart); // Triggers re-render via event
    }
}

window.removeItem = function (index) {
    Store.removeFromCart(index);
}

function mockCheckout() {
    const btn = document.getElementById('checkout-btn');
    btn.textContent = 'Processing...';
    btn.disabled = true;

    setTimeout(() => {
        Store.clearCart();
        document.body.innerHTML = `
      <div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: var(--bg-dark); color: var(--text-main);">
        <h1 style="font-size: 2.5rem; margin-bottom: 20px;">Order Confirmed</h1>
        <p style="font-size: 1.2rem; color: var(--text-muted);">Thank you for your purchase.</p>
        <a href="index.html" class="btn" style="margin-top: 40px;">Return Home</a>
      </div>
    `;
    }, 2000);
}
