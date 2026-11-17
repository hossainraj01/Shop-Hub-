// ===========================================
// ShopHub Professional Script v2
// Part 1 - Core Setup
// ===========================================

// ---------- Global Variables ----------

let allProducts = [];
let cart = [];
let wishlist = [];

// ---------- Categories ----------

const categories = [
    "smartphones",
    "laptops",
    "mens-shirts"
];

// ---------- DOM ----------

const productContainer = document.getElementById("products");
const flashContainer = document.getElementById("flash-products");

const searchInput = document.getElementById("search");

const cartIcon = document.querySelector(".cart-icon");

const cartCount = document.getElementById("cart-count");

const cartSidebar = document.getElementById("cart-sidebar");

const cartOverlay = document.getElementById("cart-overlay");

const cartItems = document.getElementById("cart-items");

const cartTotal = document.getElementById("cart-total");

const closeCartBtn = document.getElementById("close-cart");

const checkoutBtn = document.querySelector(".checkout-btn");

// ---------- Current User ----------

let currentUser = JSON.parse(

    localStorage.getItem("currentUser")

) || null;

// ===========================================
// Local Storage
// ===========================================

function saveCart(){

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

}

function loadCart(){

    cart = JSON.parse(

        localStorage.getItem("cart")

    ) || [];

}

function saveWishlist(){

    localStorage.setItem(

        "wishlist",

        JSON.stringify(wishlist)

    );

}

function loadWishlist(){

    wishlist = JSON.parse(

        localStorage.getItem("wishlist")

    ) || [];

}

// ===========================================
// Toast
// ===========================================

function showToast(message){

    const toast = document.createElement("div");

    toast.className="toast";

    toast.innerText=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },2000);

}

// ===========================================
// Cart Counter
// ===========================================

function updateCartCount(){

    if(cartCount){

        cartCount.innerText=cart.length;

    }

}

// ===========================================
// Init
// ===========================================

loadCart();

loadWishlist();

updateCartCount();

console.log("✅ ShopHub Core Loaded");
// ===========================================
// Part 2 - Load Products & Display
// ===========================================

// ---------- Load Products ----------

async function loadProducts() {

    allProducts = [];

    try {

        for (const category of categories) {

            const response = await fetch(
                `https://dummyjson.com/products/category/${category}`
            );

            const data = await response.json();

            allProducts.push(...data.products.slice(0, 4));

        }

        // Custom Products

        allProducts.push(

            {
                id: 1001,
                title: "Sony WH-1000XM5",
                price: 349,
                thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30?w=600"
            },

            {
                id: 1002,
                title: "Apple AirPods Max",
                price: 549,
                thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
            },

            {
                id: 1003,
                title: "Gaming Headset",
                price: 129,
                thumbnail: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600"
            },

            {
                id: 1004,
                title: "Maybelline Foundation",
                price: 18,
                thumbnail: "https://dummyjson.com/image/400x400/f5f5f5/333?text=Foundation"
            },

        );

        displayProducts(allProducts);

    } catch (error) {

        console.error(error);

        if (productContainer) {

            productContainer.innerHTML = `
                <h2 style="text-align:center;padding:40px;">
                    Failed to load products.
                </h2>
            `;

        }

    }

}

// ---------- Display Products ----------

function displayProducts(products) {

    if (!productContainer) return;

    let html = "";

    products.forEach(product => {

        html += `

        <div class="product">

            <img src="${product.thumbnail}" alt="${product.title}">

            <h3>${product.title}</h3>

            <div class="price">

                <span class="new-price">$${product.price}</span>

            </div>

            <button
                class="cart-btn"
                data-title="${product.title}"
                data-price="${product.price}"
                data-image="${product.thumbnail}">

                🛒 Add to Cart

            </button>

        </div>

        `;

    });

    productContainer.innerHTML = html;

    attachCartButtons();

}

// ---------- Cart Button ----------

function attachCartButtons() {

    document.querySelectorAll(".cart-btn").forEach(button => {

        button.addEventListener("click", function () {

            const product = {

                title: this.dataset.title,

                price: Number(this.dataset.price),

                image: this.dataset.image

            };

            addToCart(product);

        });

    });

}

// ---------- Start ----------

loadProducts();

console.log("✅ Products Loaded");
// ===========================================
// Part 3 - Shopping Cart System
// ===========================================

// ---------- Add To Cart ----------

