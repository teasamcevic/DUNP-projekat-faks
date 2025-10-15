// Ako nije ulogovan -> homepage
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
if (!isLoggedIn) {
  window.location.href = "http://127.0.0.1:5501/homepage/index.html";
}

// (Opcionalno) Ako imaš dugme/link na truelogin strani za nastavak,
// npr. <a id="goUsers" href="#">Nastavi</a>, možemo da ga "usmerimo" ka strani korisnika.
document.getElementById("goUsers")?.addEventListener("click", (e) => {
  e.preventDefault();
  // ovde stavi gde želiš dalje (npr. konsultacije ili korisnici)
  window.location.href = "http://127.0.0.1:5501/konsultacije/index.html";
});

// Ako želiš automatski prelazak posle par sekundi, odkomentariši:
// setTimeout(() => {
//   window.location.href = "http://127.0.0.1:5501/konsultacije/index.html";
// }, 1500);
