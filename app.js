let products = [];
let activeCategory = 'All';

async function initStorefront() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return window.location.href = 'auth.html';

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
  if (profile) {
    document.getElementById('user-handle').textContent = profile.username;
    document.getElementById('user-balance').textContent = `₱${parseFloat(profile.balance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  }

  fetchProducts();
}

async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (!error) {
    products = data || [];
    renderProducts();
  }
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  const search = document.getElementById('search-input').value.toLowerCase();
  const maxPrice = parseFloat(document.getElementById('price-range').value);

  const filtered = products.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(search) || p.game_title.toLowerCase().includes(search);
    const matchesPrice = p.price <= maxPrice;
    return matchesCat && matchesSearch && matchesPrice;
  });

  grid.innerHTML = filtered.map(p => `
    <div class="glass-panel rounded-xl overflow-hidden flex flex-col justify-between hover:border-purple-500/50 transition duration-200">
      <img src="${p.image_url || 'https://via.placeholder.com/300x180?text=Gaming+Asset'}" class="h-44 w-full object-cover">
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span class="bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">${p.game_title}</span>
            <span>✔ ${p.seller_handle}</span>
          </div>
          <h3 class="font-bold text-white text-base mb-2">${p.title}</h3>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-lg font-black text-emerald-400">₱${parseFloat(p.price).toLocaleString()}</span>
          <a href="checkout.html?item_id=${p.id}" class="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition">Buy Now</a>
        </div>
      </div>
    </div>
  `).join('');
}

document.getElementById('search-input')?.addEventListener('input', renderProducts);
document.getElementById('price-range')?.addEventListener('input', (e) => {
  document.getElementById('price-display').textContent = `₱${parseInt(e.target.value).toLocaleString()}`;
  renderProducts();
});

document.querySelectorAll('.cat-filter').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.cat-filter').forEach(b => b.className = 'cat-filter bg-gray-800 text-xs px-3 py-2 rounded-lg font-bold hover:bg-gray-700');
    e.target.className = 'cat-filter active bg-purple-600 text-xs px-3 py-2 rounded-lg font-bold';
    activeCategory = e.target.dataset.cat;
    renderProducts();
  });
});

document.getElementById('logout-btn')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'auth.html';
});

initStorefront();
