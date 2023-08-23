const socket = io();

const chatOutput = document.getElementById('chat-output');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message.trim() !== '') {
    socket.emit('message', message);
    messageInput.value = '';
  }
});

socket.on('message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = data;
  chatOutput.appendChild(messageElement);
  chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll to the bottom
});
