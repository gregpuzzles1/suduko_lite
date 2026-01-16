# Research: Modern Sudoku Playing Website

**Feature**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Date**: 2026-01-16

## Decisions

### Decision: Static-site architecture (vanilla ES modules)

- **Chosen**: Plain HTML/CSS/JavaScript using ES modules, no framework required.
- **Rationale**: Best fit for GitHub Pages static hosting, fast startup, minimal complexity.
- **Alternatives considered**:
  - Vite/React/etc.: faster iteration for large apps, but adds build complexity and bundle size.

### Decision: URL routing

- **Chosen**: Multi-page site with `index.html` (game) and `contact.html` (contact).
- **Rationale**: No SPA routing needed; avoids GitHub Pages routing edge cases.
- **Alternatives considered**:
  - SPA router + 404 fallback: workable but unnecessary for this feature.

### Decision: Sudoku solution generation

- **Chosen**: Backtracking fill of an empty grid with randomized candidate ordering.
- **Rationale**: Straightforward, deterministic enough for testing, and produces valid solved grids.
- **Alternatives considered**:
  - Pattern-based generators: fast but lower variety unless carefully implemented.

High-level approach:
1. Start with empty 9x9 grid.
2. For each next cell, compute valid candidates from row/col/box constraints.
3. Try candidates in shuffled order.
4. Recurse; backtrack on dead ends.

### Decision: Puzzle creation from solution

- **Chosen**: Remove clues iteratively from a solved grid while maintaining uniqueness.
- **Rationale**: Direct way to enforce the “exactly one solution” requirement.
- **Alternatives considered**:
  - Pre-baked puzzles per difficulty: stable difficulty, but less variety and requires curation.

Algorithm sketch:
1. Generate `solutionGrid`.
2. Start `puzzleGrid = solutionGrid`.
3. Create a shuffled list of all cell positions.
4. For each position:
   - Temporarily clear the cell.
   - Run a uniqueness check solver with an early-exit “count solutions up to 2”.
   - If solutions != 1, restore the value.
5. Stop when clue target range and rating target range are satisfied.

### Decision: Difficulty classification (Option B)

- **Chosen**: Difficulty banding uses both clue-count ranges and a solver effort score.
- **Rationale**: Clue count alone often produces mismatched difficulty; a lightweight solver score
  improves consistency without requiring a full human-technique engine.
- **Alternatives considered**:
  - Clue count only: simplest but inconsistent.
  - Human-technique-only rating: accurate but generator complexity increases significantly.

Effort score proposal (simple + implementable):
- Run a solver that prioritizes constraint propagation:
  - Naked singles
  - Hidden singles
- If stuck, guess using “minimum remaining values” (MRV) and backtrack.
- Score components:
  - `guessCount` (higher = harder)
  - `maxDepth` (higher = harder)
  - `forcedMoves` (more forced moves = easier)
- Map to bands, for example:
  - Beginner/Intermediate: `guessCount = 0`, low depth
  - Advanced: occasional guess, limited depth
  - Expert+: multiple guesses / deeper branching

### Decision: Invalid moves (constraint conflicts)

- **Chosen**: Allow placing conflicting values but highlight conflicts clearly.
- **Rationale**: Better UX (players can explore) while still signaling issues.
- **Alternatives considered**:
  - Strict blocking: can be frustrating.

### Decision: Correctness feedback and same-number highlighting

- **Chosen**:
  - Incorrect (vs solution) user-entered large values are red.
  - Correct user-entered large values are blue.
  - “Same-number highlighting” applies only to correct occurrences (blue only).

### Decision: Pencil mark auto-delete scope

- **Chosen**: After a correct large entry, remove invalid pencil marks across the entire grid.
- **Rationale**: Matches the requested behavior and keeps notes consistent.
- **Alternatives considered**:
  - Only row/col/box: less disruptive but doesn’t meet the stated preference.

Implementation note (for pruning):
- After each correct placement, recompute candidates for each empty cell, then remove any pencil
  marks not in that candidate set.

### Decision: Confetti

- **Chosen**: Small in-repo canvas confetti implementation.
- **Rationale**: Offline-friendly and avoids CDN dependency.
- **Alternatives considered**:
  - `canvas-confetti` library: reliable, but adds a third-party dependency that must be vendored.

## Open Questions

None remaining for Phase 0.
