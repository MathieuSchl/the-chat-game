// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require("fs");

const messageRules = require("./message-rules");

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

// Create backup of game.json
fs.writeFileSync("./data/backup.json", JSON.stringify(JSON.parse(fs.readFileSync("./data/game.json")), null, 4));

if (!fs.existsSync("./data/")) fs.mkdirSync("./data/");
let messages = fs.existsSync("./data/save.json") ? JSON.parse(fs.readFileSync("./data/save.json")).messages: [];
let game = fs.existsSync("./data/save.json") ? JSON.parse(fs.readFileSync("./data/save.json")).game : null;
if(game == null) game = {step: 0}
setInterval(() => {
  if(!fs.existsSync("./data/save.json") || JSON.stringify(JSON.parse(fs.readFileSync("./data/save.json"))) !== JSON.stringify({ game, messages })) fs.writeFileSync("./data/save.json", JSON.stringify({ game, messages }));
}, 10000);

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    data.index = messages.length;
    
    if(data.sender === "Indice") data.team = "verte";
    else {
      const res = messageRules.applyCurrentRule(data.content);
      data.content = res.text;
      data.font = res.font;
    }
    
    messages.push(data);
    io.emit('message', data);
  });

  socket.on('getMessage', () => {
    const lastMessages = messages.slice(-20);
    io.emit('setMessage', lastMessages);
  });

  socket.on('getMoreMessage', (data) => {
    const min = data - 21 >= 0 ? data - 21 : 0;
    const max = data - 1;
    
    const moreMessages = messages.slice(min, max);
    socket.emit('setPreviousMessage', moreMessages);
  });

  socket.on("getMode", () => {
    socket.emit("getMode", { 
      mode: messageRules.getCurrentRule(),
      randomMode: messageRules.getRandomMode()
    });
  })

  socket.on("setMode", (mode) => {
    messageRules.setCurrentRule(mode);
    socket.emit("getMode", { 
      mode: messageRules.getCurrentRule(),
      randomMode: messageRules.getRandomMode()
    });
  })

  socket.on("setRandom", (mode) => {
    messageRules.setRandomMode(mode);
    socket.emit("getMode", { 
      mode: messageRules.getCurrentRule(),
      randomMode: messageRules.getRandomMode()
    });
  })

  socket.on("getGame", () => {
    try {
      let theGameData = fs.existsSync("./data/game.json") ? JSON.parse(fs.readFileSync("./data/game.json")).game : null;
      
      if(!theGameData)
        return socket.emit("quest", {quest: {
          "Rouge": {
            "direction": "Le fichier game.json n'existe pas",
            "text1": "Le fichier game.json n'existe pas",
            "text2": "Le fichier game.json n'existe pas",
          },
          "Bleu": {
            "direction": "Le fichier game.json n'existe pas",
            "text1": "Le fichier game.json n'existe pas",
            "text2": "Le fichier game.json n'existe pas",
          }
        }});

      if (theGameData[game.step]) 
        return socket.emit("quest", {quest: theGameData[game.step]});

      return socket.emit("quest", {quest: {
        "Rouge": {
          "direction": "Félicitation le jeu est terminé",
          "src": "youWin.gif",
          "text1": "Vous avez retrouvé l'équipe bleu",
        },
        "Bleu": {
          "direction": "Félicitation le jeu est terminé",
          "src": "youWin.gif",
          "text1": "Vous avez retrouvé l'équipe rouge",
        }
      }});
    } catch (error) {
      return io.emit("quest", {quest: {
        "Rouge": {
          "direction": error + ""
        },
        "Bleu": {
          "direction": error + ""
        }
      }});
    }
  })


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

  socket.on("validAnwser", (inputValue, team) => {
    let theGameData = fs.existsSync("./data/game.json") ? JSON.parse(fs.readFileSync("./data/game.json")).game : null;

    if(!theGameData)
      return io.emit("quest", {quest: {
        "Rouge": {
          "direction": "Le fichier game.json n'existe pas",
          "text1": "Le fichier game.json n'existe pas",
          "text2": "Le fichier game.json n'existe pas",
        },
        "Bleu": {
          "direction": "Le fichier game.json n'existe pas",
          "text1": "Le fichier game.json n'existe pas",
          "text2": "Le fichier game.json n'existe pas",
        }
      }});

    if(isNumber(theGameData[game.step][team].answer)){
      if(theGameData[game.step][team].answer == inputValue) {
        game.step++;
      }
    } else {
      const distance = levenshtein(theGameData[game.step][team].answer.toLowerCase(), inputValue.toLowerCase());
      if(distance <= 1) {
        game.step++;
      }
    }

    if (theGameData[game.step]){
      messageRules.setCurrentRule(theGameData[game.step].Rouge.rule ? theGameData[game.step].Rouge.rule : "Rien");
      messageRules.setRandomMode(theGameData[game.step].Rouge.random ? true : false);

      return io.emit("quest", {quest: theGameData[game.step]});
    }

    messageRules.setCurrentRule("Rien");
    messageRules.setRandomMode(false);

    return io.emit("quest", {quest: {
      "Rouge": {
        "direction": "Félicitation le jeu est terminé",
        "src": "youWin.gif",
        "text1": "Vous avez retrouvé l'équipe bleu",
      },
      "Bleu": {
        "direction": "Félicitation le jeu est terminé",
        "src": "youWin.gif",
        "text1": "Vous avez retrouvé l'équipe rouge",
      }
    }});
  })

  //io.emit('message', data);
});

// Gérer les erreurs globales de serveur
server.on('error', (err) => {
  console.error('Erreur du serveur HTTP:', err);
});

server.listen(3001, () => {
  console.log('Serveur lancé sur http://localhost:3001');
});
