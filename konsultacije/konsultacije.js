// ========== Guard: ako nije ulogovan -> homepage ==========
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
if (!isLoggedIn) {
  window.location.href = "http://127.0.0.1:5501/homepage/index.html";
}

// ========== Fetch + filtriranje + render ==========
const API_URL = "http://127.0.0.1:5501/api/profesori.json";
const root = document.getElementById("consultationsRoot");
const programSel = document.getElementById("programFilter");
const danSel = document.getElementById("danFilter");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");

const latinNoDiacritics = (s = "") =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

const prettyProgram = (p) => {
  const n = latinNoDiacritics(String(p || "")).toLowerCase();
  if (n.includes("softversko")) return "Softversko inženjerstvo";
  if (n.includes("matematika")) return "Matematika";
  if (n.includes("gradjenivarstvo") || n.includes("građevinarstvo"))
    return "Građevinarstvo";
  return p || "Program";
};

const extractDan = (kons) => {
  const m =
    String(kons || "")
      .trim()
      .split(/\s+/)[0] || "";
  return latinNoDiacritics(m).toLowerCase();
};

const cardHTML = (p) => `
  <div class="professor-card">
    <div class="info-line"><span class="label">Ime:</span> ${p.Ime}</div>
    <div class="info-line"><span class="label">Predmet:</span> ${
      p.Predmet
    }</div>
    <div class="info-line"><span class="label">Konsultacije:</span> ${
      p.Konsultacije
    }</div>
    <div class="info-line"><span class="label">Program:</span> ${prettyProgram(
      p.Program
    )}</div>
  </div>
`;

const groupByProgram = (items) =>
  items.reduce((acc, it) => {
    const key = prettyProgram(it.Program);
    (acc[key] ||= []).push(it);
    return acc;
  }, {});

let DATA = [];

(async function init() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Greška pri čitanju API-ja");
    DATA = (await res.json()).map((x) => ({
      ...x,
      Ime: String(x.Ime || "").trim(),
      Predmet: String(x.Predmet || "").trim(),
      Konsultacije: String(x.Konsultacije || "").trim(),
      Program: String(x.Program || "").trim(),
    }));

    // Popuni program dropdown
    const programs = [
      ...new Set(DATA.map((d) => prettyProgram(d.Program))),
    ].sort();
    for (const p of programs) {
      const opt = document.createElement("option");
      opt.value = latinNoDiacritics(p).toLowerCase();
      opt.textContent = p;
      programSel.appendChild(opt);
    }

    attachEvents();
    render();
  } catch (e) {
    root.innerHTML = `<div style="color:#b42318">Neuspelo učitavanje podataka: ${e.message}</div>`;
  }
})();

function attachEvents() {
  [programSel, danSel].forEach((el) => el.addEventListener("change", render));
  searchInput.addEventListener("input", debounce(render, 150));
  clearBtn.addEventListener("click", () => {
    programSel.value = "";
    danSel.value = "";
    searchInput.value = "";
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
  const q = latinNoDiacritics(searchInput.value || "")
    .toLowerCase()
    .trim();
  const progVal = (programSel.value || "").toLowerCase();
  const danVal = (danSel.value || "").toLowerCase();

  const filtered = DATA.filter((p) => {
    const name = latinNoDiacritics(p.Ime).toLowerCase();
    const subj = latinNoDiacritics(p.Predmet).toLowerCase();
    const prog = latinNoDiacritics(prettyProgram(p.Program)).toLowerCase();
    const dan = extractDan(p.Konsultacije);

    const passSearch = q ? name.includes(q) || subj.includes(q) : true;
    const passProg = progVal ? prog.includes(progVal) : true;
    const passDan = danVal ? dan === danVal : true;

    return passSearch && passProg && passDan;
  });

  const byProg = groupByProgram(filtered);
  const html = Object.keys(byProg)
    .sort()
    .map((programName) => {
      const cards = byProg[programName].map(cardHTML).join("");
      return `
      <div class="program-section">
        <h2 class="section-title">${programName}</h2>
        ${
          cards ||
          '<div style="color:#6b7280">Nema rezultata u ovom programu.</div>'
        }
      </div>
    `;
    })
    .join("");

  root.innerHTML =
    html ||
    '<div style="color:#6b7280">Nema rezultata. Pokušaj drugačiji filter ili pretragu.</div>';
}
