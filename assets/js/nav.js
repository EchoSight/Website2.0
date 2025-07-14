const burgerBtn = document.getElementById('burgerBtn');
const mainMenu = document.getElementById('mainMenu');

function toggleMenu() {
  const expanded = burgerBtn.getAttribute('aria-expanded') === 'true';
  burgerBtn.setAttribute('aria-expanded', (!expanded).toString());
  mainMenu.classList.toggle('open');
}

if (burgerBtn && mainMenu) {
  burgerBtn.onclick = toggleMenu;
  burgerBtn.onkeydown = (e) => {
    if (e.key === 'Enter') toggleMenu();
  };
}
