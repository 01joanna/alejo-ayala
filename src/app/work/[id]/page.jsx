"use client";
import React from "react";
import projects from "../../data/data";
import { useParams } from "next/navigation";

export default function Project() {
    const params = useParams();
    const project = projects.find((p) => p.id.toString() === params.id);

    if (!project) return <p>Proyecto no encontrado</p>;

    return (
        <section className="w-screen min-h-screen flex flex-col items-center justify-center pt-40 px-4 pb-30">
            <div className="w-full max-w-6xl aspect-video mx-auto">
                <iframe
                    src={project.video}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                />
            </div>
            <div className="mt-4 text-center">
                <h2 className="font-bold uppercase">
                    “{project.title}” | DIRECTED BY {project.director} FOR {project.for}
                </h2>
                <p className="mt-2">{project.year}</p>
                <p className="mt-1">{project.description}</p>
            </div>
            <div className="mt-8 w-full grid px-20"
                style={{
                    gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(project.images.length))}, minmax(0, 1fr))`
                }}
            >
                {project.images.map((img, i) => (
                    <div key={i} className="w-full h-48 overflow-hidden">
                        <img
                            src={img}
                            alt={`${project.title} image ${i + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
