// js/dashboard.js
// ==========================================
// LÓGICA DE UI DEL DASHBOARD
// ==========================================

let currentEditId = null; // null = modo crear, string = modo editar

/**
 * Inicializa el dashboard completo
 */
async function initDashboard() {
    // 1. Proteger la ruta
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Mostrar email
    const emailEl = document.getElementById('user-email');
    if (emailEl) emailEl.textContent = user.email;

    // 3. Configurar logout
    setupLogout();

    // 4. Configurar botón "Nuevo Lead"
    document.getElementById('new-lead-btn')?.addEventListener('click', () => {
        openLeadModal();
    });

    // 5. Configurar botón de cerrar modal
    document.getElementById('close-modal-btn')?.addEventListener('click', closeLeadModal);

    // 6. Configurar formulario del modal
    document.getElementById('lead-form')?.addEventListener('submit', handleLeadSubmit);

    // 7. Configurar botón eliminar
    document.getElementById('delete-lead-btn')?.addEventListener('click', handleLeadDelete);

    // 8. Cargar leads
    await loadLeads();
}

/**
 * Configura el botón de logout
 */
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            notify('Error al cerrar sesión. Intenta de nuevo.', 'error');
        }
    });
}

/**
 * Carga y renderiza los leads del usuario
 */
async function loadLeads() {
    const container = document.getElementById('leads-container');
    if (!container) return;

    try {
        const leads = await getLeads();
        renderLeads(leads);
    } catch (error) {
        console.error('Error al cargar leads:', error);
        container.innerHTML = `
            <div class="empty-state">
                <p>Error al cargar los leads.</p>
                <p class="text-muted">Recarga la página o intenta de nuevo.</p>
            </div>
        `;
    }
}

/**
 * Renderiza la lista de leads en una tabla
 */
function renderLeads(leads) {
    const container = document.getElementById('leads-container');
    if (!container) return;

    if (leads.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Aún no tienes leads registrados.</p>
                <p class="text-muted">Crea tu primer lead para empezar a usar LeadsFlow.</p>
            </div>
        `;
        return;
    }

    const rows = leads.map(lead => `
        <tr class="lead-row" data-id="${lead.id}">
            <td class="lead-id">${formatLeadId(lead.id)}</td>
            <td class="lead-name">${escapeHtml(lead.nombre)} ${escapeHtml(lead.apellido)}</td>
            <td><span class="badge badge-${estadoToClass(lead.estado)}">${escapeHtml(lead.estado)}</span></td>
            <td>${escapeHtml(lead.servicio || '—')}</td>
            <td>${escapeHtml(lead.proximo_paso || '—')}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <table class="leads-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Lead</th>
                    <th>Estado</th>
                    <th>Servicio</th>
                    <th>Próximo paso</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;

    // Event listeners en cada fila
    document.querySelectorAll('.lead-row').forEach(row => {
        row.addEventListener('click', () => {
            openLeadModal(row.dataset.id);
        });
    });
}

/**
 * Abre el modal. Sin id = crear. Con id = ver/editar.
 */
async function openLeadModal(leadId = null) {
    const modal = document.getElementById('lead-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('lead-form');
    const deleteBtn = document.getElementById('delete-lead-btn');

    if (!modal || !form) return;

    form.reset();
    currentEditId = leadId;

    if (leadId) {
        // Modo edición
        modalTitle.textContent = 'Editar Lead';
        deleteBtn.style.display = 'inline-block';

        try {
            const lead = await getLeadById(leadId);
            fillLeadForm(lead);
        } catch (error) {
            console.error('Error al cargar lead:', error);
            notify('No se pudo cargar el lead.', 'error');
            return;
        }
    } else {
        // Modo creación
        modalTitle.textContent = 'Nuevo Lead';
        deleteBtn.style.display = 'none';
    }

    modal.classList.add('modal-open');
}

/**
 * Rellena el formulario con los datos del lead
 */
function fillLeadForm(lead) {
    document.getElementById('field-nombre').value = lead.nombre || '';
    document.getElementById('field-apellido').value = lead.apellido || '';
    document.getElementById('field-email').value = lead.email || '';
    document.getElementById('field-telefono').value = lead.telefono || '';
    document.getElementById('field-empresa').value = lead.empresa || '';
    document.getElementById('field-servicio').value = lead.servicio || '';
    document.getElementById('field-estado').value = lead.estado || 'Nuevo';
    document.getElementById('field-notas').value = lead.notas || '';
    document.getElementById('field-proximo-paso').value = lead.proximo_paso || '';
    document.getElementById('field-fecha-contrato').value = lead.fecha_contrato || '';
}

/**
 * Cierra el modal
 */
function closeLeadModal() {
    const modal = document.getElementById('lead-modal');
    if (modal) modal.classList.remove('modal-open');
    currentEditId = null;
}

/**
 * Recoge los datos del formulario
 */
function getFormData() {
    return {
        nombre: document.getElementById('field-nombre').value.trim(),
        apellido: document.getElementById('field-apellido').value.trim(),
        email: document.getElementById('field-email').value.trim() || null,
        telefono: document.getElementById('field-telefono').value.trim() || null,
        empresa: document.getElementById('field-empresa').value.trim() || null,
        servicio: document.getElementById('field-servicio').value.trim() || null,
        estado: document.getElementById('field-estado').value,
        notas: document.getElementById('field-notas').value.trim() || null,
        proximo_paso: document.getElementById('field-proximo-paso').value.trim() || null,
        fecha_contrato: document.getElementById('field-fecha-contrato').value || null
    };
}

/**
 * Maneja el submit del formulario (crear o actualizar)
 */
async function handleLeadSubmit(e) {
    e.preventDefault();

    const data = getFormData();

    if (!data.nombre || !data.apellido) {
        notify('Nombre y apellido son obligatorios', 'error');
return;
        return;
    }

    try {
               if (currentEditId) {
            await updateLead(currentEditId, data);
            notify('Lead actualizado correctamente', 'success');
        } else {
            await createLead(data);
            notify('Lead creado correctamente', 'success');
        }
        closeLeadModal();
        await loadLeads();
    } catch (error) {
        console.error('Error al guardar lead:', error);
       notify('Error al guardar el lead: ' + error.message, 'error');
    }
}

/**
 * Maneja el eliminar lead
 */
async function handleLeadDelete() {
    if (!currentEditId) return;

    if (!confirm('¿Estás seguro de que quieres eliminar este lead?')) return;

    try {
               await deleteLead(currentEditId);
        notify('Lead eliminado correctamente', 'success');
        closeLeadModal();
        await loadLeads();
    } catch (error) {
        console.error('Error al eliminar lead:', error);
        notify('Error al eliminar el lead: ' + error.message, 'error');
    }
}

/**
 * Convierte el estado a una clase CSS
 */
function estadoToClass(estado) {
    const map = {
        'Nuevo': 'nuevo',
        'Pendiente': 'pendiente',
        'En negociación': 'negociacion',
        'Ganado': 'ganado',
        'Perdido': 'perdido'
    };
    return map[estado] || 'nuevo';
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}