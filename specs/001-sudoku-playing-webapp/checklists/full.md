# Full Checklist: Modern Sudoku Playing Website

**Purpose**: Unit tests for the written requirements (clarity, completeness, consistency)
**Created**: 2026-01-16
**Feature**: [../spec.md](../spec.md)

**Note**: This checklist evaluates the requirements themselves (not implementation behavior).

## Requirement Completeness

- [X] CHK001 Are the difficulty options fully enumerated and stable (no missing or extra labels)? [Completeness, Spec §FR-003]
- [X] CHK002 Are all game controls required by the spec explicitly listed (New Game, undo, eraser, pencil toggle, number row)? [Completeness, Spec §FR-002, Spec §FR-020, Spec §FR-021, Spec §FR-022, Spec §FR-013]
- [X] CHK003 Are the rules for editable vs given cells explicitly defined (including whether user-entered correct values remain editable)? [Completeness, Spec §FR-006, Spec §FR-013a]
- [X] CHK004 Are requirements defined for conflict highlighting (constraint violations) as distinct from correctness coloring? [Completeness, Spec §FR-017a]
- [X] CHK005 Are requirements defined for how pencil marks are represented (3x3 layout mapping 1→top-left through 9→bottom-right)? [Completeness, Spec §FR-015]
- [X] CHK006 Are completion requirements defined (win detection, popup content, confetti, and when it triggers)? [Completeness, Spec §FR-023, Spec §SC-005]

## Requirement Clarity

- [X] CHK007 Is "solver effort score" defined with enough specificity to avoid multiple interpretations (inputs, outputs, thresholds/bands)? [Ambiguity, Spec §FR-009a]
- [X] CHK008 Is "exactly one valid solution" defined in a measurable way (what constitutes a solution, and how it is determined)? [Clarity, Spec §FR-007, Spec §SC-002]
- [X] CHK009 Are the visual states clearly described and distinguishable (red incorrect vs blue correct vs conflict highlight vs selection highlight)? [Clarity, Spec §FR-012, Spec §FR-016, Spec §FR-017, Spec §FR-017a]
- [X] CHK010 Is the "same-number highlighting" rule clear about scope (correct-only) and trigger conditions? [Clarity, Spec §FR-018]
- [X] CHK011 Is "auto-remove invalid pencil marks across the entire grid" defined precisely enough to avoid ambiguity about timing and scope? [Clarity, Spec §FR-019]
- [X] CHK012 Are "responsive and ready for mobile" requirements specific enough to be objectively assessed (breakpoints, minimum target sizes, layout constraints)? [Gap]

## Requirement Consistency

- [X] CHK013 Do the User Story acceptance scenarios align with the FR list without introducing extra implied requirements? [Consistency, Spec §User Stories, Spec §Functional Requirements]
- [X] CHK014 Do the color/highlighting requirements avoid conflicts (e.g., how a cell is styled when it is both selected and conflicting and incorrect)? [Consistency, Spec §FR-012, Spec §FR-016, Spec §FR-017a]
- [X] CHK015 Are the pencil-mark behaviors consistent between User Story 2 and the functional requirements (toggle semantics, persistence, and deletion rules)? [Consistency, Spec §User Story 2, Spec §FR-015, Spec §FR-019]
- [X] CHK016 Are "allow conflicting moves" and "show incorrect values red" consistent in meaning (constraint-incorrect vs solution-incorrect are not conflated)? [Consistency, Spec §FR-016, Spec §FR-017a]
- [X] CHK017 Are GitHub Pages constraints applied consistently across requirements (base path, no backend, no secrets)? [Consistency, Spec §FR-026, Spec §FR-027]

## Acceptance Criteria Quality

- [X] CHK018 Are the measurable success criteria sufficient to judge success for gameplay UX (beyond generation time and uniqueness), or are key outcomes missing? [Gap, Spec §SC-001–SC-005]
- [X] CHK019 Are performance targets stated in measurable terms for both generation and interaction responsiveness? [Measurability, Spec §SC-001]
- [X] CHK020 Is the accessibility success criterion specific about required interaction modalities and what "no dead-ends" means? [Clarity, Spec §SC-003]
- [X] CHK021 Do the success criteria cover the footer/link requirements (repo link + contact page link) in a verifiable way? [Gap, Spec §FR-025]

## Scenario Coverage

- [X] CHK022 Are requirements defined for keyboard-only interaction for all primary operations (cell selection, number entry, toggles, new game selection)? [Coverage, Spec §SC-003]
- [X] CHK023 Are requirements defined for touch interaction ergonomics on mobile (tap targets, scrolling behavior, avoiding accidental input)? [Gap]
- [X] CHK024 Are requirements defined for starting a new game mid-progress including what state resets (history, selection, highlights, pencil mode)? [Coverage, Spec §Edge Cases]
- [X] CHK025 Are requirements defined for what happens when an invalid move creates a contradiction that blocks completion (e.g., user can still edit/undo, and win detection remains correct)? [Coverage, Spec §FR-017a, Spec §FR-020, Spec §FR-023]
- [X] CHK026 Are requirements defined for contact page content and what "contact page" means (form vs email link vs static text)? [Gap, Spec §FR-025]

## Edge Case Coverage

- [X] CHK027 Are requirements defined for "no active cell selected" interactions for all controls (number entry, eraser, pencil marks, undo)? [Coverage, Spec §Edge Cases]
- [X] CHK028 Are requirements defined for attempting to modify a given cell (how it is communicated in UI)? [Coverage, Spec §FR-006]
- [X] CHK029 Are requirements defined for generator failure and retry behavior (user messaging, retry limit, fallback)? [Coverage, Spec §Edge Cases]
- [X] CHK030 Are requirements defined for preventing/handling duplicate selection states (multiple highlighted cells, multiple active cells)? [Gap, Spec §FR-011]

## Non-Functional Requirements

- [X] CHK031 Are accessibility requirements sufficient beyond keyboard navigation (focus visibility, color contrast, reduced motion, semantics/labels)? [Gap, Spec §SC-003]
- [X] CHK032 Are requirements defined for reduced-motion handling of confetti/animations (respecting user preferences)? [Gap, Spec §FR-023]
- [X] CHK033 Are offline/dependency requirements explicit (no CDN reliance; fallback if assets fail)? [Gap, Spec §FR-026]
- [X] CHK034 Are requirements defined for GitHub Pages base-path compatibility (relative links and assets, and constraints for navigation)? [Clarity, Spec §FR-027]

## Dependencies & Assumptions

- [X] CHK035 Are assumptions about storage (localStorage) explicitly marked as optional vs required, and is the scope of persistence defined? [Assumption, Spec §FR-026]
- [X] CHK036 Are the repo URL and MIT License link targets specified (exact URLs), or is that intentionally deferred? [Gap, Spec §FR-025]

## Ambiguities & Conflicts

- [X] CHK037 Is the term "incorrect" consistently defined as "does not match solution" rather than "violates Sudoku constraints," and is that definition documented? [Ambiguity, Spec §FR-016, Spec §FR-017a]
- [X] CHK038 Is the interaction between "global pencil pruning" and user-entered conflicts defined (e.g., whether pruning uses the current board even if it contains conflicts)? [Ambiguity, Spec §FR-017a, Spec §FR-019]

## Notes

- Items are written as requirement-quality checks (not implementation tests).
- Add findings inline and link to specific requirement IDs (FR/SC) when marking gaps.
