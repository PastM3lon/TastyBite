document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const adminNavItems = document.querySelectorAll(".admin-link, .admin-icon");

    adminNavItems.forEach((item) => {
        if (!isAdmin) {
            item.style.display = "none";
        }
    });

    const isAdminPage = window.location.pathname.toLowerCase().includes("/admin/admin.html");
    if (isAdminPage && !isAdmin) {
        window.location.href = "../Recipes Page/Recipes.html";
        return;
    }
});