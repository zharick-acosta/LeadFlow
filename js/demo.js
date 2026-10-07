// js/demo.js
// ==========================================
// MODO DEMO - Datos ficticios y lógica de solo lectura
// ==========================================

// ==========================================
// DATOS FICTICIOS
// ==========================================

const DEMO_LEADS = [
    {
        id: 'demo-001-a1b2c3d4',
        nombre: 'María',
        apellido: 'Cruz',
        email: 'maria.cruz@creativedesign.co',
        telefono: '304123-4555',
        empresa: 'Creative Design SAS',
        servicio: 'Campaña de marketing',
        estado: 'Nuevo',
        notas: 'María desea una campaña para sus nuevos paquetes de Canva.',
        proximo_paso: 'Ajustar avance de la campaña pagada',
        fecha_contrato: '2026-09-07',
        fecha_creacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // hace 2h
    },
    {
        id: 'demo-002-e5f6g7h8',
        nombre: 'Carlos',
        apellido: 'Ruiz',
        email: 'carlos.ruiz@correo.com',
        telefono: '310555-1234',
        empresa: 'Tech Solutions',
        servicio: 'Google ADS',
        estado: 'Perdido',
        notas: 'Interesado pero sin presupuesto por ahora.',
        proximo_paso: 'Devolución de propuesta',
        fecha_contrato: null,
        fecha_creacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // hace 5 días
    },
    {
        id: 'demo-003-i9j0k1l2',
        nombre: 'Ana',
        apellido: 'Torres',
        email: 'ana.torres@redessociales.com',
        telefono: '320444-7788',
        empresa: 'Redes & Co',
        servicio: 'Redes sociales',
        estado: 'Pendiente',
        notas: 'Necesita estrategia de contenido para Instagram y TikTok.',
        proximo_paso: 'Llamada pendiente el jueves',
        fecha_contrato: null,
        fecha_creacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'demo-004-m3n4o5p6',
        nombre: 'Diego',
        apellido: 'Martínez',
        email: 'diego@agenciacreativa.com',
        telefono: '315666-9900',
        empresa: 'Agencia Creativa',
        servicio: 'Diseño de marca',
        estado: 'En negociación',
        notas: 'Quiere rediseño completo de identidad visual. Presupuesto aprox $3M.',
        proximo_paso: 'Enviar propuesta formal',
        fecha_contrato: null,
        fecha_creacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'demo-005-q7r8s9t0',
        nombre: 'Laura',
        apellido: 'Gómez',
        email: 'laura.gomez@startup.co',
        telefono: '300111-2233',
        empresa: 'Startup Lab',
        servicio: 'Landing page',
        estado: 'Ganado',
        notas: 'Proyecto cerrado. Se inicia la próxima semana.',
        proximo_paso: 'Kickoff del proyecto',
        fecha_contrato: '2026-09-15',
        fecha_creacion: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // hace 6h
    },
    {
        id: 'demo-006-u1v2w3x4',
        nombre: 'Roberto',
        apellido: 'Silva',
        email: 'roberto.silva@email.com',
        telefono: '301222-3344',
        empresa: 'Silva Consulting',
        servicio: 'Consultoría SEO',
        estado: 'Nuevo',
        notas: 'Llegó por el formulario público. Necesita auditoría SEO.',
        proximo_paso: 'Contactar en 24h',
        fecha_contrato: null,
        fecha_creacion: new Date(Date.now() - 30 * 60 * 1000).toISOString() // hace 30 min
    }
];

// Estado en memoria (no se persiste nada)
let demoLeads = [...DEMO_LEADS];
let currentEditId = null;
let estadoChartInstance = null;

// ==========================================
// INICIALIZACIÓN
// ==========================================

function initDemo() {
    // Configurar botones que SÍ funcionan (ver leads, KPIs, compartir)
    document.getElementById('new-lead-btn')?.addEventListener('click', () => {
        openLeadModal();
    });

    document.getElementById('close-modal-btn')?.addEventListener('click', closeLeadModal);

    // Al hacer submit o eliminar → notificación en lugar de acción
    document.getElementById('lead-form')?.addEventListener('submit', handleDemoSubmit);
    document.getElementById('delete-lead-btn')?.addEventListener('click', handleDemoDelete);

    // Botón de compartir SÍ funciona (solo muestra el link)
    document.getElementById('share-form-btn')?.addEventListener('click', openShareModal);
    document.getElementById('close-share-modal-btn')?.addEventListener('click', closeShareModal);
    document.getElementById('copy-url-btn')?.addEventListener('click', copyShareUrl);

    // Botón de actualizar analytics
    document.getElementById('refresh-analytics-btn')?.addEventListener('click', () => {
        loadAnalytics();
        notify('Estadísticas actualizadas', 'success', 2000);
    });

    // Cargar todo
    loadAnalytics();
    loadLeads();
}

