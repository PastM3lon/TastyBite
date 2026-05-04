document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const adminNavItems = document.querySelectorAll(".admin-link, .admin-icon");

    adminNavItems.forEach((item) => {
        if (!isAdmin) {
            item.style.display = "none";
        }
    });
});