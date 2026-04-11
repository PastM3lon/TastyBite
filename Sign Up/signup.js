function accountSubmit() {
    const nameInput = document.getElementById("signUpName");
    const emailInput = document.getElementById("signUpEmail");
    const passwordInput = document.getElementById("signUpPassword");
    const confirmPasswordInput = document.getElementById("signUpConfirmPassword");
    const adminCheckbox = document.getElementById("signUpIsAdmin");
    const message = document.getElementById("signupMessage");

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const isAdmin = adminCheckbox.checked;
    
    message.textContent = "";
    message.classList.remove("error", "success");

    if (!fullName || !email || !password || !confirmPassword) {
        message.textContent = "Please fill out all fields.";
        message.classList.add("error");
        return false;
    }

    if (password.length < 8) {
        message.textContent = "Password must be at least 8 characters.";
        message.classList.add("error");
        return false;
    }

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        message.classList.add("error");
        return false;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.some((user) => user.email === email);
    
    if (userExists) {
        message.textContent = "An account with this email already exists.";
        message.classList.add("error");
        return false;
    }

    users.push({fullName, email, password, isAdmin});

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("isAdmin", String(isAdmin));
    localStorage.setItem("currentUserEmail", email);
    localStorage.setItem("currentUserName", fullName);

    message.textContent = "Account created successfully. Redirecting to login...";
    message.classList.add("success");
    return true;
}