const socket = io();

const loginBox = document.getElementById('login-box');
const usernameInput = document.getElementById('username-input');
const usernameSubmit = document.getElementById('username-submit');

usernameSubmit.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('join', username);
    hideLoginBox();
  }
});

function hideLoginBox() {
  loginBox.style.display = 'none';
}

socket.on('userJoined', (username) => {
  $('#users').append($('<li>').text(username));
  $('#messages').append(`${username} joined`);
  updateScroll();
});

socket.on('userLeft', (username) => {
  $('#users li').filter(function() {
    return $(this).text() === username;
  }).remove();
  $('#messages').append(`${username} left`);
  updateScroll();
});

$('#form').submit((e) => {
  e.preventDefault();
  const message = $('#input').val();
  if (message.trim() !== '') {
    socket.emit('message', { message: message });
    $('#input').val('');
  }
});

socket.on('message', (data) => {
  const message = `<strong>${data.username}:</strong> ${data.message}`;
  $('#messages').append($('<li>').html(message));
  updateScroll();
});

function updateScroll() {
  const chatWindow = document.getElementById('chat-window');
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
