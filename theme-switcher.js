/**
 * Theme Switcher
 *
 * Manages theme switching for the brutalist UI.
 * Themes: forest (default), blueprint, industrial
 *
 * Features:
 * - Persists theme choice in localStorage
 * - Respects system dark mode preference
 * - Accessible keyboard navigation
 */

(function() {
    'use strict';

    // Theme definitions with their accent colors for the dot buttons
    const THEMES = {
        forest: {
            name: 'forest',
            color: '#3D6649',
            label: 'Forest Theme'
        },
        blueprint: {
            name: 'blueprint',
            color: '#0044CC',
            label: 'Blueprint Theme'
        },
        industrial: {
            name: 'industrial',
            color: '#E65100',
            label: 'Industrial Theme'
        }
    };

    const STORAGE_KEY = 'preferred-theme';
    const DEFAULT_THEME = 'forest';

    /**
     * Get the currently active theme from localStorage or default
     */
    function getCurrentTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored && THEMES[stored] ? stored : DEFAULT_THEME;
    }

    /**
     * Apply a theme to the document
     * @param {string} themeName - The theme to apply
     */
    function setTheme(themeName) {
        const theme = THEMES[themeName];
        if (!theme) {
            console.warn(`Unknown theme: ${themeName}`);
            return;
        }

        // Remove theme attribute for default (forest), set for others
        if (themeName === DEFAULT_THEME) {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', themeName);
        }

        // Persist choice
        localStorage.setItem(STORAGE_KEY, themeName);

        // Update active states on buttons
        updateActiveStates(themeName);

        // Dispatch event for other scripts that might need to know
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: themeName }
        }));
    }

    /**
     * Update the active class on theme switcher buttons
     * @param {string} activeTheme - The currently active theme
     */
    function updateActiveStates(activeTheme) {
        const buttons = document.querySelectorAll('.theme-switcher .color-dot');
        buttons.forEach(btn => {
            const btnTheme = btn.dataset.theme;
            if (btnTheme === activeTheme) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    }

    /**
     * Create the theme switcher UI element
     * @returns {HTMLElement} The theme switcher container
     */
    function createThemeSwitcher() {
        const container = document.createElement('div');
        container.className = 'theme-switcher';
        container.setAttribute('role', 'group');
        container.setAttribute('aria-label', 'Theme selection');

        Object.values(THEMES).forEach(theme => {
            const button = document.createElement('button');
            button.className = 'color-dot';
            button.style.backgroundColor = theme.color;
            button.dataset.theme = theme.name;
            button.setAttribute('aria-label', theme.label);
            button.setAttribute('aria-pressed', 'false');
            button.setAttribute('type', 'button');

            button.addEventListener('click', () => {
                setTheme(theme.name);
            });

            container.appendChild(button);
        });

        return container;
    }

    /**
     * Initialize the theme switcher
     */
    function init() {
        // Apply saved theme immediately (before DOM is fully ready)
        const savedTheme = getCurrentTheme();

        // Apply theme to prevent flash
        if (savedTheme !== DEFAULT_THEME) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Wait for DOM to be ready to create UI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDOMReady);
        } else {
            onDOMReady();
        }

        function onDOMReady() {
            // Create and insert theme switcher
            const switcher = createThemeSwitcher();
            document.body.appendChild(switcher);

            // Update active states
            updateActiveStates(savedTheme);
        }
    }

    // Expose setTheme globally for manual use if needed
    window.setTheme = setTheme;

    // Initialize
    init();
})();
