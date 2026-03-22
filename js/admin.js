// =========== ADMIN PANEL LOGIC ===========

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial State Checks
    const loginView = document.getElementById("login-view");
    const dashView = document.getElementById("dashboard-view");
    const loginForm = document.getElementById("admin-login-form");
    const errorMsg = document.getElementById("login-error");
    const logoutBtn = document.getElementById("logout-btn");
    
    // Check if logged in
    if (localStorage.getItem("admin_auth") === "true") {
        loginView.style.display = "none";
        dashView.style.display = "flex";
        loadDashboardData();
    } else {
        loginView.style.display = "flex";
        dashView.style.display = "none";
    }

    // 2. Login Handling
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("admin-user").value;
            const pass = document.getElementById("admin-pass").value;

            // Admin requirement: username = admin, password = 54321
            if (user === "admin" && pass === "54321") {
                localStorage.setItem("admin_auth", "true");
                loginView.style.display = "none";
                dashView.style.display = "flex";
                loadDashboardData();
            } else {
                errorMsg.style.display = "block";
            }
        });
    }

    // 3. Logout Handling
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("admin_auth");
            loginView.style.display = "flex";
            dashView.style.display = "none";
            document.getElementById("admin-login-form").reset();
            errorMsg.style.display = "none";
        });
    }

    // 4. Sidebar Navigation
    const navLinks = document.querySelectorAll(".sidebar-nav a[data-target]");
    const sections = document.querySelectorAll(".section-view");
    const pageTitle = document.getElementById("page-title");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const target = link.getAttribute("data-target");
            sections.forEach(s => s.classList.remove("active"));
            document.getElementById("section-" + target).classList.add("active");
            
            // Capitalize title
            pageTitle.textContent = target.charAt(0).toUpperCase() + target.slice(1).replace('-', ' ');

            if (target === "dashboard") loadDashboardData();
            if (target === "products") loadProductsGrid();
            if (target === "orders") loadOrdersTable();
        });
    });

    // 5. Add Product Logic
    const addProductForm = document.getElementById("add-product-form");
    if (addProductForm) {
        addProductForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("p-name").value;
            const price = document.getElementById("p-price").value;
            const image = document.getElementById("p-img").value;

            const products = getProducts();
            const newProduct = {
                id: Date.now(),
                name,
                price: parseInt(price),
                image
            };
            
            products.push(newProduct);
            saveProducts(products);
            
            addProductForm.reset();
            document.getElementById("product-success-msg").style.display = "block";
            setTimeout(() => {
                document.getElementById("product-success-msg").style.display = "none";
            }, 3000);
        });
    }
});

// Load Dashboard Metrics
function loadDashboardData() {
    const products = getProducts();
    const orders = getOrders();
    
    const dashProd = document.getElementById("dash-prod-count");
    const dashOrd = document.getElementById("dash-order-count");
    const dashRev = document.getElementById("dash-revenue");

    if (dashProd) dashProd.textContent = products.length;
    if (dashOrd) dashOrd.textContent = orders.length;

    if (dashRev) {
        const total = orders.reduce((sum, order) => sum + parseInt(order.total), 0);
        dashRev.textContent = formatCurrency(total);
    }
}

// Load Products Table
function loadProductsGrid() {
    const list = document.getElementById("admin-product-list");
    if (!list) return;
    const products = getProducts();
    
    list.innerHTML = "";
    products.forEach((p, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${p.image}" width="50" height="50" style="object-fit:cover; border-radius:4px;"></td>
            <td><strong>${p.name}</strong></td>
            <td>${formatCurrency(parseInt(p.price))}</td>
            <td>
                <button class="action-btn" onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        `;
        list.appendChild(tr);
    });
}

function deleteProduct(id) {
    if(!confirm("Are you sure you want to delete this product?")) return;
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    loadProductsGrid(); // Refresh
}

// Load Orders Table
function loadOrdersTable() {
    const list = document.getElementById("admin-order-list");
    if (!list) return;
    const orders = getOrders();

    list.innerHTML = "";
    orders.forEach(o => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${o.id}</strong><br><small style="color:#6b7280">${o.date}</small></td>
            <td>${o.name}</td>
            <td>${o.phone}</td>
            <td>${o.items.length} item(s)</td>
            <td><strong>${formatCurrency(parseInt(o.total))}</strong></td>
        `;
        list.appendChild(tr);
    });
}
