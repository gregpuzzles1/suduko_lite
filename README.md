# Sudoku Lite

A modern, sleek Sudoku playing website with multiple difficulty levels.

## Features

- **6 Difficulty Levels**: Beginner, Intermediate, Advanced, Expert, Master, Extreme
- **Smart Puzzle Generation**: Unique solutions guaranteed with difficulty-appropriate clue counts
- **Interactive Gameplay**: 
  - Click or keyboard navigation
  - Pencil marks for candidate notes
  - Undo/erase functionality
  - Real-time correctness feedback (red/blue coloring)
  - Constraint conflict highlighting
  - Same-number highlighting for correct entries
- **Accessible**: Keyboard navigation, ARIA labels, focus indicators, reduced motion support
- **Responsive**: Mobile and desktop friendly (down to 320px viewport)
- **Static Site**: No backend required, works offline

## Running Locally

Since this is a static site with ES modules, you need a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Running on Your LAN (Phone / Tablet)

To open the site from another device (like your phone), you need to:

1. Make sure your computer and phone are on the same Wi‑Fi / LAN.
2. Start the server bound to your LAN interface (not just `localhost`).
3. Open the LAN URL from your phone.

### 1) Find your PC’s LAN IP

On Windows PowerShell:

```powershell
ipconfig
```

Look for an IPv4 address like `192.168.1.23` on your active adapter.

### 2) Start a server that listens on the network

From the project folder:

```bash
# Python 3 (recommended)
python -m http.server 8000 --bind 0.0.0.0

# Node.js (http-server)
npx http-server -a 0.0.0.0 -p 8000

# PHP
php -S 0.0.0.0:8000
```

### 3) Open it from your phone

On your phone’s browser, go to:

`http://<YOUR_PC_IP>:8000/`

Example:

`http://192.168.1.23:8000/`

### If it doesn’t load

- Windows Firewall may be blocking the port. Allow your server app through, or open TCP port `8000` for your Private network.
- Try a different port (e.g. `8080`) if `8000` is in use.
- Some guest Wi‑Fi networks block device‑to‑device traffic (client isolation). If so, switch networks or disable isolation on the router.

## Cache Busting (Desktop + Mobile)

Browsers can sometimes cache ES module dependencies and CSS aggressively.
If you ship changes and a device still seems to be running old code/styles:

- Bump `APP_VERSION` in `src/version.js`
- Reload (desktop: `Ctrl+F5`)

This forces fresh JS/CSS to be fetched on both desktop and mobile.

## Deployment

This site is designed for GitHub Pages.

### Deploy with GitHub Actions (recommended)

1. Push the repository to GitHub
2. In GitHub: **Settings → Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**
4. Push to `main` (or run the workflow manually)

The site will be available at `https://gregpuzzles1.github.io/sudoku_lite/`.

All links and assets use relative paths for subpath compatibility.

## Project Structure

```
├── index.html          # Main game page
├── contact.html        # Contact page
├── styles/            # CSS stylesheets
│   ├── base.css       # Base styles and variables
│   ├── board.css      # Sudoku board styles
│   ├── controls.css   # Control button styles
│   └── modal.css      # Win modal and confetti
├── src/               # JavaScript modules
│   ├── app.js         # Main application entry
│   ├── state.js       # Game state management
│   ├── sudoku/        # Sudoku engine
│   │   ├── rules.js   # Constraint helpers
│   │   ├── solver.js  # Solution counting and scoring
│   │   └── generator.js # Puzzle generation
│   └── ui/            # UI modules
│       ├── board.js   # Board rendering
│       ├── controls.js # Controls handling
│       ├── modal.js   # Win modal
│       └── confetti.js # Confetti animation
└── assets/            # Static assets
    └── icons/         # Icon placeholders
```

## License

MIT License - see footer for details

## Credits

© 2026 Greg Christian
