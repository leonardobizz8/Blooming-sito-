
        /* =========================================================
           DATABASE PRODOTTI ESTERNO DINAMICO (prodotti.json)
           ========================================================= */
        let ALL_ITEMS = [];

        /* =========================================================
           SENIOR DEVOPS FIX: SANITIZZAZIONE RIGOROSA DEI PERCORSI RELATIVI
           Rimuove categoricamente qualsiasi slash iniziale ('/') e forza il percorso 
           a essere relativo alla cartella corrente ('./'), preservando URL esterni.
           ========================================================= */
        function toSafeRelativeUrl(rawPath) {
            if (!rawPath || typeof rawPath !== 'string') return '';
            const trimmed = rawPath.trim();
            if (!trimmed) return '';
            // Preserva URL esterni assoluti (https://, http://, protocol-relative //domain, data:, blob:)
            if (/^(?:https?:|\/\/[a-z0-9]|data:|blob:)/i.test(trimmed)) {
                return trimmed;
            }
            // Rimuove categoricamente qualsiasi slash iniziale e forza './'
            let safeImagePath = trimmed.replace(/^[\\/]+/, './');
            if (!safeImagePath.startsWith('./') && !safeImagePath.startsWith('../')) {
                safeImagePath = './' + safeImagePath;
            }
            return safeImagePath;
        }
        if (typeof window !== 'undefined') {
            window.toSafeRelativeUrl = toSafeRelativeUrl;
        }


        async function loadProductsData() {
            const grid = document.getElementById('fisch-grid-container');
            const eqGrid = document.getElementById('equora-grid-container');
            if (grid) {
                grid.innerHTML = `<div style="grid-column: 1 / -1; padding: 48px 0; text-align: center; color: var(--text-muted);">
                    <div style="font-size: 13.5px; letter-spacing: 0.05em; text-transform: uppercase;">Caricamento catalogo prodotti in corso...</div>
                </div>`;
            }
            if (eqGrid) {
                eqGrid.innerHTML = `<div style="grid-column: 1 / -1; padding: 48px 0; text-align: center; color: #6D7F75;">
                    <div style="font-size: 13.5px; letter-spacing: 0.05em; text-transform: uppercase;">Caricamento catalogo Equora in corso...</div>
                </div>`;
            }

            try {
                let res;
            try {
                res = await fetch('data/prodotti.json');
                if (!res || !res.ok) res = await fetch('prodotti.json');
            } catch(e) {
                res = await fetch('prodotti.json');
            }
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                ALL_ITEMS = await res.json();
            } catch (err) {
                console.error('Errore nel caricamento del file prodotti.json:', err);
                if (grid) {
                    grid.innerHTML = `<div style="grid-column: 1 / -1; padding: 48px 20px; text-align: center; color: var(--text-muted);">
                        <p style="font-size: 16px; margin-bottom: 8px;">Impossibile caricare il catalogo prodotti.</p>
                        <p style="font-size: 13px;">Assicurati che il file <code>prodotti.json</code> sia accessibile nel web server.</p>
                    </div>`;
                }
                return false;
            }

            // Normalizzazione preventiva di sicurezza dei brand e sanitizzazione percorsi JSON per GitHub Pages
            ALL_ITEMS.forEach(it => {
                const col = (it.collection || '').toLowerCase();
                const br = (it.brand || '').toLowerCase();
                it.brand = (col.includes('equora') || br.includes('equora')) ? 'equora' : 'blooming';
                if (typeof it.variants_count === 'undefined' && Array.isArray(it.variants)) {
                    it.variants_count = it.variants.length;
                }
                if (it.img) it.img = toSafeRelativeUrl(it.img);
                if (it.pdf) it.pdf = toSafeRelativeUrl(it.pdf);
                if (it.scheda_pdf) it.scheda_pdf = toSafeRelativeUrl(it.scheda_pdf);
                if (Array.isArray(it.variants)) {
                    it.variants.forEach(v => {
                        if (v.img) v.img = toSafeRelativeUrl(v.img);
                        if (v.pdf) v.pdf = toSafeRelativeUrl(v.pdf);
                    });
                }
            });

            filteredItems = [...ALL_ITEMS];
            return true;
        }

        /* =========================================================
           V11: JAVASCRIPT AVANZATO PER IL SITO UFFICIALE BLOOMING
           ========================================================= */

        /* COMPLEMENTI D'ARREDO (FILE LOCALI INVECE DI BASE64) */
        const COMPLEMENTS_LIST = [
            {
                name: "Panchina Rocco",
                img: "img/panchina_rocco.webp",
                specs: [
                    ["Altezza", "40 cm"],
                    ["Lunghezza", "120 cm"],
                    ["Profondità", "40 cm"],
                    ["Manici cuoio", "Naturali o neri"],
                    ["Tessuto necessario", "2 mt"]
                ]
            },
            {
                name: "Jabba The Hutt",
                img: "img/poltrona_jabba.webp",
                specs: [
                    ["Larghezza", "73 cm"],
                    ["Altezza", "80 cm"],
                    ["Profondità", "85 cm"],
                    ["Braccioli", "In frassino ulivato"],
                    ["Seduta e schienale", "In molle greche"],
                    ["Fusto", "In multistrato"]
                ]
            },
            {
                name: "Pouf Gemon",
                img: "img/pouf_gemon.webp",
                specs: [
                    ["Altezza", "46 cm"],
                    ["Diametro", "35 cm"],
                    ["Manico in cuoio", "Naturale o Nero"],
                    ["Tessuto necessario", "1.20 mt"]
                ]
            },
            {
                name: "Poltrona Pucci",
                img: "img/poltrona_pucci.webp",
                specs: [
                    ["Larghezza", "75 cm"],
                    ["Altezza", "88 cm"],
                    ["Larghezza Seduta", "44,5 cm"],
                    ["Altezza seduta", "60 cm"],
                    ["Piedini", "Neri opachi o Oro"],
                    ["Tessuto", "Int. 1.20 m / Est. 2.30 m"]
                ]
            }
        ];

        const DICT = {
            it: {
                nav_home: "Home",
                nav_tende: "Tende",
                nav_tessuti: "Tessuti",
                nav_prod: "Prodotti",
                nav_comp: "Complementi",
                nav_equora: "EQUORA",
                nav_company: "L'Azienda",
                nav_appt: "Incontra un Funzionario",
                nav_contacts: "Contatti",
                s1_kicker: "Novità Tessile 2026",
                s1_title: "Nuova Collezione",
                s1_sub: "Ricerca materica, fibre naturali nobili e lavorazioni d'eccellenza Made in Italy.",
                s1_cta: "Esplora la collezione →",
                s2_kicker: "Second Brand • Collezione Dedicata",
                s2_sub: "Materiali alternativi, tessuti in grande altezza e soluzioni versatili ad alta accessibilità per il progetto contemporaneo d'arredo.",
                s2_cta: "Scopri Equora Collection →",
                s3_kicker: "Produzione d'Eccellenza",
                s3_title: "Complementi d'Arredo",
                s3_sub: "Panchina Rocco, Poltrona Jabba The Hutt, Pouf Gemon e Poltrona Pucci: arredi scultura rivestibili con i tessuti esclusivi della collezione.",
                s3_cta: "Esplora i complementi →",
                what_looking: "Cosa stai cercando?",
                cat_upholstery: "Imbottiti e Sedute",
                cat_curtains: "Tende e Grande Altezza",
                cat_outdoor: "Outdoor & Performance",
                cat_fr: "Ignifughi & Contract",
                dedar_sub_quote: "Un intreccio autentico di filati, trame e cromie: il tessuto per ogni progetto d'architettura d'interni.",
                explore_all_btn: "ESPLORA L'INTERO CATALOGO PRODOTTI",
                comp_strip_title: "Complementi d'Arredo",
                comp_strip_link: "Vedi schede e misure →",
                appt_kicker: "Rete Commerciale & Trade B2B",
                appt_heading: "Incontra il mondo Blooming",
                appt_desc: "Desideri valutare le collezioni tessili, ricevere le tirelle o visionare i complementi d'arredo per i tuoi progetti? Richiedi la visita di un nostro funzionario commerciale direttamente nel tuo studio o azienda.",
                tab_tutti_tessuti: "1. TENDE",
                tab_tende: "1. TENDE",
                tab_imbottiti: "2. TESSUTI",
                tab_complementi: "3. COMPLEMENTI",
                filter_heading: "FILTRO PRODOTTI",
                filter_reset: "Reset",
                sort_label: "Ordina Per",
                per_page_label: "per pagina",
                acc_use: "UTILIZZO",
                acc_func: "FUNZIONE",
                acc_comp: "COMPOSIZIONE",
                acc_pattern: "DISEGNO",
                acc_type: "TIPO DI TESSUTO",
                acc_col: "COLLEZIONI",
                comp_page_h: "Complementi d'Arredo",
                comp_page_p: "Panchine, poltrone e pouf realizzati artigianalmente in Italia e personalizzabili con tutti i tessuti della collezione Blooming.",
                az_page_h: "L'Azienda",
                az_sub_h: "Lo stile, il gusto e l'eccellenza tessile italiana",
                foot_col_nav: "Collezioni & Pagine",
                foot_col_cont: "Contatti & Sede",
                load_more_btn: "CARICA ALTRI PRODOTTI"
            },
            en: {
                nav_home: "Home",
                nav_tende: "Curtains",
                nav_tessuti: "Fabrics",
                nav_prod: "Products",
                nav_comp: "Complements",
                nav_equora: "EQUORA",
                nav_company: "Company",
                nav_appt: "Meet Sales Agent",
                nav_contacts: "Contacts",
                s1_kicker: "Textile Release 2026",
                s1_title: "New Collection",
                s1_sub: "Tactile research, noble natural fibers and fine Italian craftsmanship.",
                s1_cta: "Explore collection →",
                s2_kicker: "Second Brand • Dedicated Line",
                s2_sub: "Alternative materials, wide-width fabrics and versatile high-accessibility solutions for contemporary interior projects.",
                s2_cta: "Discover Equora Collection →",
                s3_kicker: "Bespoke Production",
                s3_title: "Furnishing Complements",
                s3_sub: "Rocco Bench, Jabba The Hutt Armchair, Gemon Pouf and Pucci Armchair customizable with our exclusive fabrics.",
                s3_cta: "Explore complements →",
                what_looking: "What are you looking for?",
                cat_upholstery: "Upholstery",
                cat_curtains: "Curtains & Wide-Width",
                cat_outdoor: "Outdoor & Performance",
                cat_fr: "Flame Retardant & Contract",
                dedar_sub_quote: "An authentic interweaving of yarns, textures and shades: tailored fabric for every interior design vision.",
                explore_all_btn: "EXPLORE THE FULL CATALOGUE",
                comp_strip_title: "Furnishing Complements",
                comp_strip_link: "View specs and sizes →",
                appt_kicker: "B2B Trade Network",
                appt_heading: "Meet the Blooming Universe",
                appt_desc: "Would you like to evaluate our textile collections, receive sample hangers or inspect furnishing complements for your projects? Request a visit from our commercial representative directly at your studio or firm.",
                tab_tutti_tessuti: "1. CURTAINS",
                tab_tende: "1. CURTAINS",
                tab_imbottiti: "2. FABRICS",
                tab_complementi: "3. COMPLEMENTS",
                filter_heading: "PRODUCT FILTER",
                filter_reset: "Reset",
                sort_label: "Sort By",
                per_page_label: "per page",
                acc_use: "USE",
                acc_func: "FUNCTION",
                acc_comp: "COMPOSITION",
                acc_pattern: "PATTERN",
                acc_type: "FABRIC TYPE",
                acc_col: "COLLECTIONS",
                comp_page_h: "Furnishing Complements",
                comp_page_p: "Bespoke benches, armchairs and poufs handcrafted in Italy and customizable with all Blooming textiles.",
                az_page_h: "The Company",
                az_sub_h: "Italian Style, Taste and Textile Mastery",
                foot_col_nav: "Collections & Pages",
                foot_col_cont: "Contacts & Headquarters",
                load_more_btn: "LOAD MORE PRODUCTS"
            }
        };

        let curLang = 'it';
        let filteredItems = [];
        let currentPage = 1;
        let itemsPerPage = 12;

        let equoraFilteredItems = [];
        let equoraCurrentPage = 1;
        let equoraItemsPerPage = 12;

        let activeSlide = 0;
        let slideTimer = null;

        /* HEADER DINAMICO A SCOMPARSA (SMART HIDE/SHOW ON SCROLL) */
        let lastScrollY = window.scrollY;
        let scrollTicking = false;
        const mainHeader = document.getElementById('main-header');

        function updateHeaderVisibility() {
            const drawer = document.getElementById('mobile-nav-drawer');
            if (drawer && drawer.classList.contains('open')) {
                mainHeader.classList.remove('header-hidden');
                scrollTicking = false;
                return;
            }

            const currentScrollY = window.scrollY;
            if (currentScrollY > 120) {
                mainHeader.classList.add('scrolled');
                if (currentScrollY > lastScrollY + 6) {
                    mainHeader.classList.add('header-hidden');
                } else if (currentScrollY < lastScrollY - 6) {
                    mainHeader.classList.remove('header-hidden');
                }
            } else {
                mainHeader.classList.remove('scrolled');
                mainHeader.classList.remove('header-hidden');
            }
            lastScrollY = Math.max(0, currentScrollY);
            scrollTicking = false;
        }

        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(updateHeaderVisibility);
                scrollTicking = true;
            }
        });

        /* =========================================================
           1. NATIVE GPU COMPOSITOR SCROLL (60/120Hz STABILE & FLUIDO)
           Nessun virtual scroll interceptor: zero jank e zero scroll lock.
           ========================================================= */
        let lenisInstance = null;

        function refreshScrollHeights() {
            // No-op sicuro: previene forced reflows e layout thrashing durante il rendering asincrono
        }
        window.refreshScrollHeights = refreshScrollHeights;

        function initSmoothScroll() {
            // Scroll nativo del browser accelerato via hardware (compositor thread)
        }

        /* =========================================================
           2. EFFETTO REVEAL A SIPARIO SULLE FOTO PRINCIPALI (Curtain Reveal)
           ========================================================= */
        function initCurtainReveal() {
            const curtainImages = document.querySelectorAll('.reveal-image');
            if (!curtainImages.length) return;

            const curtainObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        curtainObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -30px 0px'
            });

            curtainImages.forEach(img => curtainObserver.observe(img));

            // Per la Hero Slide 1 (above the fold), trigger immediato
            setTimeout(() => {
                const initialHero = document.querySelector('.hero-slide.active.reveal-image');
                if (initialHero) initialHero.classList.add('is-revealed');
            }, 100);
        }

        /* =========================================================
           3. TITOLI CON EFFETTO SPLIT-LINE (.split-reveal)
           ========================================================= */
        function initSplitTitles() {
            const splitElements = document.querySelectorAll('.split-reveal');
            if (!splitElements.length) return;

            splitElements.forEach(el => {
                if (el.getAttribute('data-split-done')) return;
                el.setAttribute('data-split-done', 'true');

                const text = el.textContent.trim();
                const words = text.split(/\s+/);
                el.innerHTML = words.map((w, idx) => {
                    const delay = (idx * 0.08).toFixed(2);
                    return `<span class="split-line-mask"><span class="split-line-word" style="transition-delay: ${delay}s;">${w}</span></span>`;
                }).join(' ');
            });

            const titleObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        titleObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            });

            splitElements.forEach(el => titleObserver.observe(el));

            // Trigger immediato per titolo hero visibile
            setTimeout(() => {
                const initialSplit = document.querySelector('.hero-slide.active .split-reveal');
                if (initialSplit) initialSplit.classList.add('is-revealed');
            }, 150);
        }

        async function initBloomingApp() {
            // Dismiss preloader immediately to minimize FCP & LCP latency
            const preloader = document.getElementById('site-preloader');
            if (preloader) preloader.classList.add('loaded');

            // Inizializzazione Motion Suite Awwwards con fallback difensivo
            try { initSmoothScroll(); } catch(e) { console.warn('Lenis init:', e); }
            try { initCurtainReveal(); } catch(e) { console.warn('Curtain init:', e); }
            try { initSplitTitles(); } catch(e) { console.warn('Split titles init:', e); }

            // Caricamento dinamico asincrono del database JSON prodotti.json tramite fetch()
            try {
                const loaded = await loadProductsData();
                if (loaded) {
                    populateDynamicFilterBoxes();
                    filterBloomingCollection('NEW');
                    filterEquoraGrid('Autunno 2026');
                }
            } catch(e) {
                console.error('Errore caricamento prodotti:', e);
            }

            // Render complementi d'arredo
            try { renderFullComplementsPage(); } catch(e) { console.warn(e); }

            // Setup real-time search listeners on all inputs (global, catalog, complements, equora, mobile)
            try { setupSearchListeners(); } catch(e) { console.warn(e); }

            // Setup Load More buttons listeners
            try { setupLoadMoreListeners(); } catch(e) { console.warn(e); }

            // Setup hero slider
            try { setHeroSlide(0); startSlideShow(); } catch(e) { console.warn(e); }

            // Setup scroll reveal animation
            try { setupScrollReveal(); } catch(e) { console.warn(e); }

            // Setup Back to top listener
            try { setupBackToTop(); } catch(e) { console.warn(e); }

            // Setup Cookie Banner
            try { setupCookieBanner(); } catch(e) { console.warn(e); }

            // Refresh animazioni AOS per la vista iniziale Home
            setTimeout(() => {
                if (typeof AOS !== 'undefined') {
                    try { AOS.refresh(); } catch (e) {}
                }
            }, 300);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initBloomingApp);
        } else {
            initBloomingApp();
        }

        /* HERO SLIDER 3 SLIDE */
        function setHeroSlide(idx) {
            activeSlide = idx;
            for (let i = 0; i < 3; i++) {
                const sl = document.getElementById('h-slide-' + i);
                if (sl) {
                    sl.classList.toggle('active', i === idx);
                    if (i === idx) {
                        sl.classList.add('is-revealed');
                        const sp = sl.querySelector('.split-reveal');
                        if (sp) sp.classList.add('is-revealed');
                    }
                }
            }
            document.querySelectorAll('.hero-dot-pill').forEach((dot, i) => {
                dot.classList.toggle('active', i === idx);
            });
            const dotsNav = document.querySelector('.hero-dots-nav');
            if (dotsNav) {
                dotsNav.classList.toggle('equora-active', idx === 2);
            }
        }

        function nextHeroSlide() {
            const nxt = (activeSlide + 1) % 3;
            setHeroSlide(nxt);
        }

        function prevHeroSlide() {
            const prv = (activeSlide + 2) % 3;
            setHeroSlide(prv);
        }

        function startSlideShow() {
            if (slideTimer) clearInterval(slideTimer);
            slideTimer = setInterval(nextHeroSlide, 7000);
        }

        function pauseSlideShow() {
            if (slideTimer) clearInterval(slideTimer);
        }

        function resumeSlideShow() {
            startSlideShow();
        }

        /* MENU A TENDINA MOBILE & TABLET (TOGGLE & CLOSE) */
        function toggleMobileMenu() {
            const drawer = document.getElementById('mobile-nav-drawer');
            const backdrop = document.getElementById('mobile-drawer-backdrop');
            const btn = document.getElementById('mobile-menu-open-btn');
            if (!drawer) return;
            const isOpen = drawer.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                drawer.classList.add('open');
                if (backdrop) backdrop.classList.add('open');
                if (btn) btn.classList.add('active');
                if (mainHeader) mainHeader.classList.remove('header-hidden');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeMobileMenu() {
            const drawer = document.getElementById('mobile-nav-drawer');
            const backdrop = document.getElementById('mobile-drawer-backdrop');
            const btn = document.getElementById('mobile-menu-open-btn');
            if (drawer) drawer.classList.remove('open');
            if (backdrop) backdrop.classList.remove('open');
            if (btn) btn.classList.remove('active');
            document.body.style.overflow = '';
        }

        /* SPA ROUTING SEMPLICE (SWITCH PAGINA) */
        function switchPage(pageId) {
            closeMobileMenu();
            closeItemDrawer();

            document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
            const target = document.getElementById('view-' + pageId);
            if (target) {
                target.classList.add('active');
            }

            // Aggiorna classi active sia su Desktop che su Mobile
            document.querySelectorAll('.nav-btn, .mob-link').forEach(btn => {
                if (btn.getAttribute('data-page') === pageId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            window.scrollTo({ top: 0, behavior: 'instant' });

            if (pageId === 'home' || pageId === 'azienda') {
                setTimeout(() => {
                    checkScrollReveal();
                    initSplitTitles();
                    initCurtainReveal();
                    if (typeof AOS !== 'undefined') {
                        try { AOS.refresh(); } catch (e) {}
                    }
                }, 80);
            }

            // GA4 Page View Tracking (rispetta il consenso GDPR)
            trackEvent('page_view', {
                page_title: pageId.charAt(0).toUpperCase() + pageId.slice(1),
                page_location: window.location.origin + window.location.pathname + '#' + pageId
            });
        }

        /* CAMBIO LINGUA (IT / EN) */
        function setLanguage(l) {
            curLang = l;
            const dIt = document.getElementById('lang-it');
            const dEn = document.getElementById('lang-en');
            if (dIt) dIt.classList.toggle('active', l === 'it');
            if (dEn) dEn.classList.toggle('active', l === 'en');

            const mobIt = document.getElementById('mob-lang-it');
            const mobEn = document.getElementById('mob-lang-en');
            if (mobIt) mobIt.classList.toggle('active', l === 'it');
            if (mobEn) mobEn.classList.toggle('active', l === 'en');
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const k = el.getAttribute('data-i18n');
                if (DICT[l] && DICT[l][k]) {
                    el.textContent = DICT[l][k];
                }
            });
            applyFischbacherCatalog();
        }

        function setSiteLang(l) {
            setLanguage(l);
        }

        /* =========================================================
           FILTRAGGIO RIGOROSO CATALOGO BLOOMING & GESTIONE COLLEZIONI
           ========================================================= */
        let currentBloomingCollectionMode = 'NEW'; // Di default apre sull'ultima collezione ("Nuova Collezione 2026")

        function filterBloomingCollection(mode, btnEl) {
            currentBloomingCollectionMode = mode;
            if (btnEl) {
                document.querySelectorAll('.fisch-col-pill').forEach(b => b.classList.remove('active'));
                btnEl.classList.add('active');
            } else {
                const newBtn = document.getElementById('btn-blooming-new');
                const allBtn = document.getElementById('btn-blooming-all');
                if (newBtn && allBtn) {
                    newBtn.classList.toggle('active', mode === 'NEW');
                    allBtn.classList.toggle('active', mode === 'ALL');
                }
            }
            if (mode === 'NEW') {
                // Deseleziona eventuali checkbox della sidebar che andrebbero in conflitto
                document.querySelectorAll('#filter-box-collections input[type="checkbox"]').forEach(cb => cb.checked = false);
            }
            applyFischbacherCatalog();
        }

        function onSidebarFilterChange() {
            // Se l'utente seleziona una specifica collezione dalla sidebar, sblocca la restrizione "NEW"
            if (currentBloomingCollectionMode === 'NEW') {
                const checkedCols = getCheckedValues('filter-box-collections');
                if (checkedCols.length > 0) {
                    currentBloomingCollectionMode = 'ALL';
                    const newBtn = document.getElementById('btn-blooming-new');
                    const allBtn = document.getElementById('btn-blooming-all');
                    if (newBtn) newBtn.classList.remove('active');
                    if (allBtn) allBtn.classList.add('active');
                }
            }
            applyFischbacherCatalog();
        }

        /* POPOLA ACCORDION LATERALI DINAMICI */
        function populateDynamicFilterBoxes() {
            const patSet = new Set();
            const typSet = new Set();
            const colCounts = {};

            // STRICT BRAND SAFETY: Solo ed esclusivamente articoli Blooming nel catalogo Blooming
            const bloomingOnly = ALL_ITEMS.filter(it => it.brand === 'blooming');

            bloomingOnly.forEach(it => {
                (it.patterns || []).forEach(p => p && patSet.add(p.trim()));
                (it.typologies || []).forEach(t => t && typSet.add(t.trim()));
                if (it.collection) {
                    const c = it.collection.trim();
                    colCounts[c] = (colCounts[c] || 0) + 1;
                }
            });

            const patBox = document.getElementById('filter-box-patterns');
            if (patBox) {
                patBox.innerHTML = Array.from(patSet).sort().map(p => `
                    <label class="fisch-check-row"><input type="checkbox" value="${p}" onchange="onSidebarFilterChange()"> ${p}</label>
                `).join('');
            }

            const typBox = document.getElementById('filter-box-typologies');
            if (typBox) {
                typBox.innerHTML = Array.from(typSet).sort().map(t => `
                    <label class="fisch-check-row"><input type="checkbox" value="${t}" onchange="onSidebarFilterChange()"> ${t}</label>
                `).join('');
            }

            const colBox = document.getElementById('filter-box-collections');
            if (colBox) {
                const sortedCols = Object.keys(colCounts).sort((a, b) => colCounts[b] - colCounts[a]);
                colBox.innerHTML = sortedCols.map(c => `
                    <label class="fisch-check-row"><input type="checkbox" value="${c}" onchange="onSidebarFilterChange()"> ${c} (${colCounts[c]})</label>
                `).join('');
            }
        }

        function toggleAccordion(btn) {
            const item = btn.closest('.fisch-acc-item');
            if (item) item.classList.toggle('open');
        }

        function getCheckedValues(containerId) {
            const box = document.getElementById(containerId);
            if (!box) return [];
            return Array.from(box.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        }

        function resetAllFischFilters() {
            const fi = document.getElementById('fisch-q-input');
            if (fi) fi.value = '';
            document.querySelectorAll('.fisch-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.querySelectorAll('.fisch-tab').forEach(t => t.classList.remove('active'));
            filterBloomingCollection('NEW');
        }

        /* 3 SOLE MACRO-CATEGORIE RIGOROSE (TENDE, TESSUTI PER IMBOTTITI, COMPLEMENTI) */
        function selectTopMacroTab(cat) {
            if (cat === 'EQUORA_LINK') {
                switchPage('equora');
                return;
            }
            if (cat === 'COMPLEMENTI_LINK') {
                switchPage('complementi');
                return;
            }
            document.querySelectorAll('.fisch-tab').forEach(t => {
                t.classList.toggle('active', t.getAttribute('data-topcat') === cat);
            });
            document.querySelectorAll('.nav-btn, .mob-link').forEach(btn => {
                const dp = btn.getAttribute('data-page');
                btn.classList.toggle('active', dp === 'prodotti');
            });
            document.querySelectorAll('#filter-box-uses input[type="checkbox"]').forEach(cb => {
                if (cat === 'Tende') {
                    cb.checked = (cb.value === 'Tende');
                } else if (cat === 'Tessuti') {
                    cb.checked = (cb.value === 'Imbottiti' || cb.value === 'Outdoor' || cb.value === 'Ignifughi');
                } else {
                    cb.checked = false;
                }
            });
            applyFischbacherCatalog();

            // GA4 Category Selection Tracking
            trackEvent('select_content', {
                content_type: 'catalog_macro_category',
                item_id: cat
            });
        }

        function openProductsWithFilter(mode) {
            switchPage('prodotti');
            resetAllFischFilters();
            filterBloomingCollection(mode || 'NEW');
        }

        function openProductsWithUse(useVal) {
            switchPage('prodotti');
            resetAllFischFilters();
            if (useVal === 'Tende') {
                selectTopMacroTab('Tende');
            } else {
                selectTopMacroTab('Tessuti');
                const cb = document.querySelector(`#filter-box-uses input[value="${useVal}"]`);
                if (cb) cb.checked = true;
                applyFischbacherCatalog();
            }
        }

        function openProductsByCollection(colName) {
            switchPage('prodotti');
            resetAllFischFilters();
            const colItem = document.querySelector('#filter-box-collections').closest('.fisch-acc-item');
            if (colItem) colItem.classList.add('open');
            const cb = document.querySelector(`#filter-box-collections input[value="${colName}"]`);
            if (cb) cb.checked = true;
            applyFischbacherCatalog();
        }

        function changePerPage() {
            itemsPerPage = parseInt(document.getElementById('fisch-perpage-select').value, 10) || 24;
            currentPage = 1;
            renderFischbacherPage();
        }

        /* FUNZIONI DI RICERCA INTELLIGENTE & ASCOLTATORI REATTIVI */
        function getActivePage() {
            const activeView = document.querySelector('.page-view.active');
            if (!activeView) return 'home';
            return (activeView.id || '').replace('view-', '');
        }

        function itemMatchesQuery(it, q) {
            if (!q) return true;
            const tokens = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
            if (!tokens.length) return true;

            const varText = (it.variants || []).map(v => `${v.code || ''} ${v.name || ''}`).join(' ');
            const usesText = (it.uses || []).join(' ');
            const fibersText = (it.fibers || []).join(' ');
            const funcsText = (it.functions || []).join(' ');
            const patsText = (it.patterns || []).join(' ');
            const typsText = (it.typologies || []).join(' ');

            const fullBlob = [
                it.name || '',
                it.code || '',
                it.collection || '',
                it.comp || '',
                it.height || '',
                it.martindale || '',
                usesText,
                fibersText,
                funcsText,
                patsText,
                typsText,
                varText
            ].join(' ').toLowerCase();

            return tokens.every(tok => fullBlob.includes(tok));
        }

        function complementMatchesQuery(c, q) {
            if (!q) return true;
            const tokens = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
            if (!tokens.length) return true;
            const specsText = (c.specs || []).map(s => `${s[0]} ${s[1]}`).join(' ');
            const fullText = `${c.name || ''} ${specsText}`.toLowerCase();
            return tokens.every(tok => fullText.includes(tok));
        }

        function handleGlobalSearch(query) {
            const val = (query || '').trim();
            const activePage = getActivePage();

            // Sincronizza tutti gli input di ricerca principali
            const gInput = document.getElementById('global-search');
            const mInput = document.getElementById('mobile-search-input');
            if (gInput && gInput.value !== val) gInput.value = val;
            if (mInput && mInput.value !== val) mInput.value = val;

            const qLower = val.toLowerCase();
            const isEquoraWord = qLower.includes('equora');
            const isCompWord = ['panchina', 'poltrona', 'pouf', 'jabba', 'rocco', 'pucci', 'gemon', 'cuoio'].some(w => qLower.includes(w));

            if (activePage === 'equora' || isEquoraWord) {
                if (activePage !== 'equora') switchPage('equora');
                const eqInput = document.getElementById('equora-search-input');
                if (eqInput) eqInput.value = val;
                handleEquoraSearch(val);
                return;
            }

            if (activePage === 'complementi' || isCompWord) {
                if (activePage !== 'complementi') switchPage('complementi');
                const compInput = document.getElementById('comp-q-input');
                if (compInput) compInput.value = val;
                renderFullComplementsPage(val);
                return;
            }

            // Default: Catalogo Prodotti
            if (activePage !== 'prodotti') switchPage('prodotti');
            const fischInput = document.getElementById('fisch-q-input');
            if (fischInput) fischInput.value = val;
            applyFischbacherCatalog();
        }

        function setupSearchListeners() {
            const configs = [
                { id: 'global-search', onVal: (v) => handleGlobalSearch(v) },
                { id: 'mobile-search-input', onVal: (v) => handleGlobalSearch(v) },
                { id: 'fisch-q-input', onVal: (v) => {
                    const gi = document.getElementById('global-search');
                    if (gi && gi.value !== v) gi.value = v;
                    applyFischbacherCatalog();
                }},
                { id: 'comp-q-input', onVal: (v) => {
                    const gi = document.getElementById('global-search');
                    if (gi && gi.value !== v) gi.value = v;
                    renderFullComplementsPage(v);
                }},
                { id: 'equora-search-input', onVal: (v) => {
                    const gi = document.getElementById('global-search');
                    if (gi && gi.value !== v) gi.value = v;
                    handleEquoraSearch(v);
                }}
            ];

            configs.forEach(({ id, onVal }) => {
                const el = document.getElementById(id);
                if (!el || (el.dataset && el.dataset.searchBound)) return;
                if (el.dataset) el.dataset.searchBound = 'true';

                ['input', 'keyup'].forEach(evtType => {
                    el.addEventListener(evtType, (e) => {
                        onVal(e.target.value);
                    });
                });

                el.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        el.blur();
                        closeMobileMenu();
                        const activeView = document.querySelector('.page-view.active');
                        if (activeView) {
                            const grid = activeView.querySelector('.fisch-product-grid, .complements-page-grid, .equora-catalog-grid');
                            if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                });
            });
        }

        function setupLoadMoreListeners() {
            const fischBtn = document.getElementById('fisch-load-more-btn');
            if (fischBtn && !fischBtn.dataset.bound) {
                fischBtn.dataset.bound = 'true';
                fischBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadMoreBloomingProducts();
                });
            }

            const eqBtn = document.getElementById('equora-load-more-btn');
            if (eqBtn && !eqBtn.dataset.bound) {
                eqBtn.dataset.bound = 'true';
                eqBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadMoreEquoraProducts();
                });
            }
        }

        function applyFischbacherCatalog() {
            const q = (document.getElementById('fisch-q-input') ? document.getElementById('fisch-q-input').value : '').trim();
            const selUses = getCheckedValues('filter-box-uses');
            const selFuncs = getCheckedValues('filter-box-functions');
            const selFibs = getCheckedValues('filter-box-fibers');
            const selPats = getCheckedValues('filter-box-patterns');
            const selTyps = getCheckedValues('filter-box-typologies');
            const selCols = getCheckedValues('filter-box-collections');
            const sortMode = document.getElementById('fisch-sort-select') ? document.getElementById('fisch-sort-select').value : 'newest_desc';

            filteredItems = ALL_ITEMS.filter(it => {
                // REGOLA FERREA: SEPARAZIONE STAGNA DEI BRAND. La griglia Blooming renderizza SOLO brand === 'blooming'
                if (it.brand !== 'blooming') return false;

                // REGOLA FERREA: APERTURA DI DEFAULT SULL'ULTIMA COLLEZIONE
                // Se la modalità attiva è 'NEW', isola l'ultima collezione in ordine temporale ("Corea Autunno" / is_new)
                if (currentBloomingCollectionMode === 'NEW') {
                    const isLatest = it.is_new === true || (it.collection && it.collection.toLowerCase().includes('corea autunno'));
                    if (!isLatest) return false;
                }

                if (q) {
                    if (!itemMatchesQuery(it, q)) return false;
                    // Se c'è una corrispondenza esatta per codice articolo, mostrala senza essere bloccata dai filtri secondari
                    if (it.code && it.code.toLowerCase() === q.toLowerCase()) return true;
                }
                if (selUses.length && !selUses.some(u => (it.uses || []).includes(u))) return false;
                if (selFuncs.length && !selFuncs.some(f => (it.functions || []).includes(f))) return false;
                if (selFibs.length && !selFibs.some(fb => (it.fibers || []).includes(fb))) return false;
                if (selPats.length && !selPats.some(p => (it.patterns || []).includes(p))) return false;
                if (selTyps.length && !selTyps.some(t => (it.typologies || []).includes(t))) return false;
                if (selCols.length && !selCols.includes(it.collection)) return false;
                return true;
            });

            /* ORDINAMENTO DEL CATALOGO SULL'ARRAY DI OGGETTI JSON (NEWEST FIRST DEFAULT) */
            if (sortMode === 'newest_desc') {
                filteredItems.sort((a, b) => {
                    const dateA = a.release_date || (a.is_new ? '2026-09-01' : '2020-01-01');
                    const dateB = b.release_date || (b.is_new ? '2026-09-01' : '2020-01-01');
                    if (dateA !== dateB) return dateB.localeCompare(dateA); // Dal più recente al meno recente
                    return (a.name || '').localeCompare(b.name || '');
                });
            } else if (sortMode === 'collection_asc') {
                filteredItems.sort((a, b) => {
                    const colA = (a.collection || '').toLowerCase();
                    const colB = (b.collection || '').toLowerCase();
                    if (colA !== colB) return colA.localeCompare(colB);
                    return (a.name || '').localeCompare(b.name || '');
                });
            } else if (sortMode === 'name_asc') {
                filteredItems.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            } else if (sortMode === 'name_desc') {
                filteredItems.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            } else if (sortMode === 'code_asc') {
                filteredItems.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
            }

            currentPage = 1;
            renderFischbacherPage();
        }

        function goToFischPage(p) {
            currentPage = p;
            renderFischbacherPage(false);
            window.scrollTo({ top: 120, behavior: 'smooth' });
        }

        /* RENDERING SINGOLA CARD BLOOMING (GPU-ACCELERATED, 0-CLS, LAZY & ASYNC DECODING) */

        /* =========================================================
           PRINCIPAL PERFORMANCE ARCHITECT: DOM VIRTUALIZATION & RECYCLING ENGINE
           Mantiene fissi i 60 FPS delegando lo scroll alla GPU e limitando
           a 10-15 le card idratate in memoria video. Zero Cumulative Layout Shift (CLS = 0.00).
           ========================================================= */

        function buildBloomingCardContent(item, isFirst, activeVarCode, activeImgSrc) {
            const fallbackSrc = toSafeRelativeUrl('img/placeholder.jpg');
            const hasImg = item.img && item.img.trim() !== '';
            const defVar = activeVarCode || ((item.variants && item.variants[0]) ? item.variants[0].code : 'Master');
            const safeImg = toSafeRelativeUrl(activeImgSrc || (hasImg ? item.img : fallbackSrc)) || fallbackSrc;

            const imgMarkup = `<img src="${safeImg}" id="card-img-${item.code}" alt="Tessuto d'arredo Blooming ${item.name} Art. ${item.code}" width="400" height="400" loading="${isFirst ? 'eager' : 'lazy'}" fetchpriority="${isFirst ? 'high' : 'auto'}" decoding="async" onerror="this.onerror=null; this.src='${fallbackSrc}';">`;

            const variantsList = item.variants || [];
            let swatchesHtml = '';
            if (variantsList.length > 0) {
                const maxShow = 5;
                const visibleVars = variantsList.slice(0, maxShow);
                swatchesHtml = `
                    <div class="fisch-card-swatches" onclick="event.stopPropagation()">
                        ${visibleVars.map((v, vIdx) => {
                            const rawVImg = v.img || item.img || fallbackSrc;
                            const safeVImg = toSafeRelativeUrl(rawVImg) || fallbackSrc;
                            const isActive = (v.code === defVar) || (!activeVarCode && vIdx === 0);
                            return `
                            <button type="button" 
                                    class="fisch-mini-swatch ${isActive ? 'active' : ''}" 
                                    style="background-image: url('${safeVImg}')"
                                    title="Col. ${v.code}"
                                    aria-label="Colore ${v.code}"
                                    onclick="selectCardVariant(event, '${item.code}', '${v.code}', '${safeVImg}')">
                            </button>
                        `}).join('')}
                        ${variantsList.length > maxShow ? `<span class="fisch-more-swatches">+${variantsList.length - maxShow}</span>` : ''}
                    </div>
                `;
            }

            return `
                <div class="fisch-thumb-rect">
                    ${imgMarkup}
                </div>
                <div class="fisch-col-badge">${item.collection || 'BLOOMING'}</div>
                <div class="fisch-item-title">${item.name}</div>
                <div class="fisch-item-code" id="card-code-${item.code}">Art. ${item.code} · Col. ${defVar}</div>
                ${swatchesHtml}
            `;
        }

        function buildBloomingSkeletonContent() {
            return `
                <div class="fisch-thumb-rect card-skeleton-thumb"></div>
                <div class="card-skeleton-badge"></div>
                <div class="card-skeleton-title"></div>
                <div class="card-skeleton-code"></div>
            `;
        }

        function buildEquoraCardContent(it, isFirst, activeVarCode, activeImgSrc) {
            const variants = it.variants || [];
            const firstVar = variants[0] || {};
            const fallbackSrc = toSafeRelativeUrl('img/placeholder.jpg');
            const defVar = activeVarCode || firstVar.code || '';
            const safeHeroImg = toSafeRelativeUrl(activeImgSrc || it.img || (firstVar && firstVar.img) || fallbackSrc) || fallbackSrc;

            const comp = it.comp ? `<div class="eq-card-spec"><span>Comp.</span> <strong>${it.comp}</strong></div>` : '';
            const h = it.height ? `<div class="eq-card-spec"><span>H.</span> <strong>${it.height}</strong></div>` : '';
            const mart = it.martindale ? `<div class="eq-card-spec"><span>Mart.</span> <strong>${it.martindale}</strong></div>` : '';

            let swatchesHtml = '';
            const maxSwatches = 7;
            const visibleVars = variants.slice(0, maxSwatches);
            if (visibleVars.length > 0) {
                swatchesHtml = `
                    <div class="eq-swatches-strip" onclick="event.stopPropagation()">
                        ${visibleVars.map((v, sIdx) => {
                            const rawVImg = v.img || safeHeroImg || fallbackSrc;
                            const safeVImg = toSafeRelativeUrl(rawVImg) || fallbackSrc;
                            const isActive = (v.code === defVar) || (!activeVarCode && sIdx === 0);
                            return `
                            <button type="button" 
                                    class="eq-swatch-dot ${isActive ? 'active' : ''}" 
                                    data-var="${v.code || ''}" 
                                    title="${v.name || ('Col. ' + v.code)}" 
                                    style="background-image: url('${safeVImg}')"
                                    onclick="selectEquoraCardVariant(event, '${it.code}', '${v.code || ''}', '${safeVImg}')">
                            </button>
                        `}).join('')}
                        ${variants.length > maxSwatches ? `<span class="eq-swatch-more">+${variants.length - maxSwatches}</span>` : ''}
                    </div>
                `;
            }

            return `
                <div class="eq-card-media">
                    <img src="${safeHeroImg}" alt="Tessuto d'arredo Equora ${it.name} Art. ${it.code}" class="eq-card-img" width="400" height="400" loading="${isFirst ? 'eager' : 'lazy'}" fetchpriority="${isFirst ? 'high' : 'auto'}" decoding="async" onerror="this.onerror=null; this.src='${fallbackSrc}';">
                    <div class="eq-card-hover-overlay">
                        <span>Richiedi Scheda & Tirelle →</span>
                    </div>
                    <span class="eq-card-badge">${it.collection || 'Equora'}</span>
                </div>
                <div class="eq-card-body">
                    <div class="eq-card-code-row">
                        <span class="eq-card-code">Art. ${it.code}</span>
                        <span class="eq-card-variant-code">${defVar ? 'Var. ' + defVar : ''}</span>
                    </div>
                    <h3 class="eq-card-name">${it.name}</h3>
                    <div class="eq-card-specs">
                        ${comp}
                        ${h}
                        ${mart}
                    </div>
                    ${swatchesHtml}
                    <div class="eq-card-action">
                        <button type="button" class="eq-card-btn" onclick="openItemDrawer('${it.code}', null, 'equora'); event.stopPropagation();">Dettagli & Campionario B2B</button>
                    </div>
                </div>
            `;
        }

        function buildEquoraSkeletonContent() {
            return `
                <div class="eq-card-media card-skeleton-thumb"></div>
                <div class="eq-card-body" style="padding:16px;">
                    <div class="card-skeleton-badge" style="width:40%; margin-bottom:8px;"></div>
                    <div class="card-skeleton-title" style="width:80%; margin-bottom:12px;"></div>
                    <div class="card-skeleton-code" style="width:60%; margin-bottom:16px;"></div>
                    <div style="width:100%; height:32px; background:#eae7e0; border-radius:4px;"></div>
                </div>
            `;
        }

        let virtualCardObserver = null;

        function initVirtualCardObserver() {
            if (virtualCardObserver || typeof IntersectionObserver === 'undefined') return;

            // rootMargin: 350px sopra e sotto per anticipare l'idratazione senza sfarfallio
            virtualCardObserver = new IntersectionObserver((entries) => {
                for (let i = 0; i < entries.length; i++) {
                    const entry = entries[i];
                    const card = entry.target;
                    if (entry.isIntersecting) {
                        hydrateCard(card);
                    } else {
                        if (card.dataset.mounted === '1') {
                            dehydrateCard(card);
                        }
                    }
                }
            }, {
                root: null,
                rootMargin: '350px 0px 350px 0px',
                threshold: 0
            });
        }

        function hydrateCard(card) {
            if (card.dataset.mounted === '1') return;
            const code = card.dataset.code;
            const brand = card.dataset.brand;
            const isFirst = card.dataset.first === '1';
            const curVar = card.getAttribute('data-current-var');
            const curImg = card.getAttribute('data-current-img');

            const item = ALL_ITEMS.find(x => x.code === code && x.brand === brand) || ALL_ITEMS.find(x => x.code === code);
            if (!item) return;

            if (brand === 'equora') {
                card.innerHTML = buildEquoraCardContent(item, isFirst, curVar, curImg);
            } else {
                card.innerHTML = buildBloomingCardContent(item, isFirst, curVar, curImg);
            }

            // Lock dimensionale per prevenire Layout Shift al de-rendering
            if (!card.style.minHeight) {
                const h = card.offsetHeight;
                if (h > 0) card.style.minHeight = h + 'px';
            }

            card.dataset.mounted = '1';
            card.classList.remove('is-virtualized');
        }

        function dehydrateCard(card) {
            if (card.dataset.mounted !== '1') return;

            if (!card.style.minHeight) {
                const h = card.offsetHeight;
                if (h > 0) card.style.minHeight = h + 'px';
            }

            const brand = card.dataset.brand;
            if (brand === 'equora') {
                card.innerHTML = buildEquoraSkeletonContent();
            } else {
                card.innerHTML = buildBloomingSkeletonContent();
            }

            card.dataset.mounted = '0';
            card.classList.add('is-virtualized');
        }

        function observeGridCards(container) {
            if (!container) return;
            initVirtualCardObserver();
            if (!virtualCardObserver) return;

            const cards = container.querySelectorAll('.fisch-card, .equora-card');
            for (let i = 0; i < cards.length; i++) {
                const c = cards[i];
                if (!c.dataset.observed) {
                    c.dataset.observed = '1';
                    const h = c.offsetHeight;
                    if (h > 0 && !c.style.minHeight) {
                        c.style.minHeight = h + 'px';
                    }
                    virtualCardObserver.observe(c);
                }
            }
        }

        if (typeof window !== 'undefined') {
            let resizeVirtualTimer = null;
            window.addEventListener('resize', () => {
                clearTimeout(resizeVirtualTimer);
                resizeVirtualTimer = setTimeout(() => {
                    const cards = document.querySelectorAll('.fisch-card, .equora-card');
                    for (let i = 0; i < cards.length; i++) {
                        const c = cards[i];
                        if (c.dataset.mounted === '1') {
                            c.style.minHeight = '';
                            const h = c.offsetHeight;
                            if (h > 0) c.style.minHeight = h + 'px';
                        }
                    }
                }, 150);
            }, { passive: true });
        }

        function renderBloomingCardHtml(item, isFirst) {
            if (item.brand !== 'blooming') return '';
            const fallbackSrc = toSafeRelativeUrl('img/placeholder.jpg');
            const hasImg = item.img && item.img.trim() !== '';
            const defaultVar = (item.variants && item.variants[0]) ? item.variants[0].code : 'Master';
            const rawDefaultImg = (item.variants && item.variants[0] && item.variants[0].img) ? item.variants[0].img : (hasImg ? item.img : fallbackSrc);
            const defaultImg = toSafeRelativeUrl(rawDefaultImg) || fallbackSrc;

            return `
                <div class="fisch-card" id="card-${item.code}" data-brand="blooming" data-code="${item.code}" data-first="${isFirst ? '1' : '0'}" data-mounted="1" data-current-var="${defaultVar}" data-current-img="${defaultImg}" onclick="openItemDrawer('${item.code}', this.getAttribute('data-current-var'), 'blooming')">
                    ${buildBloomingCardContent(item, isFirst, defaultVar, defaultImg)}
                </div>
            `;
        }

        /* RENDERING A BLOCCHI PAGINAZIONE LATO CLIENT (LOAD MORE 12 ITEMS) */
        function renderFischbacherPage(isAppend = false) {
            // STRICT BRAND SAFETY: sicurezza assoluta, elimina qualsiasi elemento non blooming
            filteredItems = filteredItems.filter(it => it.brand === 'blooming');
            const total = filteredItems.length;
            const countLabel = document.getElementById('fisch-count-label');
            if (countLabel) {
                countLabel.innerHTML = curLang === 'it'
                    ? `<strong style="color:var(--accent);">${total}</strong> articoli trovati`
                    : `<strong style="color:var(--accent);">${total}</strong> items found`;
            }

            const grid = document.getElementById('fisch-grid-container');
            const loadMoreBtn = document.getElementById('fisch-load-more-btn');
            const loadMoreWrap = document.getElementById('fisch-load-more-wrap');

            if (!isAppend) {
                currentPage = 1;
            }

            const startIdx = (currentPage - 1) * itemsPerPage;
            const endIdx = Math.min(startIdx + itemsPerPage, total);
            const slice = filteredItems.slice(startIdx, endIdx);

            if (grid) {
                if (total === 0) {
                    grid.innerHTML = `<div style="grid-column: 1 / -1; padding: 48px 0; text-align: center; color: var(--text-muted);">
                        ${curLang === 'it' ? 'Nessun articolo corrisponde ai filtri selezionati.' : 'No items match selected filters.'}
                    </div>`;
                    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
                    if (loadMoreWrap) loadMoreWrap.style.display = 'none';
                    return;
                }

                const cardsHtml = slice.map((item, idx) => renderBloomingCardHtml(item, !isAppend && idx === 0)).join('');

                if (isAppend) {
                    grid.insertAdjacentHTML('beforeend', cardsHtml);
                } else {
                    grid.innerHTML = cardsHtml;
                }
                observeGridCards(grid);
            }

            // Controllo visibilità pulsante Carica Altri
            if (loadMoreBtn) {
                if (endIdx >= total) {
                    loadMoreBtn.style.display = 'none';
                    if (loadMoreWrap) loadMoreWrap.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'inline-flex';
                    if (loadMoreWrap) loadMoreWrap.style.display = 'flex';
                }
            }
        }

        function loadMoreBloomingProducts() {
            const total = filteredItems.length;
            if (currentPage * itemsPerPage >= total) return;
            currentPage++;
            renderFischbacherPage(true);
        }

        /* SELEZIONE VARIANTE COLORE INTERATTIVA SULLA CARD */
        function selectCardVariant(e, code, varCode, imgSrc) {
            if (e) e.stopPropagation();
            const card = document.getElementById('card-' + code);
            if (!card) return;
            const fallbackSrc = toSafeRelativeUrl('img/placeholder.jpg');
            const safeImg = toSafeRelativeUrl(imgSrc);
            const targetImg = (safeImg && safeImg.trim() !== '') ? safeImg : fallbackSrc;
            card.setAttribute('data-current-var', varCode);
            card.setAttribute('data-current-img', targetImg);
            const img = document.getElementById('card-img-' + code);
            if (img) {
                img.onerror = function() {
                    this.onerror = null;
                    this.src = fallbackSrc;
                };
                img.src = targetImg;
            }
            const codeEl = document.getElementById('card-code-' + code);
            if (codeEl) {
                codeEl.textContent = `Art. ${code} · Col. ${varCode}`;
            }
            card.querySelectorAll('.fisch-mini-swatch').forEach(sw => {
                sw.classList.toggle('active', sw.getAttribute('title') === `Col. ${varCode}`);
            });
        }

        let currentCompSearch = '';

        function renderFullComplementsPage(filterVal = null) {
            if (filterVal !== null) {
                currentCompSearch = (filterVal || '').trim().toLowerCase();
            }
            const box = document.getElementById('full-complements-container');
            if (!box) return;

            let list = COMPLEMENTS_LIST;
            if (currentCompSearch) {
                const tokens = currentCompSearch.split(/\s+/).filter(Boolean);
                list = list.filter(c => {
                    const specsText = (c.specs || []).map(s => `${s[0]} ${s[1]}`).join(' ');
                    const fullText = `${c.name || ''} ${specsText}`.toLowerCase();
                    return tokens.every(tok => fullText.includes(tok));
                });
            }

            const counter = document.getElementById('complements-counter-label');
            if (counter) {
                counter.innerHTML = `<strong style="color:var(--accent);">${list.length}</strong> modelli disponibili`;
            }

            if (list.length === 0) {
                box.innerHTML = `
                    <div style="grid-column: 1 / -1; padding: 48px 20px; text-align: center; color: var(--text-muted);">
                        <p style="font-size: 15px; margin-bottom: 12px;">Nessun complemento d'arredo trovato per "${currentCompSearch}".</p>
                        <button class="btn-accent" style="font-size:11.5px; padding:10px 18px;" onclick="renderFullComplementsPage(''); const ci = document.getElementById('comp-q-input'); if(ci) ci.value=''; const gi = document.getElementById('global-search'); if(gi) gi.value='';">Mostra tutti i complementi</button>
                    </div>
                `;
                return;
            }

            box.innerHTML = list.map((c, idx) => {
                const delay = (idx % 2) * 120;
                return `
                <div class="comp-full-card" >
                    <div class="comp-full-img">
                        <img src="${c.img || 'img/placeholder.jpg'}" alt="Complemento d'arredo Blooming ${c.name}" width="600" height="480" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='img/placeholder.jpg';">
                    </div>
                    <div class="comp-full-top">
                        <h2>${c.name}</h2>
                        <button class="dedar-explore-all-link" style="font-size:11.5px;" onclick="bookForComplement('${c.name}')">Richiedi quotazione →</button>
                    </div>
                    <div class="comp-specs-list">
                        ${c.specs.map(s => `<div><strong>${s[0]}:</strong> ${s[1]}</div>`).join('')}
                    </div>
                </div>
            `;
            }).join('');
            
        }

        /* DRAWER SCHEDA TECNICA CON LENTE ZOOM MATERICA & SELETTORE VARIANTI */
        function openItemDrawer(code, varCode = null, brand = null) {
            const targetBrand = brand || (getActivePage() === 'equora' ? 'equora' : 'blooming');
            const item = ALL_ITEMS.find(x => x.code === code && x.brand === targetBrand) || ALL_ITEMS.find(x => x.code === code);
            if (!item) return;

            // GA4 Item Selection Tracking
            trackEvent('select_item', {
                item_id: code,
                item_name: item.name,
                item_category: item.collection,
                item_variant: varCode || 'Master'
            });

            const selVar = varCode
                ? item.variants.find(v => v.code === varCode) || item.variants[0]
                : (item.variants[0] || { code: 'Master', img: item.img });

            const fallbackSrc = toSafeRelativeUrl('img/placeholder.jpg');
            const rawMainImg = (selVar && selVar.img) ? selVar.img : (item.img || fallbackSrc);
            const mainImg = toSafeRelativeUrl(rawMainImg) || fallbackSrc;
            const activeVarCode = selVar ? selVar.code : 'Master';

            const imgHtml = `<div class="drawer-sample-container" id="drawer-zoom-container">
                       <img src="${mainImg}" id="drawer-main-preview" class="drawer-sample-img" alt="Dettaglio texture tessuto ${item.name} Art. ${item.code}" width="600" height="600" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='${fallbackSrc}';">
                   </div>`;

            const swatchesHtml = (item.variants || []).map(v => {
                const rawVImg = v.img || item.img || fallbackSrc;
                const safeVImg = toSafeRelativeUrl(rawVImg) || fallbackSrc;
                return `
                <div class="drawer-swatch-cell ${v.code === activeVarCode ? 'active' : ''}" onclick="openItemDrawer('${item.code}', '${v.code}', '${item.brand}')">
                    <img src="${safeVImg}" width="64" height="64" loading="lazy" decoding="async" alt="Variante ${v.code}" onerror="this.onerror=null; this.src='${fallbackSrc}';">
                    <span>${v.code}</span>
                </div>
            `}).join('');

            document.getElementById('item-drawer-content').innerHTML = `
                <div style="font-size:11.5px; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:var(--accent); margin-bottom:4px;">${item.collection}</div>
                <h2 style="font-size:24px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:18px;">${item.name} — ${item.code}</h2>

                <div class="drawer-top-box">
                    <div>
                        ${imgHtml}
                        <div class="drawer-zoom-hint">Passa il cursore per ingrandire la trama del filato</div>
                    </div>
                    <div>
                        <div style="font-size:11.5px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px; font-weight:600;">Variante selezionata</div>
                        <div style="font-size:16.5px; font-weight:600; margin-bottom:16px;">Art. ${item.code} · Col. ${activeVarCode}</div>
                        <button class="btn-accent" style="width:100%; padding:14px 18px; justify-content:center;" onclick="requestCommercialVisitForArticle('${item.code}', '${activeVarCode}', '${item.name}')">
                            Richiedi Visita Funzionario Commerciale →
                        </button>
                    </div>
                </div>

                <table class="drawer-specs-table">
                    <tr><td>Composizione</td><td>${item.comp || '-'}</td></tr>
                    <tr><td>Altezza</td><td>${item.height || '-'}</td></tr>
                    <tr><td>Peso</td><td>${item.weight || '-'}</td></tr>
                    <tr><td>Martindale</td><td>${item.martindale || '-'}</td></tr>
                    <tr><td>Restringimento</td><td>${item.shrinking || '-'}</td></tr>
                    <tr><td>Utilizzo</td><td>${(item.uses || []).join(', ')}</td></tr>
                    <tr><td>Tipo / Disegno</td><td>${(item.typologies || []).concat(item.patterns || []).join(' · ')}</td></tr>
                </table>

                <div style="font-size:11.5px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--text); margin-bottom:8px;">
                    Varianti Colore Disponibili (${(item.variants || []).length})
                </div>
                <div class="drawer-swatches-grid">${swatchesHtml}</div>
            `;

            document.getElementById('item-drawer').classList.add('open');

            // Setup Lente Zoom Materica in alta risoluzione
            if (mainImg) {
                setTimeout(() => {
                    const c = document.getElementById('drawer-zoom-container');
                    const img = document.getElementById('drawer-main-preview');
                    setupDrawerMagnifier(c, img, mainImg);
                }, 50);
            }
        }

        /* LENTE D'INGRANDIMENTO MATERICA (ZOOM ALTA RISOLUZIONE) */
        function setupDrawerMagnifier(containerEl, imgEl, imgSrc) {
            if (!containerEl || !imgEl) return;
            let lens = containerEl.querySelector('.drawer-magnifier-lens');
            if (!lens) {
                lens = document.createElement('div');
                lens.className = 'drawer-magnifier-lens';
                containerEl.appendChild(lens);
            }
            const safeLensImg = toSafeRelativeUrl(imgSrc);
            lens.style.backgroundImage = `url('${safeLensImg}')`;

            containerEl.onmousemove = function(e) {
                const rect = containerEl.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
                    lens.style.display = 'none';
                    return;
                }
                lens.style.display = 'block';
                lens.style.left = x + 'px';
                lens.style.top = y + 'px';

                const zoomFactor = 2.8;
                lens.style.backgroundSize = `${rect.width * zoomFactor}px ${rect.height * zoomFactor}px`;
                const bgX = (x * zoomFactor) - (lens.offsetWidth / 2);
                const bgY = (y * zoomFactor) - (lens.offsetHeight / 2);
                lens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
            };

            containerEl.onmouseleave = function() {
                lens.style.display = 'none';
            };
        }

        function closeItemDrawer() {
            document.getElementById('item-drawer').classList.remove('open');
        }

        /* =========================================================
           RICHIESTA VISITA FUNZIONARIO COMMERCIALE & COMPLEMENTI
           ========================================================= */
        function requestCommercialVisitForArticle(code, varCode, name) {
            closeItemDrawer();
            switchPage('appuntamento');
            const notesEl = document.getElementById('appt-notes-field');
            const entry = `${name} (Art. ${code} - Col. ${varCode})`;
            if (notesEl) {
                if (notesEl.value && !notesEl.value.includes(entry)) {
                    notesEl.value += `, ${entry}`;
                } else if (!notesEl.value) {
                    notesEl.value = `Richiesta incontro con funzionario commerciale per visionare dal vivo il tessuto: ${entry}`;
                }
            }
            setTimeout(() => {
                const f = document.getElementById('form-prenotazione-appuntamento');
                if (f) f.scrollIntoView({ behavior: 'smooth' });
            }, 80);
        }

        function bookForComplement(compName) {
            switchPage('appuntamento');
            const notesEl = document.getElementById('appt-notes-field');
            if (notesEl) {
                notesEl.value = `Richiesta consulenza e preventivo con funzionario commerciale per il complemento d'arredo: ${compName}`;
            }
            // GA4 Complement Inquiry Event
            trackEvent('inquire_complement', {
                item_name: compName
            });
            setTimeout(() => {
                const f = document.getElementById('form-prenotazione-appuntamento');
                if (f) f.scrollIntoView({ behavior: 'smooth' });
            }, 80);
        }

        /* GESTIONE FORM RICHIESTA VISITA COMMERCIALE (COLLEGAMENTO MAILTO: INFO@BLOOMINGFABRICS.IT) */
        function handleDedicatedAppointmentSubmit(e) {
            e.preventDefault();
            const form = e.target;

            // Protezione Anti-Spam: Campo Honeypot invisibile
            if (form._gotcha_honey && form._gotcha_honey.value.trim() !== '') {
                console.warn('Spam rilevato via honeypot.');
                return;
            }

            const fullname = form.fullname.value.trim();
            const company = (form.company ? form.company.value.trim() : '') || '-';
            const email = form.email.value.trim();
            const phone = form.phone.value.trim();
            const city = (form.city ? form.city.value.trim() : '') || '-';
            const apptType = (form.appt_type ? form.appt_type.value : '') || 'Visita Commerciale';
            const prefDate = (form.preferred_date ? form.preferred_date.value : '') || 'Non specificata';
            const prefTime = (form.preferred_time ? form.preferred_time.value : '') || '-';
            const notes = (form.notes ? form.notes.value.trim() : '') || '-';

            if (!fullname || !email || !phone) {
                alert('Compila tutti i campi obbligatori contrassegnati con *');
                return;
            }

            // Validazione rigorosa formato email
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                alert('Inserisci un indirizzo email valido (es. nome@dominio.it)');
                if (form.email) form.email.focus();
                return;
            }

            // GA4 Lead Generation Tracking
            trackEvent('generate_lead', {
                lead_type: 'commercial_appointment',
                appointment_type: apptType
            });

            const subject = `Richiesta Visita Commerciale: ${fullname} - ${company}`;
            const bodyText = `Richiesta Incontro Funzionario Commerciale dal sito BLOOMING:\n\n` +
                `• Nominativo: ${fullname}\n` +
                `• Studio / Negozio / Azienda: ${company}\n` +
                `• Email: ${email}\n` +
                `• Telefono: ${phone}\n` +
                `• Città / Sede: ${city}\n` +
                `• Tipologia Incontro: ${apptType}\n` +
                `• Data preferita: ${prefDate}\n` +
                `• Fascia oraria: ${prefTime}\n` +
                `• Note e Articoli di interesse:\n${notes}\n\n` +
                `---\nDestinatario: info@bloomingfabrics.it (E.L.F. srl BLOOMING)`;

            const mailtoUrl = `mailto:info@bloomingfabrics.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

            const feedback = document.getElementById('appt-form-feedback');
            if (feedback) {
                feedback.style.display = 'block';
                feedback.innerHTML = `
                    <div style="border-left: 3px solid var(--accent); padding-left: 14px;">
                        <h4 style="font-size:16px; font-weight:600; color:var(--text); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em;">Richiesta Inoltrata con Successo</h4>
                        <p style="font-size:14px; color:var(--text-muted); line-height:1.6; margin-bottom:12px;">
                            Grazie <strong>${fullname}</strong>. La tua richiesta di incontro commerciale per <em>${company}</em> è stata preparata ed indirizzata all'ufficio commerciale: <strong>info@bloomingfabrics.it</strong>.<br>
                            Il tuo programma di posta elettronica si aprirà automaticamente per finalizzare l'invio.
                        </p>
                        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
                            <a href="${mailtoUrl}" class="btn-accent" style="padding:10px 18px; font-size:12px;">
                                Apri Email e Conferma Invio →
                            </a>
                            <span style="font-size:12px; color:var(--text-muted);">Oppure chiamaci: <strong>+39 0423 495444</strong></span>
                        </div>
                    </div>
                `;
                feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 350);

            form.reset();
        }

        /* GESTIONE FORM CONTATTI (COLLEGAMENTO MAILTO: INFO@BLOOMINGFABRICS.IT) */
        function handleDirectContactSubmit(e) {
            e.preventDefault();
            const form = e.target;

            // Protezione Anti-Spam: Campo Honeypot invisibile
            if (form._gotcha_honey && form._gotcha_honey.value.trim() !== '') {
                console.warn('Spam rilevato via honeypot.');
                return;
            }

            const fullname = form.fullname.value.trim();
            const email = form.email.value.trim();
            const phone = (form.phone ? form.phone.value.trim() : '') || '-';
            const subjectChoice = (form.subject ? form.subject.value : '') || 'Richiesta Informazioni BLOOMING';
            const msg = form.message.value.trim();

            if (!fullname || !email || !msg) {
                alert('Compila tutti i campi obbligatori contrassegnati con *');
                return;
            }

            // Validazione rigorosa formato email
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                alert('Inserisci un indirizzo email valido (es. nome@dominio.it)');
                if (form.email) form.email.focus();
                return;
            }

            // GA4 Contact Form Event
            trackEvent('contact', {
                method: 'direct_form',
                subject: subjectChoice
            });

            const emailSubject = `Contatto dal Sito BLOOMING: ${subjectChoice} - ${fullname}`;
            const bodyText = `Nuovo messaggio dal modulo contatti del sito BLOOMING:\n\n` +
                `• Nominativo: ${fullname}\n` +
                `• Email: ${email}\n` +
                `• Telefono: ${phone}\n` +
                `• Oggetto: ${subjectChoice}\n` +
                `• Messaggio:\n${msg}\n\n` +
                `---\nDestinatario: info@bloomingfabrics.it (E.L.F. srl BLOOMING)`;

            const mailtoUrl = `mailto:info@bloomingfabrics.it?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(bodyText)}`;

            const feedback = document.getElementById('contact-form-feedback');
            if (feedback) {
                feedback.style.display = 'block';
                feedback.innerHTML = `
                    <div style="border-left: 3px solid var(--accent); padding-left: 14px;">
                        <h4 style="font-size:16px; font-weight:600; color:var(--text); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em;">Messaggio Preparato con Successo</h4>
                        <p style="font-size:14px; color:var(--text-muted); line-height:1.6; margin-bottom:12px;">
                            Grazie <strong>${fullname}</strong>. Il messaggio è stato indirizzato alla nostra sede di Castelfranco Veneto: <strong>info@bloomingfabrics.it</strong>.<br>
                            Il tuo client di posta si aprirà automaticamente per completare l'invio.
                        </p>
                        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
                            <a href="${mailtoUrl}" class="btn-accent" style="padding:10px 18px; font-size:12px;">
                                Apri Email e Conferma Invio →
                            </a>
                            <span style="font-size:12px; color:var(--text-muted);">Sede Castelfranco Veneto: <strong>+39 0423 495444</strong></span>
                        </div>
                    </div>
                `;
                feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 350);

            form.reset();
        }

        /* ANIMAZIONI SCROLL REVEAL (INTERSECTION OBSERVER) & PARALLASSE EDITORIALE */
        let updateCompanyParallax = null;

        function setupScrollReveal() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-revealed');
                            obs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.12 });

                document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
            } else {
                document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
            }

            // Inizializza Parallasse Asimmetrico Sezione Azienda
            initCompanyParallax();
        }

        function checkScrollReveal() {
            document.querySelectorAll('.page-view.active .reveal-on-scroll').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.95) {
                    el.classList.add('is-revealed');
                }
            });
            if (typeof updateCompanyParallax === 'function') {
                updateCompanyParallax();
            }
        }

        /* EFFETTO PARALLASSE ASINCRONO AD ALTA PRECISIONE (Azienda Overlapping Masonry) */
        function initCompanyParallax() {
            const section = document.getElementById('company-main-section') || document.querySelector('.company-section-wrap');
            const primary = document.querySelector('.company-img-primary');
            const secondary = document.querySelector('.company-img-secondary');
            if (!section || !primary || !secondary) return;

            let ticking = false;

            updateCompanyParallax = function() {
                const viewAzienda = document.getElementById('view-azienda');
                if (!viewAzienda || !viewAzienda.classList.contains('active')) {
                    ticking = false;
                    return;
                }

                // Su smartphone compatto manteniamo il flusso a schede senza offset di parallasse
                if (window.innerWidth <= 640) {
                    primary.style.transform = '';
                    secondary.style.transform = '';
                    ticking = false;
                    return;
                }

                const rect = section.getBoundingClientRect();
                const winH = window.innerHeight;

                if (rect.top < winH && rect.bottom > 0) {
                    const centerOffset = (rect.top + rect.height / 2) - (winH / 2);
                    // Parallasse asimmetrico: la foto primaria slitta delicatamente verso il basso, la secondaria in opposizione verso l'alto
                    const primaryY = centerOffset * 0.04;
                    const secondaryY = centerOffset * -0.075;

                    primary.style.transform = `translate3d(0, ${primaryY.toFixed(2)}px, 0)`;
                    secondary.style.transform = `translate3d(0, ${secondaryY.toFixed(2)}px, 0)`;
                }
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateCompanyParallax);
                    ticking = true;
                }
            }, { passive: true });

            window.addEventListener('resize', () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateCompanyParallax);
                    ticking = true;
                }
            }, { passive: true });

            updateCompanyParallax();
        }

        /* =========================================================
           GESTIONE CATALOGO DEDICATO EQUORA — TESSUTI IN EQUILIBRIO
           ========================================================= */
        let currentEquoraFilter = 'Autunno 2026';
        let currentEquoraSearch = '';

        function getEquoraItems() {
            // STRICT BRAND SAFETY: Solo ed esclusivamente articoli EQUORA
            return ALL_ITEMS.filter(it => it.brand === 'equora');
        }

        function filterEquoraGrid(filter, btnEl) {
            currentEquoraFilter = filter;
            if (btnEl) {
                document.querySelectorAll('.eq-pill-btn').forEach(b => b.classList.remove('active'));
                btnEl.classList.add('active');
            } else {
                document.querySelectorAll('.eq-pill-btn').forEach(b => {
                    const txt = (b.textContent || '');
                    if (filter === 'Autunno 2026' && txt.includes('Autunno 2026')) b.classList.add('active');
                    else if (filter === 'ALL' && txt.includes('Tutti')) b.classList.add('active');
                    else if (filter === 'Evergreen' && txt.includes('Evergreen')) b.classList.add('active');
                    else b.classList.remove('active');
                });
            }
            renderEquoraGrid();
        }

        function handleEquoraSearch(val) {
            currentEquoraSearch = (val || '').trim().toLowerCase();
            renderEquoraGrid();
        }

        function selectEquoraCardVariant(e, itemCode, varCode, imgSrc) {
            e.stopPropagation();
            const card = document.getElementById('eq-card-' + itemCode);
            if (!card) return;
            const fallbackSrc = toSafeRelativeUrl('img/placeholder.jpg');
            const safeImg = toSafeRelativeUrl(imgSrc);
            const targetImg = (safeImg && safeImg.trim() !== '') ? safeImg : fallbackSrc;
            const img = card.querySelector('.eq-card-img');
            if (img) {
                img.onerror = function() {
                    this.onerror = null;
                    this.src = fallbackSrc;
                };
                img.src = targetImg;
            }
            const codeSpan = card.querySelector('.eq-card-variant-code');
            if (codeSpan && varCode) codeSpan.textContent = 'Var. ' + varCode;
            card.querySelectorAll('.eq-swatch-dot').forEach(dot => {
                dot.classList.toggle('active', dot.getAttribute('data-var') === varCode);
            });
        }

        /* RENDERING SINGOLA CARD EQUORA (GPU-ACCELERATED, 0-CLS, LAZY & ASYNC DECODING) */
        function renderEquoraCardHtml(it, isFirst) {
            if (it.brand !== 'equora') return '';
            const variants = it.variants || [];
            const firstVar = variants[0] || {};
            const fallbackSrc = toSafeRelativeUrl('img/placeholder.jpg');
            const rawHeroImg = (it.img && it.img.trim() !== '') ? it.img : ((firstVar && firstVar.img) ? firstVar.img : fallbackSrc);
            const heroImg = toSafeRelativeUrl(rawHeroImg) || fallbackSrc;
            const defVar = firstVar.code || '';

            return `
                <div class="equora-card" id="eq-card-${it.code}" data-brand="equora" data-code="${it.code}" data-first="${isFirst ? '1' : '0'}" data-mounted="1" data-current-var="${defVar}" data-current-img="${heroImg}" onclick="openItemDrawer('${it.code}', null, 'equora')">
                    ${buildEquoraCardContent(it, isFirst, defVar, heroImg)}
                </div>
            `;
        }

        /* RENDERING A BLOCCHI EQUORA (LOAD MORE 12 ITEMS) */
        function renderEquoraGrid(isAppend = false) {
            const container = document.getElementById('equora-grid-container');
            const counter = document.getElementById('equora-counter-label');
            const loadMoreBtn = document.getElementById('equora-load-more-btn');
            const loadMoreWrap = document.getElementById('equora-load-more-wrap');
            if (!container) return;

            if (!isAppend) {
                equoraCurrentPage = 1;
                // STRICT BRAND SAFETY: Solo ed esclusivamente articoli EQUORA
                let items = getEquoraItems().filter(it => it.brand === 'equora');

                if (currentEquoraFilter === 'Autunno 2026') {
                    items = items.filter(it => (it.collection || '').toLowerCase().includes('autunno') || it.is_new === true);
                } else if (currentEquoraFilter === 'Evergreen') {
                    items = items.filter(it => !(it.collection || '').toLowerCase().includes('autunno'));
                }

                if (currentEquoraSearch) {
                    const tokens = currentEquoraSearch.toLowerCase().split(/\s+/).filter(Boolean);
                    items = items.filter(it => {
                        const varText = (it.variants || []).map(v => `${v.code || ''} ${v.name || ''}`).join(' ');
                        const fullText = [
                            it.name || '',
                            it.code || '',
                            it.collection || '',
                            it.comp || '',
                            it.martindale || '',
                            it.height || '',
                            varText
                        ].join(' ').toLowerCase();
                        return tokens.every(tok => fullText.includes(tok));
                    });
                }

                // Logica di ordinamento "Newest First" su array JSON Equora
                items.sort((a, b) => {
                    const dateA = a.release_date || (a.is_new ? '2026-09-01' : '2020-01-01');
                    const dateB = b.release_date || (b.is_new ? '2026-09-01' : '2020-01-01');
                    if (dateA !== dateB) return dateB.localeCompare(dateA);
                    return (a.name || '').localeCompare(b.name || '');
                });

                equoraFilteredItems = items;
            }

            const total = equoraFilteredItems.length;
            if (counter) {
                counter.innerHTML = `<strong style="color:#7B9E7E;">${total}</strong> articoli disponibili`;
            }

            if (total === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; padding: 48px; text-align: center; color: #6D7F75;">
                        <p style="font-size: 16px; margin-bottom: 12px;">Nessun tessuto Equora trovato per i criteri specificati.</p>
                        <button class="eq-pill-btn" onclick="document.getElementById('equora-search-input').value=''; currentEquoraSearch=''; filterEquoraGrid('Autunno 2026');">Mostra ultima collezione Equora</button>
                    </div>
                `;
                if (loadMoreBtn) loadMoreBtn.style.display = 'none';
                if (loadMoreWrap) loadMoreWrap.style.display = 'none';
                return;
            }

            const startIdx = (equoraCurrentPage - 1) * equoraItemsPerPage;
            const endIdx = Math.min(startIdx + equoraItemsPerPage, total);
            const slice = equoraFilteredItems.slice(startIdx, endIdx);

            const cardsHtml = slice.map((it, idx) => renderEquoraCardHtml(it, !isAppend && idx === 0)).join('');

            if (isAppend) {
                container.insertAdjacentHTML('beforeend', cardsHtml);
            } else {
                container.innerHTML = cardsHtml;
            }
            observeGridCards(container);

            // Controllo visibilità pulsante Carica Altri Equora
            if (loadMoreBtn) {
                if (endIdx >= total) {
                    loadMoreBtn.style.display = 'none';
                    if (loadMoreWrap) loadMoreWrap.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'inline-flex';
                    if (loadMoreWrap) loadMoreWrap.style.display = 'flex';
                }
            }
        }

        function loadMoreEquoraProducts() {
            const total = equoraFilteredItems.length;
            if (equoraCurrentPage * equoraItemsPerPage >= total) return;
            equoraCurrentPage++;
            renderEquoraGrid(true);
        }

        /* BACK TO TOP */
        function setupBackToTop() {
            const btn = document.getElementById('back-to-top');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 350) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
            });
        }

        /* COOKIE BANNER GDPR & PREFERENCES MANAGEMENT (Linee Guida Garante Privacy) */
        function setupCookieBanner() {
            const consent = localStorage.getItem('blooming_cookie_consent');
            updatePreferencesToggle(consent === 'accepted_all');
            if (!consent) {
                setTimeout(() => {
                    const banner = document.getElementById('cookie-banner');
                    if (banner) banner.style.display = 'block';
                }, 1000);
            }
        }

        function acceptCookies() {
            localStorage.setItem('blooming_cookie_consent', 'accepted_all');
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            }
            if (typeof loadGA4Script === 'function') {
                loadGA4Script();
            }
            trackEvent('cookie_consent', { consent_level: 'all' });
            const banner = document.getElementById('cookie-banner');
            if (banner) banner.style.display = 'none';
            updatePreferencesToggle(true);
        }

        function dismissCookies() {
            localStorage.setItem('blooming_cookie_consent', 'necessary_only');
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
            }
            const banner = document.getElementById('cookie-banner');
            if (banner) banner.style.display = 'none';
            updatePreferencesToggle(false);
        }

        function updatePreferencesToggle(isChecked) {
            const toggle = document.getElementById('ga4-consent-toggle');
            if (toggle) toggle.checked = !!isChecked;
        }

        function toggleAnalyticsConsent(enable) {
            if (enable) {
                acceptCookies();
            } else {
                dismissCookies();
            }
        }

        function openPolicyModal(tab) {
            const modal = document.getElementById('legal-modal');
            if (!modal) return;
            switchPolicyTab(tab || 'privacy');
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closePolicyModal() {
            const modal = document.getElementById('legal-modal');
            if (modal) modal.classList.remove('open');
            document.body.style.overflow = '';
        }

        function switchPolicyTab(tab) {
            const isPrivacy = tab === 'privacy';
            const secPrivacy = document.getElementById('legal-sec-privacy');
            const secCookie = document.getElementById('legal-sec-cookie');
            const btnPrivacy = document.getElementById('legal-tab-btn-privacy');
            const btnCookie = document.getElementById('legal-tab-btn-cookie');

            if (secPrivacy) secPrivacy.classList.toggle('active', isPrivacy);
            if (secCookie) secCookie.classList.toggle('active', !isPrivacy);
            if (btnPrivacy) btnPrivacy.classList.toggle('active', isPrivacy);
            if (btnCookie) btnCookie.classList.toggle('active', !isPrivacy);

            const consent = localStorage.getItem('blooming_cookie_consent');
            updatePreferencesToggle(consent === 'accepted_all');
        }

        function openCookiePreferences() {
            openPolicyModal('cookie');
            setTimeout(() => {
                const box = document.getElementById('cookie-preferences-panel');
                if (box) {
                    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    box.style.transition = 'box-shadow 0.3s ease';
                    box.style.boxShadow = '0 0 0 2px var(--accent)';
                    setTimeout(() => { box.style.boxShadow = ''; }, 1800);
                }
            }, 200);
        }

        // Inizializzazione immediata della ricerca reattiva in tempo reale
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setupSearchListeners();
        }
