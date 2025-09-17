'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import projects from "../../data/data";
import { useParams } from "next/navigation";

export default function Project() {
    const params = useParams();
    const project = projects.find((p) => p.id.toString() === params.id);

    const [lightboxIndex, setLightboxIndex] = useState(null);

    if (!project)
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <p className="uppercase text-white text-xl">
                    Proyecto no encontrado
                </p>
            </div>
        );

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const prevImage = () =>
        setLightboxIndex((i) => (i > 0 ? i - 1 : project.images.length - 1));
    const nextImage = () =>
        setLightboxIndex((i) => (i < project.images.length - 1 ? i + 1 : 0));

    return (
        <section className="w-screen min-h-screen flex flex-col items-center justify-center pt-40 px-4 pb-20">
            {/* Video */}
            {project.video && (
                <div className="w-full max-w-5xl aspect-video mx-auto">
                    <iframe
                        src={project.video}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={project.title}
                    />
                </div>
            )}

            {/* Información */}
            <div className={`text-center ${project.video ? "mt-6" : "mt-0"}`}>
                <h2 className="font-bold uppercase">
                    “{project.title}”, DIRECTED BY{" "}
                    {Array.isArray(project.director)
                        ? project.director.join(" & ")
                        : project.director}
                    {project.for && project.for.length > 0 && (
                        <>
                            <br />
                            FOR{" "}
                            {Array.isArray(project.for)
                                ? project.for.join(", ")
                                : project.for}
                        </>
                    )}
                </h2>
                <p className="mt-2">{project.year}</p>
                <p className="mt-1">{project.description}</p>
            </div>

            {/* Grid de imágenes */}
            <div
                className="mt-8 lg:grid md:flex gap-0 w-full md:max-w-5xl"
                style={{
                    gridTemplateColumns:
                        project.images.length === 2
                            ? "repeat(2, minmax(0, 1fr))"
                            : project.images.length === 4
                                ? "repeat(2, minmax(0, 1fr))"
                                : project.images.length <= 3
                                    ? `repeat(${project.images.length}, minmax(0, 1fr))`
                                    : "repeat(3, minmax(0, 1fr))",
                }}
            >
                {project.images.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        alt={`${project.title} image ${i + 1}`}
                        className="w-full max-h-[300px] object-cover cursor-pointer hover:opacity-80 transition"
                        onClick={() => openLightbox(i)}
                    />
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeLightbox}
                    >
                        <motion.img
                            key={project.images[lightboxIndex]}
                            src={project.images[lightboxIndex]}
                            className="max-h-[80vh] max-w-[90vw] object-contain"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        />
                        {/* Navegación */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            className="absolute left-4 text-white text-3xl"
                        >
                            ‹
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="absolute right-4 text-white text-3xl"
                        >
                            ›
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
