"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function AdminBar() {
    const router = useRouter();

    const {
        user,
        loading,
    } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);

            router.push("/");
        } catch (error) {
            console.error(
                "Error cerrando sesión:",
                error
            );
        }
    };

    if (loading || !user) {
        return null;
    }

    return (
        <div className="fixed top-6 right-6 z-[100] flex gap-2">

            <button
                onClick={() =>
                    router.push("/admin")
                }
                className="px-4 py-2 bg-white text-black uppercase text-xs rounded-md cursor-pointer hover:opacity-80 transition"
            >
                Panel de administración
            </button>

            <button
                onClick={() =>
                    router.push("/")
                }
                className="px-4 py-2 bg-black text-white border border-white/40 uppercase text-xs rounded-md cursor-pointer hover:border-white transition"
            >
                Inicio
            </button>

            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-black text-white border border-white/40 uppercase text-xs rounded-md cursor-pointer hover:border-white transition"
            >
                Cerrar sesión
            </button>

        </div>
    );
}