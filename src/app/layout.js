'use client';
import React, { useState, useEffect } from 'react';
import './globals.css';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header/Header';
import About from './components/About/About';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAboutClick = () => {
    setShowAbout(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    setShowAbout(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <Header
          scrollY={scrollY}
          onAboutClick={handleAboutClick}
          onHomeClick={handleHomeClick}
          showAbout={showAbout}
          isHome={pathname === '/'}
        />

        {/* About */}
        <AnimatePresence>
          {showAbout && <About setShowAbout={setShowAbout} />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
  );
}
