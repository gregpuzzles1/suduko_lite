/**
 * Game State Management
 * Immutable state with action history for undo
 */

import { getCandidates, getPeers } from './sudoku/rules.js';

/**
 * Create initial game state
 * @param {number[]} puzzle - 81-element array (0 = empty, 1-9 = given)
 * @param {number[]} solution - 81-element array with correct solution
 * @returns {object} - Initial game state
 */
export function createGameState(puzzle, solution) {
    const givens = puzzle.map(cell => cell !== 0);
    const userValues = new Array(81).fill(0);
    const pencilMarks = Array.from({ length: 81 }, () => new Set());
    
    return {
        puzzle: [...puzzle],
        solution: [...solution],
        givens,
        userValues,
        pencilMarks,
        activeCell: null,
        pencilMode: false,
        history: []
    };
}

/**
 * Get the current grid (combining givens and user values)
 * @param {object} state - Game state
 * @returns {number[]} - 81-element array with current board
 */
export function getCurrentGrid(state) {
    const grid = new Array(81);
    for (let i = 0; i < 81; i++) {
        grid[i] = state.givens[i] ? state.puzzle[i] : state.userValues[i];
    }
    return grid;
}

/**
 * Check if a user-entered value is correct
 * @param {object} state - Game state
 * @param {number} index - Cell index
 * @returns {boolean} - True if correct, false if incorrect or empty
 */
export function isCorrect(state, index) {
    if (state.givens[index]) return true;
    if (state.userValues[index] === 0) return false;
    return state.userValues[index] === state.solution[index];
}

/**
 * Check if a user-entered value conflicts with Sudoku constraints
 * @param {object} state - Game state
 * @param {number} index - Cell index
 * @returns {boolean} - True if conflicts exist
 */
export function hasConflict(state, index) {
    if (state.givens[index] || state.userValues[index] === 0) return false;
    
    const value = state.userValues[index];
    const peers = getPeers(index);
    const grid = getCurrentGrid(state);
    
    for (const peerIndex of peers) {
        if (grid[peerIndex] === value) {
            return true;
        }
    }
    
    return false;
}

/**
 * Check if the puzzle is solved (all cells correct)
 * @param {object} state - Game state
 * @returns {boolean} - True if completely solved
 */
export function isSolved(state) {
    for (let i = 0; i < 81; i++) {
        if (state.givens[i]) continue;
        if (state.userValues[i] !== state.solution[i]) return false;
    }
    return true;
}

/**
 * Apply an action to the game state (returns new state + history entry)
 * @param {object} state - Current game state
 * @param {object} action - { type, index, value, ... }
 * @returns {object} - New game state
 */
export function applyAction(state, action) {
    const newState = {
        ...state,
        userValues: [...state.userValues],
        pencilMarks: state.pencilMarks.map(set => new Set(set)),
        history: [...state.history]
    };
    
    // Record action for undo
    const historyEntry = { ...action };
    
    switch (action.type) {
        case 'setValue': {
            const { index, value } = action;
            if (state.givens[index]) {
                // Given cell - no-op
                return state;
            }
            
            historyEntry.previousValue = state.userValues[index];
            historyEntry.previousPencilMarks = new Set(state.pencilMarks[index]);
            
            newState.userValues[index] = value;
            newState.pencilMarks[index].clear();
            
            // If correct value, prune invalid pencil marks globally
            if (value !== 0 && value === state.solution[index]) {
                const peers = getPeers(index);
                for (const peerIndex of peers) {
                    newState.pencilMarks[peerIndex].delete(value);
                }
            }
            
            break;
        }
        
        case 'erase': {
            const { index } = action;
            if (state.givens[index]) {
                return state;
            }
            
            historyEntry.previousValue = state.userValues[index];
            historyEntry.previousPencilMarks = new Set(state.pencilMarks[index]);
            
            newState.userValues[index] = 0;
            newState.pencilMarks[index].clear();
            break;
        }
        
        case 'togglePencilMark': {
            const { index, value } = action;
            if (state.givens[index] || state.userValues[index] !== 0) {
                return state;
            }
            
            historyEntry.previousPencilMarks = new Set(state.pencilMarks[index]);
            
            if (newState.pencilMarks[index].has(value)) {
                newState.pencilMarks[index].delete(value);
            } else {
                newState.pencilMarks[index].add(value);
            }
            break;
        }
        
        case 'setPencilMode': {
            newState.pencilMode = action.enabled;
            historyEntry.previousMode = state.pencilMode;
            break;
        }
        
        case 'setActiveCell': {
            newState.activeCell = action.index;
            // Don't add to history (navigation actions aren't undoable)
            return newState;
        }
        
        default:
            return state;
    }
    
    newState.history.push(historyEntry);
    return newState;
}

/**
 * Undo the last action
 * @param {object} state - Current game state
 * @returns {object} - New game state with last action reverted
 */
export function undo(state) {
    if (state.history.length === 0) return state;
    
    const newState = {
        ...state,
        userValues: [...state.userValues],
        pencilMarks: state.pencilMarks.map(set => new Set(set)),
        history: state.history.slice(0, -1)
    };
    
    const lastAction = state.history[state.history.length - 1];
    
    switch (lastAction.type) {
        case 'setValue':
        case 'erase': {
            const { index, previousValue, previousPencilMarks } = lastAction;
            newState.userValues[index] = previousValue;
            if (previousPencilMarks) {
                newState.pencilMarks[index] = new Set(previousPencilMarks);
            }
            
            // Re-prune pencil marks based on restored state
            // (Simplified: just recompute globally)
            newState.pencilMarks = recomputePencilMarks(newState);
            break;
        }
        
        case 'togglePencilMark': {
            const { index, previousPencilMarks } = lastAction;
            newState.pencilMarks[index] = new Set(previousPencilMarks);
            break;
        }
        
        case 'setPencilMode': {
            newState.pencilMode = lastAction.previousMode;
            break;
        }
    }
    
    return newState;
}

/**
 * Recompute pencil marks by removing invalid candidates based on correct values
 * @param {object} state - Game state
 * @returns {Array<Set>} - New pencil marks array
 */
function recomputePencilMarks(state) {
    const grid = getCurrentGrid(state);
    const newPencilMarks = state.pencilMarks.map(set => new Set(set));
    
    // For each cell with correct user value, remove that value from peers' pencil marks
    for (let i = 0; i < 81; i++) {
        if (!state.givens[i] && state.userValues[i] !== 0 && isCorrect(state, i)) {
            const value = state.userValues[i];
            const peers = getPeers(i);
            for (const peerIndex of peers) {
                newPencilMarks[peerIndex].delete(value);
            }
        }
        
        // Also check givens
        if (state.givens[i]) {
            const value = state.puzzle[i];
            const peers = getPeers(i);
            for (const peerIndex of peers) {
                newPencilMarks[peerIndex].delete(value);
            }
        }
    }
    
    return newPencilMarks;
}
