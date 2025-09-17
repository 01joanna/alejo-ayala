'use client';
import React, { useState } from "react";
import Work from "./components/Work/Work";
import About from "./components/About/About";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <section className="relative w-screen min-h-screen">
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
        src="https://player.vimeo.com/video/1114201416?background=1&autoplay=1&muted=1&loop=1"
        className="absolute top-0 left-0 md:w-full md:h-full w-screen h-screen object-cover pointer-events-none"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </motion.div>
  )}
</AnimatePresence>
      {/* About */}
      <AnimatePresence>
        {showAbout && <About showAbout={showAbout} setShowAbout={setShowAbout} />}
      </AnimatePresence>

      {/* Work */}
      <Work />

    </section>
  );
}
