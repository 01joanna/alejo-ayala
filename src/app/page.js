'use client';
import React from "react";
import Work from "./components/Work/Work";
import { motion, AnimatePresence } from "framer-motion";

export default function Home({ showAbout, setShowAbout}) {
  return (
    <section className="relative w-screen min-h-screen">
      {/* Video */}
      <AnimatePresence>
        {!showAbout && (
          <motion.div
            className="relative w-screen h-screen z-10 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <iframe
              src="https://player.vimeo.com/video/558780923?background=1&autoplay=1&muted=1&loop=1"
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* About */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            className="absolute top-0 left-0 w-screen h-screen bg-black flex flex-col items-center justify-center px-10 text-white z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl font-bold mb-4">Alejo Ayala</h1>
            <p className="max-w-2xl text-center text-lg leading-relaxed">
              Aquí va la información sobre Alejo: biografía, proyectos destacados,
              filosofía creativa...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Work */}
      <Work />
    </section>
  );
}
