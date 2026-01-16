# Implementation Plan: Modern Sudoku Playing Website

**Branch**: `001-sudoku-playing-webapp` | **Date**: 2026-01-16 | **Spec**: ./spec.md
**Input**: Feature specification from `/specs/001-sudoku-playing-webapp/spec.md`

**Note**: This plan follows the speckit Phase 0/1 workflow and is written for a static
GitHub Pages deployment.

## Summary

Build a sleek, responsive Sudoku-playing landing page with:
- “New Game” dropdown (Beginner → Extreme) that generates puzzles per difficulty
- 9x9 grid with 3x3 box delineation
- Pencil marks, eraser, undo, and number pad entry
- Immediate feedback (correct = blue; incorrect = red) plus conflict highlighting
- Auto-prune invalid pencil marks after correct moves (global)
- Win detection with congratulations popup + confetti
- Rules section and footer links

Technical approach:
- Plain HTML/CSS/JavaScript (ES modules), no database, static hosting
- Sudoku generation via: generate full solution (backtracking) → remove clues while
  maintaining uniqueness
- Difficulty via clue-count band + solver effort score (lightweight solver)

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: HTML5 + CSS3 + JavaScript (ES2022, ES Modules)  
**Primary Dependencies**: None (no framework required); optional: self-contained confetti helper (in-repo)  
**Storage**: localStorage (optional, for lightweight user preferences; no database)  
**Testing**: Manual smoke testing in browser (automated tests optional, not required for MVP)  
**Target Platform**: Modern evergreen browsers (Chrome/Edge/Firefox/Safari), mobile + desktop
**Project Type**: single (static web app)  
**Performance Goals**: New puzzle generation < 2s; UI interactions feel instant (< 100ms typical)  
**Constraints**: Static hosting (GitHub Pages), offline-friendly defaults, no secrets, accessible UI  
**Scale/Scope**: Single-player, client-only, one puzzle active at a time

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Static-only and GitHub Pages compatible (no required server runtime)
- No secrets or sensitive data included in repo or shipped to clients
- Accessibility baseline met (keyboard navigation + semantic UI)
- Performance conscious (avoid unnecessary bloat; keep initial load lightweight)
- Deterministic build/deploy (document a single build command if applicable)

## Project Structure

### Documentation (this feature)

```text
specs/001-sudoku-playing-webapp/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
index.html
contact.html

assets/
  icons/
  fonts/           # (optional)

src/
  app.js           # bootstraps UI, event wiring
  state.js         # immutable-ish game state + history snapshots
  ui/
    board.js       # render/update grid + highlights
    controls.js    # new game dropdown + pencil/eraser/undo + number pad
    modal.js       # congratulations popup
    confetti.js    # lightweight confetti effect
  sudoku/
    generator.js   # solution grid generation + clue removal
    solver.js      # uniqueness check + effort scoring
    rules.js       # Sudoku constraint helpers

styles/
  base.css
  board.css
  controls.css
  modal.css
```

**Structure Decision**: Single static web app with vanilla ES modules.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

No constitution violations anticipated for this feature.

## Phase 0: Outline & Research (output: research.md)

Decisions to lock down:
- Static app approach: no build step by default; use ES modules
- GitHub Pages base path strategy: relative asset links; no SPA router required
- Puzzle generation algorithm: backtracking solution generator + uniqueness-preserving clue removal
- Difficulty algorithm: clue-count bands + solver effort score
- UI rules: conflict highlighting, correctness colors, same-number highlighting, pencil behavior
- Confetti implementation: lightweight canvas-based effect in-repo (offline-friendly)

## Phase 1: Design & Contracts (outputs: data-model.md, contracts/, quickstart.md)

Design deliverables:
- Data model for Board/Cell/GameState/History
- Module boundaries and “public” functions between UI/state/sudoku layers
- Contracts:
  - localStorage schema (if used)
  - internal module interface notes (no network API)
- Quickstart for local dev + GitHub Pages deployment

### Post-Design Constitution Check (re-evaluation)

- Static-only and GitHub Pages compatible: Yes (no backend; multi-page HTML)
- No secrets shipped: Yes (no keys; no auth)
- Accessibility baseline: Planned (semantic controls + keyboard navigation)
- Performance conscious: Yes (no framework; minimal JS)
- Deterministic build/deploy: Yes (no build required; simple static hosting)

## Phase 2: Planning (output: tasks.md via /speckit.tasks)

Tasking strategy:
- Build UI shell + layout (responsive)
- Implement sudoku core (generator + solver + rating)
- Implement interactions (selection, input, pencil marks, conflict + correctness visuals)
- Implement undo/eraser/pencil toggle history
- Implement win detection + modal + confetti
- Add rules section + footer + contact page
