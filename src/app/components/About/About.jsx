'use client';
import React from "react";
import { motion } from "framer-motion";

export default function About({ setShowAbout }) {
    return (
        <motion.div
            className="fixed inset-0 bg-black/90 text-white flex flex-col items-center justify-center px-10 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex flex-col gap-10 pt-12">
                <h1 className="w-[690px] h-[200px] pt-[11rem] font-extralight text-justify">
                    Alejo Ayala es Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex tempore hic repudiandae minus qui id sint voluptatem quidem saepe eaque. Excepturi ducimus repellendus fugiat dolor aliquam natus et non sint.</h1>
                <button
                    onClick={() => setShowAbout(false)}
                    className="mt-10 px-6 py-2 hover:bg-white hover:text-black transition w- text-center items-center justify-center w-30"
                >
                    Cerrar
                </button>
            </div>
        </motion.div>
    );
}
