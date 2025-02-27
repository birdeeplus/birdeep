// src/components/navbars/Navbar_general.jsx

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "../../app/styles/fonts.css";

export default function Navbar({ toggleLanguage, language }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    // Función para cerrar el menú si se hace clic fuera de él
    const closeMenuOutsideClick = (event) => {
        if (event.target.id === "menuOverlay") {
            setMenuOpen(false);
        }
    };

    // Función para cerrar el modal de login si se hace clic fuera de él
    const closeLoginOutsideClick = (event) => {
        if (event.target.id === "loginOverlay") {
            setLoginOpen(false);
        }
    };

    return (
        <nav className="w-full flex justify-between items-center py-2 px-2 fixed top-0 z-50 bg-transparent">
            {/* Logo con Link a la página principal */}
            <div className="flex items-center pl-10">
                <Link href="/" passHref>
                    <Image src="/photos/logo.png" alt="Logo" width={85} height={85} className="cursor-pointer" />
                </Link>
            </div>

            {/* Controles de Usuario */}
            <div className="flex items-center gap-5">
                {/* Botón de Cambio de Idioma */}
                <button
                    onClick={toggleLanguage}
                    className="flex items-center px-3 py-1 bg-black text-white rounded-full transition text-sm font-medium font-sans"
                >
                    <Image src="/iconos/globe.png" alt="Language" width={17} height={17} className="mr-2" />
                    <span className="InterRegular">{language === "en" ? "español" : "english"}</span>
                </button>

                {/* Botón de Usuario */}
                <button className="p-2" onClick={() => setLoginOpen(true)}>
                    <Image src="/iconos/user.png" alt="User" width={33} height={33} />
                </button>

                {/* Menú Hamburguesa */}
                <button onClick={() => setMenuOpen(true)} className="pr-10 rounded-full">
                    <Image src="/iconos/menu.png" alt="Menu" width={33} height={33} />
                </button>
            </div>

            {/* Menú Desplegable con Animación */}
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
                            {/* Botón de Cierre */}
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="absolute top-4 right-4 text-xl font-bold"
                            >
                                ✕
                            </button>

                            {/* Opciones del Menú */}
                            <ul className="ml-10 mt-[100] space-y-6">
                                <li>
                                    <Link href="/general/locations_general">
                                        <motion.span
                                            className="InterRegular font-bold cursor-pointer hover:text-gray-600 transition duration-300 block"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            Locations
                                        </motion.span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/general/recorders_general">
                                        <motion.span
                                            className="InterRegular font-bold cursor-pointer hover:text-gray-600 transition duration-300 block"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            Recorders
                                        </motion.span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/general/recordings_general">
                                        <motion.span
                                            className="InterRegular font-bold cursor-pointer hover:text-gray-600 transition duration-300 block"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            Recordings
                                        </motion.span>
                                    </Link>
                                </li>
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Login */}
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
                            className="bg-white rounded-lg shadow-lg p-8 w-[550px] h-[430px] relative flex flex-col justify-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {/* Botón de Cierre */}
                            <button
                                onClick={() => setLoginOpen(false)}
                                className="absolute top-4 right-6 text-lg font-bold text-gray-500 hover:text-black transition"
                            >
                                ✕
                            </button>

                            {/* Formulario de Login */}
                            <h2 className="InterRegular text-2xl font-bold text-gray-900 text-center mt-6 mb-8">Login</h2>

                            {/* Usuario */}
                            <div className="mb-5 px-[70]">
                                <label className="InterRegular block text-sm font-medium text-gray-900">Usuario</label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 transition">
                                        <input
                                            type="text"
                                            className="block w-full py-2 pr-3 pl-1 text-gray-900 placeholder-gray-400 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div className="mb-6 px-[70]">
                                <label className="InterRegular block text-sm font-medium text-gray-900">Contraseña</label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 transition">
                                        <input
                                            type="password"
                                            className="block w-full py-2 pr-3 pl-1 text-gray-900 placeholder-gray-400 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Botón de Login */}
                            <div className="flex justify-center">
                                <button className="px-6 py-2 bg-black text-white text-md font-medium rounded-xl hover:bg-gray-900 transition">
                                    Login
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}



