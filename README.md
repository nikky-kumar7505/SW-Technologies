<div align="center">

# SW Technologies — Modern Website

**A premium-looking, responsive multi-page website built with HTML, CSS & vanilla JavaScript.**

**Live site (GitHub Pages)**: [https://nikky-kumar7505.github.io/SW-Technologies/](https://nikky-kumar7505.github.io/SW-Technologies/)

<p>
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000" />
  <img alt="GitHub Pages" src="https://img.shields.io/badge/Deploy-GitHub%20Pages-222?style=for-the-badge&logo=github&logoColor=white" />
</p>

<p>
  <a href="https://nikky-kumar7505.github.io/SW-Technologies/" target="_blank" rel="noreferrer">
    <img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-Open%20Site-111827?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
</p>

### Admin panel

On the **live site** above: click **Login** → sign in with **`ADMIN_EMAIL`** and **`ADMIN_PASSWORD`** from **`Backend/.env`** (typically **lines 5–7**; defaults: `admin@swtech.com` / `Admin@12345`) → then use **Admin** in the navbar or open **`admin.html`** when logged in as admin.

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

## 🌍 Deploy (GitHub Pages — live)

This repo’s UI is published at **[https://nikky-kumar7505.github.io/SW-Technologies/](https://nikky-kumar7505.github.io/SW-Technologies/)** (static files from this `Frontend/` layout; no build step). Point `assets/js/config.js` at your live API (e.g. Render).

## 🌍 Deploy to Netlify

This project also works as a **static site** on Netlify (no build step).

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
- **Security headers (Netlify):** this folder includes `_headers` so Netlify sends `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS on HTTPS. Redeploy after changing it.

### Chrome “Dangerous site” / Safe Browsing

If Chrome shows a red interstitial, that is usually **Google Safe Browsing** (not a missing line in your HTML). **Do not** add random third‑party `<script src="http://...">` tags to “fix” it — that makes things worse.

What helps:

1. Redeploy so `_headers` is live, then try again in an incognito window.
2. Confirm the exact URL is your real HTTPS site (GitHub Pages or Netlify).
3. Check the URL in [Google Safe Browsing transparency](https://transparencyreport.google.com/safe-browsing/search) (or Search Console → Security) and **request a review** if it’s a false positive.

## 🔐 Admin panel access

**Live (GitHub Pages):** [https://nikky-kumar7505.github.io/SW-Technologies/](https://nikky-kumar7505.github.io/SW-Technologies/) → **Login** → use **`ADMIN_EMAIL`** / **`ADMIN_PASSWORD`** from **`Backend/.env`** (lines **5–7**; defaults: `admin@swtech.com` / `Admin@12345`) → **Admin** or `admin.html`.

**Local full-stack** (backend serves this folder): open `http://localhost:5001/login.html` (or your `PORT`), same credentials from `Backend/.env`.

---

## 📄 License

This project is for educational/assignment use. Add a license if you plan to publish it publicly.