function addToCart(product) {

    cart.push(product);

    saveCart();

    updateCartCount();

    renderCart();

    showToast(product.title + " added to cart");

}

// ---------- Render Cart ----------

function renderCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += Number(item.price);

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.title}">

            <div class="cart-info">

                <h4>${item.title}</h4>

                <p>$${item.price}</p>

                <button
                    class="remove-btn"
                    onclick="removeItem(${index})">

                    Remove

                </button>

            </div>

        </div>

        `;

    });

    if (cartTotal) {

        cartTotal.innerText = total.toFixed(2);

    }

}

// ---------- Remove Item ----------

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCartCount();

    renderCart();

    showToast("Item Removed");

}

// ---------- Clear Cart ----------

function clearCart() {

    cart = [];

    saveCart();

    updateCartCount();

    renderCart();

}

// ---------- Open Cart ----------

function openCart() {

    if (cartSidebar)
        cartSidebar.classList.add("active");

    if (cartOverlay)
        cartOverlay.classList.add("active");

}

// ---------- Close Cart ----------

function closeCart() {

    if (cartSidebar)
        cartSidebar.classList.remove("active");

    if (cartOverlay)
        cartOverlay.classList.remove("active");

}

// ---------- Events ----------

if (cartIcon) {

    cartIcon.addEventListener("click", function (e) {

        e.preventDefault();

        openCart();

    });

}

if (closeCartBtn) {

    closeCartBtn.addEventListener("click", closeCart);

}

if (cartOverlay) {

    cartOverlay.addEventListener("click", closeCart);

}

// ---------- Restore Cart ----------

renderCart();

console.log("✅ Shopping Cart Ready");
// ===========================================
// Part 4 - Search + Flash Sale + Countdown
// ===========================================

// ---------- Live Search ----------

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const keyword = this.value.toLowerCase().trim();

        const filteredProducts = allProducts.filter(product =>

            product.title.toLowerCase().includes(keyword)

        );

        displayProducts(filteredProducts);

    });

}

// ===========================================
// Flash Sale
// ===========================================

function loadFlashSale() {

    if (!flashContainer) return;

    let html = "";

    const flashProducts = allProducts.slice(0, 4);

    flashProducts.forEach(product => {

        const oldPrice = (product.price * 1.2).toFixed(2);

        html += `

        <div class="flash-card">

            <span class="discount">20% OFF</span>

            <img src="${product.thumbnail}" alt="${product.title}">

            <h3>${product.title}</h3>

            <div class="flash-price">

                <span class="new">$${product.price}</span>

                <span class="old">$${oldPrice}</span>

            </div>

            <button
                onclick="addToCart({
                    title:'${product.title}',
                    price:${product.price},
                    image:'${product.thumbnail}'
                })">

                🛒 Add To Cart

            </button>

        </div>

        `;

    });

    flashContainer.innerHTML = html;

}

// ===========================================
// Countdown Timer
// ===========================================

const saleEnd = new Date().getTime() + (24 * 60 * 60 * 1000);

setInterval(function () {

    const now = new Date().getTime();

    const distance = saleEnd - now;

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60))
        /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60))
        /
        1000
    );

    const h = document.getElementById("hours");
    const m = document.getElementById("minutes");
    const s = document.getElementById("seconds");

    if (h) h.innerText = String(hours).padStart(2, "0");
    if (m) m.innerText = String(minutes).padStart(2, "0");
    if (s) s.innerText = String(seconds).padStart(2, "0");

}, 1000);

// ===========================================
// Wishlist
// ===========================================

function addToWishlist(product){

    const exists = wishlist.find(item =>

        item.title === product.title

    );

    if(exists){

        showToast("Already in Wishlist ❤️");

        return;

    }

    wishlist.push(product);

    saveWishlist();

    showToast("Added to Wishlist ❤️");

}

// ===========================================
// Load Flash Sale After Products
// ===========================================

const oldLoadProducts = loadProducts;

loadProducts = async function(){

    await oldLoadProducts();

    loadFlashSale();

}

console.log("✅ Search & Flash Sale Loaded");
// ===========================================
// Part 5 - User Login & Checkout
// ===========================================

// ---------- User ----------

function getCurrentUser() {

    return JSON.parse(localStorage.getItem("currentUser"));

}

// ---------- Update Header ----------

function updateUser() {

    const userIcon = document.querySelector(".fa-user");

    const user = getCurrentUser();

    if (!userIcon) return;

    if (user) {

        userIcon.parentElement.innerHTML = `
            <i class="fa-solid fa-user"></i>
            <span>${user.name}</span>
        `;

    }

}

updateUser();

// ---------- Checkout ----------

function checkout() {

    const user = getCurrentUser();

    if (!user) {

        alert("Please Login First!");

        window.location.href = "login.html";

        return;

    }

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    const total = cart.reduce((sum, item) => {

        return sum + Number(item.price);

    }, 0);

    alert(

`Order Successful!

