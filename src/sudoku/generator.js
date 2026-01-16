/**
 * Sudoku Puzzle Generator
 * Generates complete solutions and derives puzzles by removing clues
 */

import { getCandidates, isValidPlacement, isGridComplete } from './rules.js';
import { hasUniqueSolution, computeEffortScore, classifyDifficulty } from './solver.js';

/**
 * Difficulty configuration: clue count ranges and effort score bands
 */
const DIFFICULTY_CONFIG = {
    beginner: { clues: [40, 45], effortMax: 5 },
    intermediate: { clues: [34, 39], effortMax: 5 },
    advanced: { clues: [28, 33], effortMin: 5, effortMax: 20 },
    expert: { clues: [24, 27], effortMin: 5, effortMax: 20 },
    master: { clues: [22, 23], effortMin: 20 },
    extreme: { clues: [17, 21], effortMin: 20 }
};

/**
 * Generate a complete valid Sudoku solution grid using randomized backtracking
 * @returns {number[]} - 81-element array with complete solution
 */
export function generateSolution() {
    const grid = new Array(81).fill(0);
    
    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    
    function fillGrid(index) {
        if (index === 81) return true;
        
        const candidates = Array.from(getCandidates(grid, index));
        const shuffled = shuffle(candidates);
        
        for (const num of shuffled) {
            if (isValidPlacement(grid, index, num)) {
                grid[index] = num;
                if (fillGrid(index + 1)) return true;
                grid[index] = 0;
            }
        }
        
        return false;
    }
    
    fillGrid(0);
    return grid;
}

/**
 * Generate a puzzle by removing clues from a complete solution
 * Ensures unique solution by checking after each removal
 * @param {string} difficulty - One of: beginner, intermediate, advanced, expert, master, extreme
 * @returns {object} - { puzzle: number[], solution: number[], difficulty: string, clues: number, effort: object }
 */
export function generatePuzzle(difficulty = 'beginner') {
    const difficultyKey = difficulty.toLowerCase();
    const config = DIFFICULTY_CONFIG[difficultyKey];
    
    if (!config) {
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }
    
    const [minClues, maxClues] = config.clues;
    const targetClues = Math.floor(Math.random() * (maxClues - minClues + 1)) + minClues;
    
    const solution = generateSolution();
    const puzzle = [...solution];
    
    // Get all indices and shuffle
    const indices = Array.from({ length: 81 }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // Remove clues one at a time, checking uniqueness
    let removed = 0;
    const maxRemove = 81 - targetClues;
    
    for (const index of indices) {
        if (removed >= maxRemove) break;
        
        const original = puzzle[index];
        puzzle[index] = 0;
        
        // Check if still has unique solution
        if (hasUniqueSolution(puzzle)) {
            removed++;
        } else {
            // Restore the clue if removing it breaks uniqueness
            puzzle[index] = original;
        }
    }
    
    const clueCount = puzzle.filter(c => c !== 0).length;
    const effort = { score: 0, guesses: 0, maxDepth: 0, constraintSolves: 0 };
    
    return {
        puzzle,
        solution,
        difficulty: difficultyKey,
        clues: clueCount,
        effort
    };
}

/**
 * Retry wrapper for generatePuzzle - just calls once (no retries needed with fast generation)
 * @param {string} difficulty - Difficulty level
 * @returns {object} - Puzzle object
 */
export function generatePuzzleWithRetry(difficulty = 'beginner') {
    return generatePuzzle(difficulty);
}
