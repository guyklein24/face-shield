// src/components/Menu.js
import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/cameras">Cameras</Link>
      <Link to="/watchlist">Watchlist</Link>
      <Link to="/users">Users</Link>
    </div>
  );
};

export default Menu;
