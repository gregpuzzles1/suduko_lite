# Data Model: Modern Sudoku Playing Website

**Feature**: [spec.md](./spec.md)
**Date**: 2026-01-16

> This is a client-side data model (no backend, no database).

## Entities

### Difficulty

- **Type**: enum
- **Values**: `beginner | intermediate | advanced | expert | master | extreme`
- **Notes**: Used to drive generator targets (clues + solver effort score band).

### Position

- **Type**: value object
- **Fields**:
  - `row: number` (0–8)
  - `col: number` (0–8)
- **Derived**:
  - `boxIndex = floor(row/3)*3 + floor(col/3)`

### Cell

- **Type**: entity
- **Identity**: `Position`
- **Fields**:
  - `given: boolean`
  - `value: number | null` (1–9)
  - `pencil: Set<number>` (subset of 1–9)
- **Validation rules**:
  - If `given = true`, then `value != null` and UI must treat cell as non-editable.
  - If `value != null`, it must be in `1..9`.
  - Pencil marks are purely user notes; they do not affect solver correctness.

### Grid

- **Type**: value object
- **Fields**:
  - `cells: Cell[9][9]`
- **Invariants**:
  - Always 9x9.

### Puzzle

- **Type**: aggregate
- **Fields**:
  - `difficulty: Difficulty`
  - `puzzle: Grid` (givens + empty cells)
  - `solution: number[9][9]` (complete solved grid)
  - `createdAtIso: string`
- **Validation rules**:
  - `solution` must satisfy Sudoku constraints.
  - `puzzle` givens must match `solution` at the same positions.

### Selection

- **Type**: value object
- **Fields**:
  - `active: Position | null`

### UI Mode

- **Type**: value object
- **Fields**:
  - `pencilMode: boolean`

### Conflict State

- **Type**: derived view
- **Definition**: For each non-empty user-entered value, determine whether it conflicts with
  Sudoku constraints (duplicate in its row/col/box) relative to the current board.
- **Notes**: Separate from correctness vs solution (red/blue).

### Action (for Undo)

- **Type**: discriminated union
- **Goal**: Allow reversible changes to `GameState`.

Suggested variants:
- `SetValue`:
  - `pos: Position`
  - `prevValue: number | null`
  - `nextValue: number | null`
  - `prevPencil: Set<number>` (optional, if clearing pencil on value set)
  - `nextPencil: Set<number>`
- `TogglePencil`:
  - `pos: Position`
  - `digit: number`
  - `prevPencil: Set<number>`
  - `nextPencil: Set<number>`
- `SetPencilMode`:
  - `prev: boolean`
  - `next: boolean`

### History

- **Type**: collection
- **Fields**:
  - `stack: Action[]` (LIFO)
- **Rules**:
  - Starting a new game clears history.

### GameState

- **Type**: aggregate root
- **Fields**:
  - `puzzle: Puzzle`
  - `selection: Selection`
  - `ui: UI Mode`
  - `history: History`
- **Derived**:
  - `isSolved: boolean` (all cells filled and match solution)

## State Transitions

### New Game

- Inputs: `difficulty`
- Output: new `Puzzle`, reset selection to null, `pencilMode=false`, empty history.

### Select Cell

- Inputs: `pos`
- Output: set active selection.

### Enter Large Value

- Preconditions: active cell exists, not given
- Behavior:
  - Set `Cell.value`.
  - Keep editable even if correct.
  - Recompute derived conflict state.
  - If correct (value matches solution): prune invalid pencil marks globally (spec decision).

### Toggle Pencil Mark

- Preconditions: active cell exists, not given
- Behavior:
  - Toggle digit in `Cell.pencil`.
  - Do not change `Cell.value`.

### Erase

- Preconditions: active cell exists, not given
- Behavior:
  - Clear `Cell.value`.

### Undo

- Preconditions: history not empty
- Behavior:
  - Pop last action and restore previous state.

## Persistence (Optional)

If used, persist only non-sensitive preferences (e.g., last selected difficulty) via
`localStorage`.
