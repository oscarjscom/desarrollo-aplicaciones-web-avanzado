import { createForm } from '/js/forms.js';
import { validators } from '/shared/rules.js';
import { api, avatar, el, formatDate, fullName, getSession, icon, logout, mountTopbar, roleChips, toast, watchExpiry } from '/js/session.js';

const session = getSession();
if (!session) logout('auth');
watchExpiry(session);
mountTopbar(session);

let me = null;
const emailInput = document.getElementById('email');
const urlInput = document.getElementById('url_profile');

function renderSide(user, previewUrl) {
    const shown = previewUrl !== undefined ? { ...user, url_profile: previewUrl } : user;
    document.querySelector('[data-avatar-slot]').replaceChildren(avatar(shown, 'xl'));
    document.querySelector('[data-profile-name]').textContent = fullName(user);
    document.querySelector('[data-profile-email]').textContent = user.email;
    document.querySelector('[data-profile-roles]').replaceChildren(roleChips(user.roles));
    document.querySelector('[data-fact="age"]').textContent = user.age !== null ? `${user.age} años` : '—';
    document.querySelector('[data-fact="createdAt"]').textContent = formatDate(user.createdAt);
    document.querySelector('[data-fact="updatedAt"]').textContent = formatDate(user.updatedAt, true);
}

const profileForm = createForm(document.getElementById('profile-form'), {
    async onSubmit(values) {
        const updated = await api('/api/users/me', { method: 'PUT', body: values });
        me = updated;
        emailInput.dataset.original = updated.email;
        profileForm.fill(updated);
        renderSide(updated);
        mountTopbar(session, updated);
        toast('Tus datos se guardaron correctamente');
    }
});

const passwordForm = createForm(document.getElementById('password-form'), {
    // La contraseña nueva no puede contener tu nombre ni tu correo (regla cruzada)
    context: () => ({ email: me?.email, name: me?.name }),
    async onSubmit(values) {
        await api('/api/users/me/password', {
            method: 'PUT',
            body: { currentPassword: values.currentPassword, newPassword: values.newPassword }
        });
        passwordForm.reset();
        toast('Tu contraseña se actualizó');
    }
});

// Vista previa en vivo de la foto de perfil mientras se escribe la URL
urlInput.addEventListener('input', () => {
    if (!me) return;
    const value = urlInput.value.trim();
    if (!value) return renderSide(me, '');
    if (!validators.url_profile(value)) renderSide(me, value);
});

try {
    me = await api('/api/users/me');
    emailInput.dataset.original = me.email; // si no cambia el correo, no se vuelve a comprobar
    profileForm.fill(me);
    renderSide(me);
    mountTopbar(session, me);
} catch (err) {
    const box = document.querySelector('[data-error]');
    box.replaceChildren(icon('error_outline'), el('div', { text: err.message }));
    box.hidden = false;
}
