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
            <div className="max-w-3xl text-center font-helveticaLight text-sm uppercase pt-30 ">
                <div className="flex flex-col gap-12">
                    <h2 className="text-justify font-helvetica">Alejo Ayala is Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque repudiandae quod aut doloremque. Adipisci voluptas odio magnam! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis fugit deleniti earum, enim commodi accusamus amet nostrum eos adipisci cumque unde beatae reiciendis sint error ipsam nihil, eius ad doloremque?</h2>

                    <div className="text-xs font-helveticaBold">
                        <p>Instagram / @alejoayala</p>
                        <p>Vimeo / @alejoayala</p>
                        <p>Contact / alejoayala@email.com</p>

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
