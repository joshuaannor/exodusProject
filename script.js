document.addEventListener('DOMContentLoaded', () => {
    loadHeader().then(updateCartCount);
    loadFeaturedProducts();
    loadProducts();
    loadProductDetail();
    loadCart();
    handleCheckout();
});

function loadHeader() {
    const headerEl = document.getElementById('site-header');
    if (!headerEl) return Promise.resolve();
    return fetch('header.html')
        .then(res => res.text())
        .then(html => {
            headerEl.innerHTML = html;
        });
}

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

    if (!cartContainer) return; // Prevent errors if not on cart.html

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

    // Find item index
    let itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1; // Reduce quantity if more than 1
        } else {
            cart.splice(itemIndex, 1); // Remove from cart if only 1 left
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart(); // Reload cart display
    updateCartCount(); // Update cart count in navbar
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

.hero {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff; /* Optional: use cloud image here later */
    text-align: center;
    padding: 2rem;
}

.hero-logo {
    width: 120px;
    max-width: 30vw;
    margin-bottom: 1.5rem;
    animation: fadeIn 1.2s ease-in-out;
}

.hero h1 {
    font-size: 3rem;
    letter-spacing: 0.2em;
    margin: 0;
    font-family: 'Inter', sans-serif;
}

.hero p {
    font-size: 1.2rem;
    margin-top: 1rem;
    font-style: italic;
    color: #333;
    max-width: 600px;
}

/* Optional fade-in animation */
@keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}
