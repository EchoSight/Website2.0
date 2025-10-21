document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const dropdownToggles = Array.from(document.querySelectorAll('.nav-dropdown-toggle'));
  const dropdowns = dropdownToggles
    .map((toggle) => {
      const controlsId = toggle.getAttribute('aria-controls');
      const menu = controlsId ? document.getElementById(controlsId) : toggle.nextElementSibling;
      return {
        toggle,
        menu,
        item: toggle.closest('.primary-nav__item--has-children'),
        closeTimeout: null,
      };
    })
    .filter((dropdown) => dropdown.menu);

  const isDesktop = () => window.matchMedia('(min-width: 960px)').matches;

  const setMenuState = (open) => {
    if (!primaryNav) return;
    primaryNav.classList.toggle('primary-nav--open', open);
    navToggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const closeMenu = () => setMenuState(false);

  const clearDropdownCloseTimeout = (dropdown) => {
    if (!dropdown?.closeTimeout) return;
    clearTimeout(dropdown.closeTimeout);
    dropdown.closeTimeout = null;
  };

  const openDropdown = (dropdown) => {
    if (!dropdown?.toggle || !dropdown.menu) return;
    clearDropdownCloseTimeout(dropdown);
    dropdown.toggle.setAttribute('aria-expanded', 'true');
    dropdown.menu.classList.add('primary-nav__submenu--open');
  };

  const closeDropdown = (dropdown) => {
    if (!dropdown?.toggle || !dropdown.menu) return;
    clearDropdownCloseTimeout(dropdown);
    dropdown.toggle.setAttribute('aria-expanded', 'false');
    dropdown.menu.classList.remove('primary-nav__submenu--open');
  };

  const closeAllDropdowns = () => {
    dropdowns.forEach((dropdown) => closeDropdown(dropdown));
  };

  const scheduleDropdownClose = (dropdown) => {
    clearDropdownCloseTimeout(dropdown);
    dropdown.closeTimeout = setTimeout(() => {
      closeDropdown(dropdown);
    }, 250);
  };

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const willOpen = !primaryNav.classList.contains('primary-nav--open');
      setMenuState(willOpen);
      closeAllDropdowns();
    });
  }

  dropdowns.forEach((dropdown) => {
    const { toggle, menu, item } = dropdown;

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeDropdown(dropdown);
      } else {
        closeAllDropdowns();
        openDropdown(dropdown);
      }
    });

    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDropdown(dropdown);
        toggle.focus();
      }
    });

    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDropdown(dropdown);
        toggle.focus();
      }
    });

    if (item) {
      item.addEventListener('mouseenter', () => {
        if (isDesktop()) {
          closeAllDropdowns();
          openDropdown(dropdown);
        }
      });

      item.addEventListener('mouseleave', (event) => {
        if (!isDesktop()) return;

        const nextTarget = event.relatedTarget;
        if (!nextTarget || !item.contains(nextTarget)) {
          scheduleDropdownClose(dropdown);
        }
      });

      item.addEventListener('focusin', () => {
        closeAllDropdowns();
        openDropdown(dropdown);
      });

      item.addEventListener('focusout', (event) => {
        if (!item.contains(event.relatedTarget)) {
          if (isDesktop()) {
            scheduleDropdownClose(dropdown);
          } else {
            closeDropdown(dropdown);
          }
        }
      });
    }
  });

  document.addEventListener('click', (event) => {
    if (primaryNav && !primaryNav.contains(event.target) && !navToggle?.contains(event.target)) {
      closeMenu();
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      closeAllDropdowns();
    }
  });

  const openDetailsElement = (detailsElement) => {
    if (!detailsElement || detailsElement.tagName.toLowerCase() !== 'details') {
      return;
    }

    if (!detailsElement.open) {
      detailsElement.open = true;
    }
  };

  const openDetailsFromHash = () => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    const detailsElement = document.getElementById(targetId);
    openDetailsElement(detailsElement);
  };

  document.querySelectorAll('[data-open-details]').forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('data-open-details');
      if (!targetId) return;

      const detailsElement = document.getElementById(targetId);
      openDetailsElement(detailsElement);
    });
  });

  openDetailsFromHash();
  window.addEventListener('hashchange', openDetailsFromHash);
});
