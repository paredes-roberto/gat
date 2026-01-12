/**
 * Contact Form Handler
 * Handles form submission and validation for Formspree
 * Includes field-by-field validation in both languages
 */

(function() {
  'use strict';

  // Get current language for messages
  function getCurrentLang() {
    return localStorage.getItem('site-lang') || (navigator.language.startsWith('en') ? 'en' : 'es');
  }

  // Get bilingual text for all validation messages
  const texts = {
    es: {
      sending: 'Enviando...',
      success: '¡Gracias! Tu mensaje ha sido enviado exitosamente.',
      error: 'Lo sentimos, hubo un error al enviar tu mensaje. Por favor intenta de nuevo más tarde.',
      validation: {
        nombreRequired: 'Por favor ingresa tu nombre.',
        nombreTooShort: 'El nombre debe tener al menos 2 caracteres.',
        emailRequired: 'Por favor ingresa tu email.',
        emailInvalid: 'Por favor ingresa un email válido.',
        mensajeRequired: 'Por favor ingresa tu mensaje.',
        mensajeTooShort: 'El mensaje debe tener al menos 10 caracteres.'
      }
    },
    en: {
      sending: 'Sending...',
      success: 'Thank you! Your message has been sent successfully.',
      error: 'Sorry, there was an error sending your message. Please try again later.',
      validation: {
        nombreRequired: 'Please enter your name.',
        nombreTooShort: 'Name must be at least 2 characters.',
        emailRequired: 'Please enter your email.',
        emailInvalid: 'Please enter a valid email address.',
        mensajeRequired: 'Please enter your message.',
        mensajeTooShort: 'Message must be at least 10 characters.'
      }
    }
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (!contactForm) return;

    // Get form fields
    const nombreField = contactForm.querySelector('input[name="nombre"]');
    const emailField = contactForm.querySelector('input[name="email"]');
    const mensajeField = contactForm.querySelector('textarea[name="mensaje"]');

    // Show message function
    function showMessage(message, isSuccess) {
      if (!formMessage) return;
      
      formMessage.textContent = message;
      formMessage.className = 'form-message ' + (isSuccess ? 'success' : 'error');
      formMessage.style.display = 'block';
      formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Hide message function
    function hideMessage() {
      if (formMessage) {
        formMessage.style.display = 'none';
      }
    }

    // Setup validation handlers - reads current language dynamically
    function setupValidationHandlers() {
      // Setup nombre field validation
      if (nombreField) {
        nombreField.addEventListener('input', function() {
          const currentLang = getCurrentLang();
          const langTexts = texts[currentLang].validation;
          if (this.validity.valueMissing) {
            this.setCustomValidity(langTexts.nombreRequired);
          } else if (this.value.length > 0 && this.value.length < 2) {
            this.setCustomValidity(langTexts.nombreTooShort);
          } else {
            this.setCustomValidity('');
          }
        });

        nombreField.addEventListener('invalid', function(e) {
          e.preventDefault();
          const currentLang = getCurrentLang();
          const langTexts = texts[currentLang].validation;
          if (this.validity.valueMissing) {
            this.setCustomValidity(langTexts.nombreRequired);
          } else {
            this.setCustomValidity(langTexts.nombreTooShort);
          }
          this.reportValidity();
        });
      }

      // Setup email field validation
      if (emailField) {
        emailField.addEventListener('input', function() {
          const currentLang = getCurrentLang();
          const langTexts = texts[currentLang].validation;
          if (this.validity.valueMissing) {
            this.setCustomValidity(langTexts.emailRequired);
          } else if (this.validity.typeMismatch) {
            this.setCustomValidity(langTexts.emailInvalid);
          } else {
            this.setCustomValidity('');
          }
        });

        emailField.addEventListener('invalid', function(e) {
          e.preventDefault();
          const currentLang = getCurrentLang();
          const langTexts = texts[currentLang].validation;
          if (this.validity.valueMissing) {
            this.setCustomValidity(langTexts.emailRequired);
          } else {
            this.setCustomValidity(langTexts.emailInvalid);
          }
          this.reportValidity();
        });
      }

      // Setup mensaje field validation
      if (mensajeField) {
        mensajeField.addEventListener('input', function() {
          const currentLang = getCurrentLang();
          const langTexts = texts[currentLang].validation;
          if (this.validity.valueMissing) {
            this.setCustomValidity(langTexts.mensajeRequired);
          } else if (this.value.length > 0 && this.value.length < 10) {
            this.setCustomValidity(langTexts.mensajeTooShort);
          } else {
            this.setCustomValidity('');
          }
        });

        mensajeField.addEventListener('invalid', function(e) {
          e.preventDefault();
          const currentLang = getCurrentLang();
          const langTexts = texts[currentLang].validation;
          if (this.validity.valueMissing) {
            this.setCustomValidity(langTexts.mensajeRequired);
          } else {
            this.setCustomValidity(langTexts.mensajeTooShort);
          }
          this.reportValidity();
        });
      }
    }

    // Initialize validation handlers
    setupValidationHandlers();

    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Check HTML5 validation first
      if (!contactForm.checkValidity()) {
        // Find first invalid field and focus it
        const firstInvalid = contactForm.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.reportValidity();
        }
        return false;
      }
      
      const currentLang = getCurrentLang();
      const langTexts = texts[currentLang];
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      
      // Hide previous messages
      hideMessage();
      
      // Disable submit button
      submitButton.disabled = true;
      submitButton.textContent = langTexts.sending;
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Send form data to Formspree
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          showMessage(langTexts.success, true);
          contactForm.reset();
          
          // Hide message after 5 seconds
          setTimeout(() => {
            hideMessage();
          }, 5000);
        } else {
          return response.json().then(data => {
            if (data.errors) {
              throw new Error(data.errors.map(error => error.message).join(', '));
            } else {
              throw new Error('Form submission failed');
            }
          });
        }
      })
      .catch(error => {
        console.error('Form submission error:', error);
        showMessage(langTexts.error, false);
      })
      .finally(() => {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
    });
  });
})();