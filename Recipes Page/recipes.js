document.addEventListener("DOMContentLoaded", () => {
   const isAdmin = localStorage.getItem("isAdmin") === "true";
   const adminNavItem = document.querySelector(".admin-link");

   if (adminNavItem && !isAdmin) {
      adminNavItem.style.display = "none";
   }
});