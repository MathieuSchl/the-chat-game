// src/components/MessageInput.js
import "./Admin.css"
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

const Admin = ({ socket }) => {
  const [mode, setMode] = useState("Rien");
  const [randomMode, setRandomMode] = useState(false);

  const buttons = [
    { text: 'Rien', value: 'Rien'},
    { text: 'Pas de voyelle', value: 'removeVowels' },
    { text: 'Pas de consonne', value: 'removeConsonants' },
    { text: '1 lettre sur 2', value: 'removeEveryOtherChar' },
    { text: '1 mot sur 2', value: 'removeEveryOtherWord' },
    { text: 'Melanger les lettres', value: 'shuffleWord' },
    { text: 'Melanger les lettres au milieu', value: 'shuffleWordsInSentenceMiddle' },
    { text: 'Inverser les mots', value: 'reverseWordsInSentence' },
    { text: 'Melanger les mots', value: 'shuffleWords' },
  ];

  function selectMode(type) {
    socket.emit("setMode", type);
  }

  function setRandom(type) {
    socket.emit("setRandom", type);
  }

  useEffect(()=>{
    socket.off("getMode");
    socket.emit("getMode");

    socket.on("getMode", (value) => {
      setMode(value.mode);
      setRandomMode(value.randomMode)
    });
  })

  return (
    <div className="button-page">
      <NavBar />
      <h1>Admin</h1>
      <div className="button-container">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`btn ${button.value === mode ? 'btn-green' : 'btn-red'}`}
            onClick={()=>{selectMode(button.value)}}
          >
            {button.text}
          </button>
        ))}
      </div>
      <div className="button-container">
        <button
          className={`btn ${randomMode ? 'btn-green' : 'btn-red'}`}
          onClick={()=>{setRandom(!randomMode)}}
        >
          Random mode
        </button>
      </div>
    </div>
  );
};

export default Admin;
