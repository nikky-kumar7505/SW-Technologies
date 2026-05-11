(() => {
  const nav = document.querySelector('[data-nav]');
  const menu = document.querySelector('[data-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');

  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('open')) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      const clickedInside = menu.contains(target) || toggle.contains(target) || (nav && nav.contains(target));
      if (!clickedInside) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  // Highlight active link based on current filename
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const links = document.querySelectorAll('a[data-nav-link]');
  links.forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (!href) return;
    const normalized = href === './' ? 'index.html' : href.replace(/^\.\//, '');
    if (normalized === path) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  // Counter animation (starts from 0 and counts up)
  const counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length) {
    const hasStarted = new WeakSet();

    const animateCounter = (el) => {
      if (hasStarted.has(el)) return;
      hasStarted.add(el);

      const target = Number(el.getAttribute('data-target') || 0);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const startAllCounters = () => {
      counters.forEach((el) => {
        if (el instanceof HTMLElement) animateCounter(el);
      });
    };

    // Trigger once as soon as possible and again on full load (safe with WeakSet guard).
    requestAnimationFrame(startAllCounters);
    window.addEventListener('load', startAllCounters, { once: true });
  }

  // 3D tilt interactions for premium depth effect
  const canTilt =
    window.matchMedia('(hover: hover)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cursor "reflection" / glow (desktop only)
  const canCursorGlow =
    window.matchMedia('(hover: hover)').matches &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canCursorGlow) {
    const root = document.documentElement;
    let rafId = 0;
    let latest = null;

    const apply = () => {
      rafId = 0;
      if (!latest) return;
      const x = (latest.clientX / window.innerWidth) * 100;
      const y = (latest.clientY / window.innerHeight) * 100;
      root.style.setProperty('--cursor-x', `${x.toFixed(2)}%`);
      root.style.setProperty('--cursor-y', `${y.toFixed(2)}%`);
      root.style.setProperty('--cursor-glow-opacity', '1');
    };

    window.addEventListener(
      'pointermove',
      (e) => {
        latest = e;
        if (!rafId) rafId = requestAnimationFrame(apply);
      },
      { passive: true }
    );

    window.addEventListener('pointerleave', () => {
      latest = null;
      root.style.setProperty('--cursor-glow-opacity', '0');
    });
  }

  if (canTilt) {
    const tiltTargets = document.querySelectorAll('.hero-card, .card, .banner-card, .stat, .contact-item');
    const maxRotate = 8;

    tiltTargets.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      el.classList.add('tilt-3d');

      let rafId = 0;
      let latestEvent = null;

      const applyTilt = () => {
        rafId = 0;
        if (!latestEvent) return;
        const rect = el.getBoundingClientRect();
        const px = (latestEvent.clientX - rect.left) / rect.width;
        const py = (latestEvent.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * (maxRotate * 2);
        const rotateX = (0.5 - py) * (maxRotate * 2);

        el.style.setProperty('--mx', `${Math.round(px * 100)}%`);
        el.style.setProperty('--my', `${Math.round(py * 100)}%`);
        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      };

      el.addEventListener('pointerenter', () => {
        el.style.transition = 'transform .14s ease, box-shadow .2s ease';
      });

      el.addEventListener('pointermove', (e) => {
        latestEvent = e;
        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      el.addEventListener('pointerleave', () => {
        latestEvent = null;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        el.style.transition = 'transform .26s ease, box-shadow .2s ease';
        el.style.transform = '';
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      });
    });
  }
})();

