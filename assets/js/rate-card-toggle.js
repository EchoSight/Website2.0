(function () {
  const toggles = document.querySelectorAll('.rate-card-toggle');
  const panel = document.getElementById('rate-card-details');
  if (!toggles.length || !panel) {
    return;
  }

  const closeButton = panel.querySelector('.rate-card-panel__close');

  const setExpanded = (expanded) => {
    toggles.forEach((toggle) => {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    panel.hidden = !expanded;
    panel.setAttribute('aria-hidden', expanded ? 'false' : 'true');

    if (expanded) {
      window.requestAnimationFrame(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        panel.focus({ preventScroll: true });
      });
    } else {
      const firstToggle = toggles[0];
      if (firstToggle) {
        firstToggle.focus();
      }
    }
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      setExpanded(!isExpanded);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      setExpanded(false);
    });
  }
})();
