// Simple testimonial slider
window.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.testimonial-item');
  const prevBtn = document.querySelector('.testimonial-nav.prev');
  const nextBtn = document.querySelector('.testimonial-nav.next');
  let index = 0;

  function showItem(n) {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === n);
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

  showItem(index);
});
