const burgerBtn = document.getElementById('burgerBtn');
const mainMenu = document.getElementById('mainMenu');
if (burgerBtn && mainMenu) {
  burgerBtn.onclick = () => mainMenu.classList.toggle('open');
  burgerBtn.onkeydown = (e) => {
    if (e.key === 'Enter') mainMenu.classList.toggle('open');
  };
}
