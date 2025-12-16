// Navbar toggle
const navToggle = document.getElementById("nav-toggle");
const navbar = document.getElementById("navbar");

navToggle.addEventListener("click", () => {
  navbar.classList.toggle("open");
  navToggle.classList.toggle("active");
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll("#navbar a").forEach(link => {
  link.addEventListener("click", () => {
    navbar.classList.remove("open");
    navToggle.classList.remove("active");
  });
});

// Projects Slideshow
let projectIndex = 0;
const projectSlides = document.querySelectorAll(".carousel.full-frame .slide");

function showProjectSlide(n) {
  projectSlides.forEach((s, i) => {
    s.classList.remove("active");
    if (i === n) s.classList.add("active");
  });
}

// Auto-rotate every 6s
setInterval(() => {
  projectIndex = (projectIndex + 1) % projectSlides.length;
  showProjectSlide(projectIndex);
}, 6000);

// Initialize first slide
showProjectSlide(projectIndex);

// =====================
// Cambio automático de idioma
// =====================
const langBtn = document.getElementById("lang-toggle");

function setLanguage(lang) {
  // Update all elements with data-es and data-en attributes
  document.querySelectorAll("[data-es]").forEach(el => {
    const translation = el.getAttribute(`data-${lang}`);
    if (translation) {
      // Check if element has innerHTML content (like strong tags)
      if (el.innerHTML && el.innerHTML.includes('<strong')) {
        el.innerHTML = translation;
      } else {
        el.textContent = translation;
      }
    }
  });
  
  // Update placeholders for input and textarea elements
  document.querySelectorAll("[data-placeholder-es]").forEach(el => {
    const placeholder = el.getAttribute(`data-placeholder-${lang}`);
    if (placeholder) {
      el.placeholder = placeholder;
    }
  });
  
  // Update hero slide content if it exists
  const heroTitle = document.getElementById('hero-main-title');
  const heroDescription = document.getElementById('hero-main-description');
  if (heroTitle && heroDescription && currentSlideIndex !== undefined && slidesData[currentSlideIndex]) {
    const currentSlide = slidesData[currentSlideIndex];
    heroTitle.textContent = currentSlide.title[lang] || currentSlide.title.es;
    heroDescription.textContent = currentSlide.description[lang] || currentSlide.description.es;
  }
  
  langBtn.textContent = lang === "es" ? "EN" : "ES";
  localStorage.setItem("site-lang", lang);
}

// Detectar idioma del navegador o preferencia guardada
let savedLang = localStorage.getItem("site-lang");
if (!savedLang) {
  const userLang = navigator.language || navigator.userLanguage;
  savedLang = userLang.startsWith("en") ? "en" : "es";
}

// Listener botón
let currentLang = savedLang;
if (langBtn) {
  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "es" ? "en" : "es";
    setLanguage(currentLang);
  });
}

// ------
// HERO
//-------
const slidesData = [
    {
        id: "slide-background-1",
        number: "01",
        title: {
            es: "Desarrollo Inmobiliario",
            en: "Real Estate Development"
        },
        description: {
            es: "Novahomes: construcción llave en mano y diseño premium con metodología DCI para transparencia total y experiencia personalizada.",
            en: "Novahomes: turnkey construction and premium design with DCI methodology for total transparency and personalized experience."
        },
        //imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
        imageUrl: "img/sector1/06.webp"
    },
    {
        id: "slide-background-2",
        number: "02",
        title: {
            es: "Infraestructura Civil",
            en: "Civil Infrastructure"
        },
        description: {
            es: "Obras públicas y privadas con eficiencia, optimización de recursos e ingeniería de valor para soluciones técnicas sólidas y visión a largo plazo.",
            en: "Public and private works with efficiency, resource optimization and value engineering for solid technical solutions and long-term vision."
        },
        //imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
        imageUrl: "/img/sector2/11.webp"
    },
    {
        id: "slide-background-3",
        number: "03",
        title: {
            es: "Consultoría Especializada",
            en: "Specialized Consulting"
        },
        description: {
            es: "Nuestro equipo de consultores especializados fortalece departamentos de proyectos, asegura ejecuciones exitosas y garantiza retorno de inversión como socio estratégico.",
            en: "Our team of specialized consultants strengthens project departments, ensures successful executions and guarantees return on investment as a strategic partner."
        },
        //imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
        imageUrl: "/img/sector3/08.webp"
    }
];

// ===== VARIABLES DE ESTADO DEL HERO =====
let currentSlideIndex = 0;
let slideInterval;
let isAnimating = false;

// ===== ELEMENTOS DOM DEL HERO =====
// Referencias a los elementos principales del hero
const bgSlides = document.querySelectorAll('.bg-slide');
const slideTitle = document.getElementById('hero-main-title');
const slideDescription = document.getElementById('hero-main-description');
const currentSlideElement = document.getElementById('current-slide-number');
const totalSlidesElement = document.getElementById('total-slides-number');
const indicators = document.querySelectorAll('.indicator');
const scrollDown = document.getElementById('scroll-down-indicator');

// ===== FUNCIONES DEL HERO =====

/**
 * Inicializa los slides del hero cargando las imágenes
 */
