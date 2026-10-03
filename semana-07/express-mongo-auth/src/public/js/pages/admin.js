import { api, avatar, el, formatDate, fullName, getSession, icon, logout, mountTopbar, roleChips, watchExpiry } from '/js/session.js';

const session = getSession();
if (!session) logout('auth');
watchExpiry(session);
mountTopbar(session);

const rowsBody = document.querySelector('[data-rows]');
const empty = document.querySelector('[data-empty]');
const count = document.querySelector('[data-count]');
const search = document.getElementById('search');
const roleFilter = document.getElementById('role-filter');
const modalEl = document.getElementById('user-modal');
const modal = window.M ? M.Modal.init(modalEl, {}) : null;

let users = [];

function renderStats() {
    const now = new Date();
    const ages = users.map((u) => u.age).filter((a) => a !== null);
    const thisMonth = users.filter((u) => {
        const d = new Date(u.createdAt);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    document.querySelector('[data-stat="total"]').textContent = users.length;
    document.querySelector('[data-stat="admins"]').textContent = users.filter((u) => u.roles.includes('admin')).length;
    document.querySelector('[data-stat="month"]').textContent = thisMonth.length;
    document.querySelector('[data-stat="avgAge"]').textContent = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : '—';
}

function renderRows() {
    const term = search.value.trim().toLowerCase();
    const role = roleFilter.value;
    const visible = users.filter((u) => {
        const haystack = [u.name, u.lastName, u.email, u.phoneNumber].join(' ').toLowerCase();
        return (!term || haystack.includes(term)) && (!role || u.roles.includes(role));
    });

    rowsBody.replaceChildren(...visible.map((u) => {
        const isMe = String(u.id) === String(session.sub);
        return el('tr', {}, [
            el('td', {}, [el('div', { class: 'cell-user' }, [
                avatar(u),
                el('div', {}, [
                    el('strong', {}, [fullName(u), isMe ? el('span', { class: 'you', text: 'Tú' }) : null]),
                    el('small', { text: u.email })
                ])
            ])]),
            el('td', {}, [roleChips(u.roles)]),
            el('td', { text: u.age !== null ? `${u.age} años` : '—' }),
            el('td', { text: u.phoneNumber || '—' }),
            el('td', { text: formatDate(u.createdAt, true) }),
            el('td', {}, [el('button', {
                type: 'button', class: 'cbtn cbtn--ghost cbtn--sm',
                'aria-label': `Ver la información de ${fullName(u)}`,
                onclick: () => openUser(u.id)
            }, [icon('visibility'), 'Ver'])])
        ]);
    }));

    empty.hidden = visible.length > 0;
    count.textContent = `${visible.length} de ${users.length} usuarios`;
}

async function openUser(id) {
    document.getElementById('modal-name').textContent = 'Cargando…';
    document.querySelector('[data-modal-email]').textContent = '';
    document.querySelector('[data-modal-facts]').replaceChildren();
    document.querySelector('[data-modal-roles]').replaceChildren();
    modal?.open();
    try {
        const u = await api('/api/users/' + encodeURIComponent(id));
        document.querySelector('[data-modal-avatar]').replaceChildren(avatar(u, 'lg'));
        document.getElementById('modal-name').textContent = fullName(u);
        document.querySelector('[data-modal-email]').textContent = u.email;
        document.querySelector('[data-modal-roles]').replaceChildren(roleChips(u.roles));
        const fact = (label, value) => el('div', {}, [el('dt', { text: label }), el('dd', { text: value || '—' })]);
        document.querySelector('[data-modal-facts]').replaceChildren(
            fact('Teléfono', u.phoneNumber),
            fact('Fecha de nacimiento', u.birthdate ? `${formatDate(u.birthdate)} (${u.age} años)` : ''),
            fact('Dirección', u.address),
            fact('Foto de perfil', u.url_profile),
            fact('Registrado', formatDate(u.createdAt, true)),
            fact('Última actualización', formatDate(u.updatedAt, true)),
            fact('Identificador', String(u.id))
        );
    } catch (err) {
        document.getElementById('modal-name').textContent = 'No se pudo cargar';
        document.querySelector('[data-modal-email]').textContent = err.message;
    }
}

search.addEventListener('input', renderRows);
roleFilter.addEventListener('change', renderRows);

try {
    users = await api('/api/users');
    const me = users.find((u) => String(u.id) === String(session.sub));
    if (me) mountTopbar(session, me);
    renderStats();
    renderRows();
} catch (err) {
    const box = document.querySelector('[data-error]');
    box.replaceChildren(icon('error_outline'), el('div', { text: err.message }));
    box.hidden = false;
    rowsBody.replaceChildren();
}
