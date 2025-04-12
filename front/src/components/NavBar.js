// src/components/MessageInput.js
import "./NavBar.css"
import React, { } from 'react';
import Cookies from 'js-cookie'; // Importer js-cookie

const NavBar = ({  }) => {
  const currentUser = Cookies.get('name');
  const isAdmin = currentUser === "Indice";

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><a href="/chat">Messages</a></li>
        <li><a href="/chat">Quête</a></li>
        {isAdmin ? (
          <li><a href="/admin">Admin</a></li>
        ) : ""}
        <li><a href="/qrcode">Qrcode</a></li>
      </ul>
    </nav>
  );
};

export default NavBar;
