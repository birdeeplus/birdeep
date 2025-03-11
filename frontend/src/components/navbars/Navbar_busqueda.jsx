"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "../../app/styles/fonts.css";
import LanguageToggleButton from "../Button_language";
import LoginForm from "../Login";
import LogoutModal from "../Logout";

export default function Navbar({ toggleLanguage, language }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false); // Estado para abrir el modal de logout
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const adminStatus = localStorage.getItem("is_admin") === "true";
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(adminStatus);
        }
    }, []);

    const handleLoginSuccess = (isAdmin) => {
        setIsLoggedIn(true);
        setIsAdmin(isAdmin);
        setLoginOpen(false);
    };

    const handleLogoutConfirm = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("is_admin");
        setIsLoggedIn(false);
        setIsAdmin(false);
        setLogoutOpen(false);
    };

    const openLogoutModal = () => {
        setLogoutOpen(true); // Abrir el modal de logout
    };

    return (
        <nav className="w-full flex justify-between items-center py-2 px-2 fixed top-0 z-50 bg-white">
            {/* Logo con Link a la página principal */}
            <div className="flex items-center pl-10">
                <Link href="/" passHref>
                    <Image src="/photos/logo.png" alt="Logo" width={85} height={85} className="cursor-pointer" />
                </Link>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-grow mx-10">
                <input
                    type="text"
                    placeholder={language === "en" ? "Search..." : "Buscar..."}
                    className="w-2/3 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:border-black"
                />
            </div>

            {/* Controles de Usuario */}
            <div className="flex items-center gap-5">
                <LanguageToggleButton toggleLanguage={toggleLanguage} language={language} />

                {/* Si el usuario está logueado */}
                {isLoggedIn ? (
                    <div className="flex items-center gap-3">
                        {isAdmin ? (
                            <span
                                className="text-green-500 font-bold cursor-pointer"
                                onClick={openLogoutModal} // Abre el modal de logout
                            >
                                Admin
                            </span>
                        ) : (
                            <span
                                className="text-blue-500 font-bold cursor-pointer"
                                onClick={openLogoutModal} // Abre el modal de logout
                            >
                                Usuario
                            </span>
                        )}
                    </div>
                ) : (
                    <button className="p-2" onClick={() => setLoginOpen(true)}>
                        <Image src="/iconos/user.png" alt="User" width={33} height={33} />
                    </button>
                )}

                {/* Menú Hamburguesa */}
                <button onClick={() => setMenuOpen(true)} className="pr-10 rounded-full">
                    <Image src="/iconos/menu.png" alt="Menu" width={33} height={33} />
                </button>
            </div>

            <AnimatePresence>
                {loginOpen && (
                    <motion.div
                        id="loginOverlay"
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <LoginForm 
                            language={language} 
                            onClose={() => setLoginOpen(false)} 
                            onLoginSuccess={handleLoginSuccess} 
                        />
                    </motion.div>
                )}

                {logoutOpen && (
                    <motion.div
                        id="logoutOverlay"
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <LogoutModal 
                            language={language} 
                            onClose={() => setLogoutOpen(false)} 
                            onLogoutConfirm={handleLogoutConfirm} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
