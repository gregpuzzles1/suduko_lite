# Quickstart: Modern Sudoku Playing Website

**Feature**: [spec.md](./spec.md)
**Date**: 2026-01-16

## Prerequisites

- Any modern browser
- A simple local static file server (recommended)

## Run Locally

From the repo root:

- PowerShell + Python (commonly available):
  - `python -m http.server 5173`
  - Open `http://localhost:5173/`

If you don’t have Python, use any static server you like.

## GitHub Pages Deployment

This project is designed to be deployed as a static site.

Recommended:
- Publish from the repository root (or from `/docs` if you later choose that layout).

Important constraints:
- Use relative asset URLs so the site works under a repo subpath, e.g.
  - `https://<user>.github.io/<repo>/`
- Avoid SPA routing unless you also implement a GitHub Pages-friendly fallback.

## Manual Smoke Checklist

- New Game dropdown works and each difficulty starts a new puzzle
- Grid renders with 3x3 box boundaries
- Selection highlights row/col/box
- Pencil mode toggles and pencil marks render in-cell
- Eraser clears an editable cell
- Undo restores previous state
- Wrong large value shows red; correct shows blue
- Constraint conflicts are highlighted when duplicates exist
- Same-number highlighting applies to correct entries only
- After correct move, invalid pencil marks are pruned globally
- Win state triggers congratulations modal + confetti
- Rules section and footer links render
