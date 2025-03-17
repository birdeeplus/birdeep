"use client";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../Login";

export default function LoginModal({ isOpen, onClose, language, onLoginSuccess }) {
    const handleLogin = () => {
        onLoginSuccess(); // Notifica al Navbar que el login fue exitoso
        onClose(); // Cierra el modal después de iniciar sesión
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    id="loginOverlay"
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                    onClick={(e) => e.target.id === "loginOverlay" && onClose()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <LoginForm language={language} onClose={onClose} onLoginSuccess={handleLogin} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
