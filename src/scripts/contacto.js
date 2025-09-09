const FORM_SELECTOR = '#contact-form';
const EMAIL_SELECTOR = '#email';
const MESSAGE_SELECTOR = '#message';
const CHAR_COUNT_SELECTOR = '#char-count';
const MAX_CHARS = 1000;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector(FORM_SELECTOR);
    if (!form) return;

    const emailEl = form.querySelector(EMAIL_SELECTOR);
    const messageEl = form.querySelector(MESSAGE_SELECTOR);
    const charCountEl = form.querySelector(CHAR_COUNT_SELECTOR);
    const emailErrorEl = form.querySelector('#email-error');
    const messageErrorEl = form.querySelector('#message-error');
    const statusEl = form.querySelector('#form-status');

    // Asegurar maxlength en el textarea
    if (messageEl && !messageEl.hasAttribute('maxlength')) {
        messageEl.setAttribute('maxlength', String(MAX_CHARS));
    }

    // Actualizar contador de caracteres
    function updateCount() {
        if (!charCountEl || !messageEl) return;
        charCountEl.textContent = `${messageEl.value.length} / ${MAX_CHARS}`;
    }
    updateCount();

    // Validación simple de email
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    // Helpers de UI
    function showError(el, text) {
        if (!el) return;
        el.textContent = text;
        el.style.display = 'block';
    }
    function hideError(el) {
        if (!el) return;
        el.style.display = 'none';
    }
    function setStatus(text) {
        if (!statusEl) return;
        statusEl.textContent = text;
    }

    // Eventos
    messageEl && messageEl.addEventListener('input', () => {
        updateCount();
        hideError(messageErrorEl);
    });

    emailEl && emailEl.addEventListener('input', () => {
        hideError(emailErrorEl);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        hideError(emailErrorEl);
        hideError(messageErrorEl);
        setStatus('');

        const email = emailEl ? emailEl.value.trim() : '';
        const message = messageEl ? messageEl.value.trim() : '';

        let valid = true;
        if (!isValidEmail(email)) {
        showError(emailErrorEl, 'Por favor ingresa un correo válido.');
        valid = false;
        }
        if (!message) {
        showError(messageErrorEl, 'El mensaje no puede estar vacío.');
        valid = false;
        }
        if (!valid) return;

        // Como es una maqueta, no enviamos al servidor.
        // Solo mostramos feedback y limpiamos el formulario.
        setStatus('Mensaje preparado (maqueta). Gracias.');
        form.reset();
        updateCount();
    });
});
