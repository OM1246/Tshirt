/**
 * store.js
 * Handles LocalStorage for Products and Cart
 */

const Store = {
    // Keys
    PRODUCTS_KEY: 'antigravity_tshirt_products_v2',
    CART_KEY: 'antigravity_tshirt_cart_v2',

    // Initial Seed Data
    seedProducts: [
        {
            id: 1,
            name: "Essential Black Tee",
            price: 45.00,
            image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop",
            category: "Men",
            colors: ["Black", "Charcoal"],
            sizes: ["S", "M", "L", "XL"],
            description: "A staple for every wardrobe. Premium cotton blend."
        },
        {
            id: 2,
            name: "Classic White Tee",
            price: 39.99,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
            category: "Unisex",
            colors: ["White", "Off-White"],
            sizes: ["M", "L", "XL"],
            description: "Clean, crisp, and comfortable."
        },
        {
            id: 3,
            name: "Urban Graphic Tee",
            price: 55.00,
            image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop",
            category: "Men",
            colors: ["Red", "Black"],
            sizes: ["S", "M", "L"],
            description: "Streetwear aesthetic with bold graphics."
        },
        {
            id: 4,
            name: "Summer Breeze Top",
            price: 42.50,
            image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop",
            category: "Women",
            colors: ["Pink", "Cyan"],
            sizes: ["XS", "S", "M"],
            description: "Lightweight and breathable for warm days."
        }
    ],

    // Initialize Store
    init() {
        if (!localStorage.getItem(this.PRODUCTS_KEY)) {
            this.setProducts(this.seedProducts);
        }
        if (!localStorage.getItem(this.CART_KEY)) {
            localStorage.setItem(this.CART_KEY, JSON.stringify([]));
        }
    },

    // Products Methods
    getProducts() {
        return JSON.parse(localStorage.getItem(this.PRODUCTS_KEY)) || [];
    },

    getProductById(id) {
        const products = this.getProducts();
        return products.find(p => p.id == id);
    },

    setProducts(products) {
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    },

    addProduct(product) {
        const products = this.getProducts();
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        product.id = newId;
        products.push(product);
        this.setProducts(products);
    },

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id != id);
        this.setProducts(products);
    },

    // Cart Methods
    getCart() {
        return JSON.parse(localStorage.getItem(this.CART_KEY)) || [];
    },

    addToCart(item) {
        // Item format: { productId, color, size, quantity }
        const cart = this.getCart();
        const existingIndex = cart.findIndex(
            (cartItem) =>
                cartItem.productId == item.productId &&
                cartItem.color == item.color &&
                cartItem.size == item.size
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity += item.quantity;
        } else {
            cart.push(item);
        }
        this.updateCart(cart);
    },

    removeFromCart(index) {
        const cart = this.getCart();
        cart.splice(index, 1);
        this.updateCart(cart);
    },

    updateCart(cart) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
        // Dispatch event for UI updates
        window.dispatchEvent(new Event('cartUpdated'));
    },

    clearCart() {
        localStorage.setItem(this.CART_KEY, JSON.stringify([]));
        window.dispatchEvent(new Event('cartUpdated'));
    }
};

// Initialize on load
Store.init();
