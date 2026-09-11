// js/auth.js

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================

/**
 * Registra un nuevo usuario
 */
async function signUp(email, password) {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) throw error;
    return data;
}

/**
 * Inicia sesión con email y contraseña
 */
async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) throw error;
    return data;
}

/**
 * Cierra la sesión del usuario actual
 */
async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
}

/**
 * Obtiene el usuario actual (si hay sesión activa)
 */
async function getCurrentUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) return null;
    return user;
}

/**
 * Protege una página: redirige a login si no hay sesión
 * Redirige a dashboard si SÍ hay sesión (para login/signup)
 */
async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
    }
    return user;
}

async function redirectIfLoggedIn() {
    const user = await getCurrentUser();
    if (user) {
        window.location.href = 'dashboard.html';
    }
}

// ==========================================
// MANEJO DE FORMULARIOS
// ==========================================

/**
 * Muestra un mensaje al usuario
 */
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = `message message-${type}`;
}

/**
 * Configura el formulario de registro
 */
function setupSignupForm() {
    // Si el usuario ya está logueado, redirigir al dashboard
    redirectIfLoggedIn();

    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        // Validaciones
        if (!email || !password) {
            showMessage('Por favor completa todos los campos', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        if (password !== passwordConfirm) {
            showMessage('Las contraseñas no coinciden', 'error');
            return;
        }

        try {
            showMessage('Creando cuenta...', 'info');
            await signUp(email, password);
            showMessage('Cuenta creada. Redirigiendo...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            console.error('Error en signup:', error);
            showMessage(traducirError(error.message), 'error');
        }
    });
}

/**
 * Configura el formulario de login
 */
function setupLoginForm() {
    // Si el usuario ya está logueado, redirigir al dashboard
    redirectIfLoggedIn();

    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showMessage('Por favor completa todos los campos', 'error');
            return;
        }

        try {
            showMessage('Iniciando sesión...', 'info');
            await signIn(email, password);
            showMessage('Sesión iniciada. Redirigiendo...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } catch (error) {
            console.error('Error en login:', error);
            showMessage(traducirError(error.message), 'error');
        }
    });
}

/**
 * Traduce errores comunes de Supabase al español
 */
function traducirError(mensaje) {
    const traducciones = {
        'Invalid login credentials': 'Email o contraseña incorrectos',
        'User already registered': 'Este email ya está registrado',
        'Email not confirmed': 'Debes confirmar tu email antes de iniciar sesión',
        'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
        'Unable to validate email address: invalid format': 'El formato del email no es válido'
    };

    for (const [en, es] of Object.entries(traducciones)) {
        if (mensaje.includes(en)) return es;
    }
    return mensaje;
}
/**
 * Inicializa el dashboard: protege la ruta, muestra el email y configura el logout
 */
async function initDashboard() {
    // 1. Proteger la ruta
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Mostrar email del usuario
    const emailEl = document.getElementById('user-email');
    if (emailEl) {
        emailEl.textContent = user.email;
    }

    // 3. Configurar botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut();
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                alert('Error al cerrar sesión. Intenta de nuevo.');
            }
        });
    }

    // 4. Placeholder para cuando hagamos el CRUD de leads
    const newLeadBtn = document.getElementById('new-lead-btn');
    if (newLeadBtn) {
        newLeadBtn.addEventListener('click', () => {
            alert('Función de crear lead - próximamente');
        });
    }
}