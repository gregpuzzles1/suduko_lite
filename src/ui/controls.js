/**
 * Controls UI Module
 * Handles New Game dropdown, pencil/erase/undo buttons, and number pad
 */

/**
 * Initialize New Game dropdown
 * @param {HTMLElement} button - New Game button
 * @param {HTMLElement} dropdown - Dropdown menu
 * @param {Function} onSelectDifficulty - Callback (difficulty) => void
 */
export function initNewGameDropdown(button, dropdown, onSelectDifficulty) {
    let isProcessing = false;
    
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dropdown.hasAttribute('hidden');
        if (isHidden) {
            dropdown.removeAttribute('hidden');
            button.setAttribute('aria-expanded', 'true');
        } else {
            dropdown.setAttribute('hidden', '');
            button.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Handle difficulty selection
    const difficultyButtons = dropdown.querySelectorAll('[data-difficulty]');
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isProcessing) return;
            isProcessing = true;
            
            const difficulty = btn.dataset.difficulty;
            console.log('Selected difficulty:', difficulty);
            
            // Close dropdown first
            dropdown.setAttribute('hidden', '');
            button.setAttribute('aria-expanded', 'false');
            
            // Then trigger callback
            setTimeout(() => {
                onSelectDifficulty(difficulty);
                isProcessing = false;
            }, 0);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!isProcessing && !button.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.setAttribute('hidden', '');
            button.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Initialize number pad
 * @param {NodeList} numberButtons - Number buttons (1-9)
 * @param {Function} onNumberClick - Callback (number) => void
 */
export function initNumberPad(numberButtons, onNumberClick) {
    numberButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const number = parseInt(btn.dataset.number, 10);
            onNumberClick(number);
        });
    });
}

/**
 * Initialize control buttons
 * @param {object} buttons - { pencil, erase, undo }
 * @param {object} callbacks - { onPencilToggle, onErase, onUndo }
 */
export function initControlButtons(buttons, callbacks) {
    buttons.pencil.addEventListener('click', () => {
        callbacks.onPencilToggle();
    });
    
    buttons.erase.addEventListener('click', () => {
        callbacks.onErase();
    });
    
    buttons.undo.addEventListener('click', () => {
        callbacks.onUndo();
    });
}

/**
 * Update pencil button pressed state
 * @param {HTMLElement} pencilButton - Pencil button element
 * @param {boolean} isPencilMode - Whether pencil mode is active
 */
export function updatePencilButton(pencilButton, isPencilMode) {
    pencilButton.setAttribute('aria-pressed', isPencilMode.toString());
}

/**
 * Load last selected difficulty from localStorage
 * @returns {string | null} - Difficulty name or null
 */
export function loadLastDifficulty() {
    try {
        return localStorage.getItem('sudoku_lite:lastDifficulty');
    } catch {
        return null;
    }
}

/**
 * Save last selected difficulty to localStorage
 * @param {string} difficulty - Difficulty name
 */
export function saveLastDifficulty(difficulty) {
    try {
        localStorage.setItem('sudoku_lite:lastDifficulty', difficulty);
    } catch {
        // localStorage not available or quota exceeded
    }
}
