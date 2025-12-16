// Carrusel automático
let slideIndex = 0;
const slides = document.querySelectorAll(".proyecto-slide");

function showSlide(n) {
  slides.forEach((s, i) => {
    s.classList.remove("active");
    if (i === n) s.classList.add("active");
  });
}

setInterval(() => {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}, 5000);

showSlide(slideIndex);

// Animación de descripción
const descripcion = document.getElementById("descripcion");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      descripcion.classList.add("visible");
    }
  });
}, { threshold: 0.2 });
observer.observe(descripcion);

// Navbar móvil
const navToggle = document.getElementById("nav-toggle");
const navbar = document.getElementById("navbar");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navbar.classList.toggle("open");
    navToggle.classList.toggle("active");
  });
}

// ===== Modal de galería =====
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("caption");
const closeModal = document.querySelector(".close");

document.querySelectorAll(".galeria-grid img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;
  });
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
