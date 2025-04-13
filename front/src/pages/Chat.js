// src/App.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importer js-cookie
import './Chat.css';
import NavBar from '../components/NavBar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

const Chat = ({ socket }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  socket.off('message');
  socket.off('setMessage');
  socket.off('setPreviousMessage');
  
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

  useEffect(()=>{
    if(messages.length === 0) {
      socket.emit("getMessage");
    }
  });

  return (
    <div className="chat">
      <NavBar socket={socket}/>
      <MessageList messages={messages} socket={socket} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
