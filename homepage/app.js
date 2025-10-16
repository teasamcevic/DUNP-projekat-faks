document.addEventListener("DOMContentLoaded", () => {
  const searchIcon   = document.querySelector(".search-icon");
  const searchInput  = document.getElementById("search");
  const menuButton   = document.querySelector(".menu");
  const navLinks     = document.querySelector(".drugiRedNavigacije .linkovi");
  const linkovi2     = document.querySelector(".drugiRedNavigacije .linkovi2");

  // === 1) Search toggle (ostaje tvoja logika) ===
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
    return anchors
      .map((a) => ({
        text: a.textContent ? a.textContent.trim() : "",
        href: a.getAttribute("href") || "",
      }))
      .filter((item) => item.text.length > 0 && item.href.length > 0);
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
  }

  // === 3) Dinamičko PREMEŠTANJE search-a i SPAJANJE linkova na telefonu ===
  const firstRow      = document.querySelector(".prviRedNavigacije");
  const firstRowLinks = firstRow ? firstRow.querySelectorAll(".linkovi a") : [];
  const secondRow     = document.querySelector(".drugiRedNavigacije");
  const searchContainerOriginal = document.querySelector(".prviRedNavigacije .search-container");
  let placeholder = null; // gde da vratimo search na desktopu
  let movedToSecondRow = false;
  let mergedLinks = false;

  const moveToMobile = () => {
    if (!secondRow) return;

    // 3a) Prebaci SEARCH u drugi red (ako već nije)
    if (searchContainerOriginal && !movedToSecondRow) {
      placeholder = document.createComment("search-placeholder");
      searchContainerOriginal.parentNode.insertBefore(placeholder, searchContainerOriginal.nextSibling);
      // Umetni search-container ispred hamburgera (pre .menu)
      secondRow.insertBefore(searchContainerOriginal, menuButton);
      movedToSecondRow = true;
    }

    // 3b) Ubaci linkove iz prvog reda u dropdown (na vrh liste), jednom
    if (linkovi2 && !mergedLinks && firstRowLinks.length) {
      const titlesInDropdown = Array.from(linkovi2.querySelectorAll("a")).map(a => a.textContent.trim());
      // ubaci na početak: POČETNA, SARADNJA, PROJEKTI (redosled kojim stoje u prvom redu)
      Array.from(firstRowLinks).forEach((a, idx) => {
        if (!titlesInDropdown.includes(a.textContent.trim())) {
          const clone = a.cloneNode(true);
          linkovi2.insertBefore(clone, linkovi2.children[idx] || linkovi2.firstChild);
        }
      });
      mergedLinks = true;
    }
  };

  const moveBackToDesktop = () => {
    // vrati SEARCH nazad u prvi red
    if (placeholder && movedToSecondRow) {
      placeholder.parentNode.insertBefore(searchContainerOriginal, placeholder);
      placeholder.remove();
      placeholder = null;
      movedToSecondRow = false;
    }
    // dropdown ostaje sa dodatim linkovima — to je ok i na desktopu jer se ne prikazuje
  };

  const applyResponsivePlacement = () => {
    if (window.innerWidth <= 480) moveToMobile();
    else moveBackToDesktop();
  };

  applyResponsivePlacement();
  window.addEventListener("resize", applyResponsivePlacement);
});
