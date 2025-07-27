// Navbar y funcionalidades principales
document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.querySelector('nav');
    const backToTop = document.getElementById('backToTop');
    
    // 1. Control del menú móvil
const toggleMobileMenu = () => {
    const isOpen = mobileMenu.classList.contains('active');

    // Deshabilitar botón durante la animación
    menuToggle.disabled = true;
    menuToggle.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    if (!isOpen) {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }

    // Restaurar botón después de animación
    setTimeout(() => {
        menuToggle.disabled = false;
    }, 300);
};

    // 2. Ajuste del menú según el tamaño de pantalla
    const adjustNavMenu = () => {
        if (window.innerWidth >= 768) {
            // Desktop
            mobileMenu.classList.add('translate-y-full');
            mobileMenu.classList.remove('translate-y-0');
            document.body.style.overflow = '';
            navMenu.classList.remove('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            // Mobile
            navMenu.classList.add('hidden');
        }
    };
    
    // 3. Efecto de scroll en el navbar
    let lastScroll = 0;
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Efecto hide/show navbar al hacer scroll
        if (currentScroll <= 100) {
            navbar.classList.remove('scrolled');
        } else if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('scrolled');
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.classList.add('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        // Botón "volver arriba"
        if (currentScroll > 300) {
            backToTop.classList.add('visible', 'opacity-100');
            backToTop.classList.remove('invisible', 'opacity-0');
        } else {
            backToTop.classList.remove('visible', 'opacity-100');
            backToTop.classList.add('invisible', 'opacity-0');
        }
        
        // Indicador de sección activa
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('#nav-menu a, #mobile-menu a');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
        
        lastScroll = currentScroll;
    };
    
    // 4. Scroll suave para anclas
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    // Cerrar menú móvil si está abierto
                    if (!mobileMenu.classList.contains('translate-y-full')) {
                        toggleMobileMenu();
                    }
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Botón "volver arriba"
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    
    // 5. Observador para animaciones
    const initScrollAnimations = () => {
        const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animateOnScrollElements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // 6. Lazy loading para imágenes
    const initLazyLoading = () => {
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img.lazy');
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        
                        if (lazyImage.dataset.src) {
                            lazyImage.src = lazyImage.dataset.src;
                        }
                        
                        if (lazyImage.dataset.srcset) {
                            lazyImage.srcset = lazyImage.dataset.srcset;
                        }
                        
                        lazyImage.classList.remove('lazy');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(lazyImage => {
                lazyImageObserver.observe(lazyImage);
            });
        }
    };
    
    // 7. Event listeners
    menuToggle.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', adjustNavMenu);
    
    // Cerrar menú al hacer clic en enlace
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('translate-y-full')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Inicializaciones
    adjustNavMenu();
    initSmoothScroll();
    initScrollAnimations();
    initLazyLoading();
    
    // Efecto hover para enlaces del menú móvil
    document.querySelectorAll('#mobile-menu a').forEach((link, index) => {
        link.style.setProperty('--i', index);
    });
    
    // Accesibilidad - navegación por teclado
    document.addEventListener('keydown', (e) => {
        // Cerrar menú con ESC
        if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-y-full')) {
            toggleMobileMenu();
        }
        
        // Navegación por tab en menú móvil
        if (!mobileMenu.classList.contains('translate-y-full')) {
            const links = Array.from(mobileMenu.querySelectorAll('a'));
            const firstLink = links[0];
            const lastLink = links[links.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstLink) {
                    e.preventDefault();
                    lastLink.focus();
                } else if (!e.shiftKey && document.activeElement === lastLink) {
                    e.preventDefault();
                    firstLink.focus();
                }
            }
        }
    });
});


