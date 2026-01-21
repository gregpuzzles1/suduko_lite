# Quickstart: Modern Sudoku Playing Website

**Feature**: [spec.md](./spec.md)
**Date**: 2026-01-20

## Prerequisites

- Any modern browser
- A simple local static file server (recommended)

## Run Locally

From the repo root:

- PowerShell + Python (commonly available):
  - `python -m http.server 8000`
  - Open `http://localhost:8000/`

## Run on LAN (Phone / Tablet)

- Start the server bound to all interfaces:
  - `python -m http.server 8000 --bind 0.0.0.0`
- Find your PC's LAN IP:
  - `ipconfig` → IPv4 Address (example: `10.0.0.225`)
- On your phone (same Wi‑Fi), open:
  - `http://<YOUR_PC_IP>:8000/`

If you don’t have Python, use any static server you like.

## GitHub Pages Deployment

This project is designed to be deployed as a static site.

Recommended:
- Deploy using GitHub Actions (Pages workflow).

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
- Same-number highlighting applies based on the active cell value:
  - Active correct value → all matching numbers highlight in blue
  - Active incorrect value → all matching numbers highlight in red tint
- After correct move, invalid pencil marks are pruned globally
- Win state triggers congratulations modal + confetti
- Rules section and footer links render

## Cache Busting

If desktop and mobile ever look out-of-sync due to browser caching:

- Bump `APP_VERSION` in `src/version.js`
- Reload (desktop: `Ctrl+F5`)
