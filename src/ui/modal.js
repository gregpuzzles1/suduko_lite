/**
 * Modal UI Module
 * Handles the congratulations popup
 */

/**
 * Initialize the win modal
 * @param {HTMLElement} modal - Modal element
 * @param {HTMLElement} closeButton - Close button element
 * @param {Function} onClose - Callback when modal is closed
 */
export function initModal(modal, closeButton, onClose) {
    closeButton.addEventListener('click', () => {
        hideModal(modal);
        onClose();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
            hideModal(modal);
            onClose();
        }
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
            onClose();
        }
    });
}

/**
 * Show the modal
 * @param {HTMLElement} modal - Modal element
 */
export function showModal(modal) {
    modal.removeAttribute('hidden');
    
    // Focus the modal content for accessibility
    const closeButton = modal.querySelector('button');
    if (closeButton) {
        setTimeout(() => closeButton.focus(), 100);
    }
}

/**
 * Hide the modal
 * @param {HTMLElement} modal - Modal element
 */
export function hideModal(modal) {
    modal.setAttribute('hidden', '');
}
