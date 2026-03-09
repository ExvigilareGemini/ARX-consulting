export function initHeader() {
  const header   = document.getElementById('site-header');
  const burger   = document.getElementById('burger-btn');
  const drawer   = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('[data-drawer-link]');

  // ─── Scroll: add .scrolled class ──────────────────────
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Burger toggle ────────────────────────────────────
  const openDrawer = () => {
    burger?.classList.add('open');
    drawer?.classList.add('open');
    burger?.setAttribute('aria-expanded', 'true');
    drawer?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    burger?.classList.remove('open');
    drawer?.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
    drawer?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  burger?.addEventListener('click', () => {
    const isOpen = drawer?.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  // ─── Close on link click ──────────────────────────────
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ─── Close on Escape ──────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
}
