const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    socket.username = username;
    io.emit('userJoined', username);
  });

  socket.on('message', (data) => {
    if (socket.username) {
      io.emit('message', { username: socket.username, message: data.message });
    }
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('userLeft', socket.username);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
