/**
 * Theme Toggle Logic
 * Handles System/Light/Dark modes with persistence.
 */

const themeToggle = document.getElementById('theme-toggle');
const themeBtns = document.querySelectorAll('.theme-btn');
const root = document.documentElement;

// State
let currentTheme = localStorage.getItem('theme') || 'system';

// Apply theme on load
function applyTheme(theme) {
    // If the theme is 'system' (from old localStorage or initial default),
    // default it to 'light' since system support is removed.
    let resolvedTheme = theme;
    if (theme === 'system') {
        resolvedTheme = 'light';
    }

    // Set attribute for CSS
    root.setAttribute('data-theme', resolvedTheme);

    // Update local storage and UI state only when theme is actually applied
    // This is now called after the animation in animateThemeSwitch
    localStorage.setItem('theme', resolvedTheme);
    updateToggleUI(resolvedTheme);
}

function updateToggleUI(theme) {
    if (!themeToggle) return;

    // Map theme to index: light=0, dark=1
    let index = 0;
    if (theme === 'dark') index = 1;

    themeToggle.setAttribute('data-selected', index);
}

// Function to handle the ripple animation
function animateThemeSwitch(targetTheme, x, y) {
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.theme-transition-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        document.body.appendChild(overlay);
    }

    // Set overlay color based on TARGET theme
    // We can't rely on CSS variables yet because root attribute hasn't changed
    // Hardcode colors or fetch from computed style of a dummy element if needed
    // Simple approach: Light -> White/Grey, Dark -> Black
    const bg = targetTheme === 'light' ? '#f3f4f6' : '#050505';
    overlay.style.background = bg;

    // Position the circle start
    overlay.style.clipPath = `circle(0% at ${x}px ${y}px)`;
    overlay.style.opacity = '1'; // Ensure it's visible for animation
    overlay.style.transition = 'clip-path 0.6s ease-in-out'; // Reset transition for clip-path

    // Force reflow
    overlay.offsetHeight;

    // Animate
    // Calculate distance to furthest corner to ensure full coverage
    const diag = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);

    overlay.style.clipPath = `circle(${diag}px at ${x}px ${y}px)`;

    // Wait for animation, then apply theme and reset
    setTimeout(() => {
        applyTheme(targetTheme);
        // Fade out or just remove?
        // If we switch the theme underneath, we can just remove the overlay after a moment
        // But to be smooth, maybe keep overlay for a split second?
        // Actually, since overlay IS the new background color, we can just remove it
        // But wait, if we remove it, the underlying content is revealed.
        // It works best if the overlay completely covered everything, then we switched theme, 
        // then we fade out the overlay? No, if overlay colors match, we can just remove it.

        // Let's fade it out to be safe
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.2s ease';

        setTimeout(() => {
            overlay.remove();
        }, 200);

    }, 600); // Match CSS transition duration
}

// Initial Run
applyTheme(currentTheme);

// Event Listeners
themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-theme'); // This is 'light' or 'dark'
        if (target === currentTheme) return;

        currentTheme = target;
        // animateThemeSwitch(target, e.clientX, e.clientY);
        // Actually, let's trigger animation then apply

        // Better: Use the pill position as center? or click position? Click is fine.
        animateThemeSwitch(target, e.clientX, e.clientY);
    });
});
