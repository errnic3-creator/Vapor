// config.js
const SUPABASE_URL = 'https://ooudzksyaltbhthfulkw.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vdWR6a3N5YWx0Ymh0aGZ1bGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3OTM0NTEsImV4cCI6MjEwMzM2OTQ1MX0.8vcqCUsh6rDJQgYbnbGmr12RlmSDC9FsoyHUJTAAV64';
// FIX: Use window.supabase or assign to a non-conflicting variable name
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Assign it globally so auth.js, app.js, etc. can access it seamlessly
window.supabase = supabaseClient;
