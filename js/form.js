// js/form.js
// ==========================================
// LÓGICA DEL FORMULARIO PÚBLICO
// ==========================================

/**
 * Obtiene el token del formulario desde la URL
 */
function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
}

/**
 * Muestra un error y deshabilita el formulario
 */
function showInvalidTokenError() {
    const form = document.getElementById('public-form');
    if (form) {
        form.innerHTML = `
            <div class="empty-state">
                <p>Este link no es válido.</p>
                <p class="text-muted">Verifica que hayas copiado el link completo o contacta a la persona que te lo compartió.</p>
            </div>
        `;
    }
}

/**
 * Envía el formulario público
 */
async function handlePublicSubmit(e) {
    e.preventDefault();

    const token = getTokenFromUrl();
    if (!token) return;

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const leadData = {
        p_form_token: token,
        p_nombre: document.getElementById('nombre').value.trim(),
        p_apellido: document.getElementById('apellido').value.trim(),
        p_email: document.getElementById('email').value.trim(),
        p_telefono: document.getElementById('telefono').value.trim() || null,
        p_empresa: document.getElementById('empresa').value.trim() || null,
        p_servicio: document.getElementById('servicio').value.trim() || null,
        p_notas: document.getElementById('notas').value.trim() || null
    };

    try {
        const { data, error } = await supabaseClient.rpc('submit_public_lead', leadData);

        if (error) throw error;

        if (!data.success) {
            throw new Error(data.error || 'Error al enviar el formulario');
        }

        // Éxito: reemplazar el formulario por un mensaje de confirmación
        const form = document.getElementById('public-form');
        form.innerHTML = `
            <div class="empty-state">
                <p style="font-size: 1rem; color: var(--color-gray-900); font-weight: 500;">
                    ¡Gracias por contactarnos!
                </p>
                <p>Hemos recibido tu información. Te contactaremos pronto.</p>
            </div>
        `;
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        notify(error.message || 'Error al enviar. Intenta de nuevo.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Inicializa el formulario público
 */
function initPublicForm() {
    const token = getTokenFromUrl();

    if (!token) {
        showInvalidTokenError();
        return;
    }

    const form = document.getElementById('public-form');
    if (form) {
        form.addEventListener('submit', handlePublicSubmit);
    }
}

// Ejecutar al cargar
initPublicForm();