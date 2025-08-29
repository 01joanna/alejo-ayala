"use client";
import React from "react";
import projects from "../../data/data";
import { useParams } from "next/navigation";

export default function Project() {
    const params = useParams();
    const project = projects.find((p) => p.id.toString() === params.id);

    if (!project)
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <p className="uppercase text-white text-xl">
                    Proyecto no encontrado
                </p>
            </div>
        );

    return (
        <section className="w-screen min-h-screen flex flex-col items-center justify-center pt-40 px-4 pb-20">
            {project.video && (
                <div className="w-full max-w-5xl aspect-video mx-auto">
                    <iframe
                        src={project.video}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={project.title}
                    ></iframe>
                </div>
            )}

            <div className={`text-center ${project.video ? "mt-6" : "mt-0"}`}>
                <h2 className="font-bold uppercase">
                    “{project.title}”, DIRECTED BY{" "}
                    {Array.isArray(project.director)
                        ? project.director.join(" & ")
                        : project.director} <br />
                    FOR{" "}
                    {Array.isArray(project.for)
                        ? project.for.join(", ")
                        : project.for}
                </h2>
                <p className="mt-2">{project.year}</p>
                <p className="mt-1">{project.description}</p>
            </div>
            <div
                className="mt-8 w-full grid px-20"
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
                    <div key={i} className="w-full overflow-hidden">
                        <img
                            src={img}
                            alt={`${project.title} image ${i + 1}`}
                            className="w-full max-h-[300px] object-cover"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
