const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('loom-theme');
if (savedTheme === 'dark') document.body.classList.add('dark-mode');

function updateThemeControl() {
  const dark = document.body.classList.contains('dark-mode');
  themeToggle?.setAttribute('aria-pressed', String(dark));
  themeToggle?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  if (themeToggle) themeToggle.innerHTML = `<span aria-hidden="true">${dark ? '☀' : '☾'}</span> ${dark ? 'Light' : 'Dark'}`;
}

updateThemeControl();
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('loom-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  updateThemeControl();
});
