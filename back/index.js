// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: [`${process.env.URL}`, `${process.env.URL}:80`, `${process.env.URL}:3000`],  // Remplace par l'URL de ton client React
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    }
  });

let messages = [];

io.on('connection', (socket) => {
  const lastMessages = messages.slice(-20);
  io.emit('setMessage', lastMessages);
  
  socket.on('message', (data) => {
    data.index = messages.length;
    messages.push(data);
    io.emit('message', data);
  });

  socket.on('getMoreMessage', (data) => {
    const min = data - 21 >= 0 ? data - 21 : 0;
    const max = data - 1;
    
    const moreMessages = messages.slice(min, max);
    io.emit('setPreviousMessage', moreMessages);
  });
});

// Gérer les erreurs globales de serveur
server.on('error', (err) => {
  console.error('Erreur du serveur HTTP:', err);
});

server.listen(3001, () => {
  console.log('Serveur lancé sur http://localhost:3001');
});
