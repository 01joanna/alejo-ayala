'use client';
import React from "react";
import Work from "./components/Work/Work";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  return (
    <section className="relative w-screen min-h-screen">
      {/* Video de portada */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Work */}
      <Work />
    </section>
  );
}
