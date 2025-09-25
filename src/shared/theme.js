// Tema uygula, root değişkenlerini ayarla
export function applyTheme(params) {
    const root = document.documentElement;
    root.style.setProperty('--bg', params.bg);
    root.style.setProperty('--fg', params.fg);
    root.style.setProperty('--radius', params.radius + 'px');
    root.style.setProperty('--fs', params.size);

    if (params.theme === 'auto') {
        root.removeAttribute('data-theme');
    } else {
        root.setAttribute('data-theme', params.theme);
    }
}
