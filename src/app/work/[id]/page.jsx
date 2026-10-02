"use client";

import React, {
    useEffect,
    useState,
    useRef,
} from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import {
    getProjectById,
    updateProject,
    deleteProject,
} from "@/services/projects";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import { useAuth } from "@/hooks/useAuth";


export default function Project() {

    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        for: [],
        director: [],
        producer: [],
        year: "",
        category: [],
        video: "",
        images: [],
    });

    const [selectedImage, setSelectedImage] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | LOAD PROJECT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadProject = async () => {

            try {

                const data = await getProjectById(params.id);

                if (!data) {
                    router.push("/work");
                    return;
                }

                setProject(data);

                /*
                 * Normalizamos todos los campos que deberían ser arrays.
                 *
                 * Esto permite trabajar correctamente tanto con proyectos
                 * antiguos que tengan strings como con proyectos nuevos
                 * que ya tengan arrays.
                 */

                setFormData({
                    title: data.title || "",

                    for: Array.isArray(data.for)
                        ? data.for
                        : data.for
                            ? [data.for]
                            : [],

                    director: Array.isArray(data.director)
                        ? data.director
                        : data.director
                            ? [data.director]
                            : [],

                    producer: Array.isArray(data.producer)
                        ? data.producer
                        : data.producer
                            ? [data.producer]
                            : [],

                    year: data.year || "",

                    /*
                     * IMPORTANTE:
                     * usamos data.category y no project.category.
                     */
                    category: Array.isArray(data.category)
                        ? data.category
                        : data.category
                            ? [data.category]
                            : [],

                    video: data.video || "",

                    images: Array.isArray(data.images)
                        ? data.images
                        : data.images
                            ? [data.images]
                            : [],
                });

            } catch (error) {

                console.error(
                    "Error loading project:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };


        if (params.id) {
            loadProject();
        }

    }, [params.id, router]);


    /*
    |--------------------------------------------------------------------------
    | GENERAL INPUT CHANGE
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    /*
    |--------------------------------------------------------------------------
    | CATEGORY CHANGE
    |--------------------------------------------------------------------------
    */

    const handleCategoryChange = (category) => {

        setFormData((prev) => {

            const currentCategories = Array.isArray(prev.category)
                ? prev.category
                : [];

            const alreadySelected =
                currentCategories.includes(category);

            return {
                ...prev,

                category: alreadySelected
                    ? currentCategories.filter(
                        (item) => item !== category
                    )
                    : [
                        ...currentCategories,
                        category,
                    ],
            };

        });

    };


    /*
    |--------------------------------------------------------------------------
    | EDIT PROJECT
    |--------------------------------------------------------------------------
    */

    const handleEdit = () => {

        if (!project) return;

        setFormData({

            title: project.title || "",

            for: Array.isArray(project.for)
                ? project.for
                : project.for
                    ? [project.for]
                    : [],

            director: Array.isArray(project.director)
                ? project.director
                : project.director
                    ? [project.director]
                    : [],

            producer: Array.isArray(project.producer)
                ? project.producer
                : project.producer
                    ? [project.producer]
                    : [],

            year: project.year || "",

            category: Array.isArray(project.category)
                ? project.category
                : project.category
                    ? [project.category]
                    : [],

            video: project.video || "",

            images: Array.isArray(project.images)
                ? project.images
                : project.images
                    ? [project.images]
                    : [],
        });

        setShowEdit(true);

    };


    /*
    |--------------------------------------------------------------------------
    | SAVE PROJECT
    |--------------------------------------------------------------------------
    */

    const handleSave = async () => {

        if (!project) return;

        setSaving(true);

        try {

            /*
             * Normalizamos absolutamente todo antes de enviarlo
             * a Firebase.
             */

            const updatedProject = {

                title: formData.title.trim(),

                for: Array.isArray(formData.for)
                    ? formData.for
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : formData.for
                        ? [formData.for.trim()]
                        : [],

                director: Array.isArray(formData.director)
                    ? formData.director
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : formData.director
                        ? [formData.director.trim()]
                        : [],

                producer: Array.isArray(formData.producer)
                    ? formData.producer
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : formData.producer
                        ? [formData.producer.trim()]
                        : [],

                year: formData.year.trim(),

                /*
                 * SIEMPRE ARRAY
                 */
                category: Array.isArray(formData.category)
                    ? formData.category
                    : formData.category
                        ? [formData.category]
                        : [],

                video: formData.video.trim(),

                images: Array.isArray(formData.images)
                    ? formData.images
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : formData.images
                        ? [formData.images.trim()]
                        : [],
            };


            await updateProject(
                project.id,
                updatedProject
            );


            /*
             * Actualizamos inmediatamente el proyecto mostrado
             * sin tener que volver a hacer fetch.
             */

            setProject((prev) => ({
                ...prev,
                ...updatedProject,
            }));

            setFormData((prev) => ({
                ...prev,
                ...updatedProject,
            }));

            setShowEdit(false);

        } catch (error) {

            console.error(
                "Error updating project:",
                error
            );

        } finally {

            setSaving(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | DELETE PROJECT
    |--------------------------------------------------------------------------
    */

    const handleDelete = async () => {

        if (!project) return;

        setDeleting(true);

        try {

            await deleteProject(project.id);

            router.push("/work");

        } catch (error) {

            console.error(
                "Error deleting project:",
                error
            );

            setDeleting(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="uppercase text-xs">
                    Loading...
                </p>
            </main>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | PROJECT NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!project) {

        return null;

    }


    /*
    |--------------------------------------------------------------------------
    | NORMALIZED DISPLAY DATA
    |--------------------------------------------------------------------------
    */

    const categories = Array.isArray(project.category)
        ? project.category
        : project.category
            ? [project.category]
            : [];

    const directors = Array.isArray(project.director)
        ? project.director
        : project.director
            ? [project.director]
            : [];

    const producers = Array.isArray(project.producer)
        ? project.producer
        : project.producer
            ? [project.producer]
            : [];

    const projectFor = Array.isArray(project.for)
        ? project.for
        : project.for
            ? [project.for]
            : [];

    const images = Array.isArray(project.images)
        ? project.images
        : project.images
            ? [project.images]
            : [];


    return (

        <main className="relative min-h-screen bg-black text-white">

            {/* ============================================================
                PROJECT
            ============================================================ */}

            <section className="min-h-screen">

                {/* VIDEO */}

                <div className="relative w-full h-screen">

                    {project.video && (

                        <iframe
                            src={project.video}
                            className="absolute inset-0 w-full h-full"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />

                    )}

                </div>


                {/* ========================================================
                    INFO
                ======================================================== */}

                <section className="px-6 md:px-10 py-16">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* LEFT */}

                        <div>

                            <h1 className="uppercase text-2xl md:text-4xl">
                                {project.title}
                            </h1>

                            {project.year && (

                                <p className="uppercase text-xs mt-2">
                                    {project.year}
                                </p>

                            )}

                        </div>


                        {/* RIGHT */}

                        <div className="uppercase text-xs space-y-4">

                            {projectFor.length > 0 && (

                                <div>
                                    <span className="opacity-50">
                                        For
                                    </span>

                                    <div className="mt-1">
                                        {projectFor.map(
                                            (item, index) => (
                                                <div key={index}>
                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                            )}


                            {directors.length > 0 && (

                                <div>
                                    <span className="opacity-50">
                                        Director
                                    </span>

                                    <div className="mt-1">
                                        {directors.map(
                                            (item, index) => (
                                                <div key={index}>
                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                            )}


                            {producers.length > 0 && (

                                <div>
                                    <span className="opacity-50">
                                        Producer
                                    </span>

                                    <div className="mt-1">
                                        {producers.map(
                                            (item, index) => (
                                                <div key={index}>
                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                            )}


                            {categories.length > 0 && (

                                <div>
                                    <span className="opacity-50">
                                        Category
                                    </span>

                                    <div className="mt-1">
                                        {categories.map(
                                            (item, index) => (
                                                <div key={index}>
                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                            )}

                        </div>

                    </div>

                </section>


                {/* ========================================================
                    IMAGES
                ======================================================== */}

                {project.id !== "8" &&
                    images.length > 0 && (

                        <section className="grid grid-cols-1 md:grid-cols-2">

                            {images.map(
                                (image, index) => (

                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() =>
                                            setSelectedImage(image)
                                        }
                                        className="relative w-full aspect-video overflow-hidden cursor-pointer"
                                    >

                                        <img
                                            src={image}
                                            alt={`${project.title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                    </button>

                                )
                            )}

                        </section>

                    )}


            </section>


            {/* ============================================================
                ADMIN BUTTONS
            ============================================================ */}

            {user && (

                <div className="fixed bottom-6 right-6 z-50 flex gap-2">

                    <button
                        onClick={handleEdit}
                        className="bg-white text-black px-5 py-3 uppercase text-xs cursor-pointer"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() =>
                            setShowDeleteConfirm(true)
                        }
                        className="bg-white text-black px-5 py-3 uppercase text-xs cursor-pointer"
                    >
                        Delete
                    </button>

                </div>

            )}


            {/* ============================================================
                IMAGE LIGHTBOX
            ============================================================ */}

            <AnimatePresence>

                {selectedImage && (

                    <motion.div
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() =>
                            setSelectedImage(null)
                        }
                    >

                        <motion.img
                            src={selectedImage}
                            alt={project.title}
                            className="max-w-full max-h-full object-contain"
                            initial={{
                                scale: 0.95,
                            }}
                            animate={{
                                scale: 1,
                            }}
                            exit={{
                                scale: 0.95,
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        />

                    </motion.div>

                )}

            </AnimatePresence>


            {/* ============================================================
                EDIT MODAL
            ============================================================ */}

            <AnimatePresence>

                {showEdit && (

                    <motion.div
                        className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center p-6 overflow-y-auto"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                    >

                        <motion.div
                            className="relative w-full max-w-2xl bg-white text-black p-6 md:p-10"
                            initial={{
                                y: 30,
                                opacity: 0,
                            }}
                            animate={{
                                y: 0,
                                opacity: 1,
                            }}
                            exit={{
                                y: 30,
                                opacity: 0,
                            }}
                        >

                            {/* CLOSE */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowEdit(false)
                                }
                                className="absolute top-4 right-4 text-xs uppercase cursor-pointer"
                            >
                                Close
                            </button>


                            <h2 className="uppercase text-xl mb-8">
                                Edit project
                            </h2>


                            <div className="space-y-6">

                                {/* TITLE */}

                                <div>

                                    <label className="block uppercase text-xs mb-2">
                                        Title
                                    </label>

                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full border-b border-black py-2 outline-none"
                                    />

                                </div>


                                {/* FOR */}

                                <div>

                                    <label className="block uppercase text-xs mb-2">
                                        For
                                    </label>

                                    <input
                                        value={formData.for.join(", ")}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                for: e.target.value
                                                    .split(",")
                                                    .map((item) =>
                                                        item.trim()
                                                    )
                                                    .filter(Boolean),
                                            }))
                                        }
                                        className="w-full border-b border-black py-2 outline-none"
                                    />

                                </div>


                                {/* DIRECTOR */}

                                <div>

                                    <label className="block uppercase text-xs mb-2">
                                        Director
                                    </label>

                                    <input
                                        value={formData.director.join(", ")}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                director: e.target.value
                                                    .split(",")
                                                    .map((item) =>
                                                        item.trim()
                                                    )
                                                    .filter(Boolean),
                                            }))
                                        }
                                        className="w-full border-b border-black py-2 outline-none"
                                    />

                                </div>


                                {/* PRODUCER */}

                                <div>

                                    <label className="block uppercase text-xs mb-2">
                                        Producer
                                    </label>

                                    <input
                                        value={formData.producer.join(", ")}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                producer: e.target.value
                                                    .split(",")
                                                    .map((item) =>
                                                        item.trim()
                                                    )
                                                    .filter(Boolean),
                                            }))
                                        }
                                        className="w-full border-b border-black py-2 outline-none"
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
                                        className="w-full border-b border-black py-2 outline-none"
                                    />

                                </div>


                                {/* ==================================================
                                    CATEGORY
                                ================================================== */}

                                <div>

                                    <label className="block uppercase text-xs mb-3">
                                        Category
                                    </label>

                                    <div className="flex flex-col gap-3">

                                        {[
                                            "director",
                                            "editor",
                                            "commercial",
                                            "music video",
                                        ].map((category) => (

                                            <label
                                                key={category}
                                                className="flex items-center gap-3 cursor-pointer uppercase text-xs"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        formData.category.includes(
                                                            category
                                                        )
                                                    }
                                                    onChange={() =>
                                                        handleCategoryChange(
                                                            category
                                                        )
                                                    }
                                                    className="cursor-pointer"
                                                />

                                                {category}

                                            </label>

                                        ))}

                                    </div>

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
                                        className="w-full border-b border-black py-2 outline-none"
                                    />

                                </div>


                                {/* IMAGES */}

                                <div>

                                    <label className="block uppercase text-xs mb-2">
                                        Images
                                    </label>

                                    <textarea
                                        value={formData.images.join("\n")}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                images: e.target.value
                                                    .split("\n")
                                                    .map((item) =>
                                                        item.trim()
                                                    )
                                                    .filter(Boolean),
                                            }))
                                        }
                                        rows={5}
                                        className="w-full border border-black p-3 outline-none resize-none"
                                        placeholder="One image URL per line"
                                    />

                                </div>


                                {/* ACTIONS */}

                                <div className="flex gap-3 pt-4">

                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-black text-white px-6 py-3 uppercase text-xs cursor-pointer disabled:opacity-50"
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowEdit(false)
                                        }
                                        className="border border-black px-6 py-3 uppercase text-xs cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>


            {/* ============================================================
                DELETE CONFIRMATION
            ============================================================ */}

            <AnimatePresence>

                {showDeleteConfirm && (

                    <motion.div
                        className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-6"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                    >

                        <motion.div
                            className="bg-white text-black w-full max-w-md p-8"
                            initial={{
                                scale: 0.95,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                            exit={{
                                scale: 0.95,
                                opacity: 0,
                            }}
                        >

                            <h2 className="uppercase text-lg mb-4">
                                Delete project
                            </h2>

                            <p className="text-sm mb-8">
                                Are you sure you want to delete{" "}
                                <strong>
                                    "{project.title}"
                                </strong>
                                ?
                            </p>


                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="bg-black text-white px-6 py-3 uppercase text-xs cursor-pointer disabled:opacity-50"
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : "Yes, delete"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDeleteConfirm(false)
                                    }
                                    className="border border-black px-6 py-3 uppercase text-xs cursor-pointer"
                                >
                                    Cancel
                                </button>

                            </div>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

        </main>
    );
}