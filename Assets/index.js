document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closebtn = document.getElementById('close-btn');
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuOverlay.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuBtn.contains(event.target) && !mobileMenuOverlay.contains(event.target)) {
            mobileMenuOverlay.classList.remove('active');
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuOverlay.classList.remove('active');
        });
    });

    closebtn.addEventListener('click', function(){
        mobileMenuOverlay.classList.remove('active');
    })

    // Parallax effect for product-section background
    const productSection = document.querySelector('.product-section');
    if (productSection) {
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.matchMedia && window.matchMedia('(max-width: 850px)').matches;
        const speed = 0.35; // lower = slower background movement
        let ticking = false;

        function updateParallax() {
            ticking = false;
            const rect = productSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            // Only adjust when section is in or near viewport
            if (rect.bottom >= -50 && rect.top <= viewportHeight + 50) {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
                const offsetTop = scrollY + rect.top; // absolute page Y for section's top
                const delta = scrollY - offsetTop; // how far we've scrolled past the section top
                const bgY = Math.round(delta * speed);
                productSection.style.backgroundPosition = `center ${bgY}px`;
            }
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateParallax);
        }

        function enableParallax() {
            // Initialize once on load and on resize breakpoint changes
            updateParallax();
            window.addEventListener('scroll', onScroll, { passive: true });
        }

        function disableParallax() {
            window.removeEventListener('scroll', onScroll, { passive: true });
            productSection.style.backgroundPosition = 'center center';
        }

        // Respect reduced motion and small screens
        if (!reduceMotion && !isMobile) {
            enableParallax();
        }

        // Listen for preference or viewport changes
        if (window.matchMedia) {
            const motionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
            const mobileMQ = window.matchMedia('(max-width: 850px)');

            function handleChange() {
                if (motionMQ.matches || mobileMQ.matches) {
                    disableParallax();
                } else {
                    enableParallax();
                }
            }

            motionMQ.addEventListener('change', handleChange);
            mobileMQ.addEventListener('change', handleChange);
        }
    }

    // FAQ accordion toggle
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach((item, idx) => {
            const button = item.querySelector('.faq-question');
            const panel = item.querySelector('.faq-answer');
            if (!button || !panel) return;

            button.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all
                faqItems.forEach(i => {
                    i.classList.remove('open');
                    const btn = i.querySelector('.faq-question');
                    const pnl = i.querySelector('.faq-answer');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                    if (pnl) pnl.style.maxHeight = null;
                });

                // Open selected if it was closed
                if (!isOpen) {
                    item.classList.add('open');
                    button.setAttribute('aria-expanded', 'true');
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                }
            });
        });
    }

    // Hide header on scroll down, show on scroll up
    const headerEl = document.querySelector('header');
    if (headerEl) {
        let lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        let ticking = false;
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

        function onScrollDirection() {
            ticking = false;
            const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;

            // Do not hide when mobile menu is open
            const menuOpen = mobileMenuOverlay && mobileMenuOverlay.classList.contains('active');
            if (menuOpen) {
                headerEl.classList.remove('header-hidden');
                lastScrollY = currentY;
                return;
            }

            const isScrollingDown = currentY > lastScrollY + 5; // small threshold
            const isScrollingUp = currentY < lastScrollY - 5;

            if (isScrollingDown && currentY > 50) {
                headerEl.classList.add('header-hidden');
            } else if (isScrollingUp) {
                headerEl.classList.remove('header-hidden');
            }

            lastScrollY = currentY;
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(onScrollDirection);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }
});


