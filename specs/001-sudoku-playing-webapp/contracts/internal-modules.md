# Internal Module Contracts

These are internal (in-repo) boundaries to keep the code maintainable.

## `src/sudoku/generator.js`

Responsibilities:
- `generateSolution(rng?) -> number[9][9]`
- `generatePuzzle({ difficulty }) -> { puzzleGrid, solutionGrid, metadata }`

Rules:
- Must only return puzzles with exactly one solution.
- Must include enough metadata to explain difficulty decisions (clue count + effort score).

## `src/sudoku/solver.js`

Responsibilities:
- `countSolutions(grid, max=2) -> number` (early exit)
- `rateDifficulty(grid) -> { clueCount, effortScore, band }`

## `src/state.js`

Responsibilities:
- Holds `GameState`
- Applies actions: `applyAction(state, action) -> nextState`
- Undo: `undo(state) -> nextState`

## `src/ui/*`

Responsibilities:
- Render: grid, highlights, controls, modal
- Map DOM events to state actions
- Never embed Sudoku solving/generation logic in UI files
