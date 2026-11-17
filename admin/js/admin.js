// Protect Dashboard

if (localStorage.getItem("adminLoggedIn") !== "true") {

    alert("Please login as Admin!");

    window.location.href = "login.html";

}
// =====================================
// ShopHub Admin Dashboard
// =====================================

// Dashboard Elements
const totalProducts = document.getElementById("total-products");
const totalUsers = document.getElementById("total-users");
const totalOrders = document.getElementById("total-orders");

// Load Data
function loadDashboard() {

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const products = JSON.parse(localStorage.getItem("products")) || [];

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    totalProducts.textContent = products.length;

    totalUsers.textContent = users.length;

    totalOrders.textContent = orders.length;

}

loadDashboard();

// =============================
// Logout
// =============================

const logout = document.getElementById("logout");

logout.addEventListener("click", function () {

    localStorage.removeItem("adminLoggedIn");

    window.location.href = "login.html";

});

console.log("✅ ShopHub Admin Loaded");