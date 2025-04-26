// src/components/MessageInput.js
import "./Img.css"
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useSearchParams } from 'react-router-dom';

const Img = ({ socket }) => {
  const [searchParams] = useSearchParams();
  const image = searchParams.get('src');

  return (
    <div className="image">
      <NavBar />
      <h1>Voir image</h1>
      <img src={image ? image : "logo512.png"}/>
    </div>
  );
};

export default Img;
