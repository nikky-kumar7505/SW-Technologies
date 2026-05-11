(() => {
  const API_BASE = String(window.SW_CONFIG?.API_BASE || '');
  const form = document.getElementById('contactForm');
  if (!form) return;

  const els = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message'),
  };

  const err = {
    name: document.getElementById('err-name'),
    email: document.getElementById('err-email'),
    phone: document.getElementById('err-phone'),
    subject: document.getElementById('err-subject'),
    message: document.getElementById('err-message'),
  };

  const success = document.getElementById('formSuccess');

  const setError = (key, msg) => {
    if (err[key]) err[key].textContent = msg || '';
    if (els[key]) {
      if (msg) els[key].setAttribute('aria-invalid', 'true');
      else els[key].removeAttribute('aria-invalid');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Object.keys(err).forEach((k) => setError(k, ''));
    if (success) success.textContent = '';

    const payload = {
      name: (els.name?.value || '').trim(),
      email: (els.email?.value || '').trim(),
      phone: (els.phone?.value || '').trim(),
      subject: (els.subject?.value || '').trim(),
      message: (els.message?.value || '').trim(),
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn && submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = true;
      submitBtn.dataset.prevText = submitBtn.textContent || '';
      submitBtn.textContent = 'Sending...';
    }
    const toast = window.SWToast?.show ? window.SWToast.show('info', 'Contact form', 'Sending your message...', { timeoutMs: 0 }) : null;

    fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          // backend validation format: { message, errors: { field: msg } }
          if (data && data.errors) {
            Object.entries(data.errors).forEach(([key, msg]) => setError(key, String(msg)));
          }
          const fieldErrors =
            data && data.errors && typeof data.errors === 'object'
              ? Object.values(data.errors)
                  .map((v) => String(v))
                  .filter(Boolean)
              : [];
          const details = fieldErrors.length ? ` (${fieldErrors.join(' ')})` : '';
          throw new Error(`${data?.message || 'Failed to submit form'}${details}`);
        }
        return data;
      })
      .then((data) => {
        form.reset();
        Object.keys(err).forEach((k) => setError(k, ''));
        if (success) success.textContent = data?.message || 'Thanks! Your message has been recorded.';
        toast?.update?.({ type: 'success', title: 'Contact form', message: data?.message || 'Message sent successfully.', timeoutMs: 3500 });
      })
      .catch((e2) => {
        if (success) success.textContent = e2?.message ? String(e2.message) : 'Something went wrong. Please try again.';
        toast?.update?.({
          type: 'error',
          title: 'Contact form',
          message: e2?.message ? String(e2.message) : 'Something went wrong. Please try again.',
          timeoutMs: 4500,
        });
      })
      .finally(() => {
        if (submitBtn && submitBtn instanceof HTMLButtonElement) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.prevText || 'Send Message';
        }
      });
  });
})();

