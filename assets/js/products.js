/**
 * products.js
 * Handles product listing, filtering, and searching.
 */

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');

    let allProducts = Store.getProducts();

    // Initial Render
    renderProducts(allProducts);

    // Event Listeners
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            if (priceValue) priceValue.textContent = `$${e.target.value}`;
            filterProducts();
        });
    }

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const maxPrice = parseFloat(priceRange.value);

        const filtered = allProducts.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(searchTerm);
            const matchCategory = category === 'all' || p.category === category;
            const matchPrice = p.price <= maxPrice;
            return matchSearch && matchCategory && matchPrice;
        });

        renderProducts(filtered);
    }

    function renderProducts(products) {
        if (!productGrid) return;
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No products found.</p>';
            return;
        }

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card animate-enter';
            card.innerHTML = `
        <div class="card-image-container">
          <img src="${p.image}" 
               alt="${p.name}" 
               class="product-img" 
               style="width: 100%; height: 100%; object-fit: contain; background: #fff;"
               onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <h3 class="product-name" style="font-size: 1.1rem; margin: 0; font-weight: 600;">${p.name}</h3>
            <span style="font-family: var(--font-mono); color: var(--accent-success); font-size: 0.9rem;">$${p.price.toFixed(2)}</span>
        </div>
        
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">${p.category}</p>
        
        <div style="display: flex; gap: 10px;">
          <a href="product.html?id=${p.id}" class="btn btn-secondary" style="flex: 1; text-align: center; font-size: 0.9rem; padding: 8px;">View Details</a>
          <button class="btn" style="padding: 0 16px;" onclick="quickAdd(${p.id}, event)">+</button>
        </div>
      `;
            productGrid.appendChild(card);
        });
    }
});

// Exposed for the "Quick Add" button
function quickAdd(id, event) {
    const product = Store.getProductById(id);
    Store.addToCart({
        productId: product.id,
        variant: { color: product.colors[0], size: product.sizes[0] }, // Default options
        quantity: 1
    });
    // Visual feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    const originalBg = btn.style.backgroundColor;

    btn.innerHTML = '✓';
    // Let CSS hover/active states handle colors usually, but here we force a feedback state
    // We can just rely on text change for simplicity or toggle a class

    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 1000);
}
