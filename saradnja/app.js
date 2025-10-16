document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.querySelector(".search-icon");
  const searchInput = document.getElementById("search");
  const menuButton = document.querySelector(".menu");
  const navLinks = document.querySelector(".drugiRedNavigacije .linkovi");
  const linkovi2 = document.querySelector(".drugiRedNavigacije .linkovi2");

  // Search toggle
  if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", () => {
      searchInput.classList.toggle("active");
      if (searchInput.classList.contains("active")) searchInput.focus();
    });
  }

  // Search functionality
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

  // Close search when clicking outside
  document.addEventListener("click", (event) => {
    if (!searchIcon || !searchInput) return;
    if (
      !searchIcon.contains(event.target) &&
      !searchInput.contains(event.target)
    ) {
      searchInput.classList.remove("active");
    }
  });

  // Mobile dropdown toggle
  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      if (searchInput) searchInput.classList.remove("active");
    });
  }

  // Dynamic search and links merging for mobile
  const firstRow = document.querySelector(".prviRedNavigacije");
  const firstRowLinks = firstRow ? firstRow.querySelectorAll(".linkovi a") : [];
  const secondRow = document.querySelector(".drugiRedNavigacije");
  const searchContainerOriginal = document.querySelector(
    ".prviRedNavigacije .search-container"
  );
  let placeholder = null;
  let movedToSecondRow = false;
  let mergedLinks = false;

  const moveToMobile = () => {
    if (!secondRow) return;

    // Move search to second row
    if (searchContainerOriginal && !movedToSecondRow) {
      placeholder = document.createComment("search-placeholder");
      searchContainerOriginal.parentNode.insertBefore(
        placeholder,
        searchContainerOriginal.nextSibling
      );
      secondRow.insertBefore(searchContainerOriginal, menuButton);
      movedToSecondRow = true;
    }

    // Merge first row links into dropdown
    if (linkovi2 && !mergedLinks && firstRowLinks.length) {
      const titlesInDropdown = Array.from(linkovi2.querySelectorAll("a")).map(
        (a) => a.textContent.trim()
      );
      Array.from(firstRowLinks).forEach((a, idx) => {
        if (!titlesInDropdown.includes(a.textContent.trim())) {
          const clone = a.cloneNode(true);
          linkovi2.insertBefore(
            clone,
            linkovi2.children[idx] || linkovi2.firstChild
          );
        }
      });
      mergedLinks = true;
    }
  };

  const moveBackToDesktop = () => {
    if (placeholder && movedToSecondRow) {
      placeholder.parentNode.insertBefore(searchContainerOriginal, placeholder);
      placeholder.remove();
      placeholder = null;
      movedToSecondRow = false;
    }
  };

  const applyResponsivePlacement = () => {
    if (window.innerWidth <= 480) moveToMobile();
    else moveBackToDesktop();
  };

  applyResponsivePlacement();
  window.addEventListener("resize", applyResponsivePlacement);
});