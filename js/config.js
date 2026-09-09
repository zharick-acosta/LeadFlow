// js/config.js
// Configuración de Supabase - REEMPLAZA con tus credenciales
const SUPABASE_URL = 'TU_PROJECT_URL_AQUI';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI';

// Inicializar cliente de Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
