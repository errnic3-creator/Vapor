let currentUser = null;

async function initSeller() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return window.location.href = 'auth.html';
  currentUser = session.user;

  loadSellerItems();
}

async function loadSellerItems() {
  const { data: items } = await supabase.from('products').select('*').eq('seller_id', currentUser.id);
  const tbody = document.getElementById('seller-table-body');
  document.getElementById('stat-listings').textContent = items ? items.length : 0;

  tbody.innerHTML = (items || []).map(item => `
    <tr class="border-b border-gray-800 hover:bg-gray-900/40">
      <td class="p-3 font-semibold text-white">${item.title}</td>
      <td class="p-3">${item.category}</td>
      <td class="p-3">${item.game_title}</td>
      <td class="p-3 text-emerald-400 font-bold">₱${parseFloat(item.price).toLocaleString()}</td>
      <td class="p-3 text-right">
        <button onclick="deleteItem('${item.id}')" class="text-xs bg-red-900/40 text-red-400 px-3 py-1 rounded hover:bg-red-900">Remove</button>
      </td>
    </tr>
  `).join('');
}

async function deleteItem(id) {
  await supabase.from('products').delete().eq('id', id);
  loadSellerItems();
}

document.getElementById('open-modal-btn').onclick = () => document.getElementById('list-modal').classList.remove('hidden');
document.getElementById('close-modal-btn').onclick = () => document.getElementById('list-modal').classList.add('hidden');

document.getElementById('list-item-form').onsubmit = async (e) => {
  e.preventDefault();
  const { data: profile } = await supabase.from('profiles').select('username').eq('id', currentUser.id).single();
  
  await supabase.from('products').insert([{
    title: document.getElementById('item-title').value,
    game_title: document.getElementById('item-game').value,
    category: document.getElementById('item-category').value,
    price: parseFloat(document.getElementById('item-price').value),
    image_url: document.getElementById('item-image').value,
    seller_id: currentUser.id,
    seller_handle: profile ? profile.username : 'Seller'
  }]);

  document.getElementById('list-modal').classList.add('hidden');
  document.getElementById('list-item-form').reset();
  loadSellerItems();
};

initSeller();
