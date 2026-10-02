import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

const homeRef = doc(
    db,
    "configuracion",
    "home"
);


// GET HOME SETTINGS
export async function getHomeSettings() {
    const snapshot = await getDoc(homeRef);

    if (!snapshot.exists()) {
        return {
            video: "",
        };
    }

    return snapshot.data();
}


// UPDATE HOME VIDEO
export async function updateHomeVideo(video) {
    await setDoc(
        homeRef,
        {
            video,
        },
        {
            merge: true,
        }
    );
}