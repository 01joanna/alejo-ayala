'use client';
import React from "react";
import { motion } from "framer-motion";

export default function About({ showAbout, setShowAbout }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-90 text-white p-8"
        >
            <div className="max-w-3xl text-center font-helveticaLight text-sm pt-30 ">
                <div className="flex flex-col gap-12">
                    <h2 className="text-justify font-helvetica uppercase">Hey creatives, producers, agencies, marketing heads and directors.
                        Your email might catch me working… but maybe also watching a movie, messing around, blasting music, reading a book, out with friends, or dancing till sunrise. That’s life and honestly, that’s the stuff that keeps me going.<br/><br/>
                        I’ll get to my inbox soon, don’t worry. But you know… movies steal two hours, books another one, music takes over whenever it wants, and parties… well, they can go all night. Let me live it, and then we’ll talk projects.
                        Cheers.
                    </h2>

                    <div className="text-xs font-helveticaBold lowercase">
                        <p><a href="https://www.instagram.com/alej0ayala/">Instagram / alej0ayala</a></p>
                        <p><a href="https://vimeo.com/alejoayala">Vimeo / @alejoayala</a></p>
                        <p><a href="mailto:alejoayalahdz@gmail.com">Contact / alejoayalahdz@gmail.com</a></p>

                    </div>
                </div>
                <button
                    onClick={() => setShowAbout(false)}
                    className="mt-8 px-6 py-3 tracking-widest hover:bg-white hover:text-black transition cursor-pointer uppercase "
                >
                    X Close
                </button>
            </div>
        </motion.div>
    );
}
