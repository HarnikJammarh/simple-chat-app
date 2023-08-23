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
    const emojiMessage = replaceEmojis(message);
    socket.emit('message', { message: emojiMessage });
    $('#input').val('');
  }
});

socket.on('message', (data) => {
  const message = `<strong>${data.username}:</strong> ${replaceEmojis(data.message)}`;
  $('#messages').append($('<li>').html(message));
  updateScroll();
});

function updateScroll() {
  const chatWindow = document.getElementById('chat-window');
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function replaceEmojis(message) {
  const emojiMap = {
    react: "⚛️",
    woah: "😲",
    hey: "👋",
    lol: "😂",
    like: "🤍",
    congratulations: "🎉",
  };

  const words = message.split(/\s+/);
  const replacedWords = words.map(word => {
    const lowerCaseWord = word.toLowerCase();
    if (emojiMap.hasOwnProperty(lowerCaseWord)) {
      return emojiMap[lowerCaseWord];
    }
    return word;
  });

  return replacedWords.join(' ');
}
