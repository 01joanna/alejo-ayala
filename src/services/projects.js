import {
    collection,
    getDocs,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export const getProjects = async () => {
    const projectsRef = collection(db, "proyectos");
    const snapshot = await getDocs(projectsRef);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const getProjectById = async (id) => {
    const projectRef = doc(db, "proyectos", String(id));
    const snapshot = await getDoc(projectRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    };
};

export const uploadProjects = async (projects) => {
    for (const project of projects) {
        const projectRef = doc(db, "proyectos", String(project.id));

        const projectToUpload = {
            ...project,

            for: Array.isArray(project.for)
                ? project.for
                : [project.for].filter(Boolean),

            director: Array.isArray(project.director)
                ? project.director
                : [project.director].filter(Boolean),

            producer: Array.isArray(project.producer)
                ? project.producer
                : [project.producer].filter(Boolean),
        };

        await setDoc(projectRef, projectToUpload);
    }
};

export const updateProject = async (id, project) => {
    const projectRef = doc(db, "proyectos", String(id));

    await updateDoc(projectRef, project);
};

export const deleteProject = async (id) => {
    const projectRef = doc(db, "proyectos", String(id));

    await deleteDoc(projectRef);
};

export const createProject = async (project) => {
    const projectsRef = collection(db, "proyectos");

    const snapshot = await getDocs(projectsRef);

    const ids = snapshot.docs
        .map((doc) => Number(doc.id))
        .filter((id) => !isNaN(id));

    const newId = ids.length > 0
        ? Math.max(...ids) + 1
        : 1;

    const projectRef = doc(
        db,
        "proyectos",
        String(newId)
    );

    const projectToCreate = {
        ...project,
        id: String(newId),
    };

    await setDoc(projectRef, projectToCreate);

    return projectToCreate;
};