function initializeSlides() {
    slidesData.forEach((slide, index) => {
        const slideElement = document.getElementById(slide.id);
        if (slideElement) {
            // Precargar imagen para evitar flashes
            const img = new Image();
            img.src = slide.imageUrl;
            img.onload = () => {
                slideElement.style.backgroundImage = `url('${slide.imageUrl}')`;
            };
        }
    });
    
    // Establecer el número total de slides
    totalSlidesElement.textContent = slidesData.length.toString().padStart(2, '0');
}

/**
 * Cambia al slide especificado con animaciones fluidas
 * @param {number} index - Índice del slide al que cambiar
 */
function changeSlide(index) {
    if (isAnimating) return;
    
    isAnimating = true;
    
    // Validar y ajustar índice para carrusel circular
    if (index < 0) index = slidesData.length - 1;
    if (index >= slidesData.length) index = 0;
    
    // Si es el mismo slide, no hacer nada
    if (index === currentSlideIndex) {
        isAnimating = false;
        return;
    }
    
    // 1. Ocultar texto actual con animación
    slideTitle.classList.remove('show');
    slideTitle.classList.add('hide');
    
    slideDescription.classList.remove('show');
    slideDescription.classList.add('hide');
    
    // 2. Cambiar imagen de fondo
    setTimeout(() => {
        bgSlides[currentSlideIndex].classList.remove('active');
        bgSlides[index].classList.add('active');
        
        // 3. Actualizar controles visuales
        indicators[currentSlideIndex].classList.remove('active');
        indicators[index].classList.add('active');
        currentSlideElement.textContent = slidesData[index].number;
        
        // 4. Actualizar contenido textual según el idioma actual
        const currentLang = localStorage.getItem("site-lang") || "es";
        slideTitle.textContent = slidesData[index].title[currentLang] || slidesData[index].title.es;
        slideDescription.textContent = slidesData[index].description[currentLang] || slidesData[index].description.es;
        
        // 5. Mostrar nuevo texto con animación
        setTimeout(() => {
            slideTitle.classList.remove('hide');
            slideDescription.classList.remove('hide');
            
            setTimeout(() => {
                slideTitle.classList.add('show');
                slideDescription.classList.add('show');
                
                // Actualizar estado
                currentSlideIndex = index;
                isAnimating = false;
            }, 50);
        }, 50);
    }, 300);
    
    // Reiniciar intervalo automático
    resetAutoSlide();
}

/**
 * Inicia el cambio automático de slides
 */
function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(currentSlideIndex + 1);
    }, 8000);
}

/**
 * Reinicia el intervalo de cambio automático
 */
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

/**
 * Pre-carga todas las imágenes para mejor rendimiento
 */
function preloadImages() {
    slidesData.forEach(slide => {
        const img = new Image();
        img.src = slide.imageUrl;
    });
}

// ===== EFECTOS DE SCROLL =====

/**
 * Inicializa los efectos de scroll y animaciones de secciones
 */
function initScrollEffects() {
    const sections = document.querySelectorAll('.section');
    const hero = document.getElementById('hero-main-section');
    
    // Observer para detectar secciones visibles
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
            }
        });
    }, observerOptions);
    
    // Observar todas las secciones
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Configurar scroll suave para flecha indicadora
    scrollDown.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
    
    // Controlar visibilidad de la flecha de scroll
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPosition = window.scrollY;
                const windowHeight = window.innerHeight;
                
                // Ocultar flecha después de cierto scroll
                if (scrollPosition > windowHeight * 0.15) {
                    scrollDown.style.opacity = '0';
                    scrollDown.style.pointerEvents = 'none';
                } else {
                    scrollDown.style.opacity = '1';
                    scrollDown.style.pointerEvents = 'auto';
                }
                
                // Efecto parallax suave en hero
                if (scrollPosition < windowHeight) {
                    const parallaxValue = scrollPosition * 0.2;
                    hero.style.transform = `translateY(${parallaxValue}px)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ===== INICIALIZACIÓN DEL HERO =====

/**
 * Configura todos los eventos y funcionalidades del hero
 */
function setupHeroEvents() {
    // Configurar clic en indicadores
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const index = parseInt(indicator.getAttribute('data-index'));
            if (index !== currentSlideIndex) {
                changeSlide(index);
            }
        });
    });
    
    // Pausar auto slide al interactuar con el hero
    const heroElement = document.querySelector('.hero');
    heroElement.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    heroElement.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide(currentSlideIndex - 1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(currentSlideIndex + 1);
        }
    });
}

// ===== INICIALIZACIÓN AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar slides
    initializeSlides();
    
    // 2. Pre-cargar imágenes
    preloadImages();
    
    // 3. Configurar eventos del hero
    setupHeroEvents();
    
    // 4. Iniciar efectos de scroll
    initScrollEffects();
    
    // 5. Establecer idioma inicial (esto también actualiza el hero)
    setLanguage(savedLang);
    
    // 6. Iniciar navegación automática
    startAutoSlide();
});

// Asegurar que las transiciones funcionen correctamente
window.addEventListener('load', () => {
    document.body.offsetHeight; // Forzar reflow
});
