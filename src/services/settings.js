import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";


// --------------------------------
// GET HOME SETTINGS
// --------------------------------

export const getHomeSettings = async () => {
    const settingsRef = doc(
        db,
        "configuracion",
        "home"
    );

    const snapshot = await getDoc(
        settingsRef
    );

    if (!snapshot.exists()) {
        return {
            video: "",
            aboutDescription: "",
        };
    }

    return {
        video: snapshot.data().video || "",
        aboutDescription:
            snapshot.data().aboutDescription || "",
    };
};


// --------------------------------
// UPDATE HOME VIDEO
// --------------------------------

export const updateHomeVideo = async (
    video
) => {
    const settingsRef = doc(
        db,
        "configuracion",
        "home"
    );

    await setDoc(
        settingsRef,
        {
            video,
        },
        {
            merge: true,
        }
    );
};


// --------------------------------
// UPDATE ABOUT DESCRIPTION
// --------------------------------

export const updateAboutDescription = async (
    aboutDescription
) => {
    const settingsRef = doc(
        db,
        "configuracion",
        "home"
    );

    await setDoc(
        settingsRef,
        {
            aboutDescription,
        },
        {
            merge: true,
        }
    );
};