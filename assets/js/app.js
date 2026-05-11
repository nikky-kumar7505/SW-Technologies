(() => {
  const API_BASE = String(window.SW_CONFIG?.API_BASE || "");
  const toastContainerId = "toastContainer";

  function getToastContainer() {
    let el = document.getElementById(toastContainerId);
    if (el) return el;
    el = document.createElement("div");
    el.id = toastContainerId;
    el.className = "toast-container";
    document.body.appendChild(el);
    return el;
  }

  function showToast(type, title, message, opts = {}) {
    const { timeoutMs = 3500 } = opts;
    const container = getToastContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type || "info"}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");

    toast.innerHTML = `
      <div>
        <p class="toast-title"></p>
        <p class="toast-msg"></p>
      </div>
      <button class="toast-close" type="button">Close</button>
    `;

    const titleEl = toast.querySelector(".toast-title");
    const msgEl = toast.querySelector(".toast-msg");
    const closeBtn = toast.querySelector(".toast-close");
    if (titleEl) titleEl.textContent = title || "Notice";
    if (msgEl) msgEl.textContent = message || "";

    const remove = () => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    };
    if (closeBtn) closeBtn.addEventListener("click", remove);

    container.prepend(toast);

    let timer = null;
    if (timeoutMs && timeoutMs > 0) {
      timer = window.setTimeout(remove, timeoutMs);
    }

    return {
      update(next = {}) {
        const { type: nt, title: ntitle, message: nmsg, timeoutMs: nto } = next;
        if (nt) toast.className = `toast toast-${nt}`;
        if (typeof ntitle === "string" && titleEl) titleEl.textContent = ntitle;
        if (typeof nmsg === "string" && msgEl) msgEl.textContent = nmsg;
        if (timer) window.clearTimeout(timer);
        const finalTimeout = typeof nto === "number" ? nto : timeoutMs;
        if (finalTimeout && finalTimeout > 0) timer = window.setTimeout(remove, finalTimeout);
      },
      remove
    };
  }

  // Make toasts available before any init() runs
  window.SWToast = { show: showToast };

  function formatApiError(data, fallbackMessage) {
    const base = data?.message ? String(data.message) : String(fallbackMessage || "Request failed");
    const errs = data?.errors && typeof data.errors === "object" ? Object.values(data.errors).map((v) => String(v)) : [];
    const details = errs.length ? ` (${errs.join(" ")})` : "";
    return `${base}${details}`;
  }

  const API = {
    newsletter: "/api/newsletter/subscribe",
    quote: "/api/quote",
    profile: "/api/auth/profile",
  };

  const storageKey = "token";
  const getToken = () => localStorage.getItem(storageKey);
  const setToken = (t) => localStorage.setItem(storageKey, t);
  const clearToken = () => localStorage.removeItem(storageKey);

  async function apiFetch(url, opts = {}) {
    const finalUrl = typeof url === "string" && url.startsWith("/") ? `${API_BASE}${url}` : url;
    const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(finalUrl, Object.assign({}, opts, { headers }));
    const data = await res.json().catch(() => ({}));
    return { res, data };
  }

  async function loadProfile() {
    const token = getToken();
    if (!token) return null;
    const { res, data } = await apiFetch(API.profile, { method: "GET" });
    if (!res.ok) return null;
    return data.user || null;
  }

  function setAuthUI(user) {
    document.querySelectorAll("[data-auth-when]").forEach((el) => {
      const when = el.getAttribute("data-auth-when");
      const show =
        (when === "loggedOut" && !user) ||
        (when === "loggedIn" && !!user) ||
        (when === "admin" && !!user && !!user.isAdmin);
      el.style.display = show ? "" : "none";
    });

    const nameEl = document.querySelector("[data-user-name]");
    if (nameEl) nameEl.textContent = user?.name ? String(user.name) : "";
  }

  async function initAuthNav() {
    const user = await loadProfile();
    setAuthUI(user);

    const logoutEls = document.querySelectorAll("[data-logout]");
    logoutEls.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        clearToken();
        setAuthUI(null);
        window.SWToast?.show?.("success", "Logout", "You have been logged out.", { timeoutMs: 2500 });
        if (location.pathname.toLowerCase().endsWith("admin.html") || location.pathname.toLowerCase().endsWith("profile.html")) {
          location.href = "index.html";
        }
      });
    });
  }

  function initNewsletter() {
    const form = document.getElementById("newsletterForm");
    const emailEl = document.getElementById("newsletterEmail");
    const msgEl = document.getElementById("newsletterMsg");
    if (!form || !emailEl) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (msgEl) msgEl.textContent = "Subscribing...";
      const toast = window.SWToast?.show("info", "Newsletter", "Subscribing...", { timeoutMs: 0 });
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = true;
        submitBtn.dataset.prevText = submitBtn.textContent || "";
        submitBtn.textContent = "Please wait...";
      }
      const email = String(emailEl.value || "").trim();
      try {
        const { res, data } = await apiFetch(API.newsletter, { method: "POST", body: JSON.stringify({ email }) });
        if (!res.ok) throw new Error(formatApiError(data, "Subscription failed"));
        form.reset();
        if (msgEl) msgEl.textContent = data?.message || "Subscribed successfully";
        toast?.update({ type: "success", title: "Newsletter", message: data?.message || "Subscribed successfully", timeoutMs: 3500 });
      } catch (err) {
        if (msgEl) msgEl.textContent = err?.message ? String(err.message) : "Subscription failed";
        toast?.update({ type: "error", title: "Newsletter", message: err?.message ? String(err.message) : "Subscription failed", timeoutMs: 4500 });
      } finally {
        if (submitBtn && submitBtn instanceof HTMLButtonElement) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.prevText || "Subscribe";
        }
      }
    });
  }

  function initQuoteModal() {
    const openers = document.querySelectorAll("[data-quote-open]");
    const modal = document.getElementById("quoteModal");
    const form = document.getElementById("quoteForm");
    const closeBtn = document.querySelector("[data-quote-close]");
    const msgEl = document.getElementById("quoteMsg");
    if (!modal || !form || !openers.length) return;

    const open = () => {
      modal.setAttribute("data-open", "true");
      const first = form.querySelector("input,select,textarea,button");
      if (first && first instanceof HTMLElement) first.focus();
    };
    const close = () => {
      modal.removeAttribute("data-open");
    };

    openers.forEach((btn) => btn.addEventListener("click", (e) => { e.preventDefault(); open(); }));
    if (closeBtn) closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (msgEl) msgEl.textContent = "Submitting...";
      const toast = window.SWToast?.show("info", "Quote request", "Submitting...", { timeoutMs: 0 });
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = true;
        submitBtn.dataset.prevText = submitBtn.textContent || "";
        submitBtn.textContent = "Please wait...";
      }
      const fd = new FormData(form);
      const payload = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        phone: String(fd.get("phone") || "").trim(),
        serviceRequired: String(fd.get("serviceRequired") || "").trim(),
        budget: String(fd.get("budget") || "").trim(),
        message: String(fd.get("message") || "").trim(),
      };

      try {
        const { res, data } = await apiFetch(API.quote, { method: "POST", body: JSON.stringify(payload) });
        if (!res.ok) {
          throw new Error(formatApiError(data, "Quote submission failed"));
        }
        form.reset();
        if (msgEl) msgEl.textContent = data?.message || "Submitted";
        toast?.update({ type: "success", title: "Quote request", message: data?.message || "Submitted", timeoutMs: 3500 });
      } catch (err) {
        if (msgEl) msgEl.textContent = err?.message ? String(err.message) : "Quote submission failed";
        toast?.update({ type: "error", title: "Quote request", message: err?.message ? String(err.message) : "Quote submission failed", timeoutMs: 4500 });
      } finally {
        if (submitBtn && submitBtn instanceof HTMLButtonElement) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.prevText || "Submit Quote Request";
        }
      }
    });
  }

  initAuthNav();
  initNewsletter();
  initQuoteModal();

  window.SWAuth = { getToken, setToken, clearToken, apiFetch, loadProfile };
})();

