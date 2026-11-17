document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("login-form");

    if (!form) {
        console.error("Login form not found!");
        return;
    }

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(u =>
            u.email === email && u.password === password
        );

        if (!user) {
            alert("Invalid Email or Password!");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));

        alert("Login Successful!");

        window.location.href = "index.html";
    });

});
