// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';
import Qrode from './pages/Qrcode';
import Chat from './pages/Chat';
import Quest from './pages/Quest';
import Img from './pages/Img';
import ChooseTeam from './pages/ChooseTeam';
import Admin from './pages/Admin';
import env from "./env";

const socket = io(env.url + ':3001');

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Définition des routes */}
        <Route path="/chooseTeam" element={<ChooseTeam socket={socket} />}/>
        <Route path="/chat" element={<Chat socket={socket} />}/>
        <Route path="/quest" element={<Quest socket={socket} />}/>
        <Route path="/image" element={<Img socket={socket} />}/>
        <Route path="/admin" element={<Admin socket={socket} />}/>
        <Route path="/qrcode" element={<Qrode socket={socket} />}/>
        {/* Route pour les pages non trouvées */}
        <Route path="*" element={<ChooseTeam socket={socket} />}/>
      </Routes>
    </Router>
  );
};

export default App;
