/* ===== app-lang.js (full strict mapping for all pages) ===== */
/* global translations */

(function () {
  const STORAGE_KEY = 'lang';
  const DEFAULT_LANG = 'sr';
  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  // helpers
  const qs  = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
  const setText = (el, v) => { if (el && typeof v === 'string') el.textContent = v; };
  const setHTML = (el, v) => { if (el && typeof v === 'string') el.innerHTML = v; };
  const setPH   = (el, v) => { if (el && typeof v === 'string') el.placeholder = v; };

  function t(path) {
    const parts = path.split('.');
    let obj = translations[currentLang];
    for (const p of parts) {
      if (!obj || typeof obj !== 'object') return null;
      obj = obj[p];
    }
    return (typeof obj === 'string') ? obj : obj;
  }

  // --- COMMON: NAV + FOOTER ---
  function applyNav() {
    const top = qsa('.prviRedNavigacije .linkovi a');
    if (top[0]) setText(top[0], t('nav.pocetna'));
    if (top[1]) setText(top[1], t('nav.saradnja'));
    if (top[2]) setText(top[2], t('nav.projekti'));

    const bottom = qsa('.drugiRedNavigacije .linkovi2 a');
    if (bottom[0]) setText(bottom[0], t('nav.univerzitet'));
    if (bottom[1]) setText(bottom[1], t('nav.departmani'));
    if (bottom[2]) setText(bottom[2], t('nav.studiranje'));
    if (bottom[3]) setText(bottom[3], t('nav.upis'));
    if (bottom[4]) setText(bottom[4], t('nav.kontakt'));

    const search = qs('.search-container .search-input');
    if (search && t('searchPlaceholder')) setPH(search, t('searchPlaceholder'));

    const langP = qs('.search-container .search-text p');
    if (langP) setText(langP, (currentLang === 'sr') ? 'EN' : 'SR');
  }

  function applyFooter() {
    const addr = qs('.tekstPoredIkonica1 p');
    if (addr && t('footer.address')) setHTML(addr, t('footer.address'));

    const copy = qs('.tekstZaCopyright p');
    if (copy && t('footer.copyright')) setText(copy, t('footer.copyright'));
  }

  // --- PAGE KEY ---
  function pageKey() {
    const p = location.pathname.toLowerCase();
    if (p.includes('/homepage/'))     return 'homepage';
    if (p.includes('/univerzitet/'))  return 'univerzitet';
    if (p.includes('/saradnja/'))     return 'saradnja';
    if (p.includes('/projekti/'))     return 'projekti';
    if (p.includes('/departmani/'))   return 'departmani';
    if (p.includes('/pravnenauke/'))  return 'pravnenauke';
    if (p.includes('/studiranje/'))   return 'studiranje';
    if (p.includes('/upis/'))         return 'upis';
    if (p.includes('/kontakt/'))      return 'kontakt';
    if (p.includes('/login/'))        return 'login';
    if (p.includes('/checked/') || p.includes('/truelogin/')) return 'truelogin';
    if (p.includes('/konsultacije/')) return 'konsultacije';
    return 'homepage';
  }

  // --- PAGES ---

  // HOMEPAGE
  function applyHomepage() {
    const heroP = qsa('.tekstPreko h1 p');
    if (heroP[0] && t('homepage.welcomeTo')) setText(heroP[0], t('homepage.welcomeTo'));
    if (heroP[1] && t('homepage.universityName')) setText(heroP[1], t('homepage.universityName'));
    if (heroP[2] && t('homepage.inNoviPazar')) setText(heroP[2], t('homepage.inNoviPazar'));

    const d1h1 = qs('.drugiDeo1 h1');
    const d1h3 = qs('.drugiDeo1 h3');
    if (d1h1 && t('homepage.dunpTitle')) setText(d1h1, t('homepage.dunpTitle'));
    if (d1h3 && t('homepage.dunpSubtitle')) setText(d1h3, t('homepage.dunpSubtitle'));

    if (qs('.ikonica1 h1') && t('homepage.studyProgramsCount')) setText(qs('.ikonica1 h1'), t('homepage.studyProgramsCount'));
    if (qs('.ikonica1 p')  && t('homepage.studyProgramsLabel')) setText(qs('.ikonica1 p'),  t('homepage.studyProgramsLabel'));
    if (qs('.ikonica2 h1') && t('homepage.cooperationsCount'))  setText(qs('.ikonica2 h1'), t('homepage.cooperationsCount'));
    if (qs('.ikonica2 p')  && t('homepage.cooperationsLabel'))  setText(qs('.ikonica2 p'),  t('homepage.cooperationsLabel'));

    const learnMore = qs('.drugiDeo1 button a');
    if (learnMore && t('homepage.learnMoreBtn')) setText(learnMore, t('homepage.learnMoreBtn'));

    const desc = qs('.tekstIspodSlike p');
    if (desc && t('homepage.description')) setText(desc, t('homepage.description'));
  }

  // UNIVERZITET
  function applyUniverzitet() {
    const title = qs('.left-section h1');
    if (title && t('univerzitet.title')) setText(title, t('univerzitet.title'));

    const ps = qsa('.left-section .content p');
    const mapKeys = [
      'univerzitet.paragraph1',
      'univerzitet.paragraph2',
      'univerzitet.paragraph3',
      'univerzitet.paragraph4',
      'univerzitet.paragraph5'
    ];
    ps.forEach((p, i) => { const k = t(mapKeys[i]); if (p && k) setText(p, k); });

    const capH2 = qs('.right-section .image-caption h2');
    const capP  = qs('.right-section .image-caption p');
    if (capH2 && t('univerzitet.yearsWithUs')) setText(capH2, t('univerzitet.yearsWithUs'));
    if (capP  && t('univerzitet.foundedText')) setHTML(capP, t('univerzitet.foundedText'));
  }

  // SARADNJA
  function applySaradnja() {
    const h1 = qs('.left-panel h1'); if (h1 && t('saradnja.title')) setText(h1, t('saradnja.title'));

    const menuLis = qsa('.left-panel .menu li');
    if (menuLis[0] && t('saradnja.menu1')) setText(menuLis[0], t('saradnja.menu1'));
    if (menuLis[1] && t('saradnja.menu2')) setText(menuLis[1], t('saradnja.menu2'));

    const descPs = qsa('.left-panel .description p');
    const dmap = ['saradnja.paragraph1', 'saradnja.paragraph2', 'saradnja.paragraph3'];
    descPs.forEach((p, i) => { const k = t(dmap[i]); if (p && k) setText(p, k); });

    const box1H2 = qsa('.right-panel .info-box h2')[0];
    const box1H3 = qsa('.right-panel .info-box h3')[0];
    const box2H2 = qsa('.right-panel .info-box h2')[1];
    const box2H3 = qsa('.right-panel .info-box h3')[1];

    if (box1H2 && t('saradnja.universityCoopTitle')) setText(box1H2, t('saradnja.universityCoopTitle'));
    if (box1H3 && t('saradnja.universityCoopSubtitle')) setText(box1H3, t('saradnja.universityCoopSubtitle'));
    if (box2H2 && t('saradnja.internationalCoopTitle')) setText(box2H2, t('saradnja.internationalCoopTitle'));
    if (box2H3 && t('saradnja.internationalCoopSubtitle')) setText(box2H3, t('saradnja.internationalCoopSubtitle'));
  }

  // PROJEKTI
  function applyProjekti() {
    const title = qs('.header h1'); if (title && t('projekti.title')) setText(title, t('projekti.title'));

    const cards = qsa('.projects-grid .project-card');
    const k = [
      { h:'projekti.mntr',    p:'projekti.mntrDesc' },
      { h:'projekti.wus',     p:'projekti.wusDesc'  },
      { h:'projekti.tempus',  p:'projekti.tempusDesc' },
      { h:'projekti.erasmus', p:'projekti.erasmusDesc' }
    ];
    cards.forEach((card, i) => {
      const h3 = qs('h3', card);
      const p  = qs('p', card);
      if (h3 && t(k[i].h)) setText(h3, t(k[i].h));
      if (p  && t(k[i].p)) setText(p,  t(k[i].p));
    });
  }

  // DEPARTMANI
  function applyDepartmani() {
    const dh1 = qs('.header h1'); if (dh1 && t('departmani.heroTitle')) setText(dh1, t('departmani.heroTitle'));
    const sub = qs('.header .subtitle'); if (sub && t('departmani.heroSubtitle')) setText(sub, t('departmani.heroSubtitle'));

    const cards = qsa('.programs-grid .program-card');
    const cardMap = [
      'departmani.cards.pravne',
      'departmani.cards.ekonomske',
      'departmani.cards.filoloske',
      'departmani.cards.filozofske',
      'departmani.cards.pmf',
      'departmani.cards.tehnicke',
      'departmani.cards.biomed',
      'departmani.cards.multi'
    ];
    cards.forEach((card, i) => {
      const meta = t(cardMap[i]);
      if (!meta) return;
      const h3 = qs('h3', card);
      if (h3 && meta.title) setText(h3, meta.title);

      const lis = qsa('ul li', card);
      if (meta.programs && lis.length) {
        lis.forEach((li, idx) => {
          if (meta.programs[idx]) setText(li, meta.programs[idx]);
        });
      }
    });

    const want = qs('.contact-section .contact-content h2 a');
    const contactUs = qs('.contact-section .contact-content h3');
    const pTags = qsa('.contact-section .contact-content p');

    if (want && t('departmani.contact.wantMoreQ')) setText(want, t('departmani.contact.wantMoreQ'));
    if (contactUs && t('departmani.contact.contactUs')) setText(contactUs, t('departmani.contact.contactUs'));

    if (pTags[0] && t('departmani.contact.emailTitle')) {
      const link = qs('a', pTags[0]);
      pTags[0].innerHTML = `${t('departmani.contact.emailTitle')} ${link ? link.outerHTML : ''}`;
    }
    if (pTags[1] && t('departmani.contact.phone')) setText(pTags[1], t('departmani.contact.phone'));
    if (pTags[2] && t('departmani.contact.fax'))   setText(pTags[2], t('departmani.contact.fax'));
    if (pTags[3]) {
      const a = qs('a', pTags[3]);
      if (a) { a.textContent = t('departmani.contact.website') || a.textContent; a.href = a.textContent; }
    }
  }

  // STUDIRANJE
  function applyStudiranje() {
    const h2 = qsa('.section .section-title')[0];
    if (h2 && t('studiranje.studiesTitle')) setText(h2, t('studiranje.studiesTitle'));

    const items = qsa('.study-list li');
    const k = [
      { name:'studiranje.oas', type:'studiranje.oasType' },
      { name:'studiranje.oss', type:'studiranje.ossType' },
      { name:'studiranje.ias', type:'studiranje.iasType' },
      { name:'studiranje.mas', type:'studiranje.masType' },
      { name:'studiranje.das', type:'studiranje.dasType' }
    ];
    items.forEach((li, i) => {
      const name = t(k[i].name);
      const type = t(k[i].type);
      if (!name || !type) return;
      li.innerHTML = `${name} <span class="study-type">${type}</span>`;
    });

    const section2Title = qsa('.section .section-title')[1];
    if (section2Title && t('studiranje.staffTitle')) setText(section2Title, t('studiranje.staffTitle'));

    const staffLis = qsa('.staff-list li');
    if (staffLis[0] && t('studiranje.professor'))     setText(staffLis[0], t('studiranje.professor'));
    if (staffLis[1] && t('studiranje.subject'))       setText(staffLis[1], t('studiranje.subject'));
    if (staffLis[2] && t('studiranje.program'))       setText(staffLis[2], t('studiranje.program'));
    if (staffLis[3] && t('studiranje.consultations')) setText(staffLis[3], t('studiranje.consultations'));

    const btnA = qs('.section button a');
    if (btnA && t('studiranje.learnMoreBtn')) setText(btnA, t('studiranje.learnMoreBtn'));

    const pt = qs('.parliament-title');
    if (pt && t('studiranje.parliamentTitle')) setText(pt, t('studiranje.parliamentTitle'));

    const ptexts = qsa('.parliament-content .parliament-text');
    if (ptexts[0] && t('studiranje.parliamentPara1')) setText(ptexts[0], t('studiranje.parliamentPara1'));
    if (ptexts[1] && t('studiranje.parliamentPara2')) setText(ptexts[1], t('studiranje.parliamentPara2'));
  }

  // UPIS
  function applyUpis() {
    const h1 = qs('.hero-title');
    if (h1 && t('upis.ready') && t('upis.for') && t('upis.enrollment')) {
      h1.innerHTML = `${t('upis.ready')} <span class="za">${t('upis.for')}</span> ${t('upis.enrollment')}`;
    }

    const leftTitle = qs('.left-content .section-title'); 
    if (leftTitle && t('upis.title')) setText(leftTitle, t('upis.title'));

    const subtitle = qs('.left-content .section-subtitle'); 
    if (subtitle && t('upis.subtitle')) setText(subtitle, t('upis.subtitle'));

    const tagline  = qs('.left-content .tagline'); 
    if (tagline && t('upis.tagline')) setText(tagline, t('upis.tagline'));

    const contactTitle = qs('.right-content .contact-title');
    if (contactTitle && t('upis.emailTitle')) setText(contactTitle, t('upis.emailTitle'));

    const contactItems = qsa('.right-content .contact-item');
    if (contactItems[1] && t('upis.phone')) setText(contactItems[1], t('upis.phone'));
    if (contactItems[2] && t('upis.fax'))   setText(contactItems[2], t('upis.fax'));
    if (contactItems[3]) {
      const a = qs('a', contactItems[3]);
      if (a) { a.textContent = t('upis.website') || a.textContent; a.href = a.textContent; }
    }
  }

  // KONTAKT
  function applyKontakt() {
    const h1 = qs('.header h1'); if (h1 && t('kontakt.title')) setText(h1, t('kontakt.title'));

    const emailP = qsa('.contact-info .contact-item .contact-details p')[0];
    const myEmailP = qsa('.contact-info .contact-item .contact-details p')[1];
    if (emailP && t('kontakt.emailLabel')) {
      const a = qs('a', emailP);
      emailP.innerHTML = `${t('kontakt.emailLabel')} ${a ? a.outerHTML : ''}`;
    }
    if (myEmailP && t('kontakt.myEmail')) {
      const a = qs('a', myEmailP);
      myEmailP.innerHTML = `${t('kontakt.myEmail')} ${a ? a.outerHTML : ''}`;
    }

    const addr1 = qsa('.contact-info .contact-item')[1];
    if (addr1) {
      const lines = qsa('.contact-details p', addr1);
      if (lines[0] && t('kontakt.addressLine1')) setText(lines[0], t('kontakt.addressLine1'));
      if (lines[1] && t('kontakt.addressLine2')) setText(lines[1], t('kontakt.addressLine2'));
    }

    const phoneFaxBox = qsa('.contact-info .contact-item')[2];
    if (phoneFaxBox) {
      const lines = qsa('.contact-details p', phoneFaxBox);
      if (lines[0] && t('kontakt.phone')) setText(lines[0], t('kontakt.phone'));
      if (lines[1] && t('kontakt.fax'))   setText(lines[1], t('kontakt.fax'));
    }

    const textarea = qs('.contact-form textarea[name="message"]') || qs('.contact-form textarea');
    if (textarea && t('kontakt.messagePlaceholder')) setPH(textarea, t('kontakt.messagePlaceholder'));

    const btn = qs('.contact-form .submit-btn');
    if (btn && t('kontakt.sendBtn')) setText(btn, t('kontakt.sendBtn'));
  }

  // LOGIN
  function applyLogin() {
    const introH1 = qs('.left-section h1');
    const introP  = qs('.left-section p');
    if (introH1 && t('login.introTitle')) setText(introH1, t('login.introTitle'));
    if (introP  && t('login.introText'))  setText(introP,  t('login.introText'));

    const cardTitle = qs('.login-card .login-title');
    if (cardTitle && t('login.title')) setText(cardTitle, t('login.title'));

    const user = qs('.login-card input[type="text"]');
    const pass = qs('.login-card input[type="password"]');
    if (user && t('login.usernamePlaceholder')) setPH(user, t('login.usernamePlaceholder'));
    if (pass && t('login.passwordPlaceholder')) setPH(pass, t('login.passwordPlaceholder'));

    const forgot = qs('.forgot-password a');
    if (forgot && t('login.forgotPassword')) setText(forgot, t('login.forgotPassword'));

    const btn = qs('.login-card .login-button');
    if (btn && t('login.loginBtn')) setText(btn, t('login.loginBtn'));
  }

  // TRUELOGIN / CHECKED
  function applyTrueLogin() {
    const ok = qs('.success-text');
    if (ok && t('truelogin.successMessage')) setText(ok, t('truelogin.successMessage'));

    const h2 = qs('.section-title');
    if (h2 && t('truelogin.consultationsTitle')) setText(h2, t('truelogin.consultationsTitle'));

    const link = qs('.consultation-list a');
    if (link && t('truelogin.consultationsLink')) setText(link, t('truelogin.consultationsLink'));
  }

  // KONSULTACIJE
  function applyKonsultacije() {
    const programFilter = qs('#programFilter option[value=""]');
    const dayFilter     = qs('#danFilter option[value=""]');
    if (programFilter && t('konsultacije.allPrograms')) setText(programFilter, t('konsultacije.allPrograms'));
    if (dayFilter && t('konsultacije.allDays')) setText(dayFilter, t('konsultacije.allDays'));

    const daysMap = [
      { val:'ponedeljak', key:'konsultacije.monday' },
      { val:'utorak',     key:'konsultacije.tuesday' },
      { val:'srijeda',    key:'konsultacije.wednesday' },
      { val:'cetvrtak',   key:'konsultacije.thursday' },
      { val:'petak',      key:'konsultacije.friday' }
    ];
    daysMap.forEach(d => {
      const opt = qs(`#danFilter option[value="${d.val}"]`);
      if (opt && t(d.key)) setText(opt, t(d.key));
    });

    const search = qs('#searchInput');
    if (search && t('konsultacije.searchPlaceholder')) setPH(search, t('konsultacije.searchPlaceholder'));

    const clearBtn = qs('#clearBtn');
    if (clearBtn && t('konsultacije.clearBtn')) setText(clearBtn, t('konsultacije.clearBtn'));

    // Observer za dinamički generisan sadržaj
    const obs = new MutationObserver(() => {
      const emptyT = qs('.empty .title'); if (emptyT && t('konsultacije.noResults')) setText(emptyT, t('konsultacije.noResults'));
      const emptyM = qs('.empty .msg');   if (emptyM && t('konsultacije.noResultsMsg')) setText(emptyM, t('konsultacije.noResultsMsg'));
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // --- RUN PAGE-SPECIFIC ---
  function applyPageSpecific() {
    const key = pageKey();
    if (key === 'homepage')     return applyHomepage();
    if (key === 'univerzitet')  return applyUniverzitet();
    if (key === 'saradnja')     return applySaradnja();
    if (key === 'projekti')     return applyProjekti();
    if (key === 'departmani')   return applyDepartmani();
    if (key === 'pravnenauke')  return;
    if (key === 'studiranje')   return applyStudiranje();
    if (key === 'upis')         return applyUpis();
    if (key === 'kontakt')      return applyKontakt();
    if (key === 'login')        return applyLogin();
    if (key === 'truelogin')    return applyTrueLogin();
    if (key === 'konsultacije') return applyKonsultacije();
  }

  function applyTranslations(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang === 'sr' ? 'sr' : 'en');

    applyNav();
    applyPageSpecific();
    applyFooter();

    const langP = qs('.search-container .search-text p');
    if (langP) setText(langP, (lang === 'sr') ? 'EN' : 'SR');

    // NEW: obavesti druge skripte (npr. konsultacije.js) da se UI treba re-renderovati
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));
  }

  // eksport za druge skripte
  window.getTranslation = t;
  window.getCurrentLang = () => currentLang;

  // init + toggle
  document.addEventListener('DOMContentLoaded', () => {
    applyTranslations(currentLang);

    const langP = qs('.search-container .search-text p');
    if (langP) {
      langP.style.cursor = 'pointer';
      langP.addEventListener('click', () => {
        applyTranslations(currentLang === 'sr' ? 'en' : 'sr');
      });
    }
  });
})();
