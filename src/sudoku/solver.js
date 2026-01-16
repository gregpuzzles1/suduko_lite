/**
 * Sudoku Solver
 * Counts solutions and computes difficulty effort scores
 */

import { getCandidates, isValidPlacement, isGridComplete } from './rules.js';

/**
 * Count the number of solutions for a puzzle (with early exit)
 * @param {number[]} grid - 81-element array (0 = empty)
 * @param {number} maxCount - Stop counting after reaching this number (default 2)
 * @returns {number} - Number of solutions found (capped at maxCount)
 */
export function countSolutions(grid, maxCount = 2) {
    const gridCopy = [...grid];
    let count = 0;
    
    function backtrack(index) {
        if (count >= maxCount) return;
        
        // Find next empty cell
        while (index < 81 && gridCopy[index] !== 0) {
            index++;
        }
        
        if (index === 81) {
            // Grid complete - found a solution
            count++;
            return;
        }
        
        const candidates = getCandidates(gridCopy, index);
        for (const num of candidates) {
            gridCopy[index] = num;
            backtrack(index + 1);
            if (count >= maxCount) {
                gridCopy[index] = 0;
                return;
            }
            gridCopy[index] = 0;
        }
    }
    
    backtrack(0);
    return count;
}

/**
 * Check if a puzzle has exactly one solution
 * @param {number[]} grid - 81-element array
 * @returns {boolean} - True if exactly one solution exists
 */
export function hasUniqueSolution(grid) {
    return countSolutions(grid, 2) === 1;
}

/**
 * Solve a puzzle using constraint propagation + backtracking
 * Returns the first solution found, or null if unsolvable
 * @param {number[]} grid - 81-element array
 * @returns {number[] | null} - Solved grid or null
 */
export function solve(grid) {
    const gridCopy = [...grid];
    
    // Try constraint propagation (naked singles)
    let changed = true;
    while (changed) {
        changed = false;
        for (let i = 0; i < 81; i++) {
            if (gridCopy[i] === 0) {
                const candidates = getCandidates(gridCopy, i);
                if (candidates.size === 0) {
                    return null; // No solution
                }
                if (candidates.size === 1) {
                    gridCopy[i] = Array.from(candidates)[0];
                    changed = true;
                }
            }
        }
    }
    
    if (isGridComplete(gridCopy)) {
        return gridCopy;
    }
    
    // Find cell with minimum remaining values (MRV heuristic)
    let minCandidates = 10;
    let minIndex = -1;
    
    for (let i = 0; i < 81; i++) {
        if (gridCopy[i] === 0) {
            const candidates = getCandidates(gridCopy, i);
            if (candidates.size === 0) return null;
            if (candidates.size < minCandidates) {
                minCandidates = candidates.size;
                minIndex = i;
            }
        }
    }
    
    if (minIndex === -1) {
        return isGridComplete(gridCopy) ? gridCopy : null;
    }
    
    // Backtrack with MRV
    const candidates = getCandidates(gridCopy, minIndex);
    for (const num of candidates) {
        gridCopy[minIndex] = num;
        const result = solve(gridCopy);
        if (result) return result;
        gridCopy[minIndex] = 0;
    }
    
    return null;
}

/**
 * Compute difficulty effort score for a puzzle
 * @param {number[]} grid - 81-element array
 * @returns {object} - { score: number, guesses: number, maxDepth: number, constraintSolves: number }
 */
export function computeEffortScore(grid) {
    const gridCopy = [...grid];
    let guesses = 0;
    let maxDepth = 0;
    let constraintSolves = 0;
    
    function backtrackWithMetrics(depth) {
        maxDepth = Math.max(maxDepth, depth);
        
        // Try constraint propagation
        let changed = true;
        while (changed) {
            changed = false;
            for (let i = 0; i < 81; i++) {
                if (gridCopy[i] === 0) {
                    const candidates = getCandidates(gridCopy, i);
                    if (candidates.size === 0) return false;
                    if (candidates.size === 1) {
                        gridCopy[i] = Array.from(candidates)[0];
                        changed = true;
                        constraintSolves++;
                    }
                }
            }
        }
        
        if (isGridComplete(gridCopy)) return true;
        
        // Find MRV cell
        let minCandidates = 10;
        let minIndex = -1;
        
        for (let i = 0; i < 81; i++) {
            if (gridCopy[i] === 0) {
                const candidates = getCandidates(gridCopy, i);
                if (candidates.size === 0) return false;
                if (candidates.size < minCandidates) {
                    minCandidates = candidates.size;
                    minIndex = i;
                }
            }
        }
        
        if (minIndex === -1) return isGridComplete(gridCopy);
        
        // Backtrack (count as guess)
        const candidates = getCandidates(gridCopy, minIndex);
        for (const num of candidates) {
            guesses++;
            gridCopy[minIndex] = num;
            if (backtrackWithMetrics(depth + 1)) return true;
            gridCopy[minIndex] = 0;
        }
        
        return false;
    }
    
    backtrackWithMetrics(0);
    
    // Compute score: weight guesses heavily, add depth bonus
    const score = guesses + maxDepth * 2 - constraintSolves * 0.5;
    
    return {
        score: Math.max(0, Math.round(score)),
        guesses,
        maxDepth,
        constraintSolves
    };
}

/**
 * Classify difficulty band based on effort score
 * @param {number} score - Effort score from computeEffortScore
 * @returns {string} - Difficulty band name
 */
export function classifyDifficulty(score) {
    if (score <= 5) return 'easy'; // Beginner/Intermediate
    if (score <= 20) return 'medium'; // Advanced/Expert
    return 'hard'; // Master/Extreme
}
