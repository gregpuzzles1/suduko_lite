# Feature Specification: Modern Sudoku Playing Website

**Feature Branch**: `001-sudoku-playing-webapp`  
**Created**: 2026-01-16  
**Status**: Draft  
**Input**: User description: "Build a modern, sleek Sudoku playing website with a landing page game board, New Game difficulty dropdown (Beginner→Extreme), a 9x9 grid with 3x3 boxes, undo/eraser/pencil controls, number pad (1-9), wrong numbers in red, correct numbers in blue with same-number highlighting, automatic cleanup of invalid pencil marks after correct moves, row/column/box highlighting for the active cell, and a win popup with confetti. Include rules text below the board plus a footer with © 2026 Greg Christian · MIT License, a GitHub repo link, and a contact page link."

## Clarifications

### Session 2026-01-16

- Q: How should we classify difficulty during puzzle generation? → A: Clue-count + uniqueness + simple solver effort score (e.g., required technique tiers / backtracking depth).
- Q: When a player enters a large number that violates Sudoku constraints (duplicate in row/column/box), what should happen? → A: Allow the move but highlight conflicts (and keep the value).
- Q: After a player enters a correct large number, should that cell become locked? → A: Keep editable until puzzle solved (only givens are locked).
- Q: When a number is selected/entered (e.g., “3”), what should “highlight the same numbers throughout the grid” apply to? → A: Highlight only correct same numbers (blue only).
- Q: When a correct large number is entered, where should invalid pencil marks be auto-deleted? → A: Across the entire grid wherever that candidate becomes invalid.

### Session 2026-01-20

- Q: When a number is selected/entered (e.g., “3”), what should same-number highlighting apply to? → A: Highlight all cells with that number; if the active value is correct use blue highlight, if incorrect use red-tinted highlight.
- Q: Footer content changes? → A: Footer should show “© 2025–<current year> Greg Christian · MIT License”, include an email link (mailto), a GitHub repo link, and an “Open an Issue” link.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Start a New Game and Play (Priority: P1)

As a player, I can start a new Sudoku game at a chosen difficulty and play by selecting
cells and entering numbers, with immediate visual feedback.

**Why this priority**: This is the core playable experience; without it there is no MVP.

**Independent Test**: Start a Beginner game, enter a known correct value and a known
incorrect value, and verify color/selection/highlighting behavior without needing any other
features.

**Acceptance Scenarios**:

1. **Given** the landing page is loaded, **When** I open the “New Game” menu and choose a
  difficulty, **Then** a new 9x9 puzzle grid is displayed with some fixed starting numbers
  and the rest empty.
2. **Given** I have selected an empty editable cell and pencil mode is off, **When** I click
  a number 1–9 in the number row, **Then** that number appears as a single large value in
  the cell.
3. **Given** I enter a value that is incorrect for that cell, **When** it is placed, **Then**
  it is shown in red.
4. **Given** I enter a value that is correct for that cell, **When** it is placed, **Then**
  it is shown in blue and all other matching values in the grid are highlighted in blue.
5. **Given** I enter a value that is incorrect for that cell, **When** it is placed, **Then**
  all other matching values in the grid are highlighted with a red-tinted highlight.
6. **Given** a cell is active, **When** it is selected, **Then** its row, column, and 3x3 box
  are highlighted with a light blue/grey background while keeping existing numbers readable.

---

### User Story 2 - Use Pencil Marks, Erase, and Undo (Priority: P2)

As a player, I can use pencil marks to note candidate numbers, erase entries, and undo
actions. When I make correct progress, outdated pencil marks are removed automatically.

**Why this priority**: Pencil marks and undo/erase are essential to a satisfying Sudoku
experience and dramatically improve usability.

**Independent Test**: In a new game, add pencil marks to a cell, place a correct number in
the same row/column/box, and verify invalid pencil marks disappear; verify undo restores
prior state.

**Acceptance Scenarios**:

1. **Given** pencil mode is on and an editable cell is selected, **When** I click numbers
  from 1–9, **Then** those numbers appear as small pencil marks in a 3x3 mini-grid within
  the cell.
2. **Given** pencil mode is off and an editable cell is selected, **When** I press the
  eraser control, **Then** the cell’s large value is cleared.
3. **Given** I make one or more actions (pencil toggle entries, large number entries, erase),
  **When** I press undo, **Then** the most recent action is reverted and the previous board
  state is restored.
4. **Given** I place a correct large value in a cell, **When** that value is confirmed,
  **Then** any pencil marks that are no longer possible are removed from all affected cells.

---

### User Story 3 - Finish the Puzzle and See Polished UI (Priority: P3)

As a player, I get a polished experience with rules text, footer links, and a satisfying
celebration when I solve the puzzle.

**Why this priority**: This turns a functional board into a memorable product and completes
the end-to-end experience.

**Independent Test**: Load a nearly-solved puzzle state, complete the last correct move, and
verify the congratulations popup and confetti appear.

