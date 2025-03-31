"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const BurgerMenu = ({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
}) => {
  return (
    <button
      onClick={toggleMenu}
      aria-label="Toggle menu"
      className="min-w-[24px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.svg
            key="open"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -45 }}
            transition={{ duration: 0.1 }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        ) : (
          <motion.svg
            key="closed"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.1 }}
            width="20"
            height="14"
            viewBox="0 0 20 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0V2H20V0H0ZM0 6V8H20V6H0ZM0 12V14H20V12H0Z"
              fill="black"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
};

export default BurgerMenu;
