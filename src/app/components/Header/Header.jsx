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
                
                {/* Logo: enlace a home con scroll smooth */}
                <Link href="/" scroll={false}>
                    <div className="w-screen flex justify-evenly px-[25rem] text-[20px] font-helveticaBold cursor-pointer">
                        {logoText.split("").map((char, index) => (
                            <span key={index}>{char}</span>
                        ))}
                    </div>
                </Link>

                {/* Menú alineado con el logo */}
                <div className="w-screen flex justify-between px-[27rem] mt-4 uppercase">
                    <a href="#work">Work</a>
                    <a href="#about">About</a>
                </div>

            </div>
        </motion.header>
    );
}
