(() => {
  const root = document.getElementById("adminRoot");
  if (!root || !window.SWAuth) return;

  const msg = document.getElementById("adminMsg");
  const setMsg = (m) => {
    if (msg) msg.textContent = m || "";
  };

  const renderTable = (containerId, columns, rows, actions) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!Array.isArray(rows) || rows.length === 0) {
      el.innerHTML = `<p class="muted" style="margin:0">No data found.</p>`;
      return;
    }

    const thead = `<thead><tr>${columns.map((c) => `<th>${c.label}</th>`).join("")}${actions ? "<th>Actions</th>" : ""}</tr></thead>`;
    const tbody = rows
      .map((r) => {
        const tds = columns.map((c) => `<td>${c.render ? c.render(r) : String(r[c.key] ?? "")}</td>`).join("");
        const act = actions ? `<td>${actions(r)}</td>` : "";
        return `<tr>${tds}${act}</tr>`;
      })
      .join("");

    el.innerHTML = `<div class="table-wrap"><table class="data-table">${thead}<tbody>${tbody}</tbody></table></div>`;
  };

  async function ensureAdmin() {
    const user = await SWAuth.loadProfile();
    if (!user) {
      location.href = "login.html";
      return null;
    }
    if (!user.isAdmin) {
      setMsg("Unauthorized: admin access only.");
      return null;
    }
    return user;
  }

  async function loadAll() {
    setMsg("Loading admin data...");
    const loadingToast = window.SWToast?.show ? window.SWToast.show("info", "Admin", "Loading admin data...", { timeoutMs: 0 }) : null;
    const okUser = await ensureAdmin();
    if (!okUser) return;

    const [contactsRes, usersRes, quotesRes] = await Promise.all([
      SWAuth.apiFetch("/api/admin/contacts", { method: "GET" }),
      SWAuth.apiFetch("/api/admin/users", { method: "GET" }),
      SWAuth.apiFetch("/api/admin/quotes", { method: "GET" })
    ]);

    if (!contactsRes.res.ok || !usersRes.res.ok || !quotesRes.res.ok) {
      setMsg("Failed to load admin data. Make sure you are logged in as admin.");
      loadingToast?.update?.({ type: "error", title: "Admin", message: "Failed to load admin data.", timeoutMs: 4500 });
      return;
    }
    setMsg("Loaded.");
    loadingToast?.update?.({ type: "success", title: "Admin", message: "Loaded.", timeoutMs: 1500 });

    renderTable(
      "contactsTable",
      [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "Subject", key: "subject" },
        { label: "Message", key: "message" },
        { label: "Created", key: "createdAt", render: (r) => new Date(r.createdAt).toLocaleString() }
      ],
      contactsRes.data.items || [],
      (r) => `<button class="btn btn-small btn-ghost" data-del-contact="${r._id}">Delete</button>`
    );

    renderTable(
      "usersTable",
      [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Admin", key: "isAdmin", render: (r) => (r.isAdmin ? "Yes" : "No") },
        { label: "Created", key: "createdAt", render: (r) => new Date(r.createdAt).toLocaleString() }
      ],
      usersRes.data.items || []
    );

    renderTable(
      "quotesTable",
      [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "Service", key: "serviceRequired" },
        { label: "Budget", key: "budget" },
        { label: "Message", key: "message" },
        { label: "Created", key: "createdAt", render: (r) => new Date(r.createdAt).toLocaleString() }
      ],
      quotesRes.data.items || []
    );

    root.addEventListener("click", async (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const id = target.getAttribute("data-del-contact");
      if (!id) return;

      setMsg("Deleting contact...");
      const delToast = window.SWToast?.show ? window.SWToast.show("info", "Admin", "Deleting contact...", { timeoutMs: 0 }) : null;
      target.setAttribute("aria-disabled", "true");
      const prevText = target.textContent || "";
      target.textContent = "Deleting...";

      try {
        const { res, data } = await SWAuth.apiFetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(data?.message || "Delete failed.");
        setMsg("Deleted successfully.");
        delToast?.update?.({ type: "success", title: "Admin", message: "Deleted successfully.", timeoutMs: 2500 });
        loadAll();
      } catch (err) {
        setMsg(err?.message ? String(err.message) : "Delete failed.");
        delToast?.update?.({ type: "error", title: "Admin", message: err?.message ? String(err.message) : "Delete failed.", timeoutMs: 4500 });
      } finally {
        target.removeAttribute("aria-disabled");
        target.textContent = prevText || "Delete";
      }
    });
  }

  loadAll();
})();

