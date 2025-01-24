'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <button>
        Burger menu 🚧
      </button>
    </>
  );
};

export default BurgerMenu;