// =========== SHARED DATA STORE ===========
// Dummy DB initialization for LocalStorage

const defaultProducts = [
    { id: 1, name: "NEXUS Essential T-Shirt", price: 2500, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Premium Denim Jacket", price: 8500, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Signature Hoodie Black", price: 5500, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 4, name: "Urban Cargo Pants", price: 4200, image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 5, name: "Classic White Sneakers", price: 6500, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 6, name: "Minimalist Cap", price: 1500, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

function initDB() {
    if (!localStorage.getItem('nexus_products')) {
        localStorage.setItem('nexus_products', JSON.stringify(defaultProducts));
    }
    if (!localStorage.getItem('nexus_orders')) {
        localStorage.setItem('nexus_orders', JSON.stringify([]));
    }
}

// Ensure DB is initiated before app runs
initDB();

function getProducts() {
    return JSON.parse(localStorage.getItem('nexus_products')) || [];
}

function saveProducts(products) {
    localStorage.setItem('nexus_products', JSON.stringify(products));
}

function getOrders() {
    return JSON.parse(localStorage.getItem('nexus_orders')) || [];
}

function saveOrder(order) {
    const orders = getOrders();
    orders.push({ id: 'ORD-' + Date.now(), ...order });
    localStorage.setItem('nexus_orders', JSON.stringify(orders));
}

function formatCurrency(amount) {
    return 'Rs. ' + amount.toLocaleString('en-LK') + '.00';
}
