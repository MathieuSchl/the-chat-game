// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';
import Chat from './pages/Chat';
import ChooseTeam from './pages/ChooseTeam';

const socket = io('http://localhost:3001'); // Remplace par l'URL de ton serveur

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Définition des routes */}
        <Route path="/chat" element={<Chat socket={socket} />}/>
        <Route path="/chooseTeam" element={<ChooseTeam socket={socket} />}/>
        {/* Route pour les pages non trouvées */}
        <Route path="*" element={<ChooseTeam socket={socket} />}/>
      </Routes>
    </Router>
  );
};

export default App;
