/**
 * Accordion indépendant — chaque panneau s'ouvre/ferme individuellement.
 *
 * Prérequis côté HTML :
 *  - Le bouton trigger doit avoir : data-accordion-trigger, aria-controls="<panelId>", aria-expanded="false"
 *  - Le panel doit avoir : id="<panelId>", data-open-class="<classeHashéeModuleScss>"
 *
 * Le data-open-class est généré par le composant Astro via styles.open,
 * ce qui garantit que la classe hashée du module SCSS est correctement référencée.
 */
export function initAccordions() {
  const triggers = document.querySelectorAll('[data-accordion-trigger]');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panelId = trigger.getAttribute('aria-controls');
      const panel   = panelId ? document.getElementById(panelId) : null;

      if (!panel) return;

      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        // ─── Fermer ──────────────────────────────────────
        trigger.setAttribute('aria-expanded', 'false');
        // Retire la classe CSS module via dataset (ajoutée à l'ouverture)
        panel.classList.remove(panel.dataset.openClass ?? '');
      } else {
        // ─── Ouvrir ──────────────────────────────────────
        trigger.setAttribute('aria-expanded', 'true');

        // Récupère le nom de la classe "open" depuis un data attribute
        // posé par le composant Astro, ou cherche dans le classList du panel
        // la classe qui contient "open" (convention du module scss)
        if (!panel.dataset.openClass) {
          // Détecte automatiquement la classe "open" du module scss :
          // les modules scss génèrent des classes de type "ServicesSection_open__xxxx"
          const allClasses = Array.from(panel.classList);
          // On cherche une classe existante sur un élément frère déjà ouvert
          // ou on construit la classe depuis le className de base du panel
          // Strategy : lire la stylesheet et trouver la règle .open associée
          const openClass = findOpenClass(panel);
          if (openClass) panel.dataset.openClass = openClass;
        }

        if (panel.dataset.openClass) {
          panel.classList.add(panel.dataset.openClass);
        }
      }
    });
  });
}

/**
 * Trouve la classe CSS générée par le module SCSS correspondant à ".open"
 * en inspectant les règles de la stylesheet pour le sélecteur contenant l'id du panel.
 *
 * @param {HTMLElement} panel
 * @returns {string|null}
 */
function findOpenClass(panel) {
  try {
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }

      for (const rule of rules) {
        if (!(rule instanceof CSSStyleRule)) continue;

        // On cherche une règle dont le sélecteur ressemble à
        // .[hash]open { grid-template-rows: 1fr }
        if (
          rule.style.gridTemplateRows === '1fr' &&
          rule.selectorText
        ) {
          // Vérifie que ce sélecteur correspond à un élément du même composant
          // en testant si le panel répond à ce sélecteur moins ".open"
          const baseSelector = rule.selectorText.replace(/\.(\S*open\S*)/i, '').trim();
          if (baseSelector && panel.matches(baseSelector)) {
            // Extrait le nom de classe "open" hashé
            const match = rule.selectorText.match(/\.([\w-]*open[\w-]*)/i);
            if (match) return match[1];
          }
        }
      }
    }
  } catch {
    // Fallback silencieux
  }
  return null;
}
