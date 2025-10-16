
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
if (!isLoggedIn) {
  window.location.href = "../homepage/index.html";
}


document.getElementById("goUsers")?.addEventListener("click", (e) => {
  e.preventDefault();

  window.location.href = "../konsultacije/index.html";
});

