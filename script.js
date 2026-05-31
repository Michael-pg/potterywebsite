const buttons = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.gallery .item');

// Sold accordion
const soldToggle = document.querySelector('.sold-toggle');
const soldGallery = document.querySelector('.sold-gallery');
soldToggle.addEventListener('click', () => {
  const open = soldToggle.getAttribute('aria-expanded') === 'true';
  soldToggle.setAttribute('aria-expanded', !open);
  soldGallery.hidden = open;
});

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;

    items.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});
