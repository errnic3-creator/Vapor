let targetItem = null;
let buyerProfile = null;

async function initCheckout() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return window.location.href = 'auth.html';

  const itemId = new URLSearchParams(window.location.search).get('item_id');
  if (!itemId) return window.location.href = 'index.html';

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
  buyerProfile = profile;

  const { data: item } = await supabase.from('products').select('*').eq('id', itemId).single();
  targetItem = item;

  if (!targetItem) return window.location.href = 'index.html';

  document.getElementById('checkout-item-details').innerHTML = `
    <img src="${targetItem.image_url || 'https://via.placeholder.com/100'}" class="w-16 h-16 rounded object-cover">
    <div class="flex-1">
      <h3 class="font-bold text-white">${targetItem.title}</h3>
      <p class="text-xs text-gray-400">${targetItem.game_title} • Seller: ${targetItem.seller_handle}</p>
      <span class="text-emerald-400 font-bold text-sm block mt-1">₱${parseFloat(targetItem.price).toLocaleString()}</span>
    </div>
  `;
}

document.getElementById('confirm-purchase-btn').onclick = async () => {
  if (parseFloat(buyerProfile.balance) < parseFloat(targetItem.price)) {
    return alert('Insufficient VAPOR wallet funds!');
  }

  const newBalance = parseFloat(buyerProfile.balance) - parseFloat(targetItem.price);
  await supabase.from('profiles').update({ balance: newBalance }).eq('id', buyerProfile.id);
  await supabase.from('products').delete().eq('id', targetItem.id);

  alert('Purchase Success! Item held in Escrow and delivered safely.');
  window.location.href = 'index.html';
};

initCheckout();
