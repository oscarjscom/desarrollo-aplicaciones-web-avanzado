import { createForm } from '/js/forms.js';
import { api, getSession, homeFor } from '/js/session.js';

const existing = getSession();
if (existing) location.replace(homeFor(existing));

createForm(document.getElementById('signup-form'), {
    async onSubmit(values) {
        // El servidor asigna siempre el rol "user": desde aquí no se puede pedir otro
        await api('/api/auth/signUp', { method: 'POST', body: values, auth: false });
        sessionStorage.setItem('custodia.lastEmail', values.email.toLowerCase());
        location.replace('/signIn?reason=registered');
    }
});
