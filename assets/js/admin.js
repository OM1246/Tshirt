/**
 * admin.js
 * Handles product management (CRUD).
 */

document.addEventListener('DOMContentLoaded', () => {
    // Basic auth check would go here

    renderProductTable();

    const form = document.getElementById('product-form');
    if (form) form.addEventListener('submit', handleFormSubmit);

    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) cancelBtn.addEventListener('click', resetForm);
});

let editingId = null;

function renderProductTable() {
    const tbody = document.getElementById('admin-product-list');
    if (!tbody) return;

    const products = Store.getProducts();
    tbody.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${product.id}</td>
      <td><img src="${product.image}" 
               class="table-img" 
               style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;"
               onerror="this.src='https://via.placeholder.com/50x50?text=Err'"></td>
      <td>${product.name}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.category}</td>
      <td>
        <button onclick="editProduct(${product.id})" class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.8rem;">Edit</button>
        <button onclick="deleteProduct(${product.id})" class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.8rem; color: #cc3333; border-color: #cc3333;">Delete</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const category = document.getElementById('p-category').value;
    const image = document.getElementById('p-image').value || 'https://via.placeholder.com/400x400?text=No+Image';

    if (editingId) {
        // Update existing
        const products = Store.getProducts();
        const index = products.findIndex(p => p.id == editingId);
        if (index !== -1) {
            products[index] = { ...products[index], name, price, category, image };
            Store.setProducts(products);
        }
        resetForm();
    } else {
        // Create new
        const newProduct = {
            name,
            price,
            category,
            image,
            colors: ["Black", "White"], // Defaults
            sizes: ["S", "M", "L", "XL"],
            description: "New addition to the collection."
        };
        Store.addProduct(newProduct);
    }

    renderProductTable();
    e.target.reset();
}

window.deleteProduct = function (id) {
    if (confirm('Delete this product?')) {
        Store.deleteProduct(id);
        renderProductTable();
    }
}

window.editProduct = function (id) {
    const product = Store.getProductById(id);
    if (!product) return;

    document.getElementById('p-name').value = product.name;
    document.getElementById('p-price').value = product.price;
    document.getElementById('p-category').value = product.category;
    document.getElementById('p-image').value = product.image;

    editingId = id;
    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('submit-btn').textContent = 'Update';
    document.getElementById('cancel-edit').style.display = 'inline-block';
}

function resetForm() {
    editingId = null;
    document.getElementById('product-form').reset();
    document.getElementById('form-title').textContent = 'Add New Product';
    document.getElementById('submit-btn').textContent = 'Add Product';
    document.getElementById('cancel-edit').style.display = 'none';
}
