
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
    getProjects,
    deleteProject,
} from "@/services/projects";

export default function AdminBar() {
    const router = useRouter();

    const { user, loading } = useAuth();

    const [showProjects, setShowProjects] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(false);

    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if (!showProjects || !user) {
            return;
        }

        const loadProjects = async () => {
            setLoadingProjects(true);

            try {
                const data = await getProjects();

                setProjects(
                    data.sort((a, b) =>
                        String(a.title).localeCompare(
                            String(b.title)
                        )
                    )
                );
            } catch (error) {
                console.error(
                    "Error loading projects:",
                    error
                );
            } finally {
                setLoadingProjects(false);
            }
        };

        loadProjects();
    }, [showProjects, user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setShowProjects(false);
            router.push("/");
        } catch (error) {
            console.error(
                "Error cerrando sesión:",
                error
            );
        }
    };

    const handleDelete = async (project) => {
        const confirmed = window.confirm(
            `¿Seguro que quieres borrar "${project.title}" ? `
        );

        if (!confirmed) {
            return;
        }

        setDeleting(project.id);

        try {
            await deleteProject(project.id);

            setProjects((prev) =>
                prev.filter(
                    (item) => item.id !== project.id
                )
            );
        } catch (error) {
            console.error(
                "Error borrando proyecto:",
                error
            );

            alert(
                "No se ha podido borrar el proyecto."
            );
        } finally {
            setDeleting(null);
        }
    };

    if (loading || !user) {
        return null;
    }

    return (
        <>
            {/* ADMIN BAR */}

            <div className="fixed top-6 right-6 z-[100] flex gap-2">

                <button
                    onClick={() => router.push("/work/new")}
                    className="px-4 py-2 bg-white text-black uppercase text-xs rounded-md cursor-pointer hover:opacity-80 transition"
                >
                    New
                </button>

                <button
                    onClick={() =>
                        setShowProjects(true)
                    }
                    className="px-4 py-2 bg-black text-white border border-white/40 uppercase text-xs rounded-md cursor-pointer hover:border-white transition"
                >
                    Proyectos
                </button>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-black text-white border border-white/40 uppercase text-xs rounded-md cursor-pointer hover:border-white transition"
                >
                    Cerrar sesión
                </button>

            </div>


            {/* PROJECTS MODAL */}

            <AnimatePresence>
                {showProjects && (
                    <>
                        {/* BACKDROP */}

                        <motion.div
                            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() =>
                                setShowProjects(false)
                            }
                        />


                        {/* PANEL */}

                        <motion.div
                            className="fixed top-0 right-0 z-[120] w-full md:w-[500px] h-screen bg-black border-l border-white/20 p-6 md:p-8 overflow-y-auto"
                            initial={{
                                x: "100%",
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: "100%",
                            }}
                            transition={{
                                duration: 0.4,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >

                            {/* HEADER */}

                            <div className="flex justify-between items-center mb-10">

                                <h2 className="uppercase font-bold">
                                    Proyectos
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowProjects(false)
                                    }
                                    className="text-2xl cursor-pointer"
                                >
                                    ×
                                </button>

                            </div>


                            {/* NEW PROJECT */}

                            <button
                                onClick={() =>
                                    router.push("/work/new")
                                }
                                className="w-full border border-white/30 rounded-md px-4 py-3 uppercase text-xs mb-8 cursor-pointer hover:border-white transition"
                            >
                                + Nuevo proyecto
                            </button>


                            {/* PROJECTS */}

                            {loadingProjects ? (
                                <p className="uppercase text-xs opacity-60">
                                    Cargando...
                                </p>
                            ) : (
                                <div className="flex flex-col">

                                    {projects.map(
                                        (project) => (
                                            <div
                                                key={project.id}
                                                className="flex items-center justify-between gap-4 py-4 border-b border-white/10"
                                            >

                                                <button
                                                    onClick={() => {
                                                        setShowProjects(false);
                                                        router.push(`/work/${project.id}`);
                                                    }}
                                                    className="text-left uppercase text-sm cursor-pointer hover:opacity-60 transition flex-1"
                                                >
                                                    {project.title}
                                                </button>


                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() => {
                                                            setShowProjects(
                                                                false
                                                            );

                                                            router.push(
                                                                `/work/${project.id}`
                                                            );
                                                        }}
                                                        className="text-xs uppercase underline cursor-pointer"
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                project
                                                            )
                                                        }
                                                        disabled={
                                                            deleting ===
                                                            project.id
                                                        }
                                                        className="text-xs uppercase underline cursor-pointer disabled:opacity-40"
                                                    >
                                                        {deleting ===
                                                            project.id
                                                            ? "..."
                                                            : "Borrar"}
                                                    </button>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

