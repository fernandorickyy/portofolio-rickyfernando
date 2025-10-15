document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const rocketContainer = document.querySelector('.rocket-container');
    const rocket = document.querySelector('.rocket-svg');
    const clickToLaunch = document.getElementById('clickToLaunch');
    const mainContent = document.getElementById('main-content');
    const menuToggle = document.getElementById('menu-toggle');
    const overlayMenu = document.getElementById('overlay-menu');
    const closeMenu = document.getElementById('close-menu');
    const menuLinks = document.querySelectorAll('.overlay-menu nav ul li a');
    const sections = document.querySelectorAll('.section');
    const homeSlides = document.querySelectorAll('.home-slider .slide');
    const sliderDots = document.querySelectorAll('.slider-controls .slider-dot');
    const flameContainer = document.getElementById('flame-container');
    const smokeContainer = document.getElementById('smoke-container');
    const bgVideo = document.getElementById('bg-video');

    let currentSlide = 0;
    let slideInterval;
    let isLaunching = false;

    // Respect reduced-motion user preference
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If reduced motion, disable video (CSS also hides it)
    if (reducedMotion && bgVideo) {
        try {
            bgVideo.pause();
            bgVideo.setAttribute('aria-hidden', 'true');
        } catch (e) {
            // ignore
        }
    }

    // UTIL: try to play video with promise handling
    const tryPlayVideo = () => {
        if (!bgVideo) return;
        if (reducedMotion) return;
        const playPromise = bgVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                // autoplay might be blocked; keep muted and try again
                bgVideo.muted = true;
            });
        }
    };

    const tryPauseVideo = () => {
        if (!bgVideo) return;
        try {
            bgVideo.pause();
        } catch (e) {
            // ignore
        }
    };

    // ============================================================
    // FLAME EFFECT
    // ============================================================
    const createFlame = () => {
        if (!isLaunching) return;
        
        const flame = document.createElement('div');
        flame.className = 'flame';
        flameContainer.appendChild(flame);
        
        setTimeout(() => {
            flame.remove();
        }, 800);
    };

    // ============================================================
    // SMOKE EFFECT
    // ============================================================
    const createSmoke = () => {
        if (!isLaunching) return;
        
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        smokeContainer.appendChild(smoke);
        
        setTimeout(() => {
            smoke.classList.add('active');
        }, 10);
        
        setTimeout(() => {
            smoke.remove();
        }, 2000);
    };

    // ============================================================
    // START LAUNCH EFFECTS
    // ============================================================
    const startLaunchEffects = () => {
        isLaunching = true;
        let effectCount = 0;
        
        const effectInterval = setInterval(() => {
            createFlame();
            createSmoke();
            effectCount++;
            
            if (effectCount >= 15) {
                clearInterval(effectInterval);
            }
        }, 100);
    };

    // ============================================================
    // ROCKET CLICK
    // ============================================================
    if (rocketContainer && preloader) {
        rocketContainer.addEventListener('click', () => {
            clickToLaunch.style.display = 'none';
            rocket.style.animation = 'none';
            startLaunchEffects();
            
            setTimeout(() => {
                rocketContainer.classList.add('rocket-launching');
                isLaunching = false;
            }, 2500);
            
            // Show main content after launch animation (matches previous timing)
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                mainContent.classList.remove('hidden');
                document.body.style.overflowY = 'auto';
                setActiveSection('home');
                startAutoSlide();

                // Play background video when main content shows (home active)
                tryPlayVideo();
            }, 7000);
        });
    }

    // ============================================================
    // SET ACTIVE SECTION (play/pause video based on section)
    // ============================================================
    const setActiveSection = (sectionId) => {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                section.classList.remove('hidden');
            } else {
                section.classList.remove('active');
                section.classList.add('hidden');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active-menu-link');
            if (link.dataset.section === sectionId) {
                link.classList.add('active-menu-link');
            }
        });

        // Play/pause bg video depending on whether Home is active
        if (sectionId === 'home') {
            tryPlayVideo();
        } else {
            tryPauseVideo();
        }
    };

    // ============================================================
    // MENU TOGGLE
    // ============================================================
    if (menuToggle && overlayMenu && closeMenu) {
        menuToggle.addEventListener('click', () => {
            overlayMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeMenu.addEventListener('click', () => {
            overlayMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSectionId = link.dataset.section;
                setActiveSection(targetSectionId);
                overlayMenu.classList.remove('active');
                document.body.style.overflow = 'auto';

                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ============================================================
    // HOME SLIDER
    // ============================================================
    const showSlide = (index) => {
        homeSlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        sliderDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % homeSlides.length;
        showSlide(currentSlide);
    };

    const startAutoSlide = () => {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    };

    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            clearInterval(slideInterval);
            startAutoSlide();
        });
    });

    // ============================================================
    // INITIAL SETUP
    // ============================================================
    mainContent.classList.add('hidden');
    document.body.style.overflow = 'hidden';
    showSlide(currentSlide);

    // If preloader is bypassed or testing, ensure that video is paused until main shown
    if (bgVideo) {
        tryPauseVideo();
    }

    // Optional: if user scrolls back to top and Home becomes visible, resume video
    // (This handles direct navigation outside overlay menu)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.target) return;
            if (entry.isIntersecting && entry.target.id === 'home' && entry.target.classList.contains('active')) {
                tryPlayVideo();
            }
        });
    }, { threshold: 0.5 });

    const homeSection = document.getElementById('home');
    if (homeSection) observer.observe(homeSection);
});