**Acceptance Scenarios**:

1. **Given** the puzzle is fully and correctly completed, **When** the final correct number
  is entered, **Then** a “Congratulations” popup appears and a confetti animation plays.
2. **Given** I scroll below the game board, **When** I view the page, **Then** I see a short
  rules section explaining how to play Sudoku.
3. **Given** I view the footer, **When** I read it, **Then** it shows “© 2026 Greg Christian ·
  MIT License” plus an email link, a link to the project repository, and an “Open an Issue” link.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- Starting a new game while a game is in progress resets the board, selection, pencil mode,
  highlights, and undo history.
- Clicking a number 1–9 when no cell is selected does not change the board and provides
  clear feedback (e.g., no-op with subtle hint).
- Trying to edit a fixed “given” cell is prevented.
- Eraser on an empty cell does not error and does not change the board.
- Undo when there is no history does not error and does not change the board.
- Rapidly switching difficulties does not leave the UI in an inconsistent state.
- Puzzle generation failure (rare) results in a friendly retry message and a working fallback
  (e.g., regenerate).

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

Assumptions (used to keep requirements unambiguous):
- The site is hosted as a static site on GitHub Pages.
- Difficulty levels are implemented via a combination of puzzle uniqueness, clue count, and
  a lightweight solver effort score (see FR-007).
- The app provides immediate correctness feedback (red/blue) as requested.

- **FR-001**: The system MUST provide a landing page that contains the playable Sudoku game.
- **FR-002**: The system MUST display a “New Game” control at the top-right of the page.
- **FR-003**: The “New Game” control MUST open a dropdown menu with exactly these options:
  Beginner, Intermediate, Advanced, Expert, Master, Extreme.
- **FR-004**: When a difficulty is chosen, the system MUST generate and display a new 9x9
  Sudoku puzzle consisting of fixed “given” cells and empty editable cells.
- **FR-005**: The 9x9 playing grid MUST be visually subdivided into nine 3x3 boxes.
- **FR-006**: The system MUST prevent editing of given cells.

Puzzle generation & difficulty model:

- **FR-007**: The system MUST generate puzzles that have exactly one valid solution.
- **FR-008**: The system MUST generate a complete valid solution grid and derive the puzzle
  by removing values while maintaining FR-007.
- **FR-009**: The system MUST map difficulty to a target clue count range:
  - Beginner: 40–45 clues
  - Intermediate: 34–39 clues
  - Advanced: 28–33 clues
  - Expert: 24–27 clues
  - Master: 22–23 clues
  - Extreme: 17–21 clues
- **FR-009a**: The system MUST also apply a solver effort score during generation and reject
  puzzles that do not fall within the intended difficulty band (in addition to clue count).
  The effort score is computed by running a constraint-propagation solver (naked singles +
  hidden singles) with backtracking fallback, counting: (a) total guesses required, (b)
  maximum backtrack depth, and (c) number of constraint-only solves. Lower scores = easier.
  Difficulty bands: Beginner/Intermediate require score ≤ 5, Advanced/Expert require 5–20,
  Master/Extreme require > 20.
- **FR-009b**: "Exactly one valid solution" means that when the solver exhaustively searches
  all possibilities (with early exit after finding 2 solutions), it finds exactly 1 complete
  valid 9x9 grid that satisfies all Sudoku constraints and matches the given clues.
- **FR-010**: The system MUST ensure the generated puzzle is playable end-to-end (i.e., the
  user can complete it without encountering contradictions when using correct entries).

Playing & input:

- **FR-011**: The system MUST allow the player to select a single active cell.
- **FR-012**: When a cell is active, the system MUST highlight the active cell’s row,
  column, and 3x3 box using a light blue/grey highlight.
- **FR-013**: The system MUST provide an always-visible row of numbers 1–9 that can be
  clicked to input values.
- **FR-013a**: The system MUST treat only given cells as locked; all user-entered cells MUST
  remain editable until the puzzle is solved.
- **FR-014**: When pencil mode is off and an editable cell is active, clicking a number 1–9
  MUST place that number as a single large value in the cell.
- **FR-015**: When pencil mode is on and an editable cell is active, clicking numbers 1–9
  MUST toggle small pencil marks in a 3x3 mini-grid inside the cell, mapping 1→top-left and
  9→bottom-right.

Validation, highlighting, and automation:

- **FR-016**: If a player enters an incorrect large value (does not match the solution for
  that cell), the value MUST display in red text.
- **FR-017**: If a player enters a correct large value (matches the solution for that cell),
  the value MUST display in blue text.
- **FR-017a**: The system MUST allow the player to enter large values that violate Sudoku
  constraints (duplicates in a row/column/box), and MUST clearly highlight the conflicting
  cells with a light red/pink background (conflict highlight is distinct from red/blue text
  correctness coloring).
