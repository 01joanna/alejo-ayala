"use client"
import React from 'react';
import projects from '../../data/data.jsx';

export default function Work() {
    return (
        <section 
        id='work'
        className="w-screen min-h-screen pt-40 grid grid-cols-1 md:grid-cols-2">
            {projects.map((project, index) => (
                <a
                    key={index}
                    className="w-full h-[300px] overflow-hidden relative group"
                    href={`/work/${project.id}`}
                >
                    <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:opacity-70"
                    />

                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-500 group-hover:opacity-50 text-white text-center px-4">
                        <h2 className="text-xl font-semibold uppercase ">{project.title}</h2>
                        <p className="text-sm mt-1">{project.director}</p>
                        <p className="text-sm mt-1">{project.year}</p>
                    </div>
                </a>
            ))}
        </section>
    )
}
