/**
 * Confetti Animation Module
 * Lightweight canvas-based confetti effect
 */

let canvas = null;
let ctx = null;
let particles = [];
let animationId = null;
let isReducedMotion = false;

/**
 * Initialize confetti canvas
 * @param {HTMLCanvasElement} canvasElement - Canvas element
 */
export function initConfetti(canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    
    // Check for reduced motion preference
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Resize canvas to window size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

/**
 * Resize canvas to match window dimensions
 */
function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * Start confetti animation
 */
export function startConfetti() {
    if (isReducedMotion) {
        // Skip animation for users who prefer reduced motion
        return;
    }
    
    if (!canvas || !ctx) return;
    
    // Create particles
    particles = [];
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4
        });
    }
    
    canvas.style.display = 'block';
    animate();
    
    // Stop after 5 seconds
    setTimeout(() => {
        stopConfetti();
    }, 5000);
}

/**
 * Animate confetti particles
 */
function animate() {
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let allOffScreen = true;
    
    particles.forEach(p => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vy += 0.1; // Gravity
        
        if (p.y < canvas.height) {
            allOffScreen = false;
        }
        
        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
    });
    
    if (allOffScreen) {
        stopConfetti();
    } else {
        animationId = requestAnimationFrame(animate);
    }
}

/**
 * Stop confetti animation and cleanup
 */
export function stopConfetti() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
    }
    
    particles = [];
}
