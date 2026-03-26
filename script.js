 /**
 * OTHER-SIDE — Premium Landing Page
 * JavaScript Functionality
 */

 // ==========================================
// Configuration
// ==========================================
const CONFIG = {
     FORM_ENDPOINT: 'https://forminit.com/f/t094yyx2th0',
    
    // Animation settings
    REVEAL_THRESHOLD: 0.15,
    REVEAL_ROOT_MARGIN: '0px 0px -50px 0px',
    
    // Scroll settings
    NAVBAR_SCROLL_THRESHOLD: 80
};

// ==========================================
// DOM Elements
// ==========================================
const elements = {
    pageLoader: document.getElementById('pageLoader'),
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('navMenu'),
    navToggle: document.getElementById('navToggle'),
    cursor: document.getElementById('cursor'),
    cursorFollower: document.getElementById('cursorFollower'),
    applicationForm: document.getElementById('applicationForm'),
    submitBtn: document.getElementById('submitBtn'),
    formSuccess: document.getElementById('formSuccess'),
    currentYear: document.getElementById('currentYear')
};

// ==========================================
// Page Loader
// ==========================================
function initLoader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            elements.pageLoader.classList.add('loaded');
        }, 2000);
    });
}

// ==========================================
// Custom Cursor
// ==========================================
function initCursor() {
    if (!elements.cursor || !elements.cursorFollower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows mouse directly
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        elements.cursor.style.left = cursorX + 'px';
        elements.cursor.style.top = cursorY + 'px';
        
        // Follower has more lag
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        elements.cursorFollower.style.left = followerX + 'px';
        elements.cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .service-card, .value-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            elements.cursor.classList.add('hover');
            elements.cursorFollower.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            elements.cursor.classList.remove('hover');
            elements.cursorFollower.classList.remove('hover');
        });
    });
}

// ==========================================
// Navigation
// ==========================================
function initNavigation() {
    // Scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > CONFIG.NAVBAR_SCROLL_THRESHOLD) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    elements.navToggle.addEventListener('click', () => {
        elements.navToggle.classList.toggle('active');
        elements.navMenu.classList.toggle('open');
        document.body.style.overflow = elements.navMenu.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.navToggle.classList.remove('active');
            elements.navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// Reveal Animations
// ==========================================
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: CONFIG.REVEAL_THRESHOLD,
        rootMargin: CONFIG.REVEAL_ROOT_MARGIN
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// ==========================================
// Counter Animation
// ==========================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                
                if (countTo === 0) {
                    target.textContent = '0';
                } else {
                    animateCounter(target, 0, countTo, 2000);
                }
                
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (end - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ==========================================
// Form Handling with Fetch
// ==========================================
function initFormHandling() {
    if (!elements.applicationForm) return;
    
    elements.applicationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            skillArea: document.getElementById('skillArea').value,
            portfolio: document.getElementById('portfolio').value.trim(),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString()
        };
        
        // Validate
        if (!formData.fullName || !formData.email || !formData.skillArea || !formData.message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Update button state - Loading
        elements.submitBtn.classList.add('loading');
        elements.submitBtn.disabled = true;
        
        try {
            // Send data via Fetch to your endpoint
            const response = await fetch(CONFIG.FORM_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            // Since we're using no-cors, we can't read the response
            // We'll assume success if no error is thrown
            
            // Simulate a small delay for UX
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success state
            elements.submitBtn.classList.remove('loading');
            elements.submitBtn.classList.add('success');
            
            // Show success message after a brief delay
            setTimeout(() => {
                elements.applicationForm.style.display = 'none';
                elements.formSuccess.classList.add('show');
            }, 1000);
            
            // Reset form
            elements.applicationForm.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Reset button state
            elements.submitBtn.classList.remove('loading');
            elements.submitBtn.disabled = false;
            
            // Show error message
            alert('Something went wrong. Please try again or email us directly at otherside743@gmail.com');
        }
    });
}

// ==========================================
// Parallax Effects
// ==========================================
function initParallax() {
    const heroGradients = document.querySelectorAll('.hero-gradient');
    
    if (heroGradients.length === 0) return;
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        heroGradients.forEach((gradient, index) => {
            const speed = (index + 1) * 15;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            
            gradient.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}

// ==========================================
// Set Current Year
// ==========================================
function setCurrentYear() {
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
    }
}

// ==========================================
// Keyboard Navigation Enhancements
// ==========================================
function initAccessibility() {
    // Handle Escape key for mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.navMenu.classList.contains('open')) {
                elements.navToggle.classList.remove('active');
                elements.navMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Focus trap for mobile menu
    const navLinks = elements.navMenu.querySelectorAll('a');
    const firstLink = navLinks[0];
    const lastLink = navLinks[navLinks.length - 1];
    
    elements.navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstLink) {
                e.preventDefault();
                lastLink.focus();
            } else if (!e.shiftKey && document.activeElement === lastLink) {
                e.preventDefault();
                firstLink.focus();
            }
        }
    });
}

// ==========================================
 // ==========================================
// Initialize Everything
// ==========================================
// function init() {
    initLoader();
    initCursor();
    initNavigation();
    initRevealAnimations();
    initCounterAnimation();
    // initFormHandling(); // Kill switch applied - HTML action takes over
    initParallax();
    setCurrentYear();
    initAccessibility();
    
    console.log('🚀 OTHER-SIDE: All systems initialized');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