// ==========================================
// ANALYTICS
// ==========================================

function loadAnalytics() {
    const total = demoLeads.length;
    const hoy = demoLeads.filter(lead => {
        const fecha = new Date(lead.fecha_creacion);
        const hoy = new Date();
        return fecha.toDateString() === hoy.toDateString();
    }).length;
    const ganados = demoLeads.filter(l => l.estado === 'Ganado').length;
    const tasa = total > 0 ? Math.round((ganados / total) * 100) : 0;

    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-hoy').textContent = hoy;
    document.getElementById('kpi-ganados').textContent = ganados;
    document.getElementById('kpi-conversion').textContent = tasa + '%';

    // Conteo por estado
    const porEstado = {};
    demoLeads.forEach(lead => {
        porEstado[lead.estado] = (porEstado[lead.estado] || 0) + 1;
    });

    renderEstadoChart(porEstado);
}

function renderEstadoChart(porEstado) {
    const canvas = document.getElementById('estado-chart');
    if (!canvas) return;

    const estados = ['Nuevo', 'Pendiente', 'En negociación', 'Ganado', 'Perdido'];
    const values = estados.map(e => porEstado[e] || 0);
    const colores = ['#f3f4f6', '#d1d5db', '#6b7280', '#111827', '#e5e7eb'];
    const bordes = ['#9ca3af', '#9ca3af', '#374151', '#000000', '#9ca3af'];

    const chartData = {
        labels: estados,
        datasets: [{
            data: values,
            backgroundColor: colores,
            borderColor: bordes,
            borderWidth: 1
        }]
    };

    if (estadoChartInstance) {
        estadoChartInstance.data = chartData;
        estadoChartInstance.update();
        return;
    }

    const ctx = canvas.getContext('2d');
    estadoChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#374151', font: { size: 12 }, padding: 12 }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const valor = context.parsed;
                            const porcentaje = total > 0 ? Math.round((valor / total) * 100) : 0;
                            return `${context.label}: ${valor} (${porcentaje}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ==========================================
// LISTA DE LEADS
// ==========================================

function loadLeads() {
    const container = document.getElementById('leads-container');
    if (!container) return;

    if (demoLeads.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No hay leads en la demo.</p>
            </div>
        `;
        return;
    }

    const rows = demoLeads.map(lead => `
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
            <tbody>${rows}</tbody>
        </table>
    `;

    document.querySelectorAll('.lead-row').forEach(row => {
        row.addEventListener('click', () => openLeadModal(row.dataset.id));
    });
}

// ==========================================
// MODAL DE LEAD
// ==========================================

function openLeadModal(leadId = null) {
    const modal = document.getElementById('lead-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('lead-form');
    const deleteBtn = document.getElementById('delete-lead-btn');

    if (!modal || !form) return;

    form.reset();
    currentEditId = leadId;

    if (leadId) {
        modalTitle.textContent = 'Editar Lead';
        deleteBtn.style.display = 'inline-block';

        const lead = demoLeads.find(l => l.id === leadId);
        if (lead) fillLeadForm(lead);
    } else {
        modalTitle.textContent = 'Nuevo Lead';
        deleteBtn.style.display = 'none';
    }

    modal.classList.add('modal-open');
}

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

function closeLeadModal() {
    const modal = document.getElementById('lead-modal');
    if (modal) modal.classList.remove('modal-open');
    currentEditId = null;
}

// ==========================================
// ACCIONES BLOQUEADAS (notificación en su lugar)
// ==========================================

function handleDemoSubmit(e) {
    e.preventDefault();
    notify('🔒 Crea una cuenta para guardar tus leads. Es gratis.', 'info', 5000);
    closeLeadModal();

    // Opcional: llevar al usuario a signup después de un tiempo
    setTimeout(() => {
        // Solo sugerimos, no redirigimos automáticamente
    }, 5000);
}

function handleDemoDelete() {
    notify('🔒 Crea una cuenta para eliminar leads. Es gratis.', 'info', 5000);
    closeLeadModal();
}

// ==========================================
// COMPARTIR FORMULARIO (sí funciona en demo)
// ==========================================

function openShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) modal.classList.add('modal-open');
}

function closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) modal.classList.remove('modal-open');
}

async function copyShareUrl() {
    const input = document.getElementById('share-url-input');
    if (!input || !input.value) return;

    try {
        await navigator.clipboard.writeText(input.value);
        notify('Link copiado al portapapeles', 'success');
    } catch (error) {
        input.select();
        document.execCommand('copy');
        notify('Link copiado al portapapeles', 'success');
    }
}

// ==========================================
// UTILIDADES (duplicadas de dashboard.js porque el demo es autónomo)
// ==========================================

function formatLeadId(uuid) {
    return '#' + uuid.substring(5, 11).toUpperCase();
}

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

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}