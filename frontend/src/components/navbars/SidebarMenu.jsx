"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function SidebarMenu({ isOpen, onClose, menuOptions, adminMenuOptions, language, isLoggedIn, isAdmin }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    id="menuOverlay"
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-start"
                    onClick={(event) => event.target.id === "menuOverlay" && onClose()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <motion.div
                        className="w-[90%] max-w-[400px] h-full bg-white shadow-lg px-10 py-6 flex flex-col relative Montserrat"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        {/* Encabezado del Menú */}
                        <div className="mt-4 flex items-center justify-between pl-4">
                            <button onClick={onClose} className="text-[#375B38] text-lg">
                                ✕
                            </button>
                            <span className="text-[#375B38] text-sm flex-grow text-center">Menú</span>
                        </div>

                        {/* Opciones del Menú */}
                        <ul className="mt-24 space-y-6 text-black text-sm pl-4">
                            {Object.keys(menuOptions[language]).map((key) => (
                                <li key={key}>
                                    <Link href={`/general/${key}_general`} className="block py-1 hover:font-semibold transition">
                                        {menuOptions[language][key]}
                                    </Link>
                                </li>
                            ))}

                            {/* Mostrar opciones del menú admin solo si es admin */}
                            {isLoggedIn && isAdmin && Object.keys(adminMenuOptions[language]).map((key) => (
                                <li key={key}>
                                    <Link href={`/admin/${key}_general`} className="block py-1 hover:font-semibold transition">
                                        {adminMenuOptions[language][key]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
