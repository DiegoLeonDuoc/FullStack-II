(function () {
    // Regex de validación de email
    const emailRegex = /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/gm;
    // Máximo de caracteres permitidos en un mensaje
    const MAX_CHARS = 1000;

    // Elementos
    const form = document.getElementById('contact-form');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const charCount = document.getElementById('char-count');
    const formStatus = document.getElementById('form-status');

    // Si no hay formulario o campos de entrada, salir
    if (!form || !emailInput || !messageInput) return; // seguridad

    // Actualiza contador de caracteres
    function updateCharCount() {
        // Se obtiene el número de caracteres escritos en el campo de entrada
        const len = messageInput.value.length;
        // Se actualiza el campo de contador de caracteres
        charCount.textContent = `${len} / ${MAX_CHARS}`;
    }

    // Validaciones individuales
    function validateEmail() {
        // Se obtiene el valor del campo de entrada de email y se quita espacios y caracteres especiales
        const val = String(emailInput.value || '').trim();
        // Se valida si el valor del campo de entrada de email es válido mediante regex
        const ok = emailRegex.test(val);
        // Si el valor del campo de entrada de email no es válido, se muestra el error
        emailError.style.display = ok ? 'none' : 'block';
        // Se agrega o quita la clase 'is-invalid' de Bootstrap
        emailInput.classList.toggle('is-invalid', !ok);
        return ok;
    }

    function validateMessage() {
        // Se obtiene el valor del campo de entrada de mensaje y se quita espacios y caracteres especiales
        const val = String(messageInput.value || '').trim();
        // Se obtiene el número de caracteres escritos en el campo de entrada de mensaje
        const len = val.length;
        // Se valida si el número de caracteres escritos en el campo de entrada de mensaje está entre 0 y 1000
        const ok = len > 0 && len <= MAX_CHARS;
        // Si el número de caracteres escritos en el campo de entrada de mensaje no está entre 0 y 1000, se muestra el error
        messageError.style.display = ok ? 'none' : 'block';
        messageInput.classList.toggle('is-invalid', !ok);
        return ok;
    }

    // Eventos
    // Se añade un listener al evento 'input' del campo de entrada de email
    emailInput.addEventListener('input', function () {
        // Se valida el email cada vez que se realiza un input
        // Se limpia el mensaje de error
        formStatus.textContent = '';
        validateEmail();
    });

    // Se añade un listener al evento 'input' del campo de entrada de mensaje
    messageInput.addEventListener('input', function () {
        // Se actualiza el contador de caracteres
        updateCharCount();
        // Se limpia el mensaje de error
        formStatus.textContent = '';
        // Se valida la cantidad de caracteres escritos en el campo de entrada de mensaje
        validateMessage();
    });

    // Inicializar contador de caracteres
    updateCharCount();

    // Manejo de envío del formulario
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // mock: no enviamos a servidor
        // Se valida el email y la cantidad de caracteres escritos en el campo de entrada de mensaje
        const emailOk = validateEmail();
        const messageOk = validateMessage();
        // Si el email no es válido
        if (!emailOk) {
            // Se enfoca el campo de entrada de email
            emailInput.focus();
            // Se limpia el mensaje de error
            formStatus.textContent = '';
        return;
        }

        // Si la cantidad de caracteres escritos en el campo de entrada de mensaje no es válida
        if (!messageOk) {
            // Se enfoca el campo de entrada de mensaje
            messageInput.focus();
            // Se limpia el mensaje de error
            formStatus.textContent = '';
            return;
        }

        // Si todo es válido, simulamos envío async
        formStatus.style.color = '#007bff';
        formStatus.textContent = 'Enviando...';

        // Mock de espera (simula petición al servidor)
        setTimeout(function () {
        // respuesta mock
        formStatus.style.color = '#28a745';
        formStatus.textContent = 'Mensaje enviado correctamente (mock).';

        // limpiar formulario (opcional en mock)
        form.reset();
        updateCharCount();
        emailInput.classList.remove('is-invalid');
        messageInput.classList.remove('is-invalid');
        emailError.style.display = 'none';
        messageError.style.display = 'none';
        }, 900);
    });
})();
