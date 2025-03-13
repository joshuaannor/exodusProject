document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    loadProducts();
    loadProductDetail();
    loadCart();
    updateCartCount();
    handleCheckout();
});

//  Load Featured Products on Homepage
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products-container');
    if (featuredProductsContainer) {
        const featuredProducts = products.slice(0, 3);
        featuredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <i class="fas fa-tshirt fa-5x"></i>
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            `;
            featuredProductsContainer.appendChild(productElement);
        });
    }
}

//  Load All Products in Shop
function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <i class="fas fa-tshirt fa-5x"></i>
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            `;
            productsContainer.appendChild(productElement);
        });
    }
}

//  Load Product Details Page
function loadProductDetail() {
    const productDetailContainer = document.getElementById('product-detail-container');
    if (productDetailContainer) {
        const productId = new URLSearchParams(window.location.search).get('id');
        const product = products.find(p => p.id == productId);
        if (product) {
            productDetailContainer.innerHTML = `
                <i class="fas fa-tshirt fa-5x"></i>
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            `;
        }
    }
}

//  Add Product to Cart
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product exists in cart
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
    updateCartCount();
}

//  Update Cart Count in Navbar
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = count;
    }
}

//  Load Cart in `cart.html`
function loadCart() {
    const cartContainer = document.getElementById("cart-container");
    const totalPriceElement = document.getElementById("total-price");

    if (!cartContainer) return; // Ensure this only runs on cart.html

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceElement.innerText = "";
    } else {
        let totalPrice = 0;
        cartContainer.innerHTML = cart.map((item, index) => {
            totalPrice += item.price * item.quantity;
            return `
                <div class="cart-item">
                    <p><strong>${item.name}</strong> - $${item.price.toFixed(2)} x ${item.quantity}</p>
                    <input type="number" min="1" value="${item.quantity}" onchange="updateCart('${item.name}', this.value)">
                    <button onclick="removeFromCart('${item.name}')">Remove</button>
                </div>
            `;
        }).join("");

        totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)}`;
    }
}

//  Remove Item from Cart
function removeFromCart(name) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

//  Update Cart Item Quantity
function updateCart(name, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = parseInt(quantity);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

//  Handle Checkout
function handleCheckout() {
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Payment successful");
            localStorage.removeItem("cart");
            window.location.href = "order.html";
        });
    }
}