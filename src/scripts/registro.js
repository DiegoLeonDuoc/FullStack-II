(function(){
    'use strict';

    /*
    Regex RFC5322
    https://regex101.com/r/3uvtNl/1
    */
    function isValidEmail(email) {
        return /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/gm.test(String(email).trim());
    }

    /**
     * Normaliza el RUT quitando puntos y espacios y convertiendo la K a minúscula.
     * Example: "12.345.678-K" -> "12345678-k"
     */
    function normalizeRut(rut) {
        return String(rut).replace(/\./g, '').replace(/\s+/g, '').toLowerCase();
    }

    /**
     * Revisa el rut normalizado para verificar el formato estandar numeros-numero/k
     * Regex used (applied to normalized input): /^[0-9]+-[0-9kK]{1}$/
     * - ^[0-9]+     : 1 o mas digitos para la parte numérica.
     * - -           : un guión literal separando la parte numérica de la parte verificadora.
     * - [0-9kK]{1}  : 1 caracter exactamente que sea un digito o 'k'(digito de verificación).
     * - $           : fin de la cadena.
     * Ejemplos válidos: "12345678-9", "12-3", "12345678-k"
     */
    function isRutFormat(rut) {
        return /^[0-9]+-[0-9k]{1}$/.test(normalizeRut(rut));
    }

    /**
     * Se calcula el DV del RUT usando el algoritmo modulo 11 .
     * Input: parte numérica como string (por ejemplo "12345678").
     * Output: '0'-'9' o 'k' como el DV esperado.
     */
    function computeRutDV(numPart) {
        let sum = 0;
        let factor = 2;
        for (let i = numPart.length - 1; i >= 0; i--) {
        sum += parseInt(numPart.charAt(i), 10) * factor;
        factor = factor === 7 ? 2 : factor + 1;
        }
        const remainder = 11 - (sum % 11);
        if (remainder === 11) return '0';
        if (remainder === 10) return 'k';
        return String(remainder);
    }

    /**
     * Usa vez calculado el DV se realizan las comprobaciones de formato y de validación.
     * Retorna true si el formato del rut es correcto y el DV es correcto.
     */
    function isValidRut(rut) {
        const norm = normalizeRut(rut);
        if (!isRutFormat(norm)) return false;
        const parts = norm.split('-');
        const num = parts[0];
        const vd = parts[1];
        if (!/^[0-9]+$/.test(num)) return false; // numeric-only check for safety
        const expected = computeRutDV(num);
        return expected === vd;
    }

    /**
     * Valida la contraseña para cumplir con los requerimientos de la aplicación.
     * Se verifica que la contraseña tenga longitud entre 8 y 30 caracteres.
     * Se verifica que contenga al menos una letra minúscula, una mayúscula, un digito y un símbolo.
     * Retorna true si la contraseña cumple con los requerimientos.
     */
    function isValidPassword(pw) {
        if (typeof pw !== 'string') return false;
        if (pw.length < 8 || pw.length > 30) return false;
        const hasLower = /[a-z]/.test(pw);
        const hasUpper = /[A-Z]/.test(pw);
        const hasDigit = /[0-9]/.test(pw);
        const hasSymbol = /[^A-Za-z0-9]/.test(pw);
        return hasLower && hasUpper && hasDigit && hasSymbol;
    }

    // Valida la edad para que sea mayor de 18 y menor de 120
    function isValidAge(age) {
        return age >=18 && age <= 120;
    }

    /**
     * Se crea (si es necesario) y se devuelve un elemento de advertencia situado encima del input.
     * El elemento tiene clase 'field-warning' y estilo inline para texto en rojo.
     */
    function getWarningEl(input) {
        let warn = input.parentElement.querySelector('.field-warning');
        if (!warn) {
        warn = document.createElement('div');
        warn.className = 'field-warning';
        warn.style.color = '#ff4d4f';
        warn.style.marginBottom = '6px';
        warn.style.fontSize = '0.9rem';
        input.parentElement.insertBefore(warn, input);
        }
        return warn;
    }

    /**
     * Se borra el texto de la advertencia y se elimina la clase 'is-invalid' de Bootstrap.
     */
    function clearWarning(input) {
        const warn = input.parentElement.querySelector('.field-warning');
        if (warn) warn.textContent = '';
        input.classList.remove('is-invalid');
    }

    // DOM-ready: se asocia el manejador de envío y se asocian los listeners de entrada en vivo.
    document.addEventListener('DOMContentLoaded', function(){
        // Se obtiene el formulario de registro
        var form = document.getElementById('registerForm');
        // Si el formulario no existe se sale
        if (!form) return;
        // Se obtienen los campos de entrada
        var rutInput = form.querySelector('#rut');
        var emailInput = form.querySelector('input[type="email"]');
        var pwInput = form.querySelector('input[type="password"]');
        var ageInput = form.querySelector('input[type="number"]');
        // Se asocia el manejador de envío
        form.addEventListener('submit', function(e){
        var rut = rutInput.value || '';
        var email = emailInput.value || '';
        var pw = pwInput.value || '';

       // Se comprueba el formato del RUT
       // Si no es válido
        if (!isRutFormat(rut)) {
            // Se evita el envío del formulario
            e.preventDefault();
            // Se obtiene el elemento de advertencia
            const w = getWarningEl(rutInput);
            // Se establece el texto de la advertencia
            w.textContent = 'RUT con formato inválido. Use 12.345.678-9 o 12345678-9.';
            // Se agrega la clase 'is-invalid' de Bootstrap
            rutInput.classList.add('is-invalid');
            // Se enfoca el campo
            rutInput.focus();
            return;
        } else {
            // Si es válido se borra la advertencia
            clearWarning(rutInput);
        }

        // Se comprueba el DV del RUT
        if (!isValidRut(rut)) {
            e.preventDefault();
            const w = getWarningEl(rutInput);
            w.textContent = 'RUT inválido (dígito verificador no coincide).';
            rutInput.classList.add('is-invalid');
            rutInput.focus();
            return;
        } else {
            clearWarning(rutInput);
        }

        // Se valida la edad
        if (!isValidAge(age)) {
            e.preventDefault();
            const w = getWarningEl(ageInput);
            w.textContent = 'Edad inválida.';
            ageInput.classList.add('is-invalid');
            ageInput.focus();
            return;
        } else {
            clearWarning(ageInput);
        }

        // Se valida el email
        if (!isValidEmail(email)) {
            e.preventDefault();
            const w = getWarningEl(emailInput);
            w.textContent = 'Email inválido.';
            emailInput.classList.add('is-invalid');
            emailInput.focus();
            return;
        } else {
            clearWarning(emailInput);
        }

        // Se valida la contraseña
        if (!isValidPassword(pw)) {
            e.preventDefault();
            const w = getWarningEl(pwInput);
            w.textContent = 'Contraseña inválida. Debe tener 8–30 caracteres e incluir minúscula, mayúscula, número y símbolo.';
            pwInput.classList.add('is-invalid');
            pwInput.focus();
            return;
        } else {
            clearWarning(pwInput);
        }
        });

        /// Se asocian los listeners de entrada en vivo: se borra la advertencia cuando el campo se convierte en válido
        [rutInput, emailInput, pwInput, ageInput].forEach(function(inp){
        // Si el campo no existe se sale
        if (!inp) return;
        // Se realizan las siguiente verificaciones cada que se realiza un cambio en el campo
        inp.addEventListener('input', function(){
            // Si el campo es el email y es válido se borra la advertencia
            if (inp === emailInput && isValidEmail(inp.value)) clearWarning(inp);
            // Si el campo es el RUT y es válido se borra la advertencia
            else if (inp === rutInput && isValidRut(inp.value)) clearWarning(inp);
            // Si el campo es la contraseña y es válida se borra la advertencia
            else if (inp === pwInput && isValidPassword(inp.value)) clearWarning(inp);
            // Si el campo es la edad y es válida se borra la advertencia
            else if (inp === ageInput && isValidAge(inp.value)) clearWarning(inp);
            // De lo contrario se deja la advertencia hasta que se convierta en válido
            else {
            // Dejar la advertencia hasta que se convierta en válido
            }
        });
        });
    });
})();
