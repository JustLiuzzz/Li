// Matrix background
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(0);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff00';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 33);

// Typing effect
async function typeMessage(text, element) {
    return new Promise(resolve => {
        new Typed(element, {
            strings: [text],
            typeSpeed: 20,
            showCursor: false,
            onComplete: resolve
        });
    });
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) {
        alert('Pesan tidak boleh kosong! Silakan ketik sesuatu. 😊');
        return;
    }

    // Display user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message fade-in';
    userMessage.textContent = message;
    document.getElementById('chat-box').appendChild(userMessage);

    // Show thinking animation
    const thinking = document.getElementById('thinking');
    thinking.style.display = 'block';
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;

    // Send to backend
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        const reply = data.reply;

        // Display AI response with typing effect
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai-message fade-in';
        document.getElementById('chat-box').appendChild(aiMessage);
        thinking.style.display = 'none';
        await typeMessage(reply, aiMessage);
    } catch (error) {
        console.error('Fetch Error:', error);
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai-message fade-in';
        aiMessage.textContent = 'Maaf, ada masalah dengan koneksi ke server. Cek konsol untuk detail. 😅';
        document.getElementById('chat-box').appendChild(aiMessage);
        thinking.style.display = 'none';
    }

    input.value = '';
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}

// Send message on Enter key
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Ensure input is focused on page load
window.onload = () => {
    document.getElementById('user-input').focus();
};

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const columns = canvas.width / fontSize;
    drops.length = Math.floor(columns);
    drops.fill(0);
});