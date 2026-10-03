import { api, avatar, el, formatDate, getSession, icon, logout, mountTopbar, roleChips, watchExpiry } from '/js/session.js';

const session = getSession();
if (!session) logout('auth');
watchExpiry(session);
mountTopbar(session);

document.querySelector('[data-expires]').textContent =
    new Date(session.exp * 1000).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

const tile = (iconName, label, value) =>
    el('div', { class: 'tile' }, [icon(iconName), el('dt', { text: label }), el('dd', {}, [value || '—'])]);

try {
    const me = await api('/api/users/me');
    mountTopbar(session, me);
    document.querySelector('[data-welcome]').textContent = `Bienvenido, ${me.name}`;
    document.querySelector('[data-avatar-slot]').replaceChildren(avatar(me, 'lg'));

    document.querySelector('[data-tiles]').replaceChildren(
        tile('person_outline', 'Nombre completo', `${me.name} ${me.lastName}`.trim()),
        tile('mail_outline', 'Correo', me.email),
        tile('phone', 'Teléfono', me.phoneNumber),
        tile('cake', 'Edad', me.age !== null ? `${me.age} años · ${formatDate(me.birthdate)}` : ''),
        tile('home', 'Dirección', me.address),
        tile('event', 'Miembro desde', formatDate(me.createdAt)),
        el('div', { class: 'tile' }, [icon('verified'), el('dt', { text: 'Roles' }), el('dd', {}, [roleChips(me.roles)])])
    );
} catch (err) {
    const box = document.querySelector('[data-error]');
    box.replaceChildren(icon('error_outline'), el('div', { text: err.message }));
    box.hidden = false;
}
