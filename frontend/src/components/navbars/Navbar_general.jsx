// src/components/navbars/Navbar_general.jsx

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "../../app/styles/fonts.css";
import LanguageToggleButton from "../Button_language";

export default function Navbar({ toggleLanguage, language }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [error, setError] = useState(""); // Estado para manejar el mensaje de error

    const closeMenuOutsideClick = (event) => {
        if (event.target.id === "menuOverlay") {
            setMenuOpen(false);
        }
    };

    const closeLoginOutsideClick = (event) => {
        if (event.target.id === "loginOverlay") {
            setLoginOpen(false);
            setError(""); // Limpiar el error al cerrar el modal
        }
    };

    const menuOptions = {
        en: { locations: "Locations", recorders: "Recorders", recordings: "Recordings" },
        es: { locations: "Ubicaciones", recorders: "Grabadoras", recordings: "Grabaciones" },
    };

    const loginFormOptions = {
        en: { username: "Username", password: "Password", login: "Login" },
        es: { username: "Usuario", password: "Contraseña", login: "Iniciar sesión" },
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(""); // Limpiar error antes de la petición

        const username = event.target.username.value;
        const password = event.target.password.value;

        try {
            const response = await fetch("http://localhost:8080/api/v1/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const textResponse = await response.text();
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (error) {
                console.error("Respuesta no válida:", textResponse);
                setError("Error en el servidor. Inténtalo más tarde.");
                return;
            }

            if (response.ok) {
                localStorage.setItem("token", data.access_token);
                setLoginOpen(false);
            } else {
                setError(data.message || "Credenciales incorrectas"); // Mostrar mensaje de error debajo del formulario
            }
        } catch (error) {
            console.error("Error en el login:", error);
            setError("Error en la conexión con el servidor");
        }
    };

    return (
        <nav className="w-full flex justify-between items-center py-2 px-2 fixed top-0 z-50">
            <div className="flex items-center pl-10">
                <Link href="/" passHref>
                    <Image src="/photos/logo.png" alt="Logo" width={85} height={85} className="cursor-pointer" />
                </Link>
            </div>

            <div className="flex items-center gap-5">
                <LanguageToggleButton toggleLanguage={toggleLanguage} language={language} />
                <button className="p-2" onClick={() => setLoginOpen(true)}>
                    <Image src="/iconos/user.png" alt="User" width={33} height={33} />
                </button>
                <button onClick={() => setMenuOpen(true)} className="pr-10 rounded-full">
                    <Image src="/iconos/menu.png" alt="Menu" width={33} height={33} />
                </button>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        id="menuOverlay"
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end"
                        onClick={closeMenuOutsideClick}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <motion.div
                            className="w-[500px] h-full bg-white shadow-lg p-6 flex flex-col relative overflow-hidden"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-xl font-bold">
                                ✕
                            </button>
                            <ul className="ml-10 mt-[100] space-y-6">
                                {Object.keys(menuOptions[language]).map((key) => (
                                    <li key={key}>
                                        <Link href={`/general/${key}_general`}>
                                            <motion.span
                                                className="InterRegular font-bold cursor-pointer hover:text-gray-600 transition duration-300 block"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                {menuOptions[language][key]}
                                            </motion.span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {loginOpen && (
                    <motion.div
                        id="loginOverlay"
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                        onClick={closeLoginOutsideClick}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-8 w-[550px] h-[460px] relative flex flex-col justify-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <button onClick={() => setLoginOpen(false)} className="absolute top-4 right-6 text-lg font-bold text-gray-500 hover:text-black transition">
                                ✕
                            </button>

                            <form onSubmit={handleLogin}>
                                <div className="mb-5 px-[70]">
                                    <label className="InterRegular block text-sm font-medium text-gray-900">
                                        {loginFormOptions[language].username}
                                    </label>
                                    <input type="text" name="username" required className="block w-full py-2 px-3 border border-gray-300 rounded-md" />
                                </div>

                                <div className="mb-6 px-[70]">
                                    <label className="InterRegular block text-sm font-medium text-gray-900">
                                        {loginFormOptions[language].password}
                                    </label>
                                    <input type="password" name="password" required className="block w-full py-2 px-3 border border-gray-300 rounded-md" />
                                </div>

                                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                                <div className="flex justify-center">
                                    <button type="submit" className="px-6 py-2 bg-black text-white text-md font-medium rounded-xl hover:bg-gray-900 transition">
                                        {loginFormOptions[language].login}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
