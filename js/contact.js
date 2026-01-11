/**
 * Contact Form Handler
 * Handles form submission, validation, and CAPTCHA verification
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
      captchaError: 'Por favor completa el CAPTCHA.',
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
      captchaError: 'Please complete the CAPTCHA.',
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
      // Check HTML5 validation first
      if (!contactForm.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        
        // Find first invalid field and focus it
        const firstInvalid = contactForm.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.reportValidity();
        }
        return false;
      }

      e.preventDefault();
      
      const currentLang = getCurrentLang();
      const langTexts = texts[currentLang];
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      
      // Hide previous messages
      hideMessage();
      
      // Get reCAPTCHA response
      const grecaptcha = window.grecaptcha;
      let recaptchaResponse = '';
      
      if (grecaptcha && typeof grecaptcha.getResponse === 'function') {
        try {
          recaptchaResponse = grecaptcha.getResponse();
          if (!recaptchaResponse) {
            showMessage(langTexts.captchaError, false);
            return;
          }
        } catch (error) {
          console.error('reCAPTCHA error:', error);
          showMessage(langTexts.error, false);
          return;
        }
      }
      
      // Disable submit button
      submitButton.disabled = true;
      submitButton.textContent = langTexts.sending;
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Add reCAPTCHA response if available
      if (recaptchaResponse) {
        formData.append('g-recaptcha-response', recaptchaResponse);
      }
      
      // Send form data
      fetch('contact.php', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Show message
        const messageText = data.success ? langTexts.success : langTexts.error;
        showMessage(messageText, data.success);
        
        if (data.success) {
          // Reset form on success
          contactForm.reset();
          
          // Reset reCAPTCHA
          if (grecaptcha && typeof grecaptcha.reset === 'function') {
            try {
              grecaptcha.reset();
            } catch (error) {
              console.error('reCAPTCHA reset error:', error);
            }
          }
          
          // Hide message after 5 seconds
          setTimeout(() => {
            hideMessage();
          }, 5000);
        }
        
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      })
      .catch(error => {
        console.error('Form submission error:', error);
        showMessage(langTexts.error, false);
        
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
    });
  });
})();
