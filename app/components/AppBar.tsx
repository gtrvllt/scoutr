"use client";
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import BurgerMenu from './BurgerMenu'; // Assurez-vous d'avoir un composant BurgerMenu
import AcmeLogo from 'app/ui/acme-logo';
import '@/ui/global.css';

const AppBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-blue-500 text-white p-4 flex items-center justify-between appbar fixed w-full">
      <div className="flex items-center">
        <button className="md:hidden" onClick={toggleMenu}>
          {/* Icone burger */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold ml-4">
          <Link href="/"><AcmeLogo /></Link>
        </h1>
      </div>

      <nav className="hidden md:flex space-x-4">
        <Link href="/about" className="hover:text-gray-300">About</Link>
        <Link href="/contact" className="hover:text-gray-300">Contact</Link>
      </nav>

      {menuOpen && <BurgerMenu />}
    </header>
  );
};

export default AppBar;