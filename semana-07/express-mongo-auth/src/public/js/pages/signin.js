import { createForm } from '/js/forms.js';
import { api, el, getSession, homeFor, icon, startSession } from '/js/session.js';

// Si ya hay una sesión válida, no tiene sentido volver a iniciar sesión
const existing = getSession();
if (existing) location.replace(homeFor(existing));

const REASONS = {
    expired: ['info', 'Tu sesión expiró. Vuelve a iniciar sesión para continuar.'],
    auth: ['info', 'Inicia sesión para entrar a esa página.'],
    logout: ['info', 'Cerraste sesión correctamente.'],
    switch: ['info', 'Inicia sesión con la otra cuenta.'],
    registered: ['ok', 'Tu cuenta fue creada. Ya puedes iniciar sesión.']
};

const reason = REASONS[new URLSearchParams(location.search).get('reason')];
const box = document.querySelector('[data-reason]');
if (reason) {
    box.className = 'alert alert--' + reason[0];
    box.replaceChildren(icon(reason[0] === 'ok' ? 'check_circle' : 'info'), el('div', { text: reason[1] }));
    box.hidden = false;
}

// Tras registrarse, el correo llega rellenado (se pasa por sessionStorage, no por la URL)
const lastEmail = sessionStorage.getItem('custodia.lastEmail');
if (lastEmail) {
    sessionStorage.removeItem('custodia.lastEmail');
    document.getElementById('email').value = lastEmail;
    document.getElementById('password').focus();
}

createForm(document.getElementById('signin-form'), {
    async onSubmit(values) {
        try {
            const { token } = await api('/api/auth/signIn', { method: 'POST', body: values, auth: false });
            startSession(token);
            location.replace(homeFor(getSession())); // cada rol va a su propio panel
        } catch (err) {
            if (err.status === 401) {
                document.getElementById('password').value = '';
                throw new Error('Correo o contraseña incorrectos');
            }
            throw err;
        }
    }
});
