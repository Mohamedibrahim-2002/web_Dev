const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const cartCount = document.querySelector('#cart-count');
const themeToggle = document.querySelector('.theme-toggle');
let cart = 0;

const savedTheme = localStorage.getItem('loom-theme');
if (savedTheme === 'dark') document.body.classList.add('dark-mode');
function updateThemeButton() {
  const dark = document.body.classList.contains('dark-mode');
  themeToggle?.setAttribute('aria-pressed', dark);
  themeToggle?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  if (themeToggle) themeToggle.innerHTML = `<span class="theme-icon" aria-hidden="true">${dark ? '☀' : '☾'}</span><span class="theme-label">${dark ? 'Light' : 'Dark'}</span>`;
}
updateThemeButton();
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('loom-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  updateThemeButton();
});

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.add-button').forEach(button => {
  button.addEventListener('click', () => {
    cart += 1;
    cartCount.textContent = cart;
    const original = button.textContent;
    button.textContent = 'Added ✓';
    button.classList.add('added');
    setTimeout(() => { button.textContent = original; button.classList.remove('added'); }, 1200);
  });
});

document.querySelectorAll('.heart').forEach(button => {
  button.addEventListener('click', () => {
    button.textContent = button.textContent === '♥' ? '♡' : '♥';
    button.style.color = button.textContent === '♥' ? '#bf654d' : '';
  });
});
