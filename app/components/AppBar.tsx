"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/ui/logo.svg";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
// import { useState } from 'react';
import BurgerMenu from "./BurgerMenu";
import "@/ui/global.css";

const AppBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0text-white px-4 flex items-center justify-center justify-between appbar fixed w-full">
      <div className="flex items-center h-full">
        <BurgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="menu-items flex space-x-4 pl-4 h-full"
              initial={{ x: 0, opacity: 0 }}
              animate={isOpen ? { x: 40, opacity: 1 } : { x: 100, opacity: 0 }}
              exit={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="menu-items flex space-x-4 pl-4">
                <Link href="/newsletter" className="h-full flex items-stretch">
                  <button className="menu-item">Newsletter</button>
                </Link>
                <Link href="/about" className="h-full flex items-stretch">
                  <button className="menu-item">About us</button>
                </Link>
                <Link href="/donate" className="h-full flex items-stretch">
                  <button className="menu-item">Donate</button>
                </Link>
                <Link href="/tos" className="h-full flex items-stretch">
                  <button className="menu-item">Terms of use</button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute right-4">
          <Link href="/">
            <Image src={Logo} alt="Logo" className="h-8 w-auto"></Image>
          </Link>
        </div>
      </div>

      {/* <UserButton></UserButton> */}
      {/* {menuOpen && <BurgerMenu />} */}
    </header>
  );
};

export default AppBar;
