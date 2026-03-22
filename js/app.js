// =========== FRONTEND APP LOGIC ===========

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Render Products
    const products = getProducts();
    const grid = document.getElementById("product-grid");

    if (grid) {
        products.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <p class="product-price">${formatCurrency(parseInt(p.price))}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // 2. UI Elements Listeners
    const cartBtn = document.getElementById("cart-btn");
    const closeCartBtn = document.getElementById("close-cart");
    const cartOverlay = document.getElementById("cart-overlay");
    const checkoutBtn = document.getElementById("checkout-btn");
    const checkoutModal = document.getElementById("checkout-modal");
    const closeCheckoutBtn = document.getElementById("close-checkout");
    const checkoutForm = document.getElementById("checkout-form");

    if (cartBtn) cartBtn.addEventListener("click", () => cartOverlay.classList.add("show"));
    if (closeCartBtn) closeCartBtn.addEventListener("click", () => cartOverlay.classList.remove("show"));
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Cart is empty!");
                return;
            }
            cartOverlay.classList.remove("show");
            checkoutModal.classList.add("show");
        });
    }

    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", () => checkoutModal.classList.remove("show"));

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("c-name").value;
            const phone = document.getElementById("c-phone").value;
            const address = document.getElementById("c-address").value;
            const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);
            
            saveOrder({
                name, phone, address, items: cart, total, date: new Date().toLocaleString()
            });

            alert("Order Placed Successfully! We will contact you soon.");
            cart = [];
            updateCartUI();
            checkoutModal.classList.remove("show");
            checkoutForm.reset();
        });
    }
});

function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartUI();
        document.getElementById("cart-overlay").classList.add("show");
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotalPrice = document.getElementById("cart-total-price");
    
    if(!cartItems) return;

    cartCount.textContent = cart.length;
    cartItems.innerHTML = "";
    
    let total = 0;

    cart.forEach((item, index) => {
        total += parseInt(item.price);
        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `
            <img src="${item.image}" alt="">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${formatCurrency(parseInt(item.price))}</div>
                <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartItems.appendChild(el);
    });

    cartTotalPrice.textContent = formatCurrency(total);
}
