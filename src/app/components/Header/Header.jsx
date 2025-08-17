'use client';
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function Header({ scrollY, onAboutClick }) {
    const controls = useAnimation();

    useEffect(() => {
        if (scrollY > 10) {
            controls.start({ top: 0, y: 0, transition: { duration: 0.5 } });
        } else {
            controls.start({ top: '50%', y: '-50%', transition: { duration: 0.5 } });
        }
    }, [scrollY, controls]);

    return (
        <motion.header
            animate={controls}
            initial={{ top: '50%', y: '-50%' }}
            className="fixed left-0 w-full flex justify-between items-center px-20 py-6 bg-transparent uppercase text-md tracking-widest font-sans text-white z-50 font-extralight"
        >
            <div><a href="#work">Work</a></div>
            <div><a href="/" className="text-[70px] tracking-wider font-ablation">Alejo Ayala</a></div>
            <div className="flex gap-10 items-center font-extralight uppercase">
                <button onClick={onAboutClick}>ABOUT</button>
                <a href="mailto:tuemail@email.com">Contact</a>
            </div>
        </motion.header>
    );
}
