---

description: "Task list for Modern Sudoku Playing Website"
---

# Tasks: Modern Sudoku Playing Website

**Input**: Design documents from `/specs/001-sudoku-playing-webapp/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly requested for this feature; tasks focus on implementation + manual verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] T### [P?] [US?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US#]**: User story label (required only in user-story phases)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize static web app structure and baseline styling.

- [X] T001 Create `index.html` shell with header, main, footer, and module script tag in index.html
- [X] T002 Create `contact.html` with basic contact content and navigation back to home in contact.html
- [X] T003 [P] Create base stylesheet with CSS variables, typography, layout, and responsive defaults in styles/base.css
- [X] T004 [P] Create board styles (9x9 grid + 3x3 box borders + highlight styles) in styles/board.css
- [X] T005 [P] Create controls styles (New Game dropdown, buttons, number row) in styles/controls.css
- [X] T006 [P] Create modal + confetti styles in styles/modal.css
- [X] T007 [P] Add editor defaults (indentation, newline) in .editorconfig
- [X] T008 Create JS entrypoint that bootstraps app and renders initial UI in src/app.js
- [X] T009 [P] Add an assets folder placeholder (icons) in assets/icons/.gitkeep
- [X] T010 Wire CSS + JS into the pages (link styles/*.css and load src/app.js) in index.html

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Sudoku engine + state model used by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T011 Implement Sudoku constraint helpers (rows/cols/boxes, candidates) in src/sudoku/rules.js
- [X] T012 Implement solver primitives for counting solutions with early exit in src/sudoku/solver.js
- [X] T013 Implement difficulty rating (clue count + effort score + band) in src/sudoku/solver.js
- [X] T014 Implement solution grid generator (randomized backtracking) in src/sudoku/generator.js
- [X] T015 Implement puzzle generator (remove clues + uniqueness enforcement + difficulty bands) in src/sudoku/generator.js
- [X] T016 Add generator failure handling + retry strategy for worst-case generation in src/sudoku/generator.js
- [X] T017 Implement core GameState and action history types in src/state.js
- [X] T018 Implement applyAction/undo reducers for SetValue/Erase/TogglePencil/SetPencilMode in src/state.js
- [X] T019 Implement derived selectors: isSolved, correctness vs solution, and constraint-conflicts in src/state.js
- [X] T020 Implement global pencil pruning after correct moves (recompute candidates, remove invalid pencil marks) in src/state.js

**Checkpoint**: Foundation ready — UI can now be built on top.

---

## Phase 3: User Story 1 - Start a New Game and Play (Priority: P1) 🎯 MVP

**Goal**: Start a new game at a selected difficulty and play by selecting cells and entering numbers with immediate feedback.

**Independent Test**: Open the site, start a Beginner game, select an empty cell, enter numbers via the number row, and verify selection + red/blue correctness + conflict highlighting.

### Implementation for User Story 1

- [X] T021 [US1] Build the top header layout with title and New Game button area in index.html
- [X] T022 [US1] Implement New Game dropdown UI (Beginner→Extreme) and event handling in src/ui/controls.js
- [X] T023 [US1] Persist last chosen difficulty (optional) using localStorage key `sudoku_lite:lastDifficulty` in src/ui/controls.js
- [X] T024 [US1] Create board DOM (81 cells, grouped styling for 3x3 boxes) in src/ui/board.js
- [X] T025 [US1] Render givens vs editable cells (givens locked) in src/ui/board.js
- [X] T026 [US1] Implement cell selection model + active cell highlight in src/ui/board.js
- [X] T027 [US1] Implement row/column/box highlight for active cell in src/ui/board.js
- [X] T028 [US1] Build the number row (1–9) UI below controls in src/ui/controls.js
- [X] T029 [US1] Implement large number entry via number row when pencil mode is off in src/ui/controls.js
- [X] T030 [US1] Connect New Game selection to generator and initialize GameState in src/app.js
- [X] T031 [US1] Display incorrect (vs solution) user numbers in red in src/ui/board.js
- [X] T032 [US1] Display correct (vs solution) user numbers in blue in src/ui/board.js
- [X] T033 [US1] Highlight same-number occurrences across the grid based on the active cell's value (blue when correct, red when incorrect) in src/ui/board.js
- [X] T034 [US1] Highlight constraint conflicts (duplicates in row/col/box) distinctly from red/blue in src/ui/board.js
- [X] T035 [US1] Ensure input is a no-op when no cell is selected (with subtle feedback) in src/ui/controls.js
- [X] T036 [US1] Add keyboard support: arrow keys move selection, digits 1–9 enter, Esc clears selection in src/ui/board.js
- [X] T037 [US1] Add basic responsive layout rules for mobile (grid sizing, controls wrapping) in styles/base.css

**Checkpoint**: User Story 1 is playable end-to-end (MVP).

---

## Phase 4: User Story 2 - Use Pencil Marks, Erase, and Undo (Priority: P2)

**Goal**: Add pencil marks, eraser, and undo to make play practical and polished.

**Independent Test**: Toggle pencil mode, enter pencil marks, place a correct number elsewhere, verify global pruning, then undo to restore.

### Implementation for User Story 2

- [X] T038 [P] [US2] Implement pencil toggle button and UI state indicator in src/ui/controls.js
- [X] T039 [US2] Render pencil marks as an in-cell 3x3 mini-grid (1→top-left, 9→bottom-right) in src/ui/board.js
- [X] T040 [US2] Implement pencil mark toggle entry when pencil mode is on (number row clicks) in src/ui/controls.js
- [X] T041 [US2] Ensure pencil entry is blocked on given cells and no-op without selection in src/ui/controls.js
- [X] T042 [US2] Implement eraser button to clear active cell's large value (editable only) in src/ui/controls.js
- [X] T043 [US2] Implement undo button to revert the latest action (value/pencil/erase/mode) in src/ui/controls.js
- [X] T044 [US2] Ensure undo clears/updates derived highlights correctly after rollback in src/app.js
- [X] T045 [US2] Apply global pencil pruning after correct large entry (remove invalid pencil marks everywhere) in src/state.js
- [X] T046 [US2] Define precedence rules for rendering when a cell is selected + conflicting + incorrect/correct in src/ui/board.js

**Checkpoint**: Pencil/erase/undo all work and feel consistent.

---

## Phase 5: User Story 3 - Finish the Puzzle and See Polished UI (Priority: P3)

**Goal**: Provide a satisfying completion flow, rules content, and footer/contact navigation.

**Independent Test**: Load a near-solved board state (or quickly solve a generated puzzle), enter the final correct number, and confirm modal + confetti triggers once.

### Implementation for User Story 3

- [X] T047 [P] [US3] Implement win detection (all cells filled and match solution) in src/state.js
- [X] T048 [US3] Create accessible congratulations modal (role, focus trap, close controls) in src/ui/modal.js
- [X] T049 [US3] Trigger modal exactly once when puzzle transitions to solved in src/app.js
- [X] T050 [P] [US3] Implement lightweight confetti effect (canvas-based) in src/ui/confetti.js
- [X] T051 [US3] Trigger confetti on win and stop/cleanup after animation in src/app.js
- [X] T052 [US3] Respect reduced motion preferences (disable or reduce confetti) in src/ui/confetti.js
- [X] T053 [US3] Add Sudoku rules section content (1–2 paragraphs) below the playing area in index.html
- [X] T054 [US3] Implement footer content and links (MIT, email, repo, Open an Issue) in index.html
- [X] T055 [US3] Ensure footer links are relative and work under GitHub Pages subpath in index.html
- [X] T056 [US3] Fill contact page content and ensure nav links work (home ↔ contact) in contact.html

**Checkpoint**: End-to-end experience complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Make the app robust, accessible, and GitHub Pages-ready.

- [X] T057 [P] Add focus-visible styling for keyboard navigation in styles/base.css
- [X] T058 Improve color contrast and ensure red/blue are distinguishable (consider non-color cues) in styles/board.css
- [X] T059 Add ARIA labels for grid/cells and ensure screen reader announcement of selection changes in src/ui/board.js
- [X] T060 Add guardrails for generator timeouts (abort + retry and show friendly message) in src/app.js
- [X] T061 Add a simple "Reset highlights" behavior when selection clears or new game starts in src/ui/board.js
- [X] T062 Reduce bundle size / avoid unnecessary assets; remove unused code and styles in src/ and styles/
- [X] T063 Run and update the manual smoke checklist to match final behavior in specs/001-sudoku-playing-webapp/quickstart.md

---

## Phase 7: Post-Implementation Fixes

**Purpose**: Address bugs and refinements discovered during testing.

- [X] T064 Remove auto-start behavior - game should wait for user to click "New Game" before generating puzzle in src/app.js
- [X] T065 Optimize puzzle generation to ensure unique solutions while maintaining reasonable performance in src/sudoku/generator.js
- [X] T066 Fix erase button to clear both user values AND pencil marks in src/state.js
- [X] T067 Fix pencil marks causing cell expansion by using absolute positioning in styles/board.css
- [X] T068 Update contact email to gregpuzzles1@gmail.com in contact.html
- [X] T069 Update GitHub repository links to https://github.com/gregpuzzles1/suduko_lite in index.html and contact.html
- [X] T070 Fix same-number highlighting to show all cells (given and user-entered) with that number in src/ui/board.js
- [X] T071 Update same-number highlighting color to be a darker blue distinct from row/column highlighting in styles/base.css and styles/board.css
- [X] T072 Fix right border thickness on grid by excluding 9th column cells from thick border in styles/board.css
- [X] T073 Improve grid line visibility by darkening cell border color in styles/base.css

---

## Phase 8: 2026-01-20 Enhancements (LAN, UI Polish, Deployment)

**Purpose**: Improvements made during multi-device testing (desktop + mobile) and deployment setup.

- [X] T074 Document LAN/mobile local testing steps (bind to 0.0.0.0 + phone URL) in README.md
- [X] T075 Increase main cell number font size for readability in styles/board.css
- [X] T076 Improve mobile number pad layout (keep 1–9 on one row) and remove square button styling on small screens in styles/base.css
- [X] T077 Add darker blue token for same-number highlighting in styles/base.css and apply in styles/board.css
- [X] T078 Add incorrect same-number highlighting (red tint) when active cell is incorrect in styles/base.css, styles/board.css, src/app.js, and src/ui/board.js
- [X] T079 Update footer to show dynamic year range (2025–current year) using a runtime script in src/footer.js and wire it into pages
- [X] T080 Update footer links: add email (mailto) and replace Contact link with Open an Issue link in index.html and contact.html
- [X] T081 Add robust cache-busting/versioning to avoid ESM/CSS caching issues (APP_VERSION + boot loader) in src/version.js, src/boot.js, and HTML pages
- [X] T082 Add GitHub Pages deployment via GitHub Actions workflow in .github/workflows/pages.yml
- [X] T083 Limit Pages deployment workflow to site changes only (paths filter) in .github/workflows/pages.yml

**Checkpoint**: All post-implementation issues resolved.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2.
- **US2 (P2)**: Depends on Phase 3 (needs board + controls).
- **US3 (P3)**: Depends on Phase 3 (needs a playable loop); integrates with Phase 4/5 optionally.

### Dependency Graph (Story Order)

- Setup → Foundational → US1 → (US2, US3) → Polish

---

## Parallel Execution Examples

### US1 Parallel Opportunities

- T003–T006 can be done in parallel (separate CSS files).
- Once skeleton exists: T024 and T022 can be developed in parallel (board vs controls modules).

### US2 Parallel Opportunities

- T038 and T039 can be done in parallel (controls vs board rendering).

### US3 Parallel Opportunities

- T047 and T050 can be done in parallel (state win detection vs confetti effect).

---

## Implementation Strategy

### Suggested MVP Scope

- MVP = **US1 only** (Phase 1 + Phase 2 + Phase 3).

### Incremental Delivery

1. Complete Setup + Foundational
2. Deliver US1 and validate playability
3. Deliver US2 (pencil/undo/erase) for real play
4. Deliver US3 (win + rules + footer/contact)
5. Apply Polish tasks

### Format Validation

All tasks in this file follow: `- [ ] T### [P?] [US?] Description with file path`.
