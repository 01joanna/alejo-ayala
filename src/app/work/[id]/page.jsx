"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

import {
    getProjectById,
    updateProject,
    deleteProject,
} from "@/services/projects";

import { useAuth } from "@/hooks/useAuth";

export default function Project() {
    const params = useParams();
    const router = useRouter();

    const { user, loading: authLoading } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [lightboxIndex, setLightboxIndex] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        for: "",
        director: "",
        producer: "",
        year: "",
        category: [],
        video: "",
        images: "",
    });

    useEffect(() => {
        const loadProject = async () => {
            try {
                const data = await getProjectById(params.id);

                setProject(data);

                if (data) {
                    setFormData({
                        title: data.title || "",

                        for: Array.isArray(data.for)
                            ? data.for.join(", ")
                            : data.for || "",

                        director: Array.isArray(data.director)
                            ? data.director.join(", ")
                            : data.director || "",

                        producer: Array.isArray(data.producer)
                            ? data.producer.join(", ")
                            : data.producer || "",

                        year: data.year || "",

                        category: Array.isArray(project.category)
                        ? project.category
                        : project.category
                            ? [project.category]
                            : [],

                        video: data.video || "",

                        images: Array.isArray(data.images)
                            ? data.images.join("\n")
                            : "",
                    });
                }
            } catch (error) {
                console.error("Error loading project:", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            loadProject();
        }
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (index, value) => {
        const images = formData.images
            ? formData.images.split("\n")
            : [""];

        images[index] = value;

        setFormData((prev) => ({
            ...prev,
            images: images.join("\n"),
        }));
    };

    const addImage = () => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images
                ? `${prev.images}\n`
                : "",
        }));
    };

    const removeImage = (index) => {
        const images = formData.images
            ? formData.images.split("\n")
            : [];

        images.splice(index, 1);

        setFormData((prev) => ({
            ...prev,
            images: images.join("\n"),
        }));
    };

    const handleCategoryChange = (category) => {
        setFormData((prev) => ({
            ...prev,
            category: prev.category.includes(category)
                ? prev.category.filter((item) => item !== category)
                : [...prev.category, category],
        }));
    };


    const handleEdit = () => {
        setFormData({
            title: project.title || "",

            for: Array.isArray(project.for)
                ? project.for.join(", ")
                : project.for || "",

            director: Array.isArray(project.director)
                ? project.director.join(", ")
                : project.director || "",

            producer: Array.isArray(project.producer)
                ? project.producer.join(", ")
                : project.producer || "",

            year: project.year || "",

            category: Array.isArray(project.category)
            ? project.category
            : project.category
                ? [project.category]
                : [],

            video: project.video || "",

            images: Array.isArray(project.images)
                ? project.images.join("\n")
                : "",
        });

        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        setSaving(true);

        try {
            const updatedProject = {
                title: formData.title.trim(),

                for: formData.for
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                director: formData.director
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                producer: formData.producer
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                year: formData.year.trim(),
                category: formData.category,

                video: formData.video.trim(),

                images: formData.images
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
            };

            await updateProject(project.id, updatedProject);

            setProject({
                ...project,
                ...updatedProject,
            });

            setEditing(false);
        } catch (error) {
            console.error("Error updating project:", error);
            alert("No se ha podido guardar el proyecto.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `¿Seguro que quieres eliminar "${project.title}"?`
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);

        try {
            await deleteProject(project.id);

            router.push("/");
        } catch (error) {
            console.error("Error deleting project:", error);

            alert("No se ha podido eliminar el proyecto.");

            setDeleting(false);
        }
    };

    const openLightbox = (index) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const prevImage = () => {
        setLightboxIndex((i) =>
            i > 0 ? i - 1 : project.images.length - 1
        );
    };

    const nextImage = () => {
        setLightboxIndex((i) =>
            i < project.images.length - 1 ? i + 1 : 0
        );
    };

    if (loading || authLoading) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <p className="uppercase text-white text-xl">
                    Loading...
                </p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <p className="uppercase text-white text-xl">
                    Proyecto no encontrado
                </p>
            </div>
        );
    }

    return (
        <section className="w-screen min-h-screen flex flex-col items-center justify-center pt-40 px-4 pb-20">

            {/* =========================
                PROJECT
            ========================= */}

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

            {/* INFORMATION */}

            <div
                className={`text-center ${project.video ? "mt-6" : "mt-0"
                    }`}
            >
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

                <p className="mt-2">
                    {project.year}
                </p>

                {project.description && (
                    <p className="mt-1">
                        {project.description}
                    </p>
                )}
            </div>

            {/* IMAGES */}

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
                {project.id !== "8" &&
                    project.images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={`${project.title} image ${i + 1}`}
                            className="w-full max-h-[300px] object-cover cursor-pointer hover:opacity-80 transition"
                            onClick={() => openLightbox(i)}
                        />
                    ))}
            </div>

            {/* ADMIN BUTTONS */}

            {user && (
                <div className="flex gap-4 mt-10">
                    <button
                        onClick={handleEdit}
                        className="px-6 py-3 bg-white text-black uppercase cursor-pointer"
                    >
                        Editar proyecto
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-6 py-3 border border-white uppercase cursor-pointer disabled:opacity-50"
                    >
                        {deleting
                            ? "Borrando..."
                            : "Borrar proyecto"}
                    </button>
                </div>
            )}

            {/* =========================
                LIGHTBOX
            ========================= */}

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

            {/* =========================
                EDIT MODAL
            ========================= */}

            <AnimatePresence>
                {editing && (
                    <>
                        {/* BACKDROP */}

                        <motion.div
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            onClick={handleCancel}
                        />

                        {/* MODAL */}

                        <motion.div
                            className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <motion.form
                                onSubmit={handleSave}
                                onClick={(e) => e.stopPropagation()}
                                className="
        pointer-events-auto
        w-[70%]
        max-w-2xl
        max-h-[calc(100vh-4rem)]
        overflow-y-auto
        bg-black
        border
        border-white/30
        rounded-2xl
        p-6
        md:p-8
        my-8
    "
                                initial={{
                                    opacity: 0,
                                    scale: 0.96,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.96,
                                    y: 20,
                                }}
                                transition={{
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                {/* HEADER */}

                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="uppercase font-bold">
                                        Editar proyecto
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="text-2xl leading-none cursor-pointer"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* FORM */}

                                <div className="flex flex-col gap-5">

                                    {/* TITLE */}

                                    <div>
                                        <label className="block uppercase text-xs mb-2">
                                            Title
                                        </label>

                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border border-white/40 rounded-md px-4 py-3 outline-none focus:border-white"
                                            required
                                        />
                                    </div>


                                    {/* FOR */}

                                    <div>
                                        <label className="block uppercase text-xs mb-2">
                                            For
                                        </label>

                                        <input
                                            name="for"
                                            value={formData.for}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border border-white/40 rounded-md px-4 py-3 outline-none focus:border-white"
                                        />
                                    </div>


                                    {/* DIRECTOR */}

                                    <div>
                                        <label className="block uppercase text-xs mb-2">
                                            Director
                                        </label>

                                        <input
                                            name="director"
                                            value={formData.director}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border border-white/40 rounded-md px-4 py-3 outline-none focus:border-white"
                                        />
                                    </div>


                                    {/* PRODUCER */}

                                    <div>
                                        <label className="block uppercase text-xs mb-2">
                                            Producer
                                        </label>

                                        <input
                                            name="producer"
                                            value={formData.producer}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border border-white/40 rounded-md px-4 py-3 outline-none focus:border-white"
                                        />
                                    </div>


                                    {/* YEAR */}

                                    <div>
                                        <label className="block uppercase text-xs mb-2">
                                            Year
                                        </label>

                                        <input
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border border-white/40 rounded-md px-4 py-3 outline-none focus:border-white"
                                        />
                                    </div>


                                    {/* CATEGORY */}

                                    <div>
                                        <label className="block uppercase text-xs mb-2">
                                            Category
                                        </label>

                                        <input
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            placeholder="Director, Editor, Music Video"
                                            className="w-full bg-transparent border border-white/40 rounded-md px-4 py-3 outline-none focus:border-white"
                                        />
                                    </div>


                                    {/* VIDEO */}

                                    <div>
                                        <label className="block uppercase text-xs mb-2">
                                            Video
                                        </label>

                                        <input
                                            name="video"
                                            value={formData.video}
                                            onChange={handleChange}
                                            placeholder="https://player.vimeo.com/..."
                                            className="w-full bg-transparent border border-white/40 rounded-md px-4 py-3 outline-none focus:border-white"
                                        />
                                    </div>


                                    {/* IMAGES */}

                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block uppercase text-xs">
                                                Images
                                            </label>

                                            <button
                                                type="button"
                                                onClick={addImage}
                                                className="text-xs uppercase underline cursor-pointer"
                                            >
                                                + Añadir imagen
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-4">

                                            {(formData.images
                                                ? formData.images.split("\n")
                                                : [""]
                                            ).map((image, index) => (

                                                <div
                                                    key={index}
                                                    className="flex gap-3 items-end"
                                                >
                                                    <div className="flex-1">

                                                        <label className="block uppercase text-[10px] mb-2 opacity-70">
                                                            Image {index + 1}
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={image}
                                                            onChange={(e) =>
                                                                handleImageChange(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="https://..."
                                                            className="w-full bg-transparent border border-white/40 rounded-md px-4 py-3 outline-none focus:border-white"
                                                        />

                                                    </div>

                                                    {(formData.images
                                                        ? formData.images.split("\n").length
                                                        : 1) > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="h-[46px] px-3 border border-white/30 rounded-md text-lg cursor-pointer hover:border-white transition"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                </div>

                                            ))}

                                        </div>
                                    </div>

                                </div>


                                {/* ACTIONS */}

                                <div className="flex gap-4 mt-8 pt-2">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-3 bg-white text-black uppercase rounded-md cursor-pointer disabled:opacity-50"
                                    >
                                        {saving ? "Guardando..." : "Guardar"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3 border border-white rounded-md uppercase cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                </div>

                            </motion.form>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </section>
    );
}