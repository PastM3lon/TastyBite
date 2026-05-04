function handleLogin() {
    const emailInput = document.getElementById("logInEmail");
    const passwordInput = document.getElementById("logInPassword");
    const message = document.getElementById("loginMessage");

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    message.textContent = "";
    message.classList.remove("error", "success");

    if (!email || !password) {
        message.textContent = "Please enter both email and password.";
        message.classList.add("error");
        return false;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((userCheck) => userCheck.email === email && userCheck.password === password);

    if (!user) {
        message.textContent = "Invalid email or password.";
        message.classList.add("error");
        return false;
    }

    localStorage.setItem("isAdmin", String(user.isAdmin));
    localStorage.setItem("currentUserEmail", email);
    localStorage.setItem("currentUserName", user.fullName);

    message.textContent = "Login successful.";
    message.classList.add("success");
    return true;
}
