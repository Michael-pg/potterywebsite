const buttons = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.item');

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
      if (filter === 'all' || item.dataset.price === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});
