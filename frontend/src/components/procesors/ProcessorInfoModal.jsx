// components/procesors/ProcessorInfoModal.jsx

import React from "react";
import Image from "next/image";

export default function ProcessorInfoModal({ processor, recorder, language, onClose }) {
    const labels = {
        es: {
            title: "Información del Procesador",
            id: "ID",
            model: "Modelo",
            comment: "Comentario",
            recorder: "Grabadora Asociada",
            close: "Cerrar",
        },
        en: {
            title: "Processor Information",
            id: "ID",
            model: "Model",
            comment: "Comment",
            recorder: "Associated Recorder",
            close: "Close",
        },
    };

    const t = labels[language];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">

                <h2 className="text-lg font-semibold text-[#375B38] mb-4">{t.title}</h2>

                <div className="text-sm text-gray-800 space-y-2">
                    <p>
                        <span className="font-medium">{t.id}:</span> {processor.id_processor}
                    </p>
                    <p>
                        <span className="font-medium">{t.model}:</span> {processor.model_processor}
                    </p>
                    <p>
                        <span className="font-medium">{t.comment}:</span>{" "}
                        {processor.comment_processor || "-"}
                    </p>
                    <p>
                        <span className="font-medium">{t.recorder}:</span>{" "}
                        {recorder ? `#${recorder.recorder_name || "-"}` : "—"}
                    </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        className="px-4 py-1 rounded bg-[#375B38] text-white hover:bg-[#2c482d] text-sm"
                        onClick={onClose}
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
}
