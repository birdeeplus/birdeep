// components/microphones/DeleteMicrophoneModal.jsx

"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function DeleteMicrophoneModal({ isOpen, onClose, onConfirm, language }) {
    if (!isOpen) return null;

    const text = {
        es: {
            message: '¿Estás seguro de que quieres eliminar "micrófono"?',
            cancel: "cancelar",
            confirm: "aceptar"
        },
        en: {
            message: 'Are you sure you want to delete "microphone"?',
            cancel: "cancel",
            confirm: "accept"
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-xl shadow-lg px-10 py-8 w-auto relative"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
            >
                {/* Cierre en la esquina */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                    aria-label="Close"
                >
                    &times;
                </button>

                {/* Mensaje */}
                <p className="text-center text-sm text-[#3F3F3F] mt-10 mb-6">
                    {text[language].message}
                </p>

                {/* Botones */}
                <div className="flex justify-center gap-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                    >
                        {text[language].cancel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                    >
                        {text[language].confirm}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
