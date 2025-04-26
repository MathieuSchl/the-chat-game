// src/components/MessageList.js
import React, { useRef } from 'react';
import Message from './Message';

const MessageList = ({ messages, socket }) => {
  const messagesListRef = useRef(0);

  const handleScroll = () => {
    // Vérifie si l'utilisateur est en haut de la div
    
    if (messagesListRef.current.scrollTop === 0 && messages.length !== 0 && messages[0].index !== 0) {
      socket.emit("getMoreMessage", messages[0].index);
    }
  };

  socket.on('message', () => {
    if (messagesListRef.current) {
        const isUserAtBottom = messagesListRef.current.scrollHeight - messagesListRef.current.scrollTop <= messagesListRef.current.clientHeight + (window.innerHeight / 2);

        setTimeout(() => {
            if(isUserAtBottom) messagesListRef.current.childNodes[messagesListRef.current.childNodes.length - 1].scrollIntoView({ behavior: 'smooth' });
        }, 10);
      }
  });

  socket.on('setMessage', () => {
    setTimeout(() => {
      messagesListRef.current.childNodes[messagesListRef.current.childNodes.length - 1].scrollIntoView();
    }, 10);
  });

  socket.on('setPreviousMessage', () => {
    if (messagesListRef.current && messages.length !== 0) {
      const previousFirst = messages[0].index;
      
      setTimeout(() => {
        const actialFirst = previousFirst - 21 >= 0 ? previousFirst - 21 : 0;
        
        messagesListRef.current.childNodes[previousFirst - actialFirst].scrollIntoView();
      }, 10);
    }
  });

  return (
    <div className="message-list" ref={messagesListRef} onScroll={handleScroll}>
      {messages.map((msg, index) => (
        <Message
          key={index}
          content={msg.content}
          sender={msg.sender}
          timestamp={msg.timestamp}
          team={msg.team}
          font={msg.font}
        />
      ))}
    </div>
  );
};

export default MessageList;
