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
            className="relative w-screen h-screen z-10 bg-black overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <video
              src="/reel_home.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
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
