/**
 * Sudoku Lite - Main Application Entry Point
 * Bootstraps the app and initializes UI event handlers
 */

import { generatePuzzleWithRetry } from './sudoku/generator.js';
import { createGameState, applyAction, undo, isSolved } from './state.js';
import { 
    initBoard, 
    renderBoard, 
    getCellIndexFromEvent, 
    setActiveCellFocus, 
    shakeCell,
    getSelectedNumber 
} from './ui/board.js';
import { 
    initNewGameDropdown, 
    initNumberPad, 
    initControlButtons, 
    updatePencilButton,
    loadLastDifficulty,
    saveLastDifficulty
} from './ui/controls.js';
import { initModal, showModal } from './ui/modal.js';
import { initConfetti, startConfetti } from './ui/confetti.js';

let gameState = null;
let lastSolvedState = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sudoku Lite - App starting...');
    
    // Get DOM elements
    const boardElement = document.getElementById('board');
    const newGameBtn = document.getElementById('newGameBtn');
    const difficultyDropdown = document.getElementById('difficultyDropdown');
    const pencilBtn = document.getElementById('pencilBtn');
    const eraseBtn = document.getElementById('eraseBtn');
    const undoBtn = document.getElementById('undoBtn');
    const numberButtons = document.querySelectorAll('.number-btn');
    const winModal = document.getElementById('winModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const confettiCanvas = document.getElementById('confettiCanvas');
    
    // Initialize UI modules
    initBoard(boardElement);
    initConfetti(confettiCanvas);
    initModal(winModal, closeModalBtn, () => {
        // Modal closed
    });
    
    initNewGameDropdown(newGameBtn, difficultyDropdown, (difficulty) => {
        startNewGame(difficulty);
    });
    
    initNumberPad(numberButtons, (number) => {
        handleNumberInput(number);
    });
    
    initControlButtons(
        { pencil: pencilBtn, erase: eraseBtn, undo: undoBtn },
        {
            onPencilToggle: () => {
                if (!gameState) return;
                gameState = applyAction(gameState, { type: 'setPencilMode', enabled: !gameState.pencilMode });
                updatePencilButton(pencilBtn, gameState.pencilMode);
            },
            onErase: () => {
                if (!gameState || gameState.activeCell === null) return;
                if (gameState.givens[gameState.activeCell]) {
                    shakeCell(gameState.activeCell);
                    return;
                }
                gameState = applyAction(gameState, { type: 'erase', index: gameState.activeCell });
                render();
            },
            onUndo: () => {
                if (!gameState) return;
                gameState = undo(gameState);
                render();
            }
        }
    );
    
    // Board click handler
    boardElement.addEventListener('click', (e) => {
        const index = getCellIndexFromEvent(e);
        if (index !== null) {
            gameState = applyAction(gameState, { type: 'setActiveCell', index });
            setActiveCellFocus(index);
            render();
        }
    });
    
    // Keyboard navigation
    boardElement.addEventListener('keydown', (e) => {
        if (!gameState || gameState.activeCell === null) return;
        
        const currentIndex = gameState.activeCell;
        const row = Math.floor(currentIndex / 9);
        const col = currentIndex % 9;
        let newIndex = currentIndex;
        
        switch (e.key) {
            case 'ArrowUp':
                if (row > 0) newIndex = (row - 1) * 9 + col;
                e.preventDefault();
                break;
            case 'ArrowDown':
                if (row < 8) newIndex = (row + 1) * 9 + col;
                e.preventDefault();
                break;
            case 'ArrowLeft':
                if (col > 0) newIndex = row * 9 + (col - 1);
                e.preventDefault();
                break;
            case 'ArrowRight':
                if (col < 8) newIndex = row * 9 + (col + 1);
                e.preventDefault();
                break;
            case 'Escape':
                newIndex = null;
                e.preventDefault();
                break;
            case '1': case '2': case '3': case '4': case '5':
            case '6': case '7': case '8': case '9':
                handleNumberInput(parseInt(e.key, 10));
                e.preventDefault();
                return;
            case 'Backspace':
            case 'Delete':
                if (gameState.givens[currentIndex]) {
                    shakeCell(currentIndex);
                } else {
                    gameState = applyAction(gameState, { type: 'erase', index: currentIndex });
                    render();
                }
                e.preventDefault();
                return;
        }
        
        if (newIndex !== currentIndex) {
            gameState = applyAction(gameState, { type: 'setActiveCell', index: newIndex });
            if (newIndex !== null) {
                setActiveCellFocus(newIndex);
            }
            render();
        }
    });
    
    // Don't auto-start game - wait for user to click New Game
    console.log('App ready. Click "New Game" to start.');
});

function startNewGame(difficulty) {
    console.log(`Starting new game: ${difficulty}`);
    
    // Show loading state
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.textContent = 'Generating...';
        newGameBtn.disabled = true;
    }
    
    // Use setTimeout to allow UI update
    setTimeout(() => {
        try {
            const startTime = Date.now();
            const puzzleData = generatePuzzleWithRetry(difficulty);
            saveLastDifficulty(difficulty);
            
            const elapsed = Date.now() - startTime;
            console.log(`Generated ${difficulty} puzzle in ${elapsed}ms - ${puzzleData.clues} clues`);
            
            gameState = createGameState(puzzleData.puzzle, puzzleData.solution);
            lastSolvedState = false;
            
            render();
        } catch (error) {
            console.error('Failed to generate puzzle:', error);
            alert('Failed to generate puzzle. Please try again.');
        } finally {
            // Restore button state
            if (newGameBtn) {
                newGameBtn.textContent = 'New Game';
                newGameBtn.disabled = false;
            }
        }
    }, 50);
}

function handleNumberInput(number) {
    if (!gameState || gameState.activeCell === null) {
        // No cell selected - subtle feedback
        return;
    }
    
    const index = gameState.activeCell;
    
    if (gameState.givens[index]) {
        shakeCell(index);
        return;
    }
    
    if (gameState.pencilMode) {
        // Pencil mark toggle
        gameState = applyAction(gameState, { type: 'togglePencilMark', index, value: number });
    } else {
        // Large value entry
        gameState = applyAction(gameState, { type: 'setValue', index, value: number });
    }
    
    render();
    checkWinCondition();
}

function render() {
    if (!gameState) return;
    
    const selectedNumber = getSelectedNumber(gameState);
    renderBoard(gameState, selectedNumber);
    
    // Update pencil button
    const pencilBtn = document.getElementById('pencilBtn');
    updatePencilButton(pencilBtn, gameState.pencilMode);
}

function checkWinCondition() {
    if (!gameState) return;
    
    const solved = isSolved(gameState);
    
    if (solved && !lastSolvedState) {
        // Just solved!
        lastSolvedState = true;
        console.log('Puzzle solved!');
        
        const winModal = document.getElementById('winModal');
        showModal(winModal);
        startConfetti();
    }
}
