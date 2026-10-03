// Motor de validación del lado del cliente. Usa las MISMAS reglas que el servidor (/shared/rules.js).
// Tipos de validación que aplica mientras se rellena el formulario:
//  1. Restricciones HTML5 (required, type, minlength, maxlength, min, max) y la API de validación del navegador.
//  2. Reglas propias por campo con setCustomValidity (formato, rangos, caracteres permitidos).
//  3. Validación en vivo (al escribir) y al salir del campo (blur); los errores aparecen solo tras tocar el campo.
//  4. Validación cruzada entre campos (confirmar contraseña; la contraseña no puede contener el nombre ni el correo).
//  5. Validación asíncrona contra el servidor (¿el correo ya está registrado?), con espera y caché.
//  6. Filtro de entrada (el teléfono solo acepta números, espacios, guiones y "+").
//  7. Normalización al salir del campo (espacios repetidos, correo en minúsculas).
//  8. Contadores de caracteres, lista de reglas de la contraseña, medidor de fuerza y aviso de Bloq Mayús.
//  9. Al enviar: revalida todo, resume los errores con enlaces, enfoca el primero y evita el doble envío.
// 10. Muestra junto a cada campo los errores que devuelve el servidor (la validación definitiva).
import { validators, PASSWORD_RULES, birthdateBounds, calcAge, collapseSpaces, normalizeEmail } from '/shared/rules.js';

const ICON = { error: 'error_outline', ok: 'check_circle', info: 'info', warn: 'warning', pending: 'autorenew' };

const LEVELS = ['Muy débil', 'Débil', 'Débil', 'Aceptable', 'Casi lista', 'Fuerte'];

