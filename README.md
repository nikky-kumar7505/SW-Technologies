<div align="center">

# SW Technologies — Modern Website

**A premium-looking, responsive multi-page website built with HTML, CSS & vanilla JavaScript.**

**Live site**: `https://jocular-madeleine-5f5699.netlify.app/`

<p>
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000" />
  <img alt="Netlify ready" src="https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" />
</p>

<p>
  <a href="https://jocular-madeleine-5f5699.netlify.app/" target="_blank" rel="noreferrer">
    <img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-Open%20Site-111827?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
</p>

</div>

---

## ✨ Highlights

- ⚡ **Fast & lightweight** static site (no build step)
- 📱 **Mobile-first** responsive layout
- 🎛️ **Vanilla JS** interactions (navbar + counters + contact form logic)
- 🎨 **Modern UI** styling in a single stylesheet

## 🖼️ Preview

> Tip: Add screenshots here to make it look even more professional.
>
> - Save images in `assets/img/` (example: `assets/img/preview-home.png`)
> - Then uncomment the image lines below

<!--
### Home
![Home preview](assets/img/preview-home.png)

### About
![About preview](assets/img/preview-about.png)
-->

## 🧭 Pages

- `index.html` — Home
- `about.html` — About
- `services.html` — Services
- `contact.html` — Contact

## 🗂️ Project structure

```text
assignment/
  index.html
  about.html
  services.html
  contact.html
  assets/
    css/
      style.css
    js/
      main.js
      contact.js
    img/
      ...
```

## 🚀 Run locally

Because this is a static site, you can open `index.html` directly in a browser.

For the best experience (and to avoid any browser restrictions), run a small local server:

### Option A: VS Code / Cursor Live Server 🧩

- Install the **Live Server** extension
- Right-click `index.html` → **Open with Live Server**

### Option B: Python (built-in) 🐍

From the `assignment/` folder:

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173` in your browser.

## 🌍 Deploy to Netlify

This project deploys as a **static site** (no build step).

### Option 1: Drag & drop (fastest) 🟢

- In Netlify: **Add new site** → **Deploy manually**
- Drag and drop the **entire `assignment/` folder** (the folder that contains `index.html`)
- Netlify will generate a live URL

### Option 2: GitHub (recommended) 🔗

- Push this project to GitHub
- In Netlify: **Add new site** → **Import an existing project**
- Configure:
  - **Build command**: *(leave empty)*
  - **Publish directory**: `.`
- Deploy

## ✅ Notes

- Keep asset paths relative (e.g. `assets/css/style.css`, `assets/js/main.js`) so they work locally and on Netlify.

## 🔐 Admin panel access (Full‑stack mode)

When you run the project as a full‑stack app (backend serves this frontend), you can access:

- Admin page: `http://localhost:5001/login.html`

Login using the seeded admin credentials (set in `Backend/.env`, defaults in `Backend/.env.example`):

- `ADMIN_EMAIL`: `admin@swtech.com`
- `ADMIN_PASSWORD`: `Admin@12345`

---

## 📄 License

This project is for educational/assignment use. Add a license if you plan to publish it publicly.

