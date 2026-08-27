const chatbotHTML = `
  <div id="chat-widget" class="fixed bottom-5 right-5 z-50 flex flex-col items-end">
    <div id="chat-window" class="hidden glass-panel w-80 h-96 rounded-xl flex flex-col mb-3 overflow-hidden border border-purple-500/40 glow-purple">
      <div class="bg-purple-900/60 p-3 border-b border-gray-800 flex justify-between items-center">
        <span class="text-xs font-bold text-white">VAPOR AI Escrow Assistant</span>
        <button id="close-chat" class="text-gray-400 hover:text-white">✕</button>
      </div>
      <div id="chat-messages" class="flex-1 p-3 overflow-y-auto space-y-2 text-xs custom-scrollbar">
        <div class="bg-purple-900/40 p-2 rounded max-w-[85%] text-purple-200">Hello! Ask me anything about VAPOR trading rules, asset verification, or escrow protection.</div>
      </div>
      <form id="chat-form" class="p-2 border-t border-gray-800 flex gap-2">
        <input type="text" id="chat-input" placeholder="Type query..." class="flex-1 bg-gray-900 border border-gray-700 px-2 py-1 rounded text-xs text-white focus:outline-none focus:border-purple-500">
        <button type="submit" class="bg-purple-600 px-3 py-1 rounded text-xs font-bold">Send</button>
      </form>
    </div>
    <button id="toggle-chat" class="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg font-bold">💬 Support</button>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', chatbotHTML);

const toggleBtn = document.getElementById('toggle-chat');
const closeBtn = document.getElementById('close-chat');
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

toggleBtn.onclick = () => chatWindow.classList.toggle('hidden');
closeBtn.onclick = () => chatWindow.classList.add('hidden');

chatForm.onsubmit = async (e) => {
  e.preventDefault();
  const query = chatInput.value.trim();
  if (!query) return;

  chatMessages.innerHTML += `<div class="bg-gray-800 p-2 rounded max-w-[85%] ml-auto text-white">${query}</div>`;
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: query }] })
    });
    
    if (res.ok) {
      const data = await res.json();
      chatMessages.innerHTML += `<div class="bg-purple-900/40 p-2 rounded max-w-[85%] text-purple-200">${data.content || 'Escrow protection active.'}</div>`;
    } else {
      throw new Error();
    }
  } catch {
    chatMessages.innerHTML += `<div class="bg-purple-900/40 p-2 rounded max-w-[85%] text-purple-200">VAPOR Escrow: All trades are protected under system virtual balance checks.</div>`;
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Voiceflow v2 Embed Integration Hook
(function(d, t) {
  var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
  v.onload = function() {
    window.voiceflow?.chat?.load({
      verify: { projectID: 'YOUR_VOICEFLOW_PROJECT_ID' },
      url: 'https://general-runtime.voiceflow.com',
      versionID: 'production'
    });
  };
  v.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
  v.type = "text/javascript";
  s.parentNode.insertBefore(v, s);
})(document, 'script');
