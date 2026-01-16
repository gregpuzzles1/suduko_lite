<!--
Sync Impact Report

- Version change: uninitialized template → 1.0.0
- Modified principles: N/A (initialized from template)
- Added sections: N/A (filled existing placeholders)
- Removed sections: N/A
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md
	- ✅ .specify/templates/spec-template.md
	- ✅ .specify/templates/tasks-template.md
	- ⚠ .specify/templates/commands/*.md (folder not present)
	- ⚠ Runtime docs (README/docs) not present
- Deferred TODOs: None
-->

# Sudoku Lite Constitution

## Core Principles

### I. Static-First (GitHub Pages Compatible)
- The app MUST run as a static site (HTML/CSS/JS + assets) with no required server runtime.
- All core functionality MUST work without any API calls to private backends.
- Features MUST degrade gracefully when offline or when external resources fail.

Rationale: GitHub Pages serves static files only; reliability comes from minimizing runtime
dependencies.

### II. No Secrets, Safe Inputs
- The repository MUST NOT contain secrets (API keys, tokens, credentials) in any form.
- Client-side code MUST treat all external data as untrusted and validate/sanitize before
	rendering.

Rationale: Anything shipped to the browser is public.

### III. Accessibility & UX Baseline
- UI MUST be keyboard navigable for all primary interactions.
- Use semantic HTML and accessible names/labels for interactive elements.
- The site MUST be usable on both mobile and desktop (responsive layout).

Rationale: Static apps are often shared widely; accessibility is a non-negotiable baseline.

### IV. Performance & Offline-Friendly Defaults
- Initial load MUST stay lightweight: avoid unnecessary frameworks and large bundles.
- Prefer local assets and local storage over network dependencies.
- Any animations/effects MUST not block interaction and MUST respect reduced-motion settings
	when applicable.

Rationale: GitHub Pages is fast, but the browser experience depends on what we ship.

### V. Deterministic Builds & Deployments
- The deployed site MUST be reproducible from the repository (no manual “click-ops”).
- If a build step exists, it MUST be deterministic and documented (single command to build).
- Production builds MUST not rely on developer-local configuration.

Rationale: Predictable deployments reduce regressions and make review meaningful.

## Hosting & Build Constraints

- The site MUST work when hosted under a repository subpath (GitHub Pages default), so all
	asset URLs and links MUST be relative or correctly configured for a non-root base path.
- If using client-side routing (SPA), routing MUST be GitHub Pages compatible (e.g., hash
	routing or a documented 404 fallback strategy).
- Content MUST be served over HTTPS-only resources; mixed-content dependencies are forbidden.

## Workflow & Quality Gates

- Every change MUST go through a PR.
- PR reviews MUST include a quick constitution check:
	- Still static-only and GitHub Pages compatible
	- No secrets added
	- UI remains keyboard accessible
	- Build/deploy remains deterministic
- If a build exists, CI MUST at minimum run the build (and lint/format checks if present).

## Governance

- This constitution is the top-level policy for the repository.
- Amendments MUST be made via PR and MUST include:
	- The updated constitution text
	- An updated Sync Impact Report
	- A semantic version bump following the policy below
- Versioning policy (SemVer):
	- MAJOR: incompatible governance changes or removal/redefinition of a principle
	- MINOR: new principle or materially expanded requirements
	- PATCH: clarifications/typos/non-semantic refinements
- Reviews MUST block merging if a change violates the constitution without an explicit
	amendment.

**Version**: 1.0.0 | **Ratified**: 2026-01-16 | **Last Amended**: 2026-01-16
