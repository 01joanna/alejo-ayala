'use client';
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header({ scrollY }) {
    const controls = useAnimation();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/") {
            // Comportamiento con animación en home
            if (scrollY > 10) {
                controls.start({ top: 0, y: 0, transition: { duration: 0.5 } });
            } else {
                controls.start({ top: "50%", y: "-50%", transition: { duration: 0.5 } });
            }
        } else {
            // En cualquier otra página, fijo arriba
            controls.start({ top: 0, y: 0, transition: { duration: 0.5 } });
        }
    }, [scrollY, controls, pathname]);

    return (
        <motion.header
            animate={controls}
            initial={{
                top: pathname === "/" ? "50%" : 0,
                y: pathname === "/" ? "-50%" : 0,
            }}
            className="fixed left-0 w-full flex justify-between items-center px-64 py-6 bg-transparent uppercase text-md tracking-widest text-white z-50 font-helvetica"
        >
            <div><a href="#work">Work</a></div>
            <div><a href="/" className="text-[50px] tracking-wider font-helveticaLight">Alejo Ayala</a></div>
            <div className="flex gap-10 items-center uppercase">
                <a href="mailto:tuemail@email.com">Contact</a>
            </div>
        </motion.header>
    );
}
