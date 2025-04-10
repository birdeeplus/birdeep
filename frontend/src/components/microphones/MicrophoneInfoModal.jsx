import React from "react";
import { FaTimes } from "react-icons/fa";

export default function MicrophoneInfoModal({ microphone, onClose, language }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">
                    <FaTimes />
                </button>
                <h2 className="text-xl font-bold text-[#375B38] mb-4">
                    {language === "es" ? "Detalles del Micrófono" : "Microphone Details"}
                </h2>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li><strong>ID:</strong> {microphone.id_microphone}</li>
                    <li><strong>{language === "es" ? "Modelo" : "Model"}:</strong> {microphone.model_microphone}</li>
                    <li><strong>{language === "es" ? "Comentario" : "Comment"}:</strong> {microphone.comment_microphone || "—"}</li>
                    <li><strong>{language === "es" ? "Grabadora Asociada" : "Linked Recorder"}:</strong> #{microphone.id_recorder || "—"}</li>
                </ul>
            </div>
        </div>
    );
}
