document.addEventListener("DOMContentLoaded", () => {
  const searchIcon   = document.querySelector(".search-icon");
  const searchInput  = document.getElementById("search");
  const menuButton   = document.querySelector(".menu");
  const navLinks     = document.querySelector(".drugiRedNavigacije .linkovi");
  const linkovi2     = document.querySelector(".drugiRedNavigacije .linkovi2");

  // === 1) Search toggle ===
  if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", () => {
      searchInput.classList.toggle("active");
      if (searchInput.classList.contains("active")) searchInput.focus();
    });
  }

  // Enter -> navigacija na najbliži link po nazivu
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

  // Zatvaranje searcha klikom van
  document.addEventListener("click", (event) => {
    if (!searchIcon || !searchInput) return;
    if (!searchIcon.contains(event.target) && !searchInput.contains(event.target)) {
      searchInput.classList.remove("active");
    }
  });

  // === 2) Mobile dropdown toggle ===
  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      if (searchInput) searchInput.classList.remove("active");
    });

    // Zatvori meni klikom van
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuButton.contains(e.target)) {
        navLinks.classList.remove("active");
      }
    });
  }

  // === 3) Dinamičko PREMEŠTANJE search-a i SPAJANJE linkova na telefonu ===
  const firstRow      = document.querySelector(".prviRedNavigacije");
  const firstRowLinks = firstRow ? firstRow.querySelectorAll(".linkovi a") : [];
  const secondRow     = document.querySelector(".drugiRedNavigacije");
  const searchContainerOriginal = document.querySelector(".prviRedNavigacije .search-container");
  let placeholder = null;
  let movedToSecondRow = false;

  const moveToMobile = () => {
    if (!secondRow) return;

    // 3a) Prebaci SEARCH u drugi red (ako već nije)
    if (searchContainerOriginal && !movedToSecondRow && searchContainerOriginal.parentNode === firstRow) {
      placeholder = document.createComment("search-placeholder");
      searchContainerOriginal.parentNode.insertBefore(placeholder, searchContainerOriginal.nextSibling);
      // Umetni search-container ispred hamburgera (pre .menu)
      secondRow.insertBefore(searchContainerOriginal, menuButton);
      movedToSecondRow = true;
    }

    // 3b) Ubaci linkove iz prvog reda u dropdown (na vrh liste), samo jednom
    if (linkovi2 && firstRowLinks.length) {
      // Proveri da li su linkovi već dodati
      const existingLinks = Array.from(linkovi2.querySelectorAll("a")).map(a => a.textContent.trim());
      const firstRowTexts = Array.from(firstRowLinks).map(a => a.textContent.trim());
      
      // Proveri da li su već svi linkovi iz prvog reda u dropdownu
      const allLinksPresent = firstRowTexts.every(text => existingLinks.includes(text));
      
      if (!allLinksPresent) {
        // Dodaj samo one linkove koji još nisu u dropdownu
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
    // Vrati SEARCH nazad u prvi red
    if (placeholder && movedToSecondRow && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(searchContainerOriginal, placeholder);
      placeholder.remove();
      placeholder = null;
      movedToSecondRow = false;
    }

    // Ukloni mobile linkove iz dropdowna
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
});