const express = require('express');
const app = express();
const socket = require('socket.io');

const server = app.listen(3000, () => {
  console.log('server running on port:', 3000);
});

app.use(express.static('public'));

const io = socket(server);

io.on('connection', (socket) => {
  console.log('user connected', socket.id);

  socket.on('join', (roomName) => {
    const rooms = io.sockets.adapter.rooms;
    const room = rooms.get(roomName);
    // console.log('rooms', rooms);
    // console.log('room', room);

    if (room === undefined) {
      socket.join(roomName);
      socket.emit('created');
    } else if (room.size == 1) {
      socket.join(roomName);
      socket.emit('joined');
    } else {
      socket.emit('full');
    }
  });

  socket.on('ready', (roomName) => {
    console.log('ready');
    socket.broadcast.to(roomName).emit('ready');
  });

  socket.on('candidate', (candidate, roomName) => {
    console.log('candidate');
    socket.broadcast.to(roomName).emit('candidate', candidate);
  });

  socket.on('offer', (offer, roomName) => {
    console.log('offer', offer);
    socket.broadcast.to(roomName).emit('offer', offer);
  });

  socket.on('answer', (answer, roomName) => {
    console.log('answer');
    socket.broadcast.to(roomName).emit('answer', answer);
  });

  socket.on('leave', (roomName) => {
    socket.leave(roomName);
    socket.broadcast.to(roomName).emit('leave');
  });
});
