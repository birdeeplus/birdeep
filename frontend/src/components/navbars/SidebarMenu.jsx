"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SidebarMenu({ isOpen, onClose, menuOptions, adminMenuOptions, language, isLoggedIn, isAdmin }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    id="menuOverlay"
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-start"
                    onClick={(event) => event.target.id === "menuOverlay" && onClose()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <motion.div
                        className="w-[500px] h-full bg-white shadow-lg p-6 flex flex-col relative overflow-hidden"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        {/* Botón de Cierre */}
                        <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold">
                            ✕
                        </button>

                        {/* Opciones del Menú */}
                        <ul className="ml-10 mt-24 space-y-6">
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

                            {/* Mostrar opciones del menú admin solo si es admin */}
                            {isLoggedIn && isAdmin && Object.keys(adminMenuOptions[language]).map((key) => (
                                <li key={key}>
                                    <Link href={`/admin/${key}_general`}>
                                        <motion.span
                                            className="InterRegular font-bold cursor-pointer hover:text-gray-600 transition duration-300 block"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {adminMenuOptions[language][key]}
                                        </motion.span>
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
