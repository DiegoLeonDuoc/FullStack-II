// Función ayudante: convertir ArrayBuffer a hex string
function bufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Encriptación SHA-256 usando Web Crypto API; devuelve hex string
async function sha256Hex(message) {
    const enc = new TextEncoder();
    const data = enc.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
}

// Se llama a esta función antes de enviar la contraseña al servidor.
// Reemplaza el valor de la contraseña del input con su hash SHA-256.
async function replacePasswordWithSha256(formElement, passwordInput) {
    // Se lee la contraseña actual (no se quita ningún espacio; se mantiene exacto)
    const pwd = passwordInput.value;
    // Si no hay contraseña, se sale
    if (!pwd) return;

    // Se realiza la encriptación
    const digestHex = await sha256Hex(pwd);

    // Se crea un elemento oculto con el hash
    const hidden = document.createElement('input');
    // Se establece el tipo de elemento oculto, para debug se deja visible
    hidden.type = 'show';
    // Se establece el nombre del elemento oculto
    hidden.name = passwordInput.name || 'password';
    // Se establece el valor del elemento oculto
    hidden.value = digestHex;
    // Se agrega el elemento oculto al formulario
    formElement.appendChild(hidden);
    // Se reemplaza el valor del input original de la contraseña con un vacío
    passwordInput.value = '';

}

function isValidEmail(email) {
    return /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/gm.test(String(email).trim());
}

document.getElementById('loginForm').addEventListener('submit', async function(e){
    const form = this;
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');

    // Ensure warning element exists (your existing code)...
    let warn = emailInput.parentElement.querySelector('.email-warning');
    if (!warn) {
        warn = document.createElement('div');
        warn.className = 'email-warning';
        warn.style.color = '#ff4d4f';
        warn.style.marginBottom = '6px';
        warn.style.fontSize = '0.9rem';
        emailInput.parentElement.insertBefore(warn, emailInput);
    }

    const email = emailInput.value;

    if (!isValidEmail(email)) {
        e.preventDefault();
        warn.textContent = 'Email inválido';
        emailInput.classList.add('is-invalid');
        emailInput.focus();
        return;
    } else {
        warn.textContent = '';
        emailInput.classList.remove('is-invalid');
    }

    // Se reemplaza la contraseña con el hash SHA-256 antes de enviar
    if (passwordInput) {
        // se evita el envío del formulario
        e.preventDefault();
        try {
            // se llama a la función de reemplazo de contraseña
            await replacePasswordWithSha256(form, passwordInput);
        } catch (err) {
            // Si falla la encriptación, se muestra el error
            console.error('Hashing failed', err);
        }
    }
});
