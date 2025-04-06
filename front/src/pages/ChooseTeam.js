// ChooseTeam.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importer js-cookie

function ChooseTeam() {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const navigate = useNavigate(); // Hook pour la navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    Cookies.set('name', name, { expires: 700, sameSite:'strict' });
    Cookies.set('team', team, { expires: 700, sameSite:'strict' });

    navigate(`/chat`);
  };

  return (
    <div>
      <h1>Bienvenue! Choisis un nom et une équipe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom :</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="team">Choisissez votre équipe :</label>
          <select
            id="team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            required
          >
            <option value="">Sélectionnez une équipe</option>
            <option value="Rouge">Rouge</option>
            <option value="Bleu">Bleu</option>
          </select>
        </div>
        <button type="submit">Rejoindre l'équipe</button>
      </form>
    </div>
  );
}

export default ChooseTeam;
