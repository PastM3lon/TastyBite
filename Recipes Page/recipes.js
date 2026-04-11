 const isAdmin = localStorage.getItem("isAdmin") === "true";
 const adminLink = document.querySelector('a[href="../Admin/Admin.html"]');
    if (!isAdmin) {
     adminLink.style.display = "none";
    }     