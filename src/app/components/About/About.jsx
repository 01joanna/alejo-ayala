"use client";

import React, {
    useEffect,
    useState,
} from "react";

import { motion } from "framer-motion";

import { getHomeSettings } from "@/services/settings";

export default function About({
    showAbout,
    setShowAbout,
}) {
    const [
        aboutDescription,
        setAboutDescription,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(true);


    // --------------------------------
    // LOAD ABOUT
    // --------------------------------

    useEffect(() => {
        const loadAbout =
            async () => {
                try {
                    const settings =
                        await getHomeSettings();

                    setAboutDescription(
                        settings.aboutDescription ||
                            ""
                    );

                } catch (error) {
                    console.error(
                        "Error loading About:",
                        error
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadAbout();
    }, []);


    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 0.8,
            }}
            exit={{
                opacity: 0,
            }}
            transition={{
                duration: 0.5,
            }}
            className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-90 text-white p-8"
        >

            <div className="max-w-3xl text-center font-helveticaLight text-sm pt-30">

                <div className="flex flex-col gap-12">

                    {/* DESCRIPTION */}

                    <h2 className="text-justify font-helvetica uppercase whitespace-pre-line">

                        {loading
                            ? "Loading..."
                            : aboutDescription}

                    </h2>


                    {/* SOCIAL / CONTACT */}

                    <div className="text-xs font-helveticaBold lowercase">

                        <p>
                            <a
                                href="https://www.instagram.com/alej0ayala/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Instagram / alej0ayala
                            </a>
                        </p>

                        <p>
                            <a
                                href="https://vimeo.com/alejoayala"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Vimeo / @alejoayala
                            </a>
                        </p>

                        <p>
                            <a href="mailto:alejoayalahdz@gmail.com">
                                Contact / alejoayalahdz@gmail.com
                            </a>
                        </p>

                    </div>

                </div>


                {/* CLOSE */}

                <button
                    onClick={() =>
                        setShowAbout(false)
                    }
                    className="mt-8 px-6 py-3 tracking-widest hover:bg-white hover:text-black transition cursor-pointer uppercase"
                >
                    X Close
                </button>

            </div>

        </motion.div>
    );
}