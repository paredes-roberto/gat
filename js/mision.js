// Configuración del Intersection Observer para animaciones
const observerOptions = {
  threshold: [0.15, 0.25, 0.5],
  rootMargin: '-20% 0px -20% 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= 0.25) {
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Función para iniciar observadores de secciones
function initSectionObservers() {
  document.querySelectorAll('.section-content').forEach((section, index) => {
    setTimeout(() => {
      observer.observe(section);
    }, 300 * index);
  });
}

// Función para animación de scroll suave
function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
}

// Función para manejar scroll entre secciones
function initScrollIndicators() {
  document.querySelectorAll('.scroll-indicator').forEach(indicator => {
    indicator.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = indicator.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;
        
        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        requestAnimationFrame(animation);
        
        indicator.style.opacity = '0.5';
        setTimeout(() => {
          indicator.style.opacity = '0.8';
        }, 300);
      }
    });
  });
}

// Función para efectos de hover en pilares
function initPillarHoverEffects() {
  document.querySelectorAll('.pillar-item').forEach(element => {
    element.addEventListener('mouseenter', () => {
      const bg = element.querySelector('.pillar-bg');
      if (bg) {
        bg.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });
    
    element.addEventListener('mouseleave', () => {
      const bg = element.querySelector('.pillar-bg');
      if (bg) {
        bg.style.transform = 'translate(-50%, -50%) scale(0)';
      }
    });
  });
}

// Función para efecto de hover en enlace NovaHomes
function initNovaLinkHover() {
  const novaLink = document.querySelector('.nova-link');
  if (novaLink) {
    novaLink.addEventListener('mouseenter', () => {
      const svg = novaLink.querySelector('svg');
      if (svg) {
        svg.style.transform = 'translateX(5px)';
      }
    });
    
    novaLink.addEventListener('mouseleave', () => {
      const svg = novaLink.querySelector('svg');
      if (svg) {
        svg.style.transform = 'translateX(0)';
      }
    });
  }
}

// Función para revelar primera sección al cargar
function revealFirstSection() {
  const firstSection = document.querySelector('#section-1 .section-content');
  if (firstSection) {
    setTimeout(() => {
      firstSection.classList.add('reveal');
    }, 300);
  }
}

// Inicializar todas las funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initSectionObservers();
  initScrollIndicators();
  initPillarHoverEffects();
  initNovaLinkHover();
  revealFirstSection();
});

// Exportar funciones para uso externo si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initSectionObservers,
    initScrollIndicators,
    initPillarHoverEffects,
    initNovaLinkHover,
    revealFirstSection
  };
}