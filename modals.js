/**
 * Architecture Diagram Modal Handler
 *
 * Handles opening and closing architecture diagram modals.
 * Modals can be opened by clicking buttons with data-modal attribute,
 * and closed by clicking the close button, overlay, or pressing Escape.
 *
 * Mermaid is lazy-loaded on first modal open to avoid blocking page load
 * (mermaid is ~2MB and only ever needed when a modal is opened).
 */

(function() {
    'use strict';

    // Mermaid is loaded once on first modal open and cached.
    let mermaidPromise = null;

    function loadMermaid() {
        if (!mermaidPromise) {
            mermaidPromise = import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs')
                .then(module => {
                    const mermaid = module.default;
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: 'dark',
                        themeVariables: {
                            primaryColor: '#0066cc',
                            primaryTextColor: '#fff',
                            primaryBorderColor: '#0052a3',
                            lineColor: '#5e5e5e',
                            secondaryColor: '#1e7e34',
                            tertiaryColor: '#c92a2a'
                        }
                    });
                    window.mermaid = mermaid;
                    return mermaid;
                })
                .catch(err => {
                    console.warn('Mermaid load failed:', err);
                    mermaidPromise = null; // allow retry
                    throw err;
                });
        }
        return mermaidPromise;
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModals);
    } else {
        initModals();
    }

    function initModals() {
        // Find all buttons that trigger modals
        const modalTriggers = document.querySelectorAll('[data-modal]');

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal');
                openModal(modalId);
            });
        });

        // Find all modal close buttons
        const closeButtons = document.querySelectorAll('.arch-modal__close');

        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.arch-modal');
                closeModal(modal);
            });
        });

        // Close modal when clicking overlay
        const overlays = document.querySelectorAll('.arch-modal__overlay');

        overlays.forEach(overlay => {
            overlay.addEventListener('click', function() {
                const modal = this.closest('.arch-modal');
                closeModal(modal);
            });
        });

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.arch-modal.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
        });
    }

    /**
     * Open a modal by ID
     * @param {string} modalId - The ID of the modal to open
     */
    function openModal(modalId) {
        const modal = document.getElementById(modalId);

        if (!modal) {
            console.error(`Modal with ID "${modalId}" not found`);
            return;
        }

        // Add active class to show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Focus the close button for accessibility
        const closeButton = modal.querySelector('.arch-modal__close');
        if (closeButton) {
            setTimeout(() => closeButton.focus(), 100);
        }

        // Lazy-load Mermaid on first open, then render diagrams in this modal
        loadMermaid().then(mermaid => {
            try {
                mermaid.run({
                    querySelector: `#${modalId} .mermaid`
                });
            } catch (e) {
                console.warn('Mermaid rendering error:', e);
            }
        }).catch(() => {
            // Already logged in loadMermaid()
        });
    }

    /**
     * Close a modal
     * @param {HTMLElement} modal - The modal element to close
     */
    function closeModal(modal) {
        if (!modal) return;

        // Remove active class to hide modal
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        document.body.style.overflow = '';

        // Return focus to trigger button if possible
        const triggerId = modal.id;
        const trigger = document.querySelector(`[data-modal="${triggerId}"]`);
        if (trigger) {
            trigger.focus();
        }
    }

    // Expose functions globally for potential external use
    window.architectureModals = {
        open: openModal,
        close: closeModal
    };
})();
