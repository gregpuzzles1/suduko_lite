/**
 * Board UI Module
 * Renders and updates the Sudoku grid with all visual states
 */

import { getPeers } from '../sudoku/rules.js';
import { getCurrentGrid, isCorrect, hasConflict } from '../state.js';

let boardElement = null;
let cellElements = [];

/**
 * Initialize the board UI
 * @param {HTMLElement} container - Board container element
 */
export function initBoard(container) {
    boardElement = container;
    cellElements = [];
    
    // Create 81 cell elements
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.setAttribute('role', 'gridcell');
        cell.tabIndex = -1;
        
        // Add ARIA label with row and column info
        const row = Math.floor(i / 9) + 1;
        const col = (i % 9) + 1;
        cell.setAttribute('aria-label', `Row ${row}, Column ${col}`);
        
        boardElement.appendChild(cell);
        cellElements.push(cell);
    }
}

/**
 * Render the board based on current game state
 * @param {object} state - Game state
 * @param {number | null} selectedNumber - Currently selected number for same-number highlighting
 * @param {boolean | null} selectedIsCorrect - Whether the active cell's value is correct
 */
export function renderBoard(state, selectedNumber = null, selectedIsCorrect = null) {
    const grid = getCurrentGrid(state);
    
    for (let i = 0; i < 81; i++) {
        const cell = cellElements[i];
        const value = grid[i];
        const isGiven = state.givens[i];
        const isActive = state.activeCell === i;
        
        // Reset classes
        cell.className = 'cell';
        
        // Set base type
        if (isGiven) {
            cell.classList.add('given');
        } else {
            cell.classList.add('editable');
        }
        
        // Active cell
        if (isActive) {
            cell.classList.add('active');
            cell.tabIndex = 0;
        } else {
            cell.tabIndex = -1;
        }
        
        // Row/column/box highlight
        if (state.activeCell !== null && state.activeCell !== i) {
            const activePeers = getPeers(state.activeCell);
            if (activePeers.has(i) || Math.floor(i / 9) === Math.floor(state.activeCell / 9) || i % 9 === state.activeCell % 9) {
                cell.classList.add('highlighted');
            }
        }
        
        // Render value or pencil marks
        if (value !== 0) {
            cell.textContent = value;
            cell.innerHTML = value;
            
            // Update ARIA label
            const row = Math.floor(i / 9) + 1;
            const col = (i % 9) + 1;
            const status = isGiven ? 'given' : (isCorrect(state, i) ? 'correct' : 'incorrect');
            cell.setAttribute('aria-label', `Row ${row}, Column ${col}, ${value}, ${status}`);
            
            // Correctness coloring (only for user-entered cells)
            if (!isGiven) {
                if (isCorrect(state, i)) {
                    cell.classList.add('correct');
                } else {
                    cell.classList.add('incorrect');
                }
                
                // Conflict highlighting
                if (hasConflict(state, i)) {
                    cell.classList.add('conflict');
                }
            }
            
            // Same-number highlighting - highlight all cells with the active cell's number.
            // Use a darker blue for correct active value, or a red tint for incorrect active value.
            // Compare numerically to avoid any string/number mismatches.
            if (selectedNumber !== null && Number(value) === Number(selectedNumber)) {
                if (selectedIsCorrect === false) {
                    cell.classList.add('same-number-incorrect');
                } else {
                    cell.classList.add('same-number');
                }
            }
        } else {
            // Empty cell - show pencil marks if any
            const marks = state.pencilMarks[i];
            if (marks.size > 0) {
                cell.innerHTML = renderPencilMarks(marks);
            } else {
                cell.textContent = '';
            }
        }
    }
}

/**
 * Render pencil marks as a 3x3 grid
 * @param {Set<number>} marks - Set of pencil mark numbers
 * @returns {string} - HTML string for pencil marks
 */
function renderPencilMarks(marks) {
    const grid = Array.from({ length: 9 }, (_, i) => {
        const num = i + 1;
        return marks.has(num) ? num : '';
    });
    
    return `
        <div class="pencil-marks">
            ${grid.map(num => `<div class="mark">${num}</div>`).join('')}
        </div>
    `;
}

/**
 * Get cell index from a click event
 * @param {Event} event - Click event
 * @returns {number | null} - Cell index or null
 */
export function getCellIndexFromEvent(event) {
    const cell = event.target.closest('.cell');
    if (!cell) return null;
    return parseInt(cell.dataset.index, 10);
}

/**
 * Set active cell and focus it
 * @param {number | null} index - Cell index to activate
 */
export function setActiveCellFocus(index) {
    if (index !== null && cellElements[index]) {
        cellElements[index].focus();
    }
}

/**
 * Animate a shake effect on a cell (for given cell interaction feedback)
 * @param {number} index - Cell index
 */
export function shakeCell(index) {
    if (cellElements[index]) {
        cellElements[index].classList.add('shake');
        setTimeout(() => {
            cellElements[index].classList.remove('shake');
        }, 300);
    }
}

/**
 * Get selected number from the board (for same-number highlighting)
 * @param {object} state - Game state
 * @returns {number | null} - Selected number or null
 */
export function getSelectedNumber(state) {
    if (state.activeCell === null) return null;
    const grid = getCurrentGrid(state);
    const value = grid[state.activeCell];
    if (value === 0) return null;
    return Number(value);
}
