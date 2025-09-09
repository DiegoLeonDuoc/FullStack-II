function isValidEmail(email) {
        return /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/gm.test(String(email).trim());
}

// Se añade un listener de envío al formulario de login
document.getElementById('loginForm').addEventListener('submit', function(e){
    // Se obtiene el campo de entrada de email
    const emailInput = this.querySelector('input[type="email"]');
    // Se obtiene el valor del campo de entrada de email
    const email = emailInput.value;

    // Se busca o se crea un elemento de advertencia situado encima del campo de entrada de email
    let warn = emailInput.parentElement.querySelector('.email-warning');
    if (!warn) {
        warn = document.createElement('div');
        warn.className = 'email-warning';
        warn.style.color = '#ff4d4f';
        warn.style.marginBottom = '6px';
        warn.style.fontSize = '0.9rem';
        emailInput.parentElement.insertBefore(warn, emailInput);
    }

    // Si el email no es válido
    if (!isValidEmail(email)) {
        // Se evita el envío del formulario
        e.preventDefault();
        // Se establece el texto de la advertencia
        warn.textContent = 'Email inválido';
        // Se agrega la clase 'is-invalid' de Bootstrap
        emailInput.classList.add('is-invalid');
        // Se enfoca el campo
        emailInput.focus();
    } else {
        // Si es válido se borra la advertencia
        warn.textContent = '';
        // Se elimina la clase 'is-invalid' de Bootstrap
        emailInput.classList.remove('is-invalid');
    }
});