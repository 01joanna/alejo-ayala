
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { createProject } from "@/services/projects";
import { useAuth } from "@/hooks/useAuth";

export default function NewProject() {
    const router = useRouter();

    const { user, loading: authLoading } = useAuth();

    const [saving, setSaving] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
                ? `${prev.images} \n`
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            return;
        }

        setSaving(true);

        try {
            const newProject = {
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

            const createdProject =
                await createProject(newProject);

            router.push(
                `/work/${createdProject.id} `
            );

        } catch (error) {
            console.error(
                "Error creating project:",
                error
            );

            alert(
                "No se ha podido crear el proyecto."
            );

        } finally {
            setSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <p className="uppercase text-sm">
                    Loading...
                </p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <p className="uppercase text-sm">
                    Acceso no autorizado
                </p>
            </div>
        );
    }

    return (
        <main className="w-screen min-h-screen flex justify-center px-4 py-24">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-black border border-white/30 rounded-2xl p-6 md:p-8 my-8 mt-30"
            >

                {/* HEADER */}

                <div className="flex justify-between items-center mb-8">

                    <h1 className="uppercase font-bold">
                        Nuevo proyecto
                    </h1>

                    <button
                        type="button"
                        onClick={() => router.back()}
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
                            placeholder="Cliente, artista..."
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
                        <label className="block uppercase text-xs mb-3">
                            Category
                        </label>

                        <div className="flex flex-col gap-2">

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
                                        checked={formData.category.includes(category)}
                                        onChange={() =>
                                            handleCategoryChange(category)
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
                                                onClick={() =>
                                                    removeImage(index)
                                                }
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
                        {saving
                            ? "Creando..."
                            : "Crear proyecto"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-white rounded-md uppercase cursor-pointer"
                    >
                        Cancelar
                    </button>

                </div>

            </form>

        </main>
    );
}
