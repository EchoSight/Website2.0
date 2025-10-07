// Testimonial slider with fade transition
window.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.testimonial-item');
  const prevBtn = document.querySelector('.testimonial-nav.prev');
  const nextBtn = document.querySelector('.testimonial-nav.next');
  const dots = Array.from(document.querySelectorAll('.testimonial-dot'));
  let index = 0;

  function showItem(n) {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === n);
    });
    dots.forEach((dot, i) => {
      const isActive = i === n;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function prev() {
    index = (index - 1 + items.length) % items.length;
    showItem(index);
  }

  function next() {
    index = (index + 1) % items.length;
    showItem(index);
  }

  prevBtn && prevBtn.addEventListener('click', prev);
  nextBtn && nextBtn.addEventListener('click', next);

  if (dots.length === items.length) {
    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        index = dotIndex;
        showItem(index);
      });
    });
  }

  showItem(index);
});
