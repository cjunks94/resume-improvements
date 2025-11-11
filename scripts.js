/**
 * Mobile Navigation Menu - Toggle and Accessibility
 * Implements hamburger menu functionality with full keyboard support
 * and WCAG 2.1 compliance
 */

(function() {
    'use strict';

    // Get DOM elements
    const menuToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Check if elements exist
    if (!menuToggle || !nav) {
        console.warn('Mobile menu elements not found');
        return;
    }

    /**
     * Toggle menu open/closed state
     */
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;

        // Update ARIA state
        menuToggle.setAttribute('aria-expanded', newState);

        // Manage focus
        if (newState) {
            // Menu opened - trap focus
            trapFocus();
        } else {
            // Menu closed - return focus to toggle button
            menuToggle.focus();
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = newState ? 'hidden' : '';
    }

    /**
     * Close the menu
     */
    function closeMenu() {
        if (menuToggle.getAttribute('aria-expanded') === 'true') {
            toggleMenu();
        }
    }

    /**
     * Trap focus within open menu (accessibility requirement)
     */
    function trapFocus() {
        // Get all focusable elements in the menu
        const focusableElements = nav.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Focus first link when menu opens
        setTimeout(() => firstFocusable.focus(), 100);

        // Handle Tab key to loop focus
        function handleTab(e) {
            if (e.key !== 'Tab') return;

            // If menu is closed, remove listener
            if (menuToggle.getAttribute('aria-expanded') !== 'true') {
                document.removeEventListener('keydown', handleTab);
                return;
            }

            // Shift + Tab on first element -> go to last
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
            // Tab on last element -> go to first
            else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }

        document.addEventListener('keydown', handleTab);
    }

    /**
     * Handle Escape key to close menu
     */
    function handleEscape(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeMenu();
        }
    }

    // Event Listeners

    // Toggle button click
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', handleEscape);

    // Close menu when clicking on backdrop
    menuToggle.addEventListener('click', function(e) {
        // If clicking the ::before pseudo-element backdrop
        // Note: this is handled by the toggle itself, backdrop click = toggle click
    });

    // Handle window resize - close menu if resizing to desktop
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // If desktop size and menu is open, close it
            if (window.innerWidth >= 769 && menuToggle.getAttribute('aria-expanded') === 'true') {
                closeMenu();
            }
        }, 250);
    });

    console.log('Mobile menu initialized');
})();
