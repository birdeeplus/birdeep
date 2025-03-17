"use client";
import { motion, AnimatePresence } from "framer-motion";
import LogoutModal from "../Logout";

export default function LogoutConfirmation({ isOpen, onClose, language, onLogoutConfirm }) {
    const handleLogout = () => {
        onLogoutConfirm(); // Notifica que el usuario cerró sesión
        onClose(); // Cierra el modal después del logout
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
                    <LogoutModal language={language} onClose={onClose} onLogoutConfirm={handleLogout} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
