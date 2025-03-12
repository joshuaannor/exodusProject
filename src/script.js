document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    loadProducts();
    loadProductDetail();
    loadCart();
    handleCheckout();
});

function loadFeaturedProducts() {
    // Load featured products dynamically
    const featuredProductsContainer = document.getElementById('featured-products-container');
    if (featuredProductsContainer) {
        // Fetch featured products from products.js
        const featuredProducts = products.slice(0, 3); // Example: first 3 products
        featuredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            featuredProductsContainer.appendChild(productElement);
        });
    }
}

function loadProducts() {
    // Load all products dynamically
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productsContainer.appendChild(productElement);
        });
    }
}

function loadProductDetail() {
    // Load product detail dynamically
    const productDetailContainer = document.getElementById('product-detail-container');
    if (productDetailContainer) {
        const productId = new URLSearchParams(window.location.search).get('id');
        const product = products.find(p => p.id == productId);
        if (product) {
            productDetailContainer.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
        }
    }
}

function loadCart() {
    // Load cart items dynamically
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.forEach(item => {
            const product = products.find(p => p.id == item.id);
            const cartItemElement = document.createElement('div');
            cartItemElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <input type="number" value="${item.quantity}" min="1" onchange="updateCart(${product.id}, this.value)">
                <button onclick="removeFromCart(${product.id})">Remove</button>
            `;
            cartContainer.appendChild(cartItemElement);
        });
        const totalPrice = cart.reduce((total, item) => total + item.quantity * products.find(p => p.id == item.id).price, 0);
        cartContainer.innerHTML += `<h3>Total: $${totalPrice}</h3>`;
    }
}

function addToCart(productId) {
    // Add product to cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id == productId);
    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart');
}

function removeFromCart(productId) {
    // Remove product from cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function updateCart(productId, quantity) {
    // Update product quantity in cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id == productId);
    if (productIndex > -1) {
        cart[productIndex].quantity = parseInt(quantity);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function handleCheckout() {
    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Integrate with Stripe API for payment
            alert('Payment successful');
            localStorage.removeItem('cart');
            window.location.href = 'order.html';
        });
    }
}