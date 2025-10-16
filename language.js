document.addEventListener("DOMContentLoaded", () => {
  const translations = {
    sr: {
      nav: [
        "POČETNA",
        "SARADNJA",
        "PROJEKTI",
        "UNIVERZITET",
        "DEPARTMANI",
        "STUDIRANJE",
        "UPIS",
        "KONTAKT",
      ],
      searchPlaceholder: "Pretraga...",
      langSwitch: "EN",
      headerH1: "ULOGUJ SE!",
      headerP:
        "Za pristup stranici o nastavnom osoblju i više informacija o istom, potrebno je ulogovati se.",
      loginTitle: "PRIJAVA",
      usernamePlaceholder: "Korisničko ime",
      passwordPlaceholder: "Lozinka",
      forgotPassword: "Zaboravljena lozinka?",
      loginButton: "PRIJAVA",
      errorEmptyUsername: "Molimo unesite email.",
      errorEmptyPassword: "Molimo unesite lozinku.",
      errorInvalid: "Nevažeći email ili lozinka.",
    },
    en: {
      nav: [
        "HOME",
        "COOPERATION",
        "PROJECTS",
        "UNIVERSITY",
        "DEPARTMENTS",
        "STUDY",
        "ADMISSION",
        "CONTACT",
      ],
      searchPlaceholder: "Search...",
      langSwitch: "SR",
      headerH1: "LOGIN",
      headerP:
        "To access the teaching staff page and more information, you need to log in.",
      loginTitle: "LOGIN",
      usernamePlaceholder: "Username",
      passwordPlaceholder: "Password",
      forgotPassword: "Forgot password?",
      loginButton: "LOGIN",
      errorEmptyUsername: "Please enter email.",
      errorEmptyPassword: "Please enter password.",
      errorInvalid: "Invalid email or password.",
    },
  };

  let currentLang = "sr";

  const searchInput = document.getElementById("search");
  const langText = document.querySelector(".search-text p");
  const navLinks = Array.from(document.querySelectorAll(".navigacija a"));
  const headerH1 = document.querySelector(".left-section h1");
  const headerP = document.querySelector(".left-section p");
  const loginTitle = document.querySelector(".login-title");
  const usernameInput = document.querySelector(
    '.login-card input[type="text"]'
  );
  const passwordInput = document.querySelector(
    '.login-card input[type="password"]'
  );
  const forgotPasswordLink = document.querySelector(".forgot-password a");
  const loginButton = document.querySelector(".login-button");

  const getErrorSpan = (input) => {
    let span = input.parentNode.querySelector(".error-message");
    if (!span) {
      span = document.createElement("span");
      span.classList.add("error-message");
      span.style.color = "red";
      span.style.fontSize = "0.9rem";
      span.style.display = "block";
      span.style.marginTop = "5px";
      input.parentNode.appendChild(span);
    }
    return span;
  };

  const usernameError = getErrorSpan(usernameInput);
  const passwordError = getErrorSpan(passwordInput);

  const setLanguage = (lang) => {
    currentLang = lang;
    navLinks.forEach((link, i) => {
      if (translations[lang].nav[i])
        link.textContent = translations[lang].nav[i];
    });
    searchInput.placeholder = translations[lang].searchPlaceholder;
    langText.textContent = translations[lang].langSwitch;
    headerH1.textContent = translations[lang].headerH1;
    headerP.textContent = translations[lang].headerP;
    loginTitle.textContent = translations[lang].loginTitle;
    usernameInput.placeholder = translations[lang].usernamePlaceholder;
    passwordInput.placeholder = translations[lang].passwordPlaceholder;
    forgotPasswordLink.textContent = translations[lang].forgotPassword;
    loginButton.textContent = translations[lang].loginButton;

    if (
      usernameError.textContent ===
        translations[lang === "sr" ? "en" : "sr"].errorEmptyUsername ||
      usernameError.textContent ===
        translations[lang === "sr" ? "en" : "sr"].errorInvalid
    )
      usernameError.textContent = "";
    if (
      passwordError.textContent ===
        translations[lang === "sr" ? "en" : "sr"].errorEmptyPassword ||
      passwordError.textContent ===
        translations[lang === "sr" ? "en" : "sr"].errorInvalid
    )
      passwordError.textContent = "";
  };

  langText.addEventListener("click", () => {
    setLanguage(currentLang === "sr" ? "en" : "sr");
  });

  setLanguage(currentLang);

  const loginForm = document.querySelector(".login-card form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    usernameError.textContent = "";
    passwordError.textContent = "";
    const email = (usernameInput.value || "").trim();
    const password = (passwordInput.value || "").trim();
    let hasError = false;

    if (!email) {
      usernameError.textContent = translations[currentLang].errorEmptyUsername;
      hasError = true;
    }
    if (!password) {
      passwordError.textContent = translations[currentLang].errorEmptyPassword;
      hasError = true;
    }
    if (hasError) return;

    let users = [];
    try {
      const res = await fetch("./users.json", { cache: "no-store" });
      users = await res.json();
    } catch (err) {
      console.error("Error loading users:", err);
    }

    const hashedPassword = await hashPassword(password);
    const user = users.find(
      (u) => u.email === email && u.password === hashedPassword
    );

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", user.email);
      window.location.href = "http://127.0.0.1:5501/truelogin/index.html";
    } else {
      usernameError.textContent = translations[currentLang].errorInvalid;
      passwordError.textContent = translations[currentLang].errorInvalid;
      localStorage.setItem("isLoggedIn", "false");
    }
  });

  async function hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const buf = await crypto.subtle.digest("SHA-256", data);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
});