Customer : ${user.name}

Items : ${cart.length}

Total : $${total.toFixed(2)}

Thank you for shopping with ShopHub ❤️`

    );

    cart = [];

    saveCart();

    renderCart();

    updateCartCount();

    closeCart();

}

// ---------- Checkout Button ----------

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", checkout);

}

// ---------- Logout ----------

function logout() {

    localStorage.removeItem("currentUser");

    showToast("Logged Out");

    setTimeout(() => {

        location.reload();

    }, 800);

}

// ---------- Keyboard Shortcut ----------

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        closeCart();

    }

});

console.log("✅ Part 5 Loaded");
// ===========================================
// Part 6 - Professional Features
// ===========================================

// ---------- Product Rating ----------

function getStars(rating = 4.5) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        if (i <= Math.floor(rating)) {

            stars += "⭐";

        } else {

            stars += "☆";

        }

    }

    return stars;

}

// ---------- Quick View ----------

function quickView(id) {

    const product = allProducts.find(p => p.id == id);

    if (!product) return;

    alert(
`${product.title}

💲 Price: $${product.price}

⭐ Rating: ${product.rating || 4.5}

📦 Premium Quality Product

Thank you for visiting ShopHub ❤️`
    );

}

// ---------- Scroll To Top ----------

const topBtn = document.createElement("button");

topBtn.innerHTML = "↑";

topBtn.className = "top-btn";

document.body.appendChild(topBtn);

topBtn.style.cssText = `
position:fixed;
bottom:20px;
right:20px;
width:45px;
height:45px;
border:none;
border-radius:50%;
background:#f85606;
color:#fff;
font-size:20px;
cursor:pointer;
display:none;
z-index:9999;
`;

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }

});

topBtn.onclick = () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};

// ---------- Welcome Message ----------

window.addEventListener("load", () => {

    const user = getCurrentUser();

    if (user) {

        showToast("Welcome " + user.name);

    }

});

// ---------- Developer Info ----------

console.log("====================================");
console.log("ShopHub Professional v2");
console.log("Products :", allProducts.length);
console.log("Cart :", cart.length);
console.log("Wishlist :", wishlist.length);
console.log("====================================");

console.log("✅ Part 6 Loaded");
// ===========================================
// Part 7 - Premium Features
// ===========================================

// ---------- Buy Now ----------

function buyNow(product){

    addToCart(product);

    openCart();

}

// ---------- Sort Products ----------

function sortLowToHigh(){

    const sorted = [...allProducts].sort((a,b)=>a.price-b.price);

    displayProducts(sorted);

}

function sortHighToLow(){

    const sorted = [...allProducts].sort((a,b)=>b.price-a.price);

    displayProducts(sorted);

}

// ---------- Category Filter ----------

function filterCategory(category){

    if(category==="all"){

        displayProducts(allProducts);

        return;

    }

    const filtered = allProducts.filter(product=>{

        return product.category===category;

    });

    displayProducts(filtered);

}

// ---------- Product Statistics ----------

function getStatistics(){

    const total = allProducts.length;

    const avg = total
        ? (allProducts.reduce((sum,p)=>sum+p.price,0)/total).toFixed(2)
        : 0;

    console.log("========== Statistics ==========");
    console.log("Products :", total);
    console.log("Average Price : $"+avg);
    console.log("Cart :", cart.length);
    console.log("Wishlist :", wishlist.length);
    console.log("================================");

}

// ---------- Online / Offline ----------

window.addEventListener("online",()=>{

    showToast("Internet Connected");

});

window.addEventListener("offline",()=>{

    showToast("No Internet Connection");

});

// ---------- Footer Year ----------

const footer = document.querySelector(".footer-bottom");

if(footer){

    footer.innerHTML=`© ${new Date().getFullYear()} ShopHub. All Rights Reserved.`;

}

// ---------- Initialize ----------

window.addEventListener("load",()=>{

    updateCartCount();

    renderCart();

    getStatistics();

});

console.log("✅ ShopHub Professional Completed");