// js/config.js
// Configuración de Supabase - REEMPLAZA con tus credenciales
const SUPABASE_URL = 'https://drtwsxuokmrlljdyzxqe.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRydHdzeHVva21ybGxqZHl6eHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4OTkxNzYsImV4cCI6MjEwNDQ3NTE3Nn0.GujFVlMo6hrRUwvlRLJUkyWqlM9wLLaN3ZF-dDTDjZ0';

// Inicializar cliente de Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
