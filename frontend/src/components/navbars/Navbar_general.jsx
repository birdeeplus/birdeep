"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "../../app/styles/fonts.css";
import LanguageToggleButton from "../Button_language";
import LoginForm from "../Login"; 
import LogoutModal from "../Logout";
import { jwtDecode } from "jwt-decode";


export default function Navbar({ toggleLanguage, language }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const closeMenuOutsideClick = (event) => {
        if (event.target.id === "menuOverlay") {
            setMenuOpen(false);
        }
    };

    const closeLoginOutsideClick = (event) => {
        if (event.target.id === "loginOverlay") {
            setLoginOpen(false);
        }
    };

    const menuOptions = {
        en: { locations: "Locations", recorders: "Recorders", recordings: "Recordings" },
        es: { locations: "Ubicaciones", recorders: "Grabadoras", recordings: "Grabaciones" },
    };

    const handleLoginSuccess = (isAdmin) => {
        setLoginOpen(false);
        setIsLoggedIn(true);
        setIsAdmin(isAdmin);
        
        localStorage.setItem("is_admin", isAdmin);  // Asegurarse de que se guarda correctamente
        window.dispatchEvent(new Event("storage")); // Disparar evento de cambio en storage
    };
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("is_admin");
        setIsLoggedIn(false);
        setIsAdmin(false);
        setLogoutOpen(false);
        
        window.dispatchEvent(new Event("storage")); // Disparar evento de cambio en storage
    };
    

    useEffect(() => {
        const token = localStorage.getItem("token");
        const adminStatus = localStorage.getItem("is_admin") === "true";
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(adminStatus);
        }
    }, []);

    return (
        <nav className="w-full flex justify-between items-center py-2 px-2 fixed top-0 z-50">
            <div className="flex items-center pl-10">
                <Link href="/" passHref>
                    <Image src="/photos/logo.png" alt="Logo" width={85} height={85} className="cursor-pointer" />
                </Link>
            </div>

            <div className="flex items-center gap-5">
                <LanguageToggleButton toggleLanguage={toggleLanguage} language={language} />

                {isLoggedIn && isAdmin ? (
                    <div className="flex items-center gap-3">
                        <span
                            className="text-green-500 font-bold cursor-pointer"
                            onClick={() => setLogoutOpen(true)}
                        >
                            Admin
                        </span>
                    </div>
                ) : (
                    <button className="p-2" onClick={() => setLoginOpen(true)}>
                        <Image src="/iconos/user.png" alt="User" width={33} height={33} />
                    </button>
                )}

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
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="absolute top-4 right-4 text-xl font-bold"
                            >
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
                                {isLoggedIn && isAdmin && (
                                    <>
                                        <li>
                                            <Link href="/general/processors_general">
                                                <motion.span
                                                    className="InterRegular font-bold cursor-pointer hover:text-gray-600 transition duration-300 block"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    Procesadores
                                                </motion.span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/general/microphones_general">
                                                <motion.span
                                                    className="InterRegular font-bold cursor-pointer hover:text-gray-600 transition duration-300 block"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    Micrófonos
                                                </motion.span>
                                            </Link>
                                        </li>
                                    </>
                                )}
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
                        <LoginForm 
                            language={language} 
                            onClose={() => setLoginOpen(false)} 
                            onLoginSuccess={handleLoginSuccess} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
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
                            onLogoutConfirm={handleLogout}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
