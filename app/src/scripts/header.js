import style from "../components/Header.module.scss";

export function initHeader() {
  const header   = document.getElementById('site-header');
  const burger   = document.getElementById('burger-btn');
  const drawer   = document.getElementById('mobile-drawer');
  const logo     = document.getElementById('logowrapper');
  const drawerLinks = document.querySelectorAll('[data-drawer-link]');

  // ─── Scroll: add .scrolled class ──────────────────────
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle(style.scrolled, window.scrollY > 20);
    logo.classList.toggle(style.scrolled, window.scrollY > 20);
    burger.classList.toggle(style.scrolled, window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Burger toggle ────────────────────────────────────
  const openDrawer = () => {
    burger?.classList.add(style.open);
    drawer?.classList.add(style.open);
    burger?.setAttribute('aria-expanded', 'true');
    drawer?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    burger?.classList.remove(style.open);
    drawer?.classList.remove(style.open);
    burger?.setAttribute('aria-expanded', 'false');
    drawer?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  burger?.addEventListener('click', () => {
    const isOpen = drawer?.classList.contains(style.open);
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
