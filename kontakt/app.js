document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll(".navigacija a"));
  const searchInput = document.getElementById("search");
  const langText = document.querySelector(".search-text p");
  const containerLeft = document.querySelector(".container .left-section");
  const containerRight = document.querySelector(".container .right-section");
  const footerP = document.querySelector(".tekstPoredIkonica2 p");

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
      container: {
        h1: "O UNIVERZITETU",
        paragraphs: [
          "Državni univerzitet u Novom Pazaru je među novim državnim univerzitetima u Srbiji u aprilu 2008. godine akreditovan za izvođenje osnovnih, master i doktorskih akademskih studija.",
          "Usledile su akreditacije 2013. i 2018. godine i nastava se izvodi na više od 30 studijskih programa.",
          "Ova visokoškolska institucija sarađuje sa brojnim univerzitetima, institucijama, visokim školama i drugim naučno-istraživačkim institucijama u zemlji i inostranstvu.",
          "Državni univerzitet ima dve zgrade, savremeno opremljene učionice i kabinete i 17 laboratorija sa modernom opremom, biblioteku sa čitaonicom i sportsku salu. Najveći broj studenata školuje se u trošku budžeta Republike Srbije.",
          "Univerzitet je osnovan uz podršku drugih državnih univerziteta u Srbiji, sa ciljem stvaranja sopstvenog kadra.",
        ],
      },
      containerRight: {
        h2: "19 GODINA SA NAMA",
        p: "DUNP spada među najmlađe visokoobrazovne ustanove u Srbiji. Osnovan je Odlukom Vlade Republike Srbije, 26. oktobra 2006. godine.",
      },
      footer: { email: "Elektronska pošta", phone: "Telefon", fax: "Faks" },
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
      container: {
        h1: "ABOUT THE UNIVERSITY",
        paragraphs: [
          "The State University of Novi Pazar is among the new state universities in Serbia, accredited in April 2008 for undergraduate, master, and doctoral studies.",
          "Accreditations were obtained in 2013 and 2018, and classes are conducted in more than 30 study programs.",
          "This higher education institution collaborates with numerous universities, institutions, colleges, and research institutions in the country and abroad.",
          "The State University has two buildings, modern classrooms and labs, 17 laboratories with modern equipment, a library with reading rooms, and a sports hall. Most students are government-funded.",
          "The university was founded with support from other Serbian state universities, aiming to develop its own staff.",
        ],
      },
      containerRight: {
        h2: "19 YEARS WITH US",
        p: "DUNP is among the youngest higher education institutions in Serbia. Founded by the Government of the Republic of Serbia on October 26, 2006.",
      },
      footer: { email: "Email", phone: "Phone", fax: "Fax" },
    },
  };

  // Učitaj jezik iz localStorage ili default
  let currentLang = localStorage.getItem("siteLang") || "sr";

  const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem("siteLang", lang);

    navLinks.forEach((link, i) => {
      if (translations[lang].nav[i])
        link.textContent = translations[lang].nav[i];
    });
    if (searchInput)
      searchInput.placeholder = translations[lang].searchPlaceholder;
    if (langText) langText.textContent = translations[lang].langSwitch;

    if (containerLeft) {
      const h1 = containerLeft.querySelector("h1");
      const paragraphs = Array.from(containerLeft.querySelectorAll("p"));
      if (h1) h1.textContent = translations[lang].container.h1;
      paragraphs.forEach((p, i) => {
        if (translations[lang].container.paragraphs[i])
          p.textContent = translations[lang].container.paragraphs[i];
      });
    }

    if (containerRight) {
      const h2 = containerRight.querySelector(".image-caption h2");
      const p = containerRight.querySelector(".image-caption p");
      if (h2) h2.textContent = translations[lang].containerRight.h2;
      if (p) p.textContent = translations[lang].containerRight.p;
    }

    if (footerP) {
      let html = footerP.innerHTML;
      html = html.replace(
        /Elektronska pošta|Email/g,
        translations[lang].footer.email
      );
      html = html.replace(/Telefon|Phone/g, translations[lang].footer.phone);
      html = html.replace(/Faks|Fax/g, translations[lang].footer.fax);
      footerP.innerHTML = html;
    }
  };

  // Klik na dugme jezika
  langText.addEventListener("click", () => {
    const newLang = currentLang === "sr" ? "en" : "sr";
    setLanguage(newLang);
    // localStorage čuva jezik → sve stranice prilikom reload-a koriste novi jezik
  });

  // Pri učitavanju stranice postavi jezik
  setLanguage(currentLang);
});