import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="p-4 bg-gray-800 text-white">
      <div className="container mx-auto">
        <Link to="/" className="mr-4">Knowledge Base</Link>
        <Link to="/add-knowledge-base" className="mr-4">Add Knowledge Base</Link>
      </div>
    </nav>
  );
};

export default Navbar;
