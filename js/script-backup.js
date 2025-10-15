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

    let currentSlide = 0;
    let slideInterval;
    let isLaunching = false;

    // ============================================================
    // LANGKAH 1: FUNGSI UNTUK MEMBUAT EFEK API (FLAME EFFECT)
    // ============================================================
    const createFlame = () => {
        if (!isLaunching) return;
        
        const flame = document.createElement('div');
        flame.className = 'flame';
        flameContainer.appendChild(flame);
        
        // Hapus elemen setelah animasi selesai
        setTimeout(() => {
            flame.remove();
        }, 800);
    };

    // ============================================================
    // LANGKAH 2: FUNGSI UNTUK MEMBUAT EFEK ASAP (SMOKE EFFECT)
    // ============================================================
    const createSmoke = () => {
        if (!isLaunching) return;
        
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        smokeContainer.appendChild(smoke);
        
        // Trigger animasi dengan menambah class 'active'
        setTimeout(() => {
            smoke.classList.add('active');
        }, 10);
        
        // Hapus elemen setelah animasi selesai
        setTimeout(() => {
            smoke.remove();
        }, 2000);
    };

    // ============================================================
    // LANGKAH 3: FUNGSI UNTUK MEMULAI EFEK PELUNCURAN ROKET
    // ============================================================
    const startLaunchEffects = () => {
        isLaunching = true;
        let effectCount = 0;
        
        // Buat efek api dan asap bersamaan setiap 100ms
        // Total 15 iterasi = 1.5 detik efek
        const effectInterval = setInterval(() => {
            createFlame();
            createSmoke();
            effectCount++;
            
            // Hentikan loop setelah 15 iterasi
            if (effectCount >= 15) {
                clearInterval(effectInterval);
            }
        }, 100);
    };

    // ============================================================
    // LANGKAH 4: EVENT LISTENER UNTUK KLIK ROKET
    // ============================================================
    if (rocketContainer && preloader) {
        rocketContainer.addEventListener('click', () => {
            // Sembunyikan teks "Click to Launch"
            clickToLaunch.style.display = 'none';
            
            // Hentikan animasi bouncing pada roket
            rocket.style.animation = 'none';
            
            // Mulai efek api dan asap (1.5 detik)
            startLaunchEffects();
            
            // Setelah 1.5 detik, roket mulai terbang (selama 10 detik)
            setTimeout(() => {
                rocketContainer.classList.add('rocket-launching');
                isLaunching = false;
            }, 2500);
            
            // Setelah 11.5 detik total, tampilkan main content
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                mainContent.classList.remove('hidden');
                document.body.style.overflowY = 'auto';
                setActiveSection('home');
                startAutoSlide();
            }, 10000);
        });
    }

    // ============================================================
    // LANGKAH 5: FUNGSI UNTUK SET ACTIVE SECTION
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

        // Update active class untuk menu links
        menuLinks.forEach(link => {
            link.classList.remove('active-menu-link');
            if (link.dataset.section === sectionId) {
                link.classList.add('active-menu-link');
            }
        });
    };

    // ============================================================
    // LANGKAH 6: MENU TOGGLE FUNCTIONALITY
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

                // Opsional: Gulir ke atas section agar terlihat jelas
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ============================================================
    // LANGKAH 7: HOME SLIDER FUNCTIONALITY
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
    // LANGKAH 8: INITIAL SETUP
    // ============================================================
    mainContent.classList.add('hidden');
    document.body.style.overflow = 'hidden';
    showSlide(currentSlide);
});