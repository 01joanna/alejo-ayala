'use client';
import React, { useState, useRef, useEffect } from "react";
import Work from "./components/Work/Work";
import About from "./components/About/About";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showAbout, setShowAbout] = useState(false);
  const [touched, setTouched] = useState(false);
  const videoRef = useRef(null);

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    setTouched(true);
  };

  useEffect(() => {
    // Listener para scroll
    const handleScroll = () => {
      if (!touched) playVideo();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [touched]);

  return (
    <section className="relative w-screen min-h-screen pb-20">
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
              ref={videoRef}
              src="/reel_home.mp4"
              muted
              loop
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Overlay invisible para primer toque */}
            {!touched && (
              <div
                onClick={playVideo}
                className="absolute inset-0 z-50"
              />
            )}
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
