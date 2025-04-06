// src/components/Message.js
import React from 'react';

const Message = ({ content, sender, timestamp, team }) => {
  return (
    <div className={`message ${team === "Rouge" ? 'red-team-message' : team === "Bleu" ? 'blue-team-message' : "green-team-message"}`}>
      <div className="message-content">
        <strong>{sender}:</strong>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Message;
