"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            router.push("/");
        } catch (error) {
            console.error(error);
            setError("Email o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-screen min-h-screen flex items-center justify-center bg-black text-white">

            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm flex flex-col gap-4 px-6"
            >

                <h1 className="text-xl uppercase text-center mb-6">
                    Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-white text-white outline-none"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-white text-white outline-none"
                    required
                />

                {error && (
                    <p className="text-red-400 text-sm text-center">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-3 bg-white text-black uppercase cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>

            </form>

        </main>
    );
}