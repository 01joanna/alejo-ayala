'use client'
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <motion.header
            initial={{ y: isHome ? 0 : -50, opacity: 0 }}
            animate={{
                y: isHome ? 0 : 0,
                opacity: 1
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className={`
        ${isHome
                    ? "absolute top-0 left-0 w-full h-full flex justify-between items-center px-20 py-10"
                    : "fixed top-0 left-0 w-full flex justify-between items-center px-20 py-6"
                }
        bg-transparent uppercase text-md tracking-widest font-sans text-white z-50 font-extralight
    `}
        >
            <div>
                <a href="/work">Work</a>
            </div>

            <div>
                <a
                    href='/'
                    className="text-[70px] tracking-wider font-ablation"
                >
                    Alejo Ayala
                </a>
            </div>

            <div className="flex gap-10 items-center font-extralight">
                <a href="/about">About</a>

                <div className="relative" onClick={() => setIsOpen(true)}>
                    <button className="all-[unset] uppercase cursor-pointer">
                        Contact
                    </button>

                    {isOpen && (
                        <div className="absolute left-0 top-full mt-2 bg-transparent text-white flex flex-col gap-2 text-xs normal-case text-left p-4">
                            <a href="mailto:tuemail@email.com">Email</a>
                            <a href="https://instagram.com/tuusuario" target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                            <a href="https://linkedin.com/in/tuusuario" target="_blank" rel="noopener noreferrer">
                                Vimeo
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </motion.header>
    );
}
