const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let isRegister = false;

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const usernameField = document.getElementById('username-field');
const authForm = document.getElementById('auth-form');
const submitBtn = document.getElementById('submit-btn');
const authError = document.getElementById('auth-error');

tabLogin.addEventListener('click', () => {
  isRegister = false;
  tabLogin.className = 'flex-1 pb-3 text-center border-b-2 border-purple-500 font-bold text-white';
  tabRegister.className = 'flex-1 pb-3 text-center border-b-2 border-transparent text-gray-400 font-bold hover:text-white';
  usernameField.classList.add('hidden');
  submitBtn.textContent = 'Sign In';
});

tabRegister.addEventListener('click', () => {
  isRegister = true;
  tabRegister.className = 'flex-1 pb-3 text-center border-b-2 border-purple-500 font-bold text-white';
  tabLogin.className = 'flex-1 pb-3 text-center border-b-2 border-transparent text-gray-400 font-bold hover:text-white';
  usernameField.classList.remove('hidden');
  submitBtn.textContent = 'Create Account';
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.classList.add('hidden');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (isRegister) {
    const username = document.getElementById('username').value;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return showError(error.message);

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: data.user.id, username: username || email.split('@')[0], balance: 10000.00 }
      ]);
      if (profileError) return showError(profileError.message);
      window.location.href = 'index.html';
    }
  } else {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return showError(error.message);
    window.location.href = 'index.html';
  }
});

function showError(msg) {
  authError.textContent = msg;
  authError.classList.remove('hidden');
}
