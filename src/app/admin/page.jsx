"use client";

import React, {
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    getProjects,
    deleteProject,
    updateProjectOrder,
} from "@/services/projects";

import {
    getHomeSettings,
    updateHomeVideo,
    updateAboutDescription,
} from "@/services/settings";

import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
    const router = useRouter();

    const {
        user,
        loading: authLoading,
    } = useAuth();

    const [
        projects,
        setProjects,
    ] = useState([]);

    const [
        selectedProjects,
        setSelectedProjects,
    ] = useState([]);

    const [
        loadingProjects,
        setLoadingProjects,
    ] = useState(true);

    const [
        deleting,
        setDeleting,
    ] = useState(false);

    const [
        draggedProject,
        setDraggedProject,
    ] = useState(null);

    const [
        savingOrder,
        setSavingOrder,
    ] = useState(false);

    const [
        homeVideo,
        setHomeVideo,
    ] = useState("");

    const [
        savingVideo,
        setSavingVideo,
    ] = useState(false);

    const [
        aboutDescription,
        setAboutDescription,
    ] = useState("");

    const [
        savingAbout,
        setSavingAbout,
    ] = useState(false);


    // --------------------------------
    // AUTH
    // --------------------------------

    useEffect(() => {
        if (
            !authLoading &&
            !user
        ) {
            router.replace("/login");
        }
    }, [
        authLoading,
        user,
        router,
    ]);


    // --------------------------------
    // LOAD DATA
    // --------------------------------

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadData = async () => {
            try {
                setLoadingProjects(true);

                const [
                    projectsData,
                    homeSettings,
                ] = await Promise.all([
                    getProjects(),
                    getHomeSettings(),
                ]);


                // Projects without order
                // go to the end
                const orderedProjects =
                    projectsData.sort(
                        (a, b) => {
                            const orderA =
                                Number(
                                    a.order ??
                                        9999
                                );

                            const orderB =
                                Number(
                                    b.order ??
                                        9999
                                );

                            return (
                                orderA -
                                orderB
                            );
                        }
                    );


                setProjects(
                    orderedProjects
                );


                setHomeVideo(
                    homeSettings.video ||
                        ""
                );


                setAboutDescription(
                    homeSettings.aboutDescription ||
                        ""
                );

            } catch (error) {
                console.error(
                    "Error loading admin data:",
                    error
                );
            } finally {
                setLoadingProjects(
                    false
                );
            }
        };

        loadData();

    }, [user]);


    // --------------------------------
    // SELECT PROJECT
    // --------------------------------

    const toggleProject = (
        projectId
    ) => {
        setSelectedProjects(
            (current) => {
                if (
                    current.includes(
                        projectId
                    )
                ) {
                    return current.filter(
                        (id) =>
                            id !==
                            projectId
                    );
                }

                return [
                    ...current,
                    projectId,
                ];
            }
        );
    };


    // --------------------------------
    // SELECT ALL
    // --------------------------------

    const allSelected =
        projects.length > 0 &&
        selectedProjects.length ===
            projects.length;

    const toggleAll = () => {
        if (allSelected) {
            setSelectedProjects([]);
            return;
        }

        setSelectedProjects(
            projects.map(
                (project) =>
                    project.id
            )
        );
    };


    // --------------------------------
    // DELETE ONE
    // --------------------------------

    const handleDeleteOne = async (
        project
    ) => {
        const confirmed =
            window.confirm(
                `¿Seguro que quieres borrar "${project.title}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            await deleteProject(
                project.id
            );

            setProjects(
                (current) =>
                    current.filter(
                        (item) =>
                            item.id !==
                            project.id
                    )
            );

            setSelectedProjects(
                (current) =>
                    current.filter(
                        (id) =>
                            id !==
                            project.id
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
            setDeleting(false);
        }
    };


    // --------------------------------
    // DELETE SELECTED
    // --------------------------------

    const handleDeleteSelected =
        async () => {
            if (
                selectedProjects.length ===
                0
            ) {
                return;
            }

            const confirmed =
                window.confirm(
                    `¿Seguro que quieres borrar ${selectedProjects.length} proyecto${
                        selectedProjects.length !==
                        1
                            ? "s"
                            : ""
                    }?`
                );

            if (!confirmed) {
                return;
            }

            try {
                setDeleting(true);

                await Promise.all(
                    selectedProjects.map(
                        (id) =>
                            deleteProject(
                                id
                            )
                    )
                );

                setProjects(
                    (current) =>
                        current.filter(
                            (project) =>
                                !selectedProjects.includes(
                                    project.id
                                )
                        )
                );

                setSelectedProjects([]);

            } catch (error) {
                console.error(
                    "Error borrando proyectos:",
                    error
                );

                alert(
                    "No se han podido borrar los proyectos."
                );
            } finally {
                setDeleting(false);
            }
        };


    // --------------------------------
    // DRAG START
    // --------------------------------

    const handleDragStart = (
        projectId
    ) => {
        setDraggedProject(
            projectId
        );
    };


    // --------------------------------
    // DROP
    // --------------------------------

    const handleDrop = (
        targetProjectId
    ) => {
        if (
            !draggedProject ||
            draggedProject ===
                targetProjectId
        ) {
            return;
        }

        setProjects(
            (current) => {
                const projectsCopy =
                    [...current];

                const draggedIndex =
                    projectsCopy.findIndex(
                        (project) =>
                            project.id ===
                            draggedProject
                    );

                const targetIndex =
                    projectsCopy.findIndex(
                        (project) =>
                            project.id ===
                            targetProjectId
                    );

                if (
                    draggedIndex ===
                        -1 ||
                    targetIndex ===
                        -1
                ) {
                    return current;
                }

                const [
                    movedProject,
                ] =
                    projectsCopy.splice(
                        draggedIndex,
                        1
                    );

                projectsCopy.splice(
                    targetIndex,
                    0,
                    movedProject
                );

                return projectsCopy;
            }
        );

        setDraggedProject(null);
    };


    // --------------------------------
    // SAVE ORDER
    // --------------------------------

    const handleSaveOrder =
        async () => {
            try {
                setSavingOrder(true);

                await Promise.all(
                    projects.map(
                        (
                            project,
                            index
                        ) =>
                            updateProjectOrder(
                                project.id,
                                index + 1
                            )
                    )
                );

                setProjects(
                    (current) =>
                        current.map(
                            (
                                project,
                                index
                            ) => ({
                                ...project,
                                order:
                                    index +
                                    1,
                            })
                        )
                );

            } catch (error) {
                console.error(
                    "Error saving order:",
                    error
                );

                alert(
                    "No se ha podido guardar el orden."
                );
            } finally {
                setSavingOrder(false);
            }
        };


    // --------------------------------
    // SAVE HOME VIDEO
    // --------------------------------

    const handleSaveVideo =
        async () => {
            try {
                setSavingVideo(true);

                await updateHomeVideo(
                    homeVideo
                );

                alert(
                    "Vídeo principal actualizado."
                );

            } catch (error) {
                console.error(
                    "Error updating home video:",
                    error
                );

                alert(
                    "No se ha podido guardar el vídeo."
                );
            } finally {
                setSavingVideo(false);
            }
        };


    // --------------------------------
    // SAVE ABOUT
    // --------------------------------

    const handleSaveAbout =
        async () => {
            try {
                setSavingAbout(true);

                await updateAboutDescription(
                    aboutDescription
                );

                alert(
                    "Descripción actualizada."
                );

            } catch (error) {
                console.error(
                    "Error updating about:",
                    error
                );

                alert(
                    "No se ha podido guardar la descripción."
                );
            } finally {
                setSavingAbout(false);
            }
        };


    // --------------------------------
    // LOADING
    // --------------------------------

    if (
        authLoading ||
        !user
    ) {
        return null;
    }


    return (
        <main className="min-h-screen bg-black text-white px-6 md:px-10 py-28">

            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">

                <div>
                    <p className="text-xs uppercase opacity-50 mb-2">
                        Admin
                    </p>

                    <h1 className="text-3xl uppercase">
                        Panel de administración
                    </h1>
                </div>

                <button
                    onClick={() =>
                        router.push(
                            "/work/new"
                        )
                    }
                    className="border border-white/40 px-5 py-3 text-xs uppercase hover:border-white transition cursor-pointer"
                >
                    + Nuevo proyecto
                </button>

            </div>


            {/* ========================= */}
            {/* PROJECTS */}
            {/* ========================= */}

            <section className="mb-20">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">

                    <div>
                        <h2 className="text-xl uppercase">
                            Proyectos
                        </h2>

                        <p className="text-xs opacity-50 mt-1">
                            {projects.length} proyectos
                        </p>
                    </div>


                    <div className="flex flex-wrap gap-2">

                        <button
                            onClick={
                                toggleAll
                            }
                            className="border border-white/30 px-4 py-2 text-xs uppercase hover:border-white transition cursor-pointer"
                        >
                            {allSelected
                                ? "Deseleccionar todos"
                                : "Seleccionar todos"}
                        </button>


                        {selectedProjects.length >
                            0 && (
                            <button
                                onClick={
                                    handleDeleteSelected
                                }
                                disabled={
                                    deleting
                                }
                                className="border border-red-400/50 text-red-300 px-4 py-2 text-xs uppercase hover:border-red-300 transition cursor-pointer"
                            >
                                {deleting
                                    ? "Borrando..."
                                    : `Borrar seleccionados (${selectedProjects.length})`}
                            </button>
                        )}

                    </div>

                </div>


                {/* PROJECT LIST */}

                {loadingProjects ? (
                    <p className="text-xs uppercase opacity-50">
                        Cargando proyectos...
                    </p>
                ) : projects.length ===
                  0 ? (
                    <p className="text-xs uppercase opacity-50">
                        No hay proyectos.
                    </p>
                ) : (
                    <div className="border-t border-white/20">

                        {projects.map(
                            (
                                project,
                                index
                            ) => (
                                <div
                                    key={
                                        project.id
                                    }
                                    draggable
                                    onDragStart={() =>
                                        handleDragStart(
                                            project.id
                                        )
                                    }
                                    onDragOver={(
                                        e
                                    ) =>
                                        e.preventDefault()
                                    }
                                    onDrop={() =>
                                        handleDrop(
                                            project.id
                                        )
                                    }
                                    className={`group flex flex-col md:flex-row md:items-center gap-4 py-5 border-b border-white/10 transition ${
                                        draggedProject ===
                                        project.id
                                            ? "opacity-30"
                                            : ""
                                    }`}
                                >

                                    {/* CHECKBOX */}

                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={selectedProjects.includes(
                                                project.id
                                            )}
                                            onChange={() =>
                                                toggleProject(
                                                    project.id
                                                )
                                            }
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                    </div>


                                    {/* DRAG */}

                                    <div className="hidden md:block cursor-grab text-white/30 group-hover:text-white transition">
                                        ☰
                                    </div>


                                    {/* ORDER */}

                                    <div className="w-8 text-xs opacity-40">
                                        {index +
                                            1}
                                    </div>


                                    {/* IMAGE */}

                                    <div className="w-full md:w-28 h-20 shrink-0 overflow-hidden bg-white/5">
                                        {project
                                            .images?.[0] ? (
                                            <img
                                                src={
                                                    project
                                                        .images[0]
                                                }
                                                alt={
                                                    project.title
                                                }
                                                className="w-full h-full object-cover"
                                            />
                                        ) : null}
                                    </div>


                                    {/* INFO */}

                                    <div className="flex-1 min-w-0">

                                        <h3 className="text-sm uppercase">
                                            {
                                                project.title
                                            }
                                        </h3>

                                        <p className="text-xs opacity-50 mt-1">
                                            {
                                                project.year
                                            }
                                        </p>


                                        {/* CATEGORIES */}

                                        <div className="flex flex-wrap gap-2 mt-2">

                                            {(Array.isArray(
                                                project.category
                                            )
                                                ? project.category
                                                : [
                                                      project.category,
                                                  ]
                                            )
                                                .filter(
                                                    Boolean
                                                )
                                                .map(
                                                    (
                                                        category
                                                    ) => (
                                                        <span
                                                            key={
                                                                category
                                                            }
                                                            className="text-[10px] uppercase border border-white/20 px-2 py-1"
                                                        >
                                                            {
                                                                category
                                                            }
                                                        </span>
                                                    )
                                                )}

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="flex gap-4 shrink-0">

                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/work/${project.id}`
                                                )
                                            }
                                            className="text-xs uppercase underline underline-offset-4 cursor-pointer hover:opacity-50 transition"
                                        >
                                            Ver
                                        </button>


                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/work/${project.id}?edit=true`
                                                )
                                            }
                                            className="text-xs uppercase underline underline-offset-4 cursor-pointer hover:opacity-50 transition"
                                        >
                                            Editar
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDeleteOne(
                                                    project
                                                )
                                            }
                                            disabled={
                                                deleting
                                            }
                                            className="text-xs uppercase text-red-300 underline underline-offset-4 cursor-pointer hover:opacity-50 transition disabled:opacity-40"
                                        >
                                            Borrar
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}


                {/* SAVE ORDER */}

                {projects.length >
                    0 && (
                    <div className="flex justify-end mt-6">

                        <button
                            onClick={
                                handleSaveOrder
                            }
                            disabled={
                                savingOrder
                            }
                            className="bg-white text-black px-6 py-3 text-xs uppercase hover:opacity-80 transition cursor-pointer disabled:opacity-40"
                        >
                            {savingOrder
                                ? "Guardando..."
                                : "Guardar orden"}
                        </button>

                    </div>
                )}

            </section>


            {/* ========================= */}
            {/* HOME VIDEO */}
            {/* ========================= */}

            <section className="border-t border-white/20 pt-10">

                <div className="mb-8">

                    <h2 className="text-xl uppercase">
                        Vídeo principal
                    </h2>

                    <p className="text-xs opacity-50 mt-2 max-w-xl">
                        Este vídeo se mostrará
                        como fondo en la página
                        principal.
                    </p>

                </div>


                <div className="max-w-3xl">

                    <label className="block text-xs uppercase opacity-50 mb-2">
                        Enlace del vídeo
                    </label>

                    <input
                        type="text"
                        value={homeVideo}
                        onChange={(e) =>
                            setHomeVideo(
                                e.target.value
                            )
                        }
                        placeholder="https://vimeo.com/..."
                        className="w-full bg-transparent border border-white/30 px-4 py-3 text-sm outline-none focus:border-white transition"
                    />


                    <button
                        onClick={
                            handleSaveVideo
                        }
                        disabled={
                            savingVideo
                        }
                        className="mt-4 bg-white text-black px-6 py-3 text-xs uppercase hover:opacity-80 transition cursor-pointer disabled:opacity-40"
                    >
                        {savingVideo
                            ? "Guardando..."
                            : "Guardar vídeo"}
                    </button>

                </div>

            </section>


            {/* ========================= */}
            {/* ABOUT */}
            {/* ========================= */}

            <section className="border-t border-white/20 pt-10 mt-10">

                <div className="mb-8">

                    <h2 className="text-xl uppercase">
                        About
                    </h2>

                    <p className="text-xs opacity-50 mt-2 max-w-xl">
                        Esta descripción se mostrará
                        en la sección About de la página.
                    </p>

                </div>


                <div className="max-w-4xl">

                    <label className="block text-xs uppercase opacity-50 mb-2">
                        Descripción
                    </label>

                    <textarea
                        value={
                            aboutDescription
                        }
                        onChange={(e) =>
                            setAboutDescription(
                                e.target.value
                            )
                        }
                        rows={12}
                        placeholder="Escribe aquí la descripción del About..."
                        className="w-full bg-transparent border border-white/30 px-4 py-4 text-sm outline-none focus:border-white transition resize-y leading-relaxed"
                    />


                    <button
                        onClick={
                            handleSaveAbout
                        }
                        disabled={
                            savingAbout
                        }
                        className="mt-4 bg-white text-black px-6 py-3 text-xs uppercase hover:opacity-80 transition cursor-pointer disabled:opacity-40"
                    >
                        {savingAbout
                            ? "Guardando..."
                            : "Guardar descripción"}
                    </button>

                </div>

            </section>

        </main>
    );
}