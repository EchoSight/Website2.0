document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
  const dropdownMenu = document.getElementById('protectedSpeciesMenu');
  const dropdownItem = dropdownToggle?.closest('.primary-nav__item--has-children');

  const isDesktop = () => window.matchMedia('(min-width: 960px)').matches;

  const setMenuState = (open) => {
    if (!primaryNav) return;
    primaryNav.classList.toggle('primary-nav--open', open);
    navToggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const closeMenu = () => setMenuState(false);

  const openDropdown = () => {
    if (!dropdownToggle || !dropdownMenu) return;
    dropdownToggle.setAttribute('aria-expanded', 'true');
    dropdownMenu.classList.add('primary-nav__submenu--open');
  };

  const closeDropdown = () => {
    if (!dropdownToggle || !dropdownMenu) return;
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownMenu.classList.remove('primary-nav__submenu--open');
  };

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const willOpen = !primaryNav.classList.contains('primary-nav--open');
      setMenuState(willOpen);
      closeDropdown();
    });
  }

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    dropdownToggle.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDropdown();
        dropdownToggle.focus();
      }
    });

    dropdownMenu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDropdown();
        dropdownToggle.focus();
      }
    });

    if (dropdownItem) {
      dropdownItem.addEventListener('mouseenter', () => {
        if (isDesktop()) {
          openDropdown();
        }
      });
      dropdownItem.addEventListener('mouseleave', (event) => {
        if (!isDesktop()) return;

        const nextTarget = event.relatedTarget;
        if (!nextTarget || !dropdownItem.contains(nextTarget)) {
          closeDropdown();
        }
      });
      dropdownItem.addEventListener('focusin', openDropdown);
      dropdownItem.addEventListener('focusout', (event) => {
        if (!dropdownItem.contains(event.relatedTarget)) {
          closeDropdown();
        }
      });
    }
  }

  document.addEventListener('click', (event) => {
    if (primaryNav && !primaryNav.contains(event.target) && !navToggle?.contains(event.target)) {
      closeMenu();
      closeDropdown();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      closeDropdown();
    }
  });
});
