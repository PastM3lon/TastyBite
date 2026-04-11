 function handleSubmit() {
  let check = document.getElementById("signUpIsAdmin");
  let isAdmin = check.checked;
  localStorage.setItem("isAdmin", isAdmin);
  return true;}