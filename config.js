// config.js
const SUPABASE_URL = 'https://supabase.com/dashboard/project/ooudzksyaltbhthfulkw';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vdWR6a3N5YWx0Ymh0aGZ1bGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3OTM0NTEsImV4cCI6MjEwMzM2OTQ1MX0.8vcqCUsh6rDJQgYbnbGmr12RlmSDC9FsoyHUJTAAV64';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
