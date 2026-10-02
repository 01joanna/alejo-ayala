"use client";

import React, {
    useEffect,
    useState,
} from "react";

import Work from "./components/Work/Work";
import About from "./components/About/About";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import {
    getHomeSettings,
} from "@/services/settings";


export default function Home() {
    const [
        showAbout,
        setShowAbout,
    ] = useState(false);

    const [
        homeVideo,
        setHomeVideo,
    ] = useState(
        "/reel_home.mp4"
    );


    useEffect(() => {
        const loadHomeVideo =
            async () => {
                try {
                    const settings =
                        await getHomeSettings();

                    if (
                        settings?.video
                    ) {
                        setHomeVideo(
                            settings.video
                        );
                    }
                } catch (error) {
                    console.error(
                        "Error loading home video:",
                        error
                    );
                }
            };

        loadHomeVideo();
    }, []);


    const isVimeo =
        homeVideo.includes(
            "vimeo.com"
        );


    return (
        <section className="relative w-screen min-h-screen pb-20">

            <AnimatePresence>

                {!showAbout && (
                    <motion.div
                        className="relative w-screen h-screen z-10 bg-black overflow-hidden"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                    >

                        {isVimeo ? (
                            <iframe
                                src={`${homeVideo}${homeVideo.includes("?") ? "&" : "?"}autoplay=1&muted=1&loop=1&background=1`}
                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                allow="autoplay; fullscreen"
                                title="Home video"
                            />
                        ) : (
                            <video
                                src={homeVideo}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                            />
                        )}

                    </motion.div>
                )}

            </AnimatePresence>


            {/* ABOUT */}

            <AnimatePresence>

                {showAbout && (
                    <About
                        showAbout={
                            showAbout
                        }
                        setShowAbout={
                            setShowAbout
                        }
                    />
                )}

            </AnimatePresence>


            {/* WORK */}

            <Work />

        </section>
    );
}