export function createForm(form, { onSubmit, context = () => ({}) } = {}) {
    form.setAttribute('novalidate', ''); // el JS muestra los mensajes; HTML5 sigue definiendo la validez
    const inputs = [...form.querySelectorAll('input, select, textarea')].filter((i) => i.name && i.type !== 'hidden');
    const asyncResults = new Map();   // caché: valor -> mensaje (null = disponible)
    const pending = new Map();        // input -> promesa en curso
    const summary = form.querySelector('[data-summary]');
    const submitBtn = form.querySelector('[type="submit"]');
    let submitted = false;
    let busy = false;

    const wrapOf = (input) => input.closest('.field');
    const msgOf = (input) => document.getElementById(input.id + '-msg');
    const labelOf = (input) => (form.querySelector(`label[for="${input.id}"] .label-text`)?.textContent || input.name).trim();

    function ruleMessage(input) {
        const value = input.value;
        const rule = input.dataset.rule;

        if (input.type === 'checkbox') return input.required && !input.checked ? 'Debes aceptar para continuar' : null;
        if (input.validity.badInput) return 'Escribe una fecha completa';
        if (input.required && !value.trim() && rule !== 'confirm') {
            return validators[rule] ? validators[rule]('') : 'Este campo es obligatorio';
        }

        switch (rule) {
            case 'confirm': {
                const target = form.elements[input.dataset.match];
                if (!value) return 'Repite la contraseña';
                return value === target.value ? null : 'Las contraseñas no coinciden';
            }
            case 'loginPassword':
                return value ? null : 'La contraseña es obligatoria';
            case 'currentPassword':
                return value ? null : 'Escribe tu contraseña actual';
            case 'password': {
                const ctx = context();
                return validators.password(value, {
                    email: ctx.email ?? form.elements.email?.value,
                    name: ctx.name ?? form.elements.name?.value
                });
            }
            default:
                return validators[rule] ? validators[rule](value) : null;
        }
    }

    function render(input, message, state = message ? 'error' : 'ok', okText = '') {
        const wrap = wrapOf(input);
        const msg = msgOf(input);
        const show = submitted || input.dataset.touched === 'true';
        if (!wrap) return;

        wrap.classList.toggle('is-invalid', show && state === 'error');
        wrap.classList.toggle('is-valid', show && state === 'ok' && input.value !== '' && input.type !== 'checkbox');
        wrap.classList.toggle('is-pending', state === 'pending');
        input.setAttribute('aria-invalid', show && state === 'error' ? 'true' : 'false');

        const stateIcon = wrap.querySelector('.state-icon');
        if (stateIcon) stateIcon.textContent = state === 'error' ? ICON.error : state === 'pending' ? ICON.pending : ICON.ok;

        if (!msg) return;
        msg.replaceChildren();
        msg.className = 'field-msg';
        const text = state === 'error' ? message : okText;
        if ((show || state === 'pending' || state === 'warn') && text) {
            msg.classList.add('is-' + (state === 'error' ? 'error' : state === 'pending' ? 'info' : state));
            const i = document.createElement('i');
            i.className = 'material-icons';
            i.setAttribute('aria-hidden', 'true');
            i.textContent = ICON[state] || ICON.info;
            msg.append(i, document.createTextNode(text));
        }
    }

    // Texto de confirmación cuando el campo está bien (por ejemplo, la edad calculada)
    function okTextFor(input) {
        if (input.dataset.rule === 'birthdate' && input.value) {
            const age = calcAge(input.value);
            return age !== null ? `Tienes ${age} años` : '';
        }
        if (input.dataset.rule === 'confirm' && input.value) return 'Las contraseñas coinciden';
        return '';
    }

    function validate(input) {
        if (input.dataset.serverError) { // el error del servidor se borra en cuanto el usuario corrige
            delete input.dataset.serverError;
        }
        const message = ruleMessage(input);
        input.setCustomValidity(message || '');

        if (input.dataset.filtered) { // se quitaron caracteres no permitidos: se avisa sin bloquear
            delete input.dataset.filtered;
            if (!message) return render(input, null, 'warn', 'Solo se permiten números, espacios, guiones y un "+" inicial');
        }

        if (!message && input.dataset.async === 'email') {
            const value = normalizeEmail(input.value);
            if (input.dataset.original && value === input.dataset.original) {
                render(input, null, 'ok');
            } else if (asyncResults.has(value)) {
                const asyncMessage = asyncResults.get(value);
                input.setCustomValidity(asyncMessage || '');
                render(input, asyncMessage, asyncMessage ? 'error' : 'ok', 'Correo disponible');
            } else {
                render(input, null, 'pending', 'Comprobando si el correo está libre…');
                scheduleEmailCheck(input, value);
            }
            return;
        }
        render(input, message, message ? 'error' : 'ok', okTextFor(input));
    }

    let emailTimer;
    function scheduleEmailCheck(input, value, immediate = false) {
        clearTimeout(emailTimer);
        const run = () => {
            const promise = fetch('/api/auth/email-available', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: value })
            })
                .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
                .then(({ ok, data }) => {
                    const message = ok ? (data.available ? null : 'Este correo ya está registrado') : (data.errors?.email || data.message);
                    asyncResults.set(value, message);
                })
                .catch(() => asyncResults.set(value, null)) // sin conexión: decide el servidor al enviar
                .finally(() => {
                    pending.delete(input);
                    if (normalizeEmail(input.value) === value) validate(input);
                });
            pending.set(input, promise);
        };
        if (immediate) run(); else emailTimer = setTimeout(run, 450);
    }

    /* ---------- Contraseña: reglas, fuerza, Bloq Mayús y mostrar/ocultar ---------- */
    function setupPasswordTools(input) {
        const box = form.querySelector(`[data-password-box="${input.id}"]`);
        if (box) {
            const meter = box.querySelector('.meter');
            const label = box.querySelector('.meter-label strong');
            const list = box.querySelector('.checklist');
            const items = PASSWORD_RULES.map((rule) => {
                const icon = document.createElement('i');
                icon.className = 'material-icons';
                icon.setAttribute('aria-hidden', 'true');
                const status = document.createElement('span');
                status.className = 'sr-only';
                const li = document.createElement('li');
                li.append(icon, document.createTextNode(rule.label), status);
                list.append(li);
                return { rule, li, icon, status };
            });
            const update = () => {
                let met = 0;
                for (const item of items) {
                    const ok = item.rule.test(input.value);
                    if (ok) met += 1;
                    item.li.classList.toggle('is-met', ok);
                    item.icon.textContent = ok ? 'check_circle' : 'radio_button_unchecked';
                    item.status.textContent = ok ? ' (cumplida)' : ' (pendiente)';
                }
                meter.dataset.level = String(input.value ? met : 0);
                label.textContent = input.value ? LEVELS[met] : '—';
            };
            input.addEventListener('input', update);
            update();
        }

        const caps = form.querySelector(`[data-caps-for="${input.id}"]`);
        if (caps) {
            const check = (e) => caps.classList.toggle('is-on', !!e.getModifierState && e.getModifierState('CapsLock'));
            input.addEventListener('keydown', check);
            input.addEventListener('keyup', check);
            input.addEventListener('blur', () => caps.classList.remove('is-on'));
        }
    }

    form.querySelectorAll('[data-toggle-password]').forEach((btn) => {
        const input = document.getElementById(btn.dataset.togglePassword);
        btn.addEventListener('click', () => {
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            btn.setAttribute('aria-pressed', String(show));
            btn.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
            btn.querySelector('i').textContent = show ? 'visibility_off' : 'visibility';
        });
    });

    /* ---------- Preparar cada campo ---------- */
    for (const input of inputs) {
        if (input.dataset.rule === 'birthdate') {
            const { min, max } = birthdateBounds();
            input.min = min;
            input.max = max;
        }

        if (input.dataset.filter === 'phone') {
            input.addEventListener('input', () => {
                const cleaned = input.value.replace(/[^0-9+\s-]/g, '').replace(/(?!^)\+/g, '');
                if (cleaned !== input.value) {
                    input.value = cleaned;
                    input.dataset.filtered = 'true';
                }
            });
        }

        const counter = document.getElementById(input.id + '-count');
        if (counter && input.maxLength > 0) {
            const updateCounter = () => {
                counter.textContent = `${input.value.length}/${input.maxLength}`;
                counter.classList.toggle('is-near', input.value.length >= input.maxLength * 0.9);
            };
            input.addEventListener('input', updateCounter);
            updateCounter();
        }

        if (input.dataset.rule === 'password') setupPasswordTools(input);

        const evt = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';
        input.addEventListener(evt, () => {
            validate(input);
            // Validación cruzada: si cambia la contraseña, se revisa otra vez la confirmación
            form.querySelectorAll(`[data-match="${input.name}"]`).forEach((c) => { if (c.value) validate(c); });
            if (input.name === 'email' || input.name === 'name') {
                const pass = form.querySelector('[data-rule="password"]');
                if (pass && pass.value) validate(pass);
            }
        });

        input.addEventListener('blur', () => {
            if (input.dataset.normalize === 'spaces' && input.value) input.value = collapseSpaces(input.value);
            if (input.dataset.normalize === 'email' && input.value) input.value = normalizeEmail(input.value);
            input.dataset.touched = 'true';
            validate(input);
            if (input.dataset.async === 'email' && !ruleMessage(input) && pending.has(input) === false) {
                const value = normalizeEmail(input.value);
                if (!asyncResults.has(value) && value !== input.dataset.original) scheduleEmailCheck(input, value, true);
            }
        });
    }

    /* ---------- Resumen de errores y envío ---------- */
    function showSummary(items, title = 'Revisa los campos marcados') {
        if (!summary) return;
        summary.replaceChildren();
        summary.className = 'alert alert--error';
        summary.hidden = false;
        const i = document.createElement('i');
        i.className = 'material-icons';
        i.setAttribute('aria-hidden', 'true');
        i.textContent = 'error_outline';
        const body = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = title;
        body.append(strong);
        if (items.length) {
            const ul = document.createElement('ul');
            for (const item of items) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#' + item.id;
                a.textContent = `${item.label}: ${item.message}`;
                a.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(item.id)?.focus(); });
                li.append(a);
                ul.append(li);
            }
            body.append(ul);
        }
        summary.append(i, body);
    }

    function hideSummary() { if (summary) summary.hidden = true; }

    function setBusy(state, text = 'Enviando…') {
        busy = state;
        if (!submitBtn) return;
        if (state) {
            submitBtn.dataset.label = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
            submitBtn.replaceChildren(Object.assign(document.createElement('span'), { className: 'spinner' }), document.createTextNode(text));
        } else {
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            if (submitBtn.dataset.label) submitBtn.innerHTML = submitBtn.dataset.label;
        }
    }

    function applyServerErrors(errors = {}) {
        const items = [];
        for (const [field, message] of Object.entries(errors)) {
            const input = form.elements[field];
            if (!input || !input.id) { items.push({ id: '', label: field, message }); continue; }
            input.dataset.touched = 'true';
            input.dataset.serverError = 'true';
            input.setCustomValidity(message);
            render(input, message, 'error');
            items.push({ id: input.id, label: labelOf(input), message });
        }
        return items;
    }

    function values() {
        const data = {};
        for (const input of inputs) {
            if (input.dataset.rule === 'confirm' || input.type === 'checkbox' || input.dataset.skip === 'true') continue;
            // Las contraseñas se envían tal cual: recortarlas cambiaría la clave
            const isSecret = ['password', 'loginPassword', 'currentPassword'].includes(input.dataset.rule);
            data[input.name] = isSecret ? input.value : input.value.trim();
        }
        return data;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (busy) return; // evita el doble envío
        submitted = true;
        inputs.forEach(validate);

        // Si hay una comprobación del correo pendiente, se espera su resultado
        const emailInput = inputs.find((i) => i.dataset.async === 'email');
        if (emailInput && !ruleMessage(emailInput)) {
            const value = normalizeEmail(emailInput.value);
            if (value !== emailInput.dataset.original && !asyncResults.has(value) && !pending.has(emailInput)) {
                clearTimeout(emailTimer);
                scheduleEmailCheck(emailInput, value, true);
            }
            if (pending.has(emailInput)) {
                setBusy(true, 'Comprobando…');
                await pending.get(emailInput);
                setBusy(false);
            }
        }

        const invalid = inputs.filter((i) => !i.checkValidity());
        if (invalid.length) {
            showSummary(invalid.map((i) => ({ id: i.id, label: labelOf(i), message: i.validationMessage })));
            invalid[0].focus();
            return;
        }

        hideSummary();
        setBusy(true);
        try {
            await onSubmit(values(), controller);
        } catch (err) {
            if (err.errors) {
                const items = applyServerErrors(err.errors);
                showSummary(items, err.message || 'Revisa los campos marcados');
                const first = Object.keys(err.errors).map((f) => form.elements[f]).find((x) => x && x.focus);
                first?.focus();
            } else {
                showSummary([], err.message || 'Ocurrió un error');
            }
        } finally {
            setBusy(false);
        }
    });

    const controller = {
        form,
        showSummary,
        hideSummary,
        applyServerErrors,
        // Rellena el formulario con datos existentes (perfil) sin marcar errores
        fill(data) {
            for (const input of inputs) {
                if (data[input.name] !== undefined && input.type !== 'password' && input.type !== 'checkbox') {
                    input.value = data[input.name] ?? '';
                    input.dispatchEvent(new Event('input'));
                }
            }
            submitted = false;
            inputs.forEach((i) => { delete i.dataset.touched; render(i, null, 'idle'); });
        },
        reset() {
            form.reset();
            submitted = false;
            inputs.forEach((i) => {
                delete i.dataset.touched;
                i.dispatchEvent(new Event('input')); // actualiza contadores y la lista de reglas
                render(i, null, 'idle');
            });
            hideSummary();
        }
    };
    return controller;
}
