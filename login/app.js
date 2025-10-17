document.addEventListener("DOMContentLoaded", async () => {
  const searchIcon = document.querySelector(".search-icon");
  const searchInput = document.getElementById("search");
  const menuButton = document.querySelector(".menu");
  const navLinks = document.querySelector(".drugiRedNavigacije .linkovi");
  const linkovi2 = document.querySelector(".drugiRedNavigacije .linkovi2");

  
  const tr = (key) => (window.getTranslation ? window.getTranslation(key) : key);
  const getLang = () => (document.documentElement.getAttribute("lang") || "sr");
  const T = (lng, key) => (window.translations?.[lng]?.login?.[key] || "");


  if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", () => {
      searchInput.classList.toggle("active");
      if (searchInput.classList.contains("active")) searchInput.focus();
    });
  }

  const normalize = (value) =>
    (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const getNavigableLinks = () => {
    const anchors = Array.from(document.querySelectorAll(".navigacija a"));
    const seen = new Set();
    return anchors
      .map((a) => ({
        text: a.textContent ? a.textContent.trim() : "",
        href: a.getAttribute("href") || "",
      }))
      .filter((item) => {
        if (item.text.length === 0 || item.href.length === 0) return false;
        const key = `${item.text}|${item.href}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  };

  const findBestMatch = (query, items) => {
    const q = normalize(query);
    if (!q) return null;
    const scored = items
      .map((item) => {
        const t = normalize(item.text);
        let score = -1;
        if (t === q) score = 3;
        else if (t.startsWith(q)) score = 2;
        else if (t.includes(q)) score = 1;
        return { item, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.length ? scored[0].item : null;
  };

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const links = getNavigableLinks();
        const match = findBestMatch(searchInput.value, links);
        if (match) window.location.href = match.href;
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (!searchIcon || !searchInput) return;
    if (
      !searchIcon.contains(event.target) &&
      !searchInput.contains(event.target)
    ) {
      searchInput.classList.remove("active");
    }
  });

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      if (searchInput) searchInput.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuButton.contains(e.target)) {
        navLinks.classList.remove("active");
      }
    });
  }

  const firstRow = document.querySelector(".prviRedNavigacije");
  const firstRowLinks = firstRow ? firstRow.querySelectorAll(".linkovi a") : [];
  const secondRow = document.querySelector(".drugiRedNavigacije");
  const searchContainerOriginal = document.querySelector(
    ".prviRedNavigacije .search-container"
  );
  let placeholder = null;
  let movedToSecondRow = false;

  const moveToMobile = () => {
    if (!secondRow) return;

    if (searchContainerOriginal && !movedToSecondRow && searchContainerOriginal.parentNode === firstRow) {
      placeholder = document.createComment("search-placeholder");
      searchContainerOriginal.parentNode.insertBefore(
        placeholder,
        searchContainerOriginal.nextSibling
      );
      secondRow.insertBefore(searchContainerOriginal, menuButton);
      movedToSecondRow = true;
    }

    if (linkovi2 && firstRowLinks.length) {
      const existingLinks = Array.from(linkovi2.querySelectorAll("a")).map(a => a.textContent.trim());
      const firstRowTexts = Array.from(firstRowLinks).map(a => a.textContent.trim());
      
      const allLinksPresent = firstRowTexts.every(text => existingLinks.includes(text));
      
      if (!allLinksPresent) {
        Array.from(firstRowLinks).reverse().forEach((a) => {
          const linkText = a.textContent.trim();
          if (!existingLinks.includes(linkText)) {
            const clone = a.cloneNode(true);
            clone.setAttribute('data-mobile-link', 'true');
            linkovi2.insertBefore(clone, linkovi2.firstChild);
          }
        });
      }
    }
  };

  const moveBackToDesktop = () => {
    if (placeholder && movedToSecondRow && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(searchContainerOriginal, placeholder);
      placeholder.remove();
      placeholder = null;
      movedToSecondRow = false;
    }

    if (linkovi2) {
      const mobileLinks = linkovi2.querySelectorAll('[data-mobile-link="true"]');
      mobileLinks.forEach(link => link.remove());
    }
  };

  const applyResponsivePlacement = () => {
    if (window.innerWidth <= 480) {
      moveToMobile();
    } else {
      moveBackToDesktop();
    }
  };

  applyResponsivePlacement();
  
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(applyResponsivePlacement, 100);
  });

  
  const loginForm = document.querySelector(".login-card form");
  const usernameInput = document.querySelector('.login-card input[type="text"]');
  const passwordInput = document.querySelector('.login-card input[type="password"]');
  const lockIcon = document.querySelector(".login-card .fa-lock");

  const passwordFormGroup = passwordInput?.closest(".form-group");
  let errorSpan = passwordFormGroup?.querySelector(".error-message");
  if (!errorSpan && passwordFormGroup) {
    errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message");
    errorSpan.style.color = "red";
    errorSpan.style.fontSize = "0.9rem";
    errorSpan.style.display = "block";
    errorSpan.style.marginTop = "5px";
    passwordFormGroup.appendChild(errorSpan);
  }

 
  const errorPairs = [
    [T("sr","emptyUsernameError"),      T("en","emptyUsernameError")],
    [T("sr","emptyPasswordError"),      T("en","emptyPasswordError")],
    [T("sr","invalidCredentialsError"), T("en","invalidCredentialsError")],
    [T("sr","passwordVisibilityError"), T("en","passwordVisibilityError")],
  ];
  function syncErrorLang() {
    if (!errorSpan) return;
    const txt = (errorSpan.textContent || "").trim();
    for (const [srTxt, enTxt] of errorPairs) {
      if (!srTxt || !enTxt) continue;
      if (getLang() === "en" && txt === srTxt) { errorSpan.textContent = enTxt; break; }
      if (getLang() === "sr" && txt === enTxt) { errorSpan.textContent = srTxt; break; }
    }
  }

  new MutationObserver(syncErrorLang).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  let users = [];
  try {
    const res = await fetch("./users.json", { cache: "no-store" });
    users = await res.json();
  } catch (err) {
    console.error("Error loading users:", err);
  }

  lockIcon?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!passwordInput?.value) {
      errorSpan.textContent = tr("login.passwordVisibilityError");
      return;
    }
    errorSpan.textContent = "";
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  });


  usernameInput?.addEventListener("input", () => {
    errorSpan.textContent = "";
  });

  passwordInput?.addEventListener("input", () => {
    errorSpan.textContent = "";
  });

 
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorSpan.textContent = "";

    const email = (usernameInput?.value || "").trim();
    const password = (passwordInput?.value || "").trim();

  
    if (!email) {
      errorSpan.textContent = tr("login.emptyUsernameError");
      return;
    }

    if (!password) {
      errorSpan.textContent = tr("login.emptyPasswordError");
      return;
    }

  
    const hashedPassword = await hashPassword(password);

    const user = users.find(
      (u) => u.email === email && u.password === hashedPassword
    );

    if (user) {
  
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", user.email);
      window.location.href = "../truelogin/index.html";
    } else {
    
      localStorage.setItem("isLoggedIn", "false");
      errorSpan.textContent = tr("login.invalidCredentialsError");
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
