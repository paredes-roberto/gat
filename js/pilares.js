// Configuración de los carruseles para cada sección
function initCarousels() {
  const sections = document.querySelectorAll('.section-1, .section-2, .section-3');
  
  sections.forEach((section, sectionIndex) => {
    const cards = section.querySelectorAll('.card');
    const indicators = section.querySelectorAll('.indicator');
    let currentCard = 0;
    const AUTO_ROTATE_TIME = 10000;
    let rotationInterval;
    
    // Función para mostrar card
    function showCard(index) {
      cards.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) {
          card.classList.add('active');
          
          // Reiniciar animaciones
          const elements = card.querySelectorAll('h3, p, .features-list');
          elements.forEach(el => {
            el.style.animation = 'none';
            setTimeout(() => {
              el.style.animation = '';
            }, 10);
          });
        }
      });

      indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
      });

      currentCard = index;
    }

    // =====================
// TOUCH / SWIPE por sección
// =====================
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

const SWIPE_THRESHOLD = 60;

section.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1 || isTouchSliding) return;

  clearInterval(rotationInterval);

  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener('touchmove', (e) => {
  if (isTouchSliding) return;

  endX = e.touches[0].clientX;
  endY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener('touchend', () => {
  if (isTouchSliding) return;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (
    Math.abs(deltaX) > Math.abs(deltaY) &&
    Math.abs(deltaX) > SWIPE_THRESHOLD
  ) {
    isTouchSliding = true;

    if (deltaX < 0) {
      // Swipe izquierda → siguiente card
      showCard((currentCard + 1) % cards.length);
    } else {
      // Swipe derecha → card anterior
      showCard((currentCard - 1 + cards.length) % cards.length);
    }

    clearTimeout(touchCooldownTimeout);
    touchCooldownTimeout = setTimeout(() => {
      isTouchSliding = false;
      startRotation(); // 🔁 vuelve al ritmo normal
    }, 600);
  } else {
    startRotation();
  }
});


    // Auto-rotate
    function startRotation() {
    clearInterval(rotationInterval);
    rotationInterval = setInterval(() => {
      currentCard = (currentCard + 1) % cards.length;
      showCard(currentCard);
      }, AUTO_ROTATE_TIME);
    }

   /* function startRotation() {
      rotationInterval = setInterval(() => {
        currentCard = (currentCard + 1) % cards.length;
        showCard(currentCard);
      }, AUTO_ROTATE_TIME);
    }*/

    function resetRotation() {
      clearInterval(rotationInterval);
      startRotation();
    }

    // Click en indicadores
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showCard(index);
        resetRotation();
      });
    });

    // Iniciar primera card
    showCard(0);
    
    // Iniciar rotación solo cuando la sección es visible
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startRotation();
        } else {
          clearInterval(rotationInterval);
        }
      });
    }, { threshold: 0.3 });
    
    sectionObserver.observe(section);
  });
}

// Función para reveal on scroll
function initRevealOnScroll() {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
      }
    });
  }, observerOptions);

  // Observar todos los elementos que necesitan reveal
  document.querySelectorAll('.section-title, .section-subtitle, .cards-container').forEach(el => {
    observer.observe(el);
  });
}

// Función para efectos hover en imágenes
function initImageHoverEffects() {
  document.querySelectorAll('.card-image').forEach(imageContainer => {
    const img = imageContainer.querySelector('img');
    if (img) {
      imageContainer.addEventListener('mouseenter', () => {
        if (imageContainer.closest('.card.active')) {
          img.style.transform = 'scale(1.05)';
        }
      });
      
      imageContainer.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    }
  });
}

// Función para inicializar todo cuando el DOM esté listo
function initPilaresEstrategicos() {
  initCarousels();
  initRevealOnScroll();
  initImageHoverEffects();
  
  // Revelar elementos inmediatamente visibles al cargar
  const visibleElements = document.querySelectorAll('.section-title, .section-subtitle, .cards-container');
  visibleElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('reveal');
    }
  });
}

// Inicializar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPilaresEstrategicos);
} else {
  initPilaresEstrategicos();
}

// Exportar funciones si es necesario para uso modular
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initPilaresEstrategicos,
    initCarousels,
    initRevealOnScroll,
    initImageHoverEffects
  };
}