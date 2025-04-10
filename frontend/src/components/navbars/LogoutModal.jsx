"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LogoutConfirmation({ isOpen, onClose, language, onLogoutConfirm }) {
    const router = useRouter();

    const handleLogout = () => {
        onLogoutConfirm();
        router.push("/");  // Redirige al home tras confirmar
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
                        className="bg-white rounded-xl shadow-lg px-8 py-10 w-[400px] max-w-[90%] relative text-center"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {/* Botón cerrar arriba derecha */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
                            aria-label="Cerrar"
                        >
                            <Image src="/iconos/cerrar.png" alt="cerrar" width={12} height={12} />
                        </button>

                        {/* Mensaje */}
                        <p className="text-sm text-gray-700 mt-6 mb-6">
                            {language === "en"
                                ? "Are you sure you want to log out?"
                                : "¿Estás seguro de que quieres cerrar tu sesión?"}
                        </p>

                        {/* Botones */}
                        <div className="flex justify-center gap-6">
                            <button
                                onClick={onClose}
                                className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                            >
                                {language === "en" ? "cancel" : "cancelar"}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                            >
                                {language === "en" ? "accept" : "aceptar"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
