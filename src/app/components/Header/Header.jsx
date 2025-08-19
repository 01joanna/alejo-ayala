'use client';
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header({ scrollY }) {
    const controls = useAnimation();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/") {
            if (scrollY > 10) {
                controls.start({ top: 0, y: 0, transition: { duration: 0.5 } });
            } else {
                controls.start({ top: "50%", y: "-50%", transition: { duration: 0.5 } });
            }
        } else {
            controls.start({ top: 0, y: 0, transition: { duration: 0.5 } });
        }
    }, [scrollY, controls, pathname]);

    const logoText = "Alejo Ayala";

    // Función de scroll suave
    const handleScroll = (id) => {
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <motion.header
            animate={controls}
            initial={{
                top: pathname === "/" ? "50%" : 0,
                y: pathname === "/" ? "-50%" : 0,
            }}
            className="fixed left-0 w-full px-8 py-6 bg-transparent uppercase text-md tracking-widest text-white z-50 font-helveticaLight"
        >
            <div className="max-w-7xl w-full mx-auto flex flex-col items-center">

                <div
                    className="w-screen flex justify-evenly px-[25rem] text-[20px] font-helveticaBold cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    {logoText.split("").map((char, index) => (
                        <span key={index} key={index}>{char}</span>
                    ))}
                </div>

                {/* Menú alineado con el logo */}
                <div className="w-screen flex justify-between px-[27rem] mt-4 uppercase">
                    <button onClick={() => handleScroll("#work")}>WORK</button>
                    <button onClick={() => handleScroll("#about")}>ABOUT</button>
                </div>

            </div>
        </motion.header>
    );
}
