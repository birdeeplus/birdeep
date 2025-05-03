"use client";
import React, { useState, useEffect } from "react";

export default function EditRecorderForm({ selectedModifyRecorder, setSelectedModifyRecorder, setRecorders, recorders, language }) {
    const [locations, setLocations] = useState([]);
    const [microphones, setMicrophones] = useState([]);
    const [processors, setProcessors] = useState([]);
    const [formData, setFormData] = useState({
        id_recorder: "",
        recorder_name: "",
        id_location_recorder: "",
        id_microphone_recorder: "",
        id_processor_recorder: "",
        installation_date: "",
        status: "",
        version: "",
    });

    const [initialData, setInitialData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [duplicateNameError, setDuplicateNameError] = useState("");  // Estado para el error de nombre duplicado
    const [futureDateError, setFutureDateError] = useState("");  // Estado para el error de fecha futura
    const [statusFutureDateError, setStatusFutureDateError] = useState(""); // Estado para el error de fecha futura en status

    const textContent = {
        en: {
            title: "Recorder Metadata",
            save: "save",
            cancel: "cancel",
            fields: {
                id_recorder: "ID Recorder",
                recorder_name: "Recorder Name",
                id_location_recorder: "Location",
                id_microphone_recorder: "Microphone",
                id_processor_recorder: "Processor",
                installation_date: "Installation Date",
                status: "Status",
                version: "Recorder Version",
            },
        },
        es: {
            title: "Metadatos grabadora",
            save: "guardar",
            cancel: "cancelar",
            fields: {
                id_recorder: "ID Grabadora",
                recorder_name: "Nombre Grabadora",
                id_location_recorder: "Localización",
                id_microphone_recorder: "Micrófono",
                id_processor_recorder: "Procesador",
                installation_date: "Fecha Instalación",
                status: "Estado",
                version: "Versión Grabadora",
            },
        },
    };

    useEffect(() => {
        const convertDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
        };

        if (selectedModifyRecorder) {
            const initial = {
                id_recorder: selectedModifyRecorder.id_recorder || "",
                recorder_name: selectedModifyRecorder.recorder_name || "",
                id_location_recorder: selectedModifyRecorder.id_location_recorder || "",
                id_microphone_recorder: selectedModifyRecorder.id_microphone_recorder || "",
                id_processor_recorder: selectedModifyRecorder.id_processor_recorder || "",
                installation_date: selectedModifyRecorder.installation_date ? convertDate(selectedModifyRecorder.installation_date) : "",
                status: selectedModifyRecorder.status ? convertDate(selectedModifyRecorder.status) : "",
                version: selectedModifyRecorder.version || "",
            };
            setInitialData(initial);
            setFormData(initial);
        }

        Promise.all([
            fetch("http://localhost:8080/api/v1/locations").then(res => res.json()),
            fetch("http://localhost:8080/api/v1/microphones").then(res => res.json()),
            fetch("http://localhost:8080/api/v1/processors").then(res => res.json())
        ])
            .then(([locData, micData, procData]) => {
                setLocations(locData);
                const availableMics = micData.filter(m => m.id_recorder === null || m.id_microphone === selectedModifyRecorder.id_microphone_recorder);
                const availableProcs = procData.filter(p => p.id_recorder === null || p.id_processor === selectedModifyRecorder.id_processor_recorder);
                setMicrophones(availableMics);
                setProcessors(availableProcs);
            })
            .catch(error => console.error("Error fetching:", error));
    }, [selectedModifyRecorder]);

    const handleChange = async (e) => {
        const { name, value } = e.target;

        // Validación de nombre duplicado
        if (name === "recorder_name") {
            setFormData(prev => ({ ...prev, [name]: value }));

            // Verificar si el nombre ingresado ya está en uso
            if (value && recorders.some(recorder => recorder.recorder_name.toLowerCase() === value.toLowerCase() && recorder.id_recorder !== selectedModifyRecorder?.id_recorder)) {
                setDuplicateNameError("This recorder name is already taken.");
            } else {
                setDuplicateNameError("");
            }
        }

        // Validación de fecha futura (instalación)
        if (name === "installation_date") {
            setFormData(prev => ({ ...prev, [name]: value }));
            const selectedDate = new Date(value);
            const currentDate = new Date();

            if (selectedDate > currentDate) {
                setFutureDateError("The installation date cannot be in the future.");
            } else {
                setFutureDateError("");
            }
        }

        // Validación de fecha futura (status)
        if (name === "status") {
            setFormData(prev => ({ ...prev, [name]: value }));
            const selectedDate = new Date(value);
            const currentDate = new Date();

            if (selectedDate > currentDate) {
                setStatusFutureDateError("The status date cannot be in the future.");
            } else {
                setStatusFutureDateError("");
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar si hay errores de validación antes de proceder
        if (formErrors.recorder_name || duplicateNameError || futureDateError || statusFutureDateError) {
            alert("Please fix the errors before submitting");
            return;
        }

        if (JSON.stringify(formData) === JSON.stringify(initialData)) {
            setSelectedModifyRecorder(null);
            return;
        }
        try {
            await fetch(`http://localhost:8080/api/v1/recorders/${selectedModifyRecorder.id_recorder}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    version: formData.version || null,
                    status: formData.status || null,
                    id_microphone_recorder: formData.id_microphone_recorder || null,
                    id_processor_recorder: formData.id_processor_recorder || null,
                }),
            });

            const refreshedRecorders = await fetch("http://localhost:8080/api/v1/recorders").then(res => res.json());
            setRecorders(refreshedRecorders);
            setSelectedModifyRecorder(null);
        } catch (error) {
            console.error("Error updating:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 p-4 z-50">
            <div className="bg-[#F9F9F9] rounded-2xl shadow-lg w-full max-w-2xl px-10 py-8 relative">
                <h2 className="text-center text-[#375B38] text-l mb-10 Montserrat">{textContent[language].title}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 text-sm">
                        {Object.keys(textContent[language].fields).map((field) => (
                            <div key={field} className="flex flex-col gap-1">
                                <label className="text-xs text-[#778184]">{textContent[language].fields[field]}</label>

                                {field === "id_location_recorder" ? (
                                    <select
                                        name={field}
                                        value={formData[field] || ""}
                                        onChange={handleChange}
                                        className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1 text-sm appearance-none"
                                    >
                                        <option value="">{language === "es" ? "Sin asignar" : "Not assigned"}</option>
                                        {locations.map(location => (
                                            <option key={location.id_location} value={location.id_location}>
                                            {location.name_location.replaceAll("_", " ")}
                                          </option>
                                        ))}
                                    </select>
                                ) : field === "id_microphone_recorder" ? (
                                    <select
                                        name={field}
                                        value={formData[field] || ""}
                                        onChange={handleChange}
                                        className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1 text-sm appearance-none"
                                    >
                                        <option value="">{language === "es" ? "Sin asignar" : "Not assigned"}</option>
                                        {microphones.map(mic => (
                                            <option key={mic.id_microphone} value={mic.id_microphone}>
                                                {mic.id_microphone}
                                            </option>
                                        ))}
                                    </select>
                                ) : field === "id_processor_recorder" ? (
                                    <select
                                        name={field}
                                        value={formData[field] || ""}
                                        onChange={handleChange}
                                        className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1 text-sm appearance-none"
                                    >
                                        <option value="">{language === "es" ? "Sin asignar" : "Not assigned"}</option>
                                        {processors.map(proc => (
                                            <option key={proc.id_processor} value={proc.id_processor}>
                                                {proc.id_processor}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field === "recorder_name" ? "number" : (field.includes("date") || field === "status" ? "date" : "text")}
                                        name={field}
                                        value={formData[field] || ""}
                                        onChange={handleChange}
                                        className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1 text-sm placeholder-[#77818480]"
                                        placeholder="datos"
                                        readOnly={field === "id_recorder"}  // Campo solo lectura
                                    />
                                )}
                                {/* Mostrar mensaje de error si existe */}
                                {formErrors[field] && <span className="text-red-500 text-xs">{formErrors[field]}</span>}
                                {field === "recorder_name" && duplicateNameError && (
                                    <span className="text-red-500 text-xs">{duplicateNameError}</span>
                                )}
                                {field === "installation_date" && futureDateError && (
                                    <span className="text-red-500 text-xs">{futureDateError}</span>
                                )}
                                {field === "status" && statusFutureDateError && (
                                    <span className="text-red-500 text-xs">{statusFutureDateError}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-center gap-6 mt-10">
                        <button
                            type="button"
                            onClick={() => setSelectedModifyRecorder(null)}
                            className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                        >
                            {textContent[language].cancel}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                        >
                            {textContent[language].save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
