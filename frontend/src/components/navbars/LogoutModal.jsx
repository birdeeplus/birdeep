"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoutConfirmation({ isOpen, onClose, language, onLogoutConfirm }) {
    const logoutText = {
        en: { title: "Sign out", message: "Are you sure you want to log out?", button: "Log out" },
        es: { title: "Cerrar sesión", message: "¿Seguro que deseas cerrar sesión?", button: "Cerrar sesión" },
    };

    const handleLogout = () => {
        onLogoutConfirm(); // Notifica que se cerró sesión
        setTimeout(onClose, 300); // Asegura que el modal se cierre después del logout
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    id="logoutOverlay"
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                    onClick={(e) => e.target.id === "logoutOverlay" && onClose()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <motion.div
                        className="bg-[#F8F8F8] rounded-lg shadow-lg p-6 w-[400px] h-[250px] flex flex-col justify-center items-center"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {/* Título */}
                        <h2 className="text-center text-[#375B38] font-semibold text-lg mb-5">
                            {logoutText[language].title}
                        </h2>

                        {/* Mensaje */}
                        <p className="text-center text-gray-700 text-sm mb-6">
                            {logoutText[language].message}
                        </p>

                        {/* Botón de logout */}
                        <button
                            onClick={handleLogout}
                            className="px-5 py-1.5 border-2 border-[#375B38] text-[#375B38] rounded-full flex items-center group transition-all duration-300 ease-in-out hover:bg-[#375B38] hover:text-white text-sm font-semibold"
                        >
                            <span className="mr-1">{logoutText[language].button}</span>
                            <span className="text-sm">›</span>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
