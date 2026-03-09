export function initContactForm() {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successMsg = document.getElementById('success-msg');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }

    const formData = new FormData(/** @type {HTMLFormElement} */ (form));
    const object   = Object.fromEntries(formData);
    const json     = JSON.stringify(object);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: json,
      });

      const data = await res.json();

      if (data.success) {
        /** @type {HTMLFormElement} */ (form).reset();
        if (successMsg) successMsg.classList.add('visible');
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch {
      alert('Impossible d\'envoyer le message. Vérifiez votre connexion.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer le message';
      }
    }
  });
}
