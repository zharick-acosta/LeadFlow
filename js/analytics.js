// js/analytics.js
// ==========================================
// ANALYTICS DEL DASHBOARD
// ==========================================

let estadoChartInstance = null;

/**
 * Obtiene la zona horaria del navegador
 */
function getTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Bogota';
}

/**
 * Carga y renderiza los analytics
 */
async function loadAnalytics() {
    try {
        const { data, error } = await supabaseClient.rpc('get_analytics', {
            p_timezone: getTimezone()
        });

        if (error) throw error;
        if (!data.success) throw new Error(data.error || 'Error al cargar analytics');

        renderKpis(data);
        renderEstadoChart(data.por_estado);
    } catch (error) {
        console.error('Error en analytics:', error);
        notify('No se pudieron cargar las estadísticas.', 'error');
    }
}

/**
 * Renderiza las tarjetas KPI
 */
function renderKpis(data) {
    document.getElementById('kpi-total').textContent = data.total ?? 0;
    document.getElementById('kpi-hoy').textContent = data.hoy ?? 0;
    document.getElementById('kpi-ganados').textContent = data.ganados ?? 0;

    const tasa = data.total > 0
        ? Math.round((data.ganados / data.total) * 100)
        : 0;
    document.getElementById('kpi-conversion').textContent = tasa + '%';
}

/**
 * Renderiza el gráfico de dona por estado
 */
function renderEstadoChart(porEstado) {
    const canvas = document.getElementById('estado-chart');
    if (!canvas) return;

    // Estados posibles, en orden lógico
    const estados = ['Nuevo', 'Pendiente', 'En negociación', 'Ganado', 'Perdido'];
    const labels = estados;
    const values = estados.map(e => porEstado[e] || 0);

    // Escala de grises según el orden (más oscuro = más "avanzado")
    const colores = [
        '#f3f4f6', // Nuevo (gris muy claro)
        '#d1d5db', // Pendiente (gris claro)
        '#6b7280', // En negociación (gris medio)
        '#111827', // Ganado (casi negro)
        '#e5e7eb'  // Perdido (gris muy claro distinto)
    ];
    const bordes = [
        '#9ca3af',
        '#9ca3af',
        '#374151',
        '#000000',
        '#9ca3af'
    ];

    const chartData = {
        labels: labels,
        datasets: [{
            data: values,
            backgroundColor: colores,
            borderColor: bordes,
            borderWidth: 1
        }]
    };

    // Si ya existe, solo actualizar datos (evita parpadeos)
    if (estadoChartInstance) {
        estadoChartInstance.data = chartData;
        estadoChartInstance.update();
        return;
    }

    // Primera vez: crear el chart
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
                    labels: {
                        color: '#374151',
                        font: { size: 12 },
                        padding: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const valor = context.parsed;
                            const porcentaje = total > 0
                                ? Math.round((valor / total) * 100)
                                : 0;
                            return `${context.label}: ${valor} (${porcentaje}%)`;
                        }
                    }
                }
            }
        }
    });
}