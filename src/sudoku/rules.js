/**
 * Sudoku Rules and Constraint Helpers
 * Provides utilities for checking Sudoku constraints and computing candidates
 */

/**
 * Get all cell indices in the same row as the given index
 * @param {number} index - Cell index (0-80)
 * @returns {number[]} - Array of indices in the same row
 */
export function getRow(index) {
    const row = Math.floor(index / 9);
    return Array.from({ length: 9 }, (_, i) => row * 9 + i);
}

/**
 * Get all cell indices in the same column as the given index
 * @param {number} index - Cell index (0-80)
 * @returns {number[]} - Array of indices in the same column
 */
export function getColumn(index) {
    const col = index % 9;
    return Array.from({ length: 9 }, (_, i) => i * 9 + col);
}

/**
 * Get all cell indices in the same 3x3 box as the given index
 * @param {number} index - Cell index (0-80)
 * @returns {number[]} - Array of indices in the same 3x3 box
 */
export function getBox(index) {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    const indices = [];
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            indices.push(r * 9 + c);
        }
    }
    return indices;
}

/**
 * Get all cell indices that share a constraint with the given index
 * (same row, column, or box)
 * @param {number} index - Cell index (0-80)
 * @returns {Set<number>} - Set of indices sharing constraints (excluding index itself)
 */
export function getPeers(index) {
    const peers = new Set([
        ...getRow(index),
        ...getColumn(index),
        ...getBox(index)
    ]);
    peers.delete(index);
    return peers;
}

/**
 * Get valid candidates for a cell given the current grid state
 * @param {number[]} grid - 81-element array (0 = empty, 1-9 = filled)
 * @param {number} index - Cell index to check
 * @returns {Set<number>} - Set of valid candidate numbers (1-9)
 */
export function getCandidates(grid, index) {
    if (grid[index] !== 0) {
        return new Set();
    }
    
    const used = new Set();
    const peers = getPeers(index);
    
    for (const peerIndex of peers) {
        if (grid[peerIndex] !== 0) {
            used.add(grid[peerIndex]);
        }
    }
    
    const candidates = new Set();
    for (let num = 1; num <= 9; num++) {
        if (!used.has(num)) {
            candidates.add(num);
        }
    }
    
    return candidates;
}

/**
 * Check if placing a number at an index violates Sudoku constraints
 * @param {number[]} grid - 81-element array
 * @param {number} index - Cell index
 * @param {number} value - Value to check (1-9)
 * @returns {boolean} - True if placement is valid (no conflicts)
 */
export function isValidPlacement(grid, index, value) {
    if (value < 1 || value > 9) return false;
    
    const peers = getPeers(index);
    for (const peerIndex of peers) {
        if (grid[peerIndex] === value) {
            return false;
        }
    }
    
    return true;
}

/**
 * Check if the entire grid is valid (no constraint violations)
 * @param {number[]} grid - 81-element array
 * @returns {boolean} - True if no conflicts exist
 */
export function isGridValid(grid) {
    for (let i = 0; i < 81; i++) {
        if (grid[i] !== 0) {
            const temp = grid[i];
            grid[i] = 0;
            const valid = isValidPlacement(grid, i, temp);
            grid[i] = temp;
            if (!valid) return false;
        }
    }
    return true;
}

/**
 * Check if the grid is completely filled (all cells 1-9)
 * @param {number[]} grid - 81-element array
 * @returns {boolean} - True if all cells filled
 */
export function isGridComplete(grid) {
    return grid.every(cell => cell >= 1 && cell <= 9);
}
