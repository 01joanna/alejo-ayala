'use client';
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function Header({ scrollY, onAboutClick, showAbout }) {
    const controls = useAnimation();
    const router = useRouter();
    const pathname = usePathname();

    const isHome = pathname === "/";

    useEffect(() => {
        if (showAbout) {
            controls.start({ top: "20%", y: 0, transition: { duration: 0.5 } });
        } else if (!isHome) {
            controls.start({ top: "0px", y: 0, transition: { duration: 0.5 } });
        } else {
            controls.start({
                top: scrollY > 10 ? "0px" : "50%",
                y: scrollY > 10 ? 0 : "-50%",
                transition: { duration: 0.5 }
            });
        }
    }, [scrollY, showAbout, isHome, controls]);


    const handleHomeClick = () => {
        if (!isHome) {
            router.push("/");
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" }); 
        }
    };

    const handleWorkClick = () => {
        if (!isHome) {
            router.push("/#work");
        } else {
            document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <motion.header
            animate={controls}
            initial={{ top: "50%", y: "-50%" }}
            className="fixed left-0 w-full px-8 py-6 bg-transparent uppercase text-md tracking-widest text-white z-50 font-helveticaLight"
        >
            <div className="max-w-7xl w-full mx-auto flex items-center justify-evenly">
                
            <button className="cursor-pointer" onClick={handleWorkClick}>WORK</button>
            <h1 className="font-helveticaBold cursor-pointer tracking-widest"
            onClick={handleHomeClick}>Alejo Ayala</h1>
            <button className="cursor-pointer" onClick={onAboutClick}>ABOUT</button>


            </div>
        </motion.header>
    );
}
