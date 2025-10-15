document.addEventListener("DOMContentLoaded", async () => {
  // Forma i polja (ne menjamo tvoj HTML)
  const loginForm =
    document.querySelector(".login-card form") ||
    document.getElementById("signInForm");

  const usernameInput =
    document.querySelector('.login-card input[placeholder="Username"]') ||
    document.querySelector('.login-card input[type="text"]');

  const passwordInput = document.querySelector(
    '.login-card input[type="password"]'
  );

  // Ikonica katanca kao toggle
  const lockIcon =
    document.querySelector(".login-card .form-group .input-wrapper .fa-lock") ||
    document.querySelector(".login-card .fa-lock");

  const lang = localStorage.getItem("language") || "sr";

  // Učitaj korisnike (mini DB)
  let users = [];
  try {
    const res = await fetch("./users.json", { cache: "no-store" });
    users = await res.json();
  } catch (err) {
    console.error("Error loading users:", err);
  }

  // Toggle password prikaza
  lockIcon?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!passwordInput?.value) {
      alert(
        lang === "en"
          ? "You have to type in the password to be able to see it."
          : "Morate da unesete lozinku da biste mogli da je vidite."
      );
      return;
    }
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  });

  // Submit login forme
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Polje "Username" koristiš kao email
    const email = (usernameInput?.value || "").trim();
    const password = (passwordInput?.value || "").trim();

    if (!email || !password) {
      alert(
        lang === "en"
          ? "Please enter email and password."
          : "Unesite email i lozinku."
      );
      // neuspešan pokušaj -> homepage
      window.location.href = "http://127.0.0.1:5501/homepage/index.html";
      return;
    }

    const hashedPassword = await hashPassword(password);

    // Provera u "bazi"
    const user = users.find(
      (u) => u.email === email && u.password === hashedPassword
    );

    if (user) {
      // Uspelo: obeleži login i vodi na TRUEL0GIN
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", user.email);
      window.location.href = "http://127.0.0.1:5501/truelogin/index.html";
    } else {
      // Nije uspelo: flag na false i vodi na HOMEPAGE
      localStorage.setItem("isLoggedIn", "false");
      alert(
        lang === "en"
          ? "Invalid email or password. Please try again."
          : "Nevažeći email ili lozinka. Pokušajte ponovo."
      );
      window.location.href = "http://127.0.0.1:5501/homepage/index.html";
    }
  });

  // SHA-256 helper
  async function hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const buf = await crypto.subtle.digest("SHA-256", data);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
});
