import React from "react";
import Link from "next/link";
import Logo from "@/ui/logo.svg";
import Image from "next/image";
import UserButton from "@/components/UserButton";
// import { useState } from 'react';
// import BurgerMenu from './BurgerMenu';  Assurez-vous d'avoir un composant BurgerMenu
import "@/ui/global.css";

const AppBar = () => {
  // const [menuOpen, setMenuOpen] = useState(false)
  // const toggleMenu = () => {
  //   setMenuOpen(!menuOpen);
  // };

  return (
    <header className="text-white p-4 flex items-center justify-center justify-between appbar fixed w-full">
      <div className="flex items-center">
        {/* <BurgerMenu></BurgerMenu> */}
        <Link href="/">
          <Image
            src={Logo}
            alt="Logo"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          ></Image>
        </Link>
      </div>

      <UserButton></UserButton>
      {/* {menuOpen && <BurgerMenu />} */}
    </header>
  );
};

export default AppBar;
