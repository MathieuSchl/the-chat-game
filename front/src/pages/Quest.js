// src/components/MessageInput.js
import "./Quest.css"
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Cookies from 'js-cookie'; // Importer js-cookie
import { useNavigate } from 'react-router-dom';

const Quest = ({ socket }) => {
  const navigate = useNavigate();
  const team = Cookies.get('team');
  const [inputValue, setInputValue] = useState('');
  const [badAnswer, setBadAnswer] = useState(false);
  const [quest, setQuest] = useState({quest: {
    "Rouge": {
    },
    "Bleu": {
    }
  }});

  function levenshtein(a, b) {
    const matrix = [];
  
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
  
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,    // suppression
            matrix[i][j - 1] + 1,    // insertion
            matrix[i - 1][j - 1] + 1 // substitution
          );
        }
      }
    }
  
    return matrix[b.length][a.length];
  }

  function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
  }

  socket.off('quest');
  socket.on('quest', (data) => {
    setQuest(data);
    setBadAnswer(false);
  });

  function handleSubmit() {
    if(isNumber(quest.quest[team].answer)){
      if(quest.quest[team].answer == inputValue) {
        setBadAnswer(false);
        socket.emit("validAnwser", inputValue, team);
      }
      else setBadAnswer(true);
    } else {
      const distance = levenshtein(quest.quest[team].answer.toLowerCase(), inputValue.toLowerCase());
      if(distance <= 1) {
        setBadAnswer(false);
        socket.emit("validAnwser", inputValue, team);
      }
      else setBadAnswer(true);
    }
    setInputValue("");
  }

  useEffect(()=>{
    //console.log(JSON.stringify(quest) === '{"quest":{"Rouge":{},"Bleu":{}}}');
    
    if(JSON.stringify(quest) === '{"quest":{"Rouge":{},"Bleu":{}}}') {
      socket.emit("getGame");
    }
  });

  return (
    <div className="quest">
      <NavBar />
      <h1>Quête</h1>
      <div className={`the-team ${team === "Rouge" ? 'red' : 'blue'}`}>Vous êtes dans l'équipe {team}</div>

      <h1>Direction de l'équipe <strong className={`${team === "Rouge" ? 'blue' : 'red'}`}>{team === "Rouge" ? 'Bleu' : 'Rouge'}</strong></h1>
      <p className="hint">Attention, les instructions présentent ici sont à communiquer à l'autre équipe</p>
      <p>{quest.quest[team].direction}</p>

      <p className="hint" />

      {quest.quest[team].text1 || quest.quest[team].src || quest.quest[team].text2 || quest.quest[team].answer ? (<div>
        <h1>Question</h1>
        <p className="hint">Attention, la question ici doit être répondue par votre équipe avec les informations de l'autre équipe</p>
        {quest.quest[team].text1 ? (<p className="question-text">{quest.quest[team].text1}</p>) : ""}
        {quest.quest[team].src ? (<img src={quest.quest[team].src} onClick={()=>{navigate(`/image?src=${quest.quest[team].src}`)}} style={{cursor: "pointer"}}/>) : ""}
        {quest.quest[team].text2 ? (<p className="question-text">{quest.quest[team].text2}</p>) : ""}

        {quest.quest[team].answer ? <div className="form-row">
          <input type="text" placeholder="Réponse" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
          <button onClick={handleSubmit}>Valider</button>
        </div>: ""}
        {quest.quest[team].answer && badAnswer ? <p className="red" style={{marginBottom: "20px"}}>Mauvaise réponse</p> : ""}
      </div>) : ""}
    </div>
  );
};

export default Quest;
