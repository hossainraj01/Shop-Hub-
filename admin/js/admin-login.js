const form = document.getElementById("admin-login-form");

form.addEventListener("submit", function(e){

e.preventDefault();

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value.trim();

if(email==="admin@shophub.com" && password==="admin123"){

localStorage.setItem("adminLoggedIn","true");

window.location.href="dashboard.html";

}else{

alert("Invalid Admin Login!");

}

});