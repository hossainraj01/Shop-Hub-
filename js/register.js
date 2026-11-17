const form = document.getElementById("register-form");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    if(name==="" || email==="" || password===""){

        alert("Please fill all fields.");

        return;

    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(user => user.email === email);

    if(exists){

        alert("Email already registered.");

        return;

    }

    users.push({

        name,
        email,
        password

    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful!");

    window.location.href = "login.html";

});