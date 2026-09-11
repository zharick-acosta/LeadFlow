// js/leads.js
// ==========================================
// CRUD DE LEADS
// ==========================================

/**
 * Obtiene todos los leads del usuario actual, ordenados por fecha de creación
 */
async function getLeads() {
    const { data, error } = await supabaseClient
        .from('leads')
        .select('*')
        .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * Obtiene un lead por su ID
 */
async function getLeadById(id) {
    const { data, error } = await supabaseClient
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Crea un nuevo lead para el usuario actual
 */
async function createLead(leadData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('No hay sesión activa');

    const { data, error } = await supabaseClient
        .from('leads')
        .insert([{ ...leadData, user_id: user.id }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Actualiza un lead existente
 * Nota: RLS garantiza que solo se pueda actualizar si es del usuario
 */
async function updateLead(id, leadData) {
    const { data, error } = await supabaseClient
        .from('leads')
        .update({
            ...leadData,
            fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Elimina un lead
 * Nota: RLS garantiza que solo se pueda eliminar si es del usuario
 */
async function deleteLead(id) {
    const { error } = await supabaseClient
        .from('leads')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

/**
 * Convierte un UUID a un ID visual corto. Ej: #A3F5E8
 */
function formatLeadId(uuid) {
    return '#' + uuid.substring(0, 6).toUpperCase();
}