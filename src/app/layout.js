'use client';
import React, { useState, useEffect } from 'react';
import './globals.css';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header/Header';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const [showAbout, setShowAbout] = useState(false); // estado global

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <Header scrollY={scrollY} onAboutClick={() => setShowAbout(true)} />

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* PASAMOS showAbout y setShowAbout como props */}
            {React.isValidElement(children)
              ? React.cloneElement(children, { showAbout, setShowAbout })
              : children}
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
  );
}
