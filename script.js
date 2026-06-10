// ===== Motion preference =====
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== Scroll-reveal =====
const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add("visible"));
} else {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach((el) => revealObserver.observe(el));
}

// ===== Animated stat counters =====
// HTML ships with the final value, so the numbers are correct even
// without JavaScript. With JS, they count up the first time they scroll
// into view (unless the visitor prefers reduced motion).
const statNumbers = document.querySelectorAll(".stat-number[data-count]");

function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1300;
    const start = performance.now();

    function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) {
            requestAnimationFrame(frame);
        }
    }

    requestAnimationFrame(frame);
}

if (!prefersReducedMotion && statNumbers.length > 0) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.6
    });

    statNumbers.forEach((el) => statObserver.observe(el));
}

// ===== Scroll-spy: highlight the section currently in view =====
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if (sections.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    const isCurrent = link.getAttribute("href") === "#" + entry.target.id;
                    if (isCurrent) {
                        link.setAttribute("aria-current", "true");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            }
        });
    }, {
        rootMargin: "-40% 0px -55% 0px"
    });

    sections.forEach((section) => spyObserver.observe(section));
}

// ===== Back-to-top button =====
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
}, { passive: true });

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
    });
});

// ===== Footer year =====
const yearSpan = document.getElementById("year");
yearSpan.textContent = new Date().getFullYear();