- **FR-017b**: Visual state precedence when multiple conditions apply: (1) Active cell border
  (thicker), (2) Conflict background (light red), (3) Text color (red incorrect / blue
  correct / black given), (4) Row/col/box highlight (light blue/grey), (5) Same-number
  highlight (blue text bold). All compatible layers apply simultaneously.
- **FR-018**: When the active cell contains a non-empty large value (given or user-entered),
  all other cells containing that same number MUST be highlighted.
- **FR-018a**: If the active cell's value is correct, the same-number highlight MUST use a
  blue highlight.
- **FR-018b**: If the active cell's value is incorrect, the same-number highlight MUST use a
  red-tinted highlight.
- **FR-019**: After a correct large value is entered, the system MUST remove pencil marks
  that are no longer valid across the entire grid (i.e., from any cell where the candidate
  is invalid due to the current board state). Pruning logic uses only the known-correct
  values (givens + user-entered correct values); cells with incorrect or conflicting values
  are ignored for pruning purposes.

Controls:

- **FR-020**: The system MUST provide an undo control that reverts the most recent player
  action affecting the board state.
- **FR-021**: The system MUST provide an eraser control that clears the currently selected
  cell’s large value (if editable).
- **FR-022**: The system MUST provide a pencil toggle control to switch between large-value
  entry and pencil-mark entry.

Completion & content:

- **FR-023**: When the puzzle is fully and correctly solved, the system MUST display a
  “Congratulations” popup and play a confetti effect.
- **FR-024**: The page MUST include a rules section below the playing area explaining Sudoku
  rules in one to two paragraphs.
- **FR-025**: The page MUST include a footer containing: “© 2025–<current year> Greg Christian ·
  MIT License", an email link to gregpuzzles1@gmail.com, a link to the project's GitHub repository
  (https://github.com/gregpuzzles1/suduko_lite), and an “Open an Issue” link to
  https://github.com/gregpuzzles1/suduko_lite/issues/new.
- **FR-025a**: The contact page MUST contain: a heading, a brief intro ("Get in touch"), and
  an email link to gregpuzzles1@gmail.com.
- **FR-025b**: All interactive elements MUST have visible focus indicators for keyboard
  navigation (2px solid outline with 3:1 contrast).
- **FR-025c**: All text MUST meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for
  large text and UI components).
- **FR-025d**: When `prefers-reduced-motion: reduce` is detected, the confetti animation MUST
  be replaced with a static congratulations message (no motion).

Mobile & touch interaction:

- **FR-024a**: The system MUST support touch interaction on mobile with minimum tap target
  sizes of 44x44 CSS pixels for all interactive controls (number pad, buttons, cells).
- **FR-024b**: When a user attempts to interact with (click/tap/type into) a given cell, the
  system MUST provide clear visual feedback (e.g., brief shake animation or border flash) and
  MUST NOT modify the cell value.
- **FR-024c**: The grid MUST remain fully visible and playable on mobile devices with viewport
  widths down to 320px without requiring horizontal scroll.

Compatibility constraints:

- **FR-026**: The site MUST function as a static site (no required server runtime).
- **FR-027**: The site MUST work when hosted under a repository subpath (links and asset
  paths remain correct on GitHub Pages).

### Key Entities *(include if feature involves data)*

- **Difficulty Level**: One of Beginner/Intermediate/Advanced/Expert/Master/Extreme.
- **Puzzle**: The generated playable grid plus the corresponding complete solution grid.
- **Cell**: A single square in the 9x9 grid with attributes: position, whether it is a given,
  current large value (if any), and current pencil marks (set of 1–9).
- **Game State**: Current puzzle, active cell, pencil mode on/off, highlighting state.
- **Action History Entry**: A reversible record of a single player action (place value, erase,
  toggle pencil mark) used for undo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From choosing a difficulty, a new playable puzzle is shown within 2 seconds on
  a typical consumer device (mid-tier phone from last 3 years, e.g., iPhone 12, Galaxy S21).
- **SC-002**: For each difficulty, 100 consecutive generated puzzles each have exactly one
  solution (verified by exhaustive solver with early exit at 2 solutions).
- **SC-003**: A player can complete core gameplay using only mouse/touch plus keyboard
  navigation for cell selection and number entry. "No dead-ends" means: (a) all interactive
  elements are reachable via Tab/Shift+Tab, (b) all actions can be triggered via
  Enter/Space/Arrow keys, (c) focus indicators are visible at all times.
- **SC-004**: In a short usability pass (N=10 users, 2-minute test script: "Start a Beginner
  game and place any number"), at least 90% of players successfully place a number with
  correct visual feedback (red/blue/highlights) without instructions.
- **SC-005**: The win state is detected reliably: completing the last correct entry triggers
  the congratulations popup and confetti exactly once.
- **SC-006**: Footer links (repo + contact) and contact page email link are functional and
  point to correct targets (verified by manual click-through).
