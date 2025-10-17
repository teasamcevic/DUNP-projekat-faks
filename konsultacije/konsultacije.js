document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.querySelector(".search-icon");
  const searchInput = document.getElementById("search");
  const menuButton = document.querySelector(".menu");
  const navLinks = document.querySelector(".drugiRedNavigacije .linkovi");
  const linkovi2 = document.querySelector(".drugiRedNavigacije .linkovi2");

  // helpers for i18n
  const t = (k) => (window.getTranslation ? window.getTranslation(k) : null);
  const curLang = () =>
    document.documentElement.getAttribute("lang") || "sr";

  // === 1) Search toggle ===
  if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", () => {
      searchInput.classList.toggle("active");
      if (searchInput.classList.contains("active")) searchInput.focus();
    });
  }

  // Search functionality with deduplication
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

  // Close search when clicking outside
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

    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuButton.contains(e.target)) {
        navLinks.classList.remove("active");
      }
    });
  }

  // === 3) Dynamic search and links merging for mobile ===
  const firstRow = document.querySelector(".prviRedNavigacije");
  const firstRowLinks = firstRow ? firstRow.querySelectorAll(".linkovi a") : [];
  const secondRow = document.querySelector(".drugiRedNavigacije");
  const searchContainerOriginal = document.querySelector(".prviRedNavigacije .search-container");
  let placeholder = null;
  let movedToSecondRow = false;

  const moveToMobile = () => {
    if (!secondRow) return;

    if (searchContainerOriginal && !movedToSecondRow && searchContainerOriginal.parentNode === firstRow) {
      placeholder = document.createComment("search-placeholder");
      searchContainerOriginal.parentNode.insertBefore(placeholder, searchContainerOriginal.nextSibling);
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

  // ========== LOGIN GUARD ==========
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    window.location.href = "../homepage/index.html";
    return;
  }

  // ========== KONSULTACIJE - FETCH + FILTRIRANJE + RENDER ==========
  const API_URL = "../api/profesori.json";
  const root = document.getElementById("consultationsRoot");
  const programSel = document.getElementById("programFilter");
  const danSel = document.getElementById("danFilter");
  const searchInputKons = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearBtn");

  const latinNoDiacritics = (s = "") =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");

  // ---- Program codes (stabilni), renderovani naziv ide iz translations
  const PROGRAM_CODE = {
    softwareEngineering: "softwareEngineering",
    mathematics: "mathematics",
    civilEngineering: "civilEngineering",
  };

  // ✅ ROBUSTNIJE mapiranje – hvata softver/matemat/gradje(v|n) + tipfelere
  function getProgramCode(raw = "") {
    const n = latinNoDiacritics(String(raw)).toLowerCase();
    const s = n.replace(/\s+/g, "");

    if (s.includes("softver") || s.includes("softversk")) {
      return PROGRAM_CODE.softwareEngineering;
    }
    if (s.includes("matemat")) {
      return PROGRAM_CODE.mathematics;
    }
    if (
      s.includes("gradjev") ||
      s.includes("gradjeni") ||
      s.includes("gradjenj") ||
      s.includes("gradje")
    ) {
      return PROGRAM_CODE.civilEngineering;
    }
    return null;
  }

  function getProgramName(code, fallbackRaw) {
    if (!code) {
      return fallbackRaw || (curLang() === "en" ? "Program" : "Program");
    }
    const trKey = `konsultacije.${code}`;
    return t(trKey) || fallbackRaw || (curLang() === "en" ? "Program" : "Program");
  }

  function labels() {
    return {
      name: t("konsultacije.nameLabel") || (curLang() === "en" ? "Name:" : "Ime:"),
      subject: t("konsultacije.subjectLabel") || (curLang() === "en" ? "Subject:" : "Predmet:"),
      consult: t("konsultacije.consultationsLabel") || (curLang() === "en" ? "Consultations:" : "Konsultacije:"),
      program: t("konsultacije.programLabel") || (curLang() === "en" ? "Program:" : "Program:"),
      noProgResults: t("konsultacije.noResults") || (curLang() === "en" ? "No results in this program." : "Nema rezultata u ovom programu."),
      noAnyResults: t("konsultacije.noResultsMsg") || (curLang() === "en" ? "No results. Try different filters or search." : "Nema rezultata. Pokušaj drugačiji filter ili pretragu."),
    };
  }

  const extractDan = (kons) => {
    const m = String(kons || "").trim().split(/\s+/)[0] || "";
    return latinNoDiacritics(m).toLowerCase();
  };

  const cardHTML = (p) => {
    const L = labels();
    const code = getProgramCode(p.Program);
    const progName = getProgramName(code, p.Program);
    return `
      <div class="professor-card">
        <div class="info-line"><span class="label">${L.name}</span> ${p.Ime}</div>
        <div class="info-line"><span class="label">${L.subject}</span> ${p.Predmet}</div>
        <div class="info-line"><span class="label">${L.consult}</span> ${p.Konsultacije}</div>
        <div class="info-line"><span class="label">${L.program}</span> ${progName}</div>
      </div>
    `;
  };

  const groupByProgramCode = (items) =>
    items.reduce((acc, it) => {
      const code = getProgramCode(it.Program) || "_other_" + (latinNoDiacritics(it.Program).toLowerCase() || "program");
      (acc[code] ||= []).push(it);
      return acc;
    }, {});

  let DATA = [];

  async function load() {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Greška pri čitanju API-ja");
    DATA = (await res.json()).map((x) => ({
      ...x,
      Ime: String(x.Ime || "").trim(),
      Predmet: String(x.Predmet || "").trim(),
      Konsultacije: String(x.Konsultacije || "").trim(),
      Program: String(x.Program || "").trim(),
    }));
  }

  function buildProgramOptions(preserveSelection = true) {
    const prev = preserveSelection ? programSel.value : "";

    const keepFirst = programSel.querySelector('option[value=""]');
    programSel.innerHTML = "";
    if (keepFirst) programSel.appendChild(keepFirst);

    const codes = new Set(
      DATA.map((d) => getProgramCode(d.Program)).filter(Boolean)
    );

    const entries = Array.from(codes).map((code) => ({
      code,
      name: getProgramName(code),
    })).sort((a, b) => a.name.localeCompare(b.name));

    for (const { code, name } of entries) {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = name;
      programSel.appendChild(opt);
    }

    if (preserveSelection && prev && Array.from(programSel.options).some(o => o.value === prev)) {
      programSel.value = prev;
    } else {
      programSel.value = "";
    }
  }

  function attachEvents() {
    [programSel, danSel].forEach((el) => el.addEventListener("change", render));
    searchInputKons.addEventListener("input", debounce(render, 150));
    clearBtn.addEventListener("click", () => {
      programSel.value = "";
      danSel.value = "";
      searchInputKons.value = "";
      render();
    });

    window.addEventListener("language-changed", () => {
      buildProgramOptions(true);
      render();
    });
  }

  function debounce(fn, delay = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  function render() {
    const q = latinNoDiacritics(searchInputKons.value || "").toLowerCase().trim();
    const progCode = (programSel.value || "");
    const danVal = (danSel.value || "").toLowerCase();

    const filtered = DATA.filter((p) => {
      const name = latinNoDiacritics(p.Ime).toLowerCase();
      const subj = latinNoDiacritics(p.Predmet).toLowerCase();
      const code = getProgramCode(p.Program) || "";
      const dan = extractDan(p.Konsultacije);

      const passSearch = q ? name.includes(q) || subj.includes(q) : true;
      const passProg = progCode ? code === progCode : true;
      const passDan = danVal ? dan === danVal : true;

      return passSearch && passProg && passDan;
    });

    const byCode = groupByProgramCode(filtered);
    const keys = Object.keys(byCode).sort((a, b) => {
      const A = getProgramName(a.startsWith("_other_") ? null : a, a.replace(/^_other_/, ""));
      const B = getProgramName(b.startsWith("_other_") ? null : b, b.replace(/^_other_/, ""));
      return A.localeCompare(B);
    });

    const L = labels();
    const html = keys.map((code) => {
      const isOther = code.startsWith("_other_");
      const fallback = isOther ? code.replace(/^_other_/, "") : null;
      const programName = getProgramName(isOther ? null : code, fallback);
      const cards = byCode[code].map(cardHTML).join("");
      return `
        <div class="program-section">
          <h2 class="section-title">${programName}</h2>
          ${cards || `<div style="color:#6b7280">${L.noProgResults}</div>`}
        </div>
      `;
    }).join("");

    root.innerHTML = html || `<div style="color:#6b7280">${L.noAnyResults}</div>`;
  }

  (async function init() {
    try {
      await load();
      buildProgramOptions(false);
      attachEvents();
      render();
    } catch (e) {
      root.innerHTML = `<div style="color:#b42318">Neuspelo učitavanje podataka: ${e.message}</div>`;
    }
  })();
});
