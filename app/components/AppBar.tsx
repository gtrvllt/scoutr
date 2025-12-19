"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useCountryListStore } from "@/store/countryListStore";
import Logo from "@/ui/logo.svg";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
// import { useState } from 'react';
import BurgerMenu from "./BurgerMenu";
import UserButton from "./UserButton";
import "@/ui/global.css";
import { usePathname } from "next/navigation";
import countries from "@/lib/countries.json";
import dynamic from "next/dynamic";

const AddMeta = dynamic(() => import("@/components/AddMeta"), { ssr: false });

const AppBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddMetaOpen, setIsAddMetaOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  // Store country list state
  const setCountryListOpen = useCountryListStore((state) => state.setIsCountryListOpen);

  // Handler pour fermer la country list au clic sur un lien
  const handleNavClick = () => { setCountryListOpen(false); setIsOpen(false); };
  // const isCountryListOpen = useCountryListStore((state) => state.setIsOpen);
  // const toggleCountryList = useCountryListStore((state) => state.toggle);

  // Try to infer country from URL like /country/FR
  const inferredCountryCode = useMemo(() => {
    if (!pathname) return "";
    const m = pathname.match(/^\/country\/([A-Za-z]{2})(?:\b|\/)/);
    return m ? m[1].toUpperCase() : "";
  }, [pathname]);

  const openAddMeta = () => {
    // Pre-fill with inferred code if available
    if (inferredCountryCode) setSelectedCountryCode(inferredCountryCode);
    setIsAddMetaOpen(true);
    setIsOpen(false);
  };

  const closeAddMeta = () => {
    setIsAddMetaOpen(false);
  };

  return (
    <header className="fixed top-0 text-white px-4 flex items-center justify-between appbar w-full">
      <div className="flex items-center h-full">
        <div className="relative z-50">
          <BurgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute left-0 top-0 h-full w-full z-40 bg-inherit flex items-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="menu-items flex space-x-4 pl-4 h-full items-center bg-white">
                <Link href="/newsletter" className="h-full flex items-stretch ml-[30px]" onClick={handleNavClick}>
                  <button className="menu-item">Newsletter</button>
                </Link>
                <Link href="/about" className="h-full flex items-stretch" onClick={handleNavClick}>
                  <button className="menu-item">About us</button>
                </Link>
                <Link href="/donate" className="h-full flex items-stretch" onClick={handleNavClick}>
                  <button className="menu-item">Donate</button>
                </Link>
                <Link href="/tos" className="h-full flex items-stretch" onClick={handleNavClick}>
                  <button className="menu-item">Terms of use</button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center space-x-4">
          <Link href="/all-metas" className="h-full flex items-stretch" onClick={handleNavClick}>
            <button className="menu-item">All Metas</button>
          </Link>
          <button className="menu-item h-full flex items-stretch" onClick={openAddMeta}>
            Add Meta
          </button>
        </div>
        <div className="absolute right-4 flex items-center gap-3">
          <UserButton />
          <Link href="/">
            <Image src={Logo} alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>
      </div>

      {/* Add Meta Modal */}
      <AnimatePresence>
        {isAddMetaOpen && (
          <motion.div
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" aria-hidden />
            <div
              className="absolute inset-0 flex items-center justify-center p-4"
              onClick={closeAddMeta}
              role="presentation"
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                className="relative w-[95vw] max-w-4xl bg-white shadow-2xl"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={closeAddMeta}
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.72 6.72a.75.75 0 011.06 0L12 10.94l4.22-4.22a.75.75 0 111.06 1.06L13.06 12l4.22 4.22a.75.75 0 11-1.06 1.06L12 13.06l-4.22 4.22a.75.75 0 11-1.06-1.06L10.94 12 6.72 7.78a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <AddMeta
                  country={null}
                  onMetaAddedCallBack={closeAddMeta}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right-side user button added above near the logo */}
      {/* {menuOpen && <BurgerMenu />} */}
    </header>
  );
};

export default AppBar;
