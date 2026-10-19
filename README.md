# 🌐 Blooming — Sito Web Ufficiale & Catalogo

Questa cartella contiene il codice sorgente completo, le risorse grafiche, i dati del catalogo e gli strumenti di sviluppo e pubblicazione del sito web ufficiale di **Blooming** (`https://leonardobizz8.github.io/Blooming-sito-/`).

---

## 📁 Struttura delle Cartelle

```text
Sito/
├── 📁 css/                 Fogli di stile grafici (style.css, style.min.css)
├── 📁 js/                  Script interattivi e logica catalogo (script.js, script.min.js)
├── 📁 img/                 Tutte le immagini, loghi di brand e mockup ambientati (.webp, .jpg, .png)
├── 📁 data/                Database prodotti (prodotti.json) e file master CSV del catalogo
├── 📁 scripts/             Strumenti di utilità, server locale e script di deploy
│   ├── server.pl           Web server locale ultra-veloce (http://127.0.0.1:8000)
│   ├── deploy.pl           Script di deploy automatico su GitHub Pages
│   └── aggiorna_catalogo_da_csv.pl  Generatore automatico di prodotti.json dai file CSV
├── 📄 index.html           Pagina principale (Home, Catalogo, Filosofia, Contatti)
├── 📄 Blooming_Sito_Ufficiale_V11.html  Versione completa / archivio
├── 📄 404.html             Pagina di errore personalizzata
├── 📄 robots.txt           Direttive per i motori di ricerca (SEO)
├── 📄 sitemap.xml          Mappa del sito per Google Search Console
└── 📄 README.md            Questa guida
```

---

## 🚀 Come Testare il Sito in Locale

Apri il Terminale ed esegui:
```bash
perl scripts/server.pl
```
Il sito sarà visibile all'indirizzo:
👉 **`http://127.0.0.1:8000/`**

---

## ☁️ Come Pubblicare le Modifiche su GitHub Pages

Per inviare le modifiche direttamente online:
```bash
perl scripts/deploy.pl
```
Lo script si occuperà di sincronizzare file, alberatura e risorse sul repository GitHub e aggiornare il sito live.