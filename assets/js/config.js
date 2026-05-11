(() => {
  // Change API base URL here once, and the whole frontend will use it.
  // Examples:
  // - Local backend: "http://localhost:5001"
  // - Deployed backend: "https://your-backend-domain.com"
  //
  // If you run the full-stack app from the backend (recommended), keep this as "" so it uses same-origin "/api/...".
  const API_BASE = "https://sw-technologies-backend.onrender.com";

  window.SW_CONFIG = {
    API_BASE,
  };
})();

