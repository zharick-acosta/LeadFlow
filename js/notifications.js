// js/notifications.js
// ==========================================
// SISTEMA DE NOTIFICACIONES
// ==========================================

/**
 * Muestra una notificación en pantalla
 * @param {string} message - Mensaje a mostrar
 * @param {'success' | 'error' | 'info'} type - Tipo de notificación
 * @param {number} duration - Duración en ms (0 = no auto-cerrar)
 */
function notify(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notifications-container');
    if (!container) {
        console.warn('No hay contenedor de notificaciones');
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">${escapeHtml(message)}</div>
        <button class="notification-close" type="button" aria-label="Cerrar">×</button>
    `;

    container.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => closeNotification(notification));

    if (duration > 0) {
        setTimeout(() => closeNotification(notification), duration);
    }
}

/**
 * Cierra una notificación con animación
 */
function closeNotification(notification) {
    if (!notification.parentNode) return;
    notification.classList.add('closing');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 200);
}