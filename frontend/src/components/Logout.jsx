"use client";
import { motion } from "framer-motion";

export default function LogoutModal({ language, onClose, onLogoutConfirm }) {
    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-white p-10 rounded-lg shadow-xl w-[400px] max-w-full relative">
                {/* Título del Modal */}
                <h3 className="text-xl font-semibold text-center mb-6 text-gray-900">
                    {language === "en" ? "Are you sure you want to log out?" : "¿Estás seguro de que quieres cerrar sesión?"}
                </h3>

                {/* Botones de Confirmación y Cancelación */}
                <div className="flex justify-between gap-4">
                    <button 
                        onClick={onLogoutConfirm} 
                        className="px-6 py-2 bg-red-600 text-white rounded-lg w-full hover:bg-red-700 transition duration-200 ease-in-out"
                    >
                        {language === "en" ? "Log Out" : "Cerrar sesión"}
                    </button>
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 bg-gray-200 text-black rounded-lg w-full hover:bg-gray-300 transition duration-200 ease-in-out"
                    >
                        {language === "en" ? "Cancel" : "Cancelar"}
                    </button>
                </div>

                {/* Botón de Cierre */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black transition duration-300"
                >
                    ✕
                </button>
            </div>
        </motion.div>
    );
}
