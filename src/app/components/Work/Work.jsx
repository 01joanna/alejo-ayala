"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjects } from "@/services/projects";

export default function Work() {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState("all");

    const group1 = ["all"];
    const group2 = ["director", "editor"];
    const group3 = ["commercial", "music video"];

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Error loading projects:", error);
            }
        };

        loadProjects();
    }, []);

    const filteredProjects = projects
        .filter((project) => {
            if (filter === "all") return true;

            return project.category.some(
                (cat) => cat.toLowerCase() === filter
            );
        })
        .sort((a, b) => Number(b.year) - Number(a.year));


    const renderFilterButtons = (group) => (
        <div className="flex gap-2">
            {group.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 uppercase text-sm cursor-pointer transition ${filter === cat
                            ? "bg-white text-black"
                            : "bg-transparent text-white"
                        }`}
                >
                    {cat === "all"
                        ? "All"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
            ))}
        </div>
    );

    return (
        <section id="work" className="md:mt-20 mt-0">
            <div className="w-full flex justify-center lg:gap-56 md:gap-0 flex-wrap pt-10 pb-6">
                {renderFilterButtons(group1)}
                {renderFilterButtons(group2)}
                {renderFilterButtons(group3)}
            </div>

            <div className="w-screen min-h-screen pt-3 grid grid-cols-1 md:grid-cols-2">
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <motion.a
                            key={project.id}
                            href={`/work/${project.id}`}
                            className="w-full h-[300px] overflow-hidden relative group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <img
                                src={project.images[0]}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:opacity-70"
                            />

                            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-500 group-hover:opacity-50 text-white text-center px-4">
                                <h2 className="text-lg font-semibold uppercase">
                                    {project.title}
                                </h2>

                                <p className="text-xs mt-1 uppercase tracking-widest">
                                    {project.for.join(" & ")}
                                </p>

                                <p className="text-sm mt-1">
                                    {project.year}
                                </p>
                            </div>
                        </motion.a>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}