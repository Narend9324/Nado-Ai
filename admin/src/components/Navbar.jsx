import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-600 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            className="block md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center">
          <img
            src="/profile.png"
            alt="Profile"
            className="rounded-full w-10 h-10"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
