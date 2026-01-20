/**
 * Boot loader for Sudoku Lite.
 *
 * Loads footer behavior on all pages and the game app only on pages
 * that have the Sudoku board.
 */

import { APP_VERSION } from './version.js';

const v = encodeURIComponent(APP_VERSION);

function withVersion(url) {
    try {
        // Preserve existing querystrings if present.
        if (url.includes('?')) return url;
        return `${url}?v=${v}`;
    } catch {
        return url;
    }
}

// Bust CSS cache on desktop by versioning stylesheets.
for (const link of document.querySelectorAll('link[rel="stylesheet"][data-versioned]')) {
    const href = link.getAttribute('href');
    if (!href) continue;
    link.setAttribute('href', withVersion(href));
}

// Always enable dynamic footer year.
await import(`./footer.js?v=${v}`);

// Only load the game if the board exists on this page.
if (document.getElementById('board')) {
    await import(`./app.js?v=${v}`);
}
