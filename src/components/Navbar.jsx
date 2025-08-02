import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">📰 Blogverse</h1>
      <ul className="nav-links">
        <li><a href="#blogs">Blogs</a></li>
        <li><a href="#new">Write</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
