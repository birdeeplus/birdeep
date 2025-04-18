import React from "react";
import Image from "next/image";

export default function EditMicrophonePopup({
    showEditForm,
    setShowEditForm,
    language,
    formData,
    handleChange,
    handleSubmit,
    recorders
}) {
    if (!showEditForm) return null;

    const labels = {
        id_microphone: "id_microphone",
        model_microphone: "model_microphone",
        comment_microphone: "comment_microphone",
        id_recorder: "id_recorder",
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg px-10 py-8 w-[680px]">
                <h2 className="text-center text-[#375B38] font-semibold text-md mb-8">
                    {language === "es" ? "Metadatos micrófono" : "Microphone metadata"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* id_microphone - read only */}
                        <div className="flex flex-col gap-1 col-span-1">
                            <label className="text-xs text-[#375B38]">{labels.id_microphone}</label>
                            <div className="text-sm text-gray-500 bg-[#F5F5F5] border rounded-md px-3 py-2">
                                {formData.id_microphone}
                            </div>
                        </div>

                        {/* model_microphone - editable with icon */}
                        <div className="flex flex-col gap-1 relative">
                            <label className="text-xs text-[#375B38]">{labels.model_microphone}</label>
                            <select
                                name="model_microphone"
                                value={formData.model_microphone}
                                onChange={handleChange}
                                className="text-sm text-gray-700 border rounded-md px-3 py-2 pr-10 appearance-none"
                            >
                                <option value="AudioMoth">AudioMoth</option>
                                <option value="Other">Other</option>
                            </select>
                            <Image
                                src="/iconos/edit.png"
                                alt="edit"
                                width={12}
                                height={12}
                                className="absolute right-4 top-8 opacity-60 pointer-events-none"
                            />
                        </div>

                        {/* comment_microphone - editable with icon */}
                        <div className="flex flex-col gap-1 relative col-span-1">
                            <label className="text-xs text-[#375B38]">{labels.comment_microphone}</label>
                            <input
                                type="text"
                                name="comment_microphone"
                                value={formData.comment_microphone || ""}
                                onChange={handleChange}
                                className="text-sm text-gray-700 border rounded-md px-3 py-2 pr-10"
                            />
                            <Image
                                src="/iconos/edit.png"
                                alt="edit"
                                width={12}
                                height={12}
                                className="absolute right-4 top-8 opacity-60 pointer-events-none"
                            />
                        </div>

                        {/* id_recorder - editable with icon */}
                        <div className="flex flex-col gap-1 relative col-span-1">
                            <label className="text-xs text-[#375B38]">{labels.id_recorder}</label>
                            <select
                                name="id_recorder"
                                value={formData.id_recorder ?? ""} // fallback a string vacía si es null
                                onChange={handleChange}
                                className="text-sm text-gray-700 border rounded-md px-3 py-2 pr-10 appearance-none"
                            >
                                <option value="">
                                    {language === "es" ? "no asignado" : "not_assigned"}
                                </option>
                                {recorders.map((rec) => (
                                    <option key={rec.id_recorder} value={rec.id_recorder}>
                                        {rec.id_recorder}
                                    </option>
                                ))}
                            </select>
                            <Image
                                src="/iconos/edit.png"
                                alt="edit"
                                width={12}
                                height={12}
                                className="absolute right-4 top-8 opacity-60 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-6 mt-4">
                        <button
                            type="button"
                            onClick={() => setShowEditForm(false)}
                            className="px-6 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                        >
                            {language === "es" ? "cancelar" : "cancel"}
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                        >
                            {language === "es" ? "aceptar" : "accept"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
