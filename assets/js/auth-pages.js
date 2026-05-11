(() => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const profileBox = document.getElementById("profileBox");

  if (!window.SWAuth) return;

  const setMsg = (el, msg) => {
    if (!el) return;
    el.textContent = msg || "";
  };

  const formatApiError = (data, fallback) => {
    const base = data?.message ? String(data.message) : String(fallback || "Request failed");
    const errs = data?.errors && typeof data.errors === "object" ? Object.values(data.errors).map((v) => String(v)) : [];
    const details = errs.length ? ` (${errs.join(" ")})` : "";
    return `${base}${details}`;
  };

  if (loginForm) {
    const msg = document.getElementById("authMsg");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setMsg(msg, "Logging in...");
      const toast = window.SWToast?.show("info", "Login", "Logging in...", { timeoutMs: 0 });
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = true;
        submitBtn.dataset.prevText = submitBtn.textContent || "";
        submitBtn.textContent = "Please wait...";
      }
      const fd = new FormData(loginForm);
      const payload = {
        email: String(fd.get("email") || "").trim(),
        password: String(fd.get("password") || ""),
      };
      try {
        const { res, data } = await SWAuth.apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(formatApiError(data, "Login failed"));
        if (data?.token) SWAuth.setToken(String(data.token));
        setMsg(msg, "Login successful. Redirecting...");
        toast?.update({ type: "success", title: "Login", message: "Login successful", timeoutMs: 2000 });
        if (data?.user?.isAdmin) location.href = "admin.html";
        else location.href = "index.html";
      } catch (err) {
        setMsg(msg, err?.message ? String(err.message) : "Login failed");
        toast?.update({ type: "error", title: "Login", message: err?.message ? String(err.message) : "Login failed", timeoutMs: 4500 });
      } finally {
        if (submitBtn && submitBtn instanceof HTMLButtonElement) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.prevText || "Login";
        }
      }
    });
  }

  if (registerForm) {
    const msg = document.getElementById("authMsg");
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setMsg(msg, "Creating your account...");
      const toast = window.SWToast?.show("info", "Register", "Creating your account...", { timeoutMs: 0 });
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = true;
        submitBtn.dataset.prevText = submitBtn.textContent || "";
        submitBtn.textContent = "Please wait...";
      }
      const fd = new FormData(registerForm);
      const payload = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        password: String(fd.get("password") || ""),
      };
      try {
        const { res, data } = await SWAuth.apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(formatApiError(data, "Registration failed"));
        if (data?.token) SWAuth.setToken(String(data.token));
        setMsg(msg, "Registered successfully. Redirecting...");
        toast?.update({ type: "success", title: "Register", message: "Registered successfully", timeoutMs: 2000 });
        location.href = "index.html";
      } catch (err) {
        setMsg(msg, err?.message ? String(err.message) : "Registration failed");
        toast?.update({ type: "error", title: "Register", message: err?.message ? String(err.message) : "Registration failed", timeoutMs: 4500 });
      } finally {
        if (submitBtn && submitBtn instanceof HTMLButtonElement) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.prevText || "Register";
        }
      }
    });
  }

  if (profileBox) {
    (async () => {
      const user = await SWAuth.loadProfile();
      if (!user) {
        location.href = "login.html";
        return;
      }
      const nameEl = document.getElementById("profileName");
      const emailEl = document.getElementById("profileEmail");
      const roleEl = document.getElementById("profileRole");
      if (nameEl) nameEl.textContent = user.name;
      if (emailEl) emailEl.textContent = user.email;
      if (roleEl) roleEl.textContent = user.isAdmin ? "Admin" : "User";
    })();
  }
})();

