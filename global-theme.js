/**
 * Core Global Theme Synchronizer
 * Handles reading from localStorage, system media query preference,
 * avoids theme flashing (FOUC), and dispatches custom events for active scripts.
 */
(function() {
    const themeKey = 'global_nsoc_theme';
    
    // Resolve theme: localStorage preference or system preference or default light
    const getPreferredTheme = () => {
        const stored = localStorage.getItem(themeKey);
        if (stored) return stored;
        
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = theme;
        localStorage.setItem(themeKey, theme);
        
        // Dispatch custom event for widgets/sub-apps to react
        const event = new CustomEvent('globalThemeChange', { detail: { theme } });
        window.dispatchEvent(event);
    };

    // Initialize theme immediately to avoid flashing
    const initialTheme = getPreferredTheme();
    document.documentElement.setAttribute('data-theme', initialTheme);

    document.addEventListener("DOMContentLoaded", () => {
        applyTheme(initialTheme);

        // Listen for system preference changes in real-time
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(themeKey)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    });

    window.toggleGlobalTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };
})();