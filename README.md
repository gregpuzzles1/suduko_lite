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

## Deployment

This site is designed for GitHub Pages:

1. Push the repository to GitHub
2. Enable GitHub Pages in repository settings (deploy from `main` branch)
3. The site will be available at `https://yourusername.github.io/sudoku_lite/`

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
