let currentUser = null;

async function initReviews() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) currentUser = session.user;
  fetchReviews();
}

async function fetchReviews() {
  const { data: reviews } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
  const feed = document.getElementById('reviews-feed');

  if (reviews && reviews.length > 0) {
    const avg = (reviews.reduce((acc, r) => acc + parseFloat(r.rating), 0) / reviews.length).toFixed(1);
    document.getElementById('avg-rating').textContent = `${avg} / 5.0`;

    feed.innerHTML = reviews.map(r => `
      <div class="glass-panel p-4 rounded-lg space-y-2">
        <div class="flex justify-between items-center text-xs">
          <span class="font-bold text-purple-300">${r.username}</span>
          <span class="text-amber-400">${'★'.repeat(r.rating)}</span>
        </div>
        <p class="text-sm text-gray-200">${r.comment}</p>
        <span class="text-[10px] text-gray-500 block">${new Date(r.created_at).toLocaleDateString()}</span>
      </div>
    `).join('');
  }
}

document.getElementById('open-rev-modal').onclick = () => {
  if (!currentUser) return alert('Please sign in to write a review.');
  document.getElementById('review-modal').classList.remove('hidden');
};
document.getElementById('close-rev-modal').onclick = () => document.getElementById('review-modal').classList.add('hidden');

document.getElementById('review-form').onsubmit = async (e) => {
  e.preventDefault();
  const { data: profile } = await supabase.from('profiles').select('username').eq('id', currentUser.id).single();

  await supabase.from('reviews').insert([{
    user_id: currentUser.id,
    username: profile ? profile.username : 'User',
    rating: parseInt(document.getElementById('rev-rating').value),
    comment: document.getElementById('rev-comment').value
  }]);

  document.getElementById('review-modal').classList.add('hidden');
  document.getElementById('review-form').reset();
  fetchReviews();
};

initReviews();
