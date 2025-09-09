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
     */
    function isRutFormat(rut) {
        return /^[0-9]+-[0-9k]{1}$/.test(normalizeRut(rut));
    }

    /**
     * Se calcula el DV del RUT usando el algoritmo modulo 11 .
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
     * Valida formato y dígito verificador del RUT.
     */
    function isValidRut(rut) {
        const norm = normalizeRut(rut);
        if (!isRutFormat(norm)) return false;
        const parts = norm.split('-');
        const num = parts[0];
        const vd = parts[1];
        if (!/^[0-9]+$/.test(num)) return false;
        const expected = computeRutDV(num);
        return expected === vd;
    }

    /**
     * Valida la contraseña (si se necesita en otros formularios).
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

    /**
     * Valida fecha de nacimiento: mayor o igual a 18 años y menor de 120 años.
     * Recibe string en formato ISO (yyyy-mm-dd) o Date-compatible.
     */
    function isValidBirthdate(dateStr) {
        if (!dateStr) return false;
        var d = new Date(dateStr);
        if (isNaN(d.getTime())) return false;
        var today = new Date();
        // Zero time components for consistent age calc
        d.setHours(0,0,0,0);
        today.setHours(0,0,0,0);

        // Calculate age in years
        var age = today.getFullYear() - d.getFullYear();
        var m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
            age--;
        }
        return age >= 18 && age <= 120;
    }

    /**
     * Se crea (si es necesario) y se devuelve un elemento de advertencia situado encima del input.
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

    document.addEventListener('DOMContentLoaded', function(){
        // Cart checkout form has id="checkout-form"
        var form = document.getElementById('checkout-form');
        if (!form) return;

        var rutInput = form.querySelector('#rut');
        var firstNameInput = form.querySelector('#firstName');
        var lastNameInput = form.querySelector('#lastName');
        var emailInput = form.querySelector('input[type="email"]');
        var phoneInput = form.querySelector('#phone');
        var birthdateInput = form.querySelector('#birthdate');

        form.addEventListener('submit', function(e){
            var rut = rutInput ? rutInput.value || '' : '';
            var email = emailInput ? emailInput.value || '' : '';
            var birthdate = birthdateInput ? birthdateInput.value || '' : '';
            var firstName = firstNameInput ? firstNameInput.value.trim() : '';
            var lastName = lastNameInput ? lastNameInput.value.trim() : '';
            var phone = phoneInput ? phoneInput.value.trim() : '';
            
            // RUT format
            if (!isRutFormat(rut)) {
                e.preventDefault();
                const w = getWarningEl(rutInput);
                w.textContent = 'RUT con formato inválido. Use 12.345.678-9 o 12345678-9.';
                rutInput.classList.add('is-invalid');
                rutInput.focus();
                return;
            } else {
                clearWarning(rutInput);
            }

            // RUT DV
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

            if (!firstName) {
                e.preventDefault();
                const w = getWarningEl(firstNameInput);
                w.textContent = 'Nombre requerido.';
                firstNameInput.classList.add('is-invalid');
                firstNameInput.focus();
                return;
            } else {
                clearWarning(firstNameInput);
            }

            if (!lastName) {
                e.preventDefault();
                const w = getWarningEl(lastNameInput);
                w.textContent = 'Apellido requerido.';
                lastNameInput.classList.add('is-invalid');
                lastNameInput.focus();
                return;
            } else {
                clearWarning(lastNameInput);
            }

            // Email
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

            // Phone basic presence (you can add pattern if desired)
            if (!phone) {
                e.preventDefault();
                const w = getWarningEl(phoneInput);
                w.textContent = 'Teléfono requerido.';
                phoneInput.classList.add('is-invalid');
                phoneInput.focus();
                return;
            } else {
                clearWarning(phoneInput);
            }

            // Birthdate -> use isValidBirthdate
            if (!isValidBirthdate(birthdate)) {
                e.preventDefault();
                const w = getWarningEl(birthdateInput);
                w.textContent = 'Fecha de nacimiento inválida. Debes tener al menos 18 años.';
                birthdateInput.classList.add('is-invalid');
                birthdateInput.focus();
                return;
            } else {
                clearWarning(birthdateInput);
            }

        });

        [firstNameInput, lastNameInput, rutInput, emailInput, phoneInput, birthdateInput].forEach(function(inp){
            if (!inp) return;
            inp.addEventListener('input', function(){
                if (inp === emailInput && isValidEmail(inp.value)) clearWarning(inp);
                else if (inp === rutInput && isValidRut(inp.value)) clearWarning(inp);
                else if (inp === birthdateInput && isValidBirthdate(inp.value)) clearWarning(inp);
                else if ((inp === firstNameInput || inp === lastNameInput || inp === phoneInput) && inp.value.trim() !== '') clearWarning(inp);
            });
        });
    });
})();
