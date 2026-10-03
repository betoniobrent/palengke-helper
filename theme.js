(() => {
    const key = 'palengkeTheme';
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    let preference;
    try { preference = localStorage.getItem(key); } catch (_) {}
    function apply(theme) {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
        document.querySelectorAll('[data-theme-toggle]').forEach(button => {
            button.textContent = theme === 'dark' ? '☀ Light mode' : '☾ Dark mode';
            button.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
            button.setAttribute('aria-pressed', String(theme === 'dark'));
        });
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0f172a' : '#047857');
    }
    const current = () => preference === 'dark' || preference === 'light' ? preference : system.matches ? 'dark' : 'light';
    apply(current());
    document.addEventListener('DOMContentLoaded', () => {
        apply(current());
        document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => {
            preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            try { localStorage.setItem(key, preference); } catch (_) {}
            apply(preference);
        }));
    });
    system.addEventListener('change', () => apply(current()));
})();
