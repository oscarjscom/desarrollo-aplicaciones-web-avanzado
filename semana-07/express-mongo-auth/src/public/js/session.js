// Sesión del navegador: el token JWT se guarda en sessionStorage, como pide la tarea.
// Ojo: leer el token aquí solo sirve para la experiencia (redirigir, mostrar el nombre).
// Quien de verdad comprueba la firma y los roles es el servidor, en cada petición a la API.

export const TOKEN_KEY = 'custodia.token';
const NAME_KEY = 'custodia.displayName';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export function decodeToken(token) {
    try {
        const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const bytes = Uint8Array.from(atob(part), (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
        return null;
    }
}

// Devuelve la sesión activa, o null si no hay token o ya expiró.
export function getSession() {
    const token = getToken();
    const payload = token && decodeToken(token);
    if (!payload || !payload.exp || payload.exp * 1000 <= Date.now()) return null;
    return { token, ...payload, roles: payload.roles || [] };
}

export function startSession(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(NAME_KEY);
}

export function logout(reason = 'logout') {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(NAME_KEY);
    location.replace('/signIn?reason=' + encodeURIComponent(reason));
}

export const isAdmin = (session) => session.roles.includes('admin');
export const homeFor = (session) => (isAdmin(session) ? '/admin' : '/dashboard');

// Cierra la sesión automáticamente en el momento exacto en que vence el token.
export function watchExpiry(session) {
    const check = () => { if (!getSession()) logout('expired'); };
    setTimeout(check, Math.max(0, session.exp * 1000 - Date.now()) + 250);
    // Si la pestaña estuvo suspendida, al volver se revisa de nuevo
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
}

// Llamadas a la API con el token. 401 cierra la sesión y 403 lleva a "Acceso denegado".
export async function api(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
        const session = getSession();
        if (!session) { logout('expired'); throw new Error('Sesión expirada'); }
        headers.Authorization = 'Bearer ' + session.token;
    }

    let res;
    try {
        res = await fetch(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch {
        throw Object.assign(new Error('No se pudo conectar con el servidor. Revisa que esté encendido.'), { status: 0 });
    }

    const data = await res.json().catch(() => ({}));
    if (auth && res.status === 401) { logout('expired'); throw new Error(data.message || 'Sesión expirada'); }
    if (auth && res.status === 403) { location.replace('/403'); throw new Error(data.message || 'Acceso denegado'); }
    if (!res.ok) throw Object.assign(new Error(data.message || 'Ocurrió un error'), { status: res.status, errors: data.errors });
    return data;
}

/* ---------- Ayudas de interfaz (todo con textContent: nunca se inserta HTML de usuario) ---------- */

export function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === 'class') node.className = value;
        else if (key === 'text') node.textContent = value;
        else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
        else node.setAttribute(key, value === true ? '' : value);
    }
    for (const child of [].concat(children)) {
        if (child === null || child === undefined || child === false) continue;
        node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
}

export const icon = (name) => el('i', { class: 'material-icons', 'aria-hidden': 'true', text: name });

export const initialsOf = (user) =>
    (`${(user.name || '?')[0] || ''}${(user.lastName || '')[0] || ''}`).toUpperCase() || '?';

// Avatar con la foto de perfil; si no hay o no carga, muestra las iniciales.
export function avatar(user, size = '') {
    const box = el('span', { class: 'avatar' + (size ? ' avatar--' + size : ''), 'aria-hidden': 'true', text: initialsOf(user) });
    if (user.url_profile) {
        const img = el('img', { src: user.url_profile, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' });
        img.addEventListener('error', () => img.remove());
        box.append(img);
    }
    return box;
}

export function roleChips(roles) {
    return el('div', { class: 'role-list' }, roles.map((r) =>
        el('span', { class: 'role' + (r === 'admin' ? ' role--admin' : '') }, [icon(r === 'admin' ? 'shield' : 'person'), r])));
}

export const formatDate = (value, withTime = false) => {
    if (!value) return '—';
    const options = withTime
        ? { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { day: 'numeric', month: 'long', year: 'numeric' };
    // Las fechas "AAAA-MM-DD" se leen en UTC para que no se corran un día
    const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value + 'T00:00:00Z') : new Date(value);
    return date.toLocaleDateString('es-PE', { ...options, timeZone: /^\d{4}-\d{2}-\d{2}$/.test(value) ? 'UTC' : undefined });
};

export const fullName = (user) => [user.name, user.lastName].filter(Boolean).join(' ') || user.email;

// Barra superior: nombre del usuario, enlaces según su rol y botón de cerrar sesión.
// Recibe opcionalmente el usuario cargado de la API para mostrar su nombre e iniciales actuales.
export function mountTopbar(session, user) {
    if (user) sessionStorage.setItem(NAME_KEY, JSON.stringify({ name: user.name, lastName: user.lastName, url_profile: user.url_profile }));
    let stored = null;
    try { stored = JSON.parse(sessionStorage.getItem(NAME_KEY)); } catch { stored = null; }
    const person = stored?.name ? stored : { name: session.name || 'Usuario', lastName: '' };
    const who = document.querySelector('[data-session-name]');
    const role = document.querySelector('[data-session-role]');
    const av = document.querySelector('[data-session-avatar]');
    if (who) who.textContent = person.name;
    if (role) role.textContent = isAdmin(session) ? 'Administrador' : 'Usuario';
    if (av) {
        const next = avatar(person);
        next.setAttribute('data-session-avatar', '');
        av.replaceWith(next);
    }
    document.querySelectorAll('[data-admin-only]').forEach((node) => { node.hidden = !isAdmin(session); });
    const exit = document.querySelector('[data-logout]');
    if (exit && !exit.dataset.bound) {
        exit.dataset.bound = '1';
        exit.addEventListener('click', () => logout('logout'));
    }
}

export function toast(message) {
    if (window.M && M.toast) M.toast({ html: el('span', { text: message }).outerHTML, displayLength: 3500 });
}
