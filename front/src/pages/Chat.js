// src/App.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importer js-cookie
import io from 'socket.io-client';
import './Chat.css';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

const socket = io('http://localhost:3001'); // Remplace par l'URL de ton serveur

const Chat = ({ socket }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  
  const currentUser = Cookies.get('name');
  const team = Cookies.get('team');
  if(!currentUser || !team) navigate(`/`);

  const handleSendMessage = (newMessage) => {
    const timestamp = new Date().toLocaleTimeString();
    const messageWithTime = { ...newMessage, timestamp, sender: currentUser, team };
    //setMessages([...messages, messageWithTime]);
    socket.emit("message", messageWithTime);
  };

  
  socket.on('message', (data) => {
    setMessages([...messages, data]);
  });

  socket.on('setMessage', (data) => {    
    setMessages(data);
  });

  socket.on('setPreviousMessage', (data) => {
    setMessages(data.concat(messages));
  });


  return (
    <div className="chat">
      <MessageList messages={messages} socket={socket} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
