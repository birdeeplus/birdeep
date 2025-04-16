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
    const [initialData, setInitialData] = useState({
        id_recorder: selectedModifyRecorder.id_recorder,
        recorder_name : selectedModifyRecorder.recorder_name || "",
        id_location_recorder: selectedModifyRecorder.id_location_recorder || "",
        id_microphone_recorder: selectedModifyRecorder.id_microphone_recorder || "",
        id_processor_recorder: selectedModifyRecorder.id_processor_recorder || "",
        installation_date: selectedModifyRecorder.installation_date || "",
        status: selectedModifyRecorder.status || "", 
        version : selectedModifyRecorder.version || "",
    });
    const textContent = {
        en: {
            save: "Save",
            cancel: "Cancel",
            modify: "Modify Recorder",
            selectLocation: "Select location",
            selectMicrophone: "Select microphone",
            selectProcessor: "Select processor",
            recorderName: "Recorder name",
            recorderVersion: "Recorder version",
            installationDate: "Installation date",
            status: "Status",
        },
        es: {
            save: "Guardar",
            cancel: "Cancelar",
            modify: "Editar Grabadora",
            selectLocation: "Seleccionar localización",
            selectMicrophone: "Seleccionar micrófono",
            selectProcessor: "Seleccionar procesador",
            recorderName: "Nombre de la grabadora",
            recorderVersion: "Versión de la grabadora",
            installationDate: "Fecha de instalación",
            status: "Estado",
        },
    };

    useEffect(() => {
        const convertDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
        };   
        if (selectedModifyRecorder) {

            const initial = {
                id_recorder: selectedModifyRecorder.id_recorder,
                recorder_name: selectedModifyRecorder.recorder_name || "",
                id_location_recorder: selectedModifyRecorder.id_location_recorder || "",
                id_microphone_recorder: selectedModifyRecorder.id_microphone_recorder || "",
                id_processor_recorder: selectedModifyRecorder.id_processor_recorder || "",
                installation_date: convertDate(selectedModifyRecorder.installation_date) || "",
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
        .then(([locationsData, microphonesData, processorsData]) => {
            setLocations(locationsData);
    
            // Micrófonos disponibles o el ya asignado
            const availableMicrophones = microphonesData.filter(m =>
                m.id_recorder === null || m.id_microphone === selectedModifyRecorder.id_microphone_recorder
            );
            const availableProcessors = processorsData.filter(p =>
                p.id_recorder === null || p.id_processor === selectedModifyRecorder.id_processor_recorder
            );
    
            setMicrophones(availableMicrophones);
            setProcessors(availableProcessors);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, [selectedModifyRecorder]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (JSON.stringify(formData) === JSON.stringify(initialData)) {
            setSelectedModifyRecorder(null);
            return;
        }
        if (formData.version === ''){
            formData.version = null;
        }
        if (formData.status === ''){
            formData.status = null;
        }
        if (formData.id_processor_recorder === ''){
            formData.id_processor_recorder = null;
        }
        if (formData.id_microphone_recorder === ''){
            formData.id_microphone_recorder = null;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/recorders/${selectedModifyRecorder.id_recorder}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error updating recorder");

            const updatedRecorder = await response.json();
            // Cambiar el formato de la fecha
            const formattedRecorder = {
                ...updatedRecorder.recorder,
                installation_date: new Date(updatedRecorder.recorder.installation_date).toUTCString(),
                status: new Date(updatedRecorder.recorder.status).toUTCString(),
            };
            setRecorders(recorders.map((rec) => (rec.id_recorder === selectedModifyRecorder.id_recorder ? formattedRecorder : rec)));
            setSelectedModifyRecorder(null);
        } catch (error) {
            console.error("Error updating recorder:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-2xl font-bold mb-4">{textContent[language].modify}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <p>{textContent[language].recorderName}</p>
                    <input 
                        type="text" 
                        name="recorder_name" 
                        value={formData.recorder_name} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                        required
                    />
                    <p>{textContent[language].selectLocation}</p>
                    <select
                        name="id_location_recorder" 
                        value={formData.id_location_recorder} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded"
                        >
                        {locations.map((loc) => (
                            <option key={loc.id_location} value={loc.id_location}>{loc.name_location}</option>
                        ))}
                    </select> 
                    <p>{textContent[language].selectMicrophone}</p>
                    <select 
                        name="id_microphone_recorder" 
                        value={formData.id_microphone_recorder} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                        >
                        <option value="">{language === "es" ? "Seleccionar micrófono" : "Select microphone"}</option>
                        {microphones.length === 0 ? (
                            <option value="">{language === "es" ? "No hay micrófonos disponibles" : "No available microphones"}</option>
                        ) : (
                            microphones.map((mic) => (
                                <option key={mic.id_microphone} value={mic.id_microphone}>{mic.id_microphone}</option>
                            ))
                        )}
                    </select>
                    <p>{textContent[language].selectProcessor}</p>
                    <select 
                        name="id_processor_recorder" 
                        value={formData.id_processor_recorder || ""} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">{language === "es" ? "Seleccionar procesador" : "Select processor"}</option>
                        {processors.length === 0 ? (
                            <option disabled>{language === "es" ? "No hay procesadores disponibles" : "No available processors"}</option>
                        ) : (
                            processors.map((proc) => (
                                <option key={proc.id_processor} value={proc.id_processor}>
                                    {proc.id_processor}
                                </option>
                            ))
                        )}
                    </select>

                    <p>{textContent[language].installationDate}</p>
                    <input 
                        type="date" 
                        name="installation_date" 
                        value={formData.installation_date} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                        required
                    />
                    <p>{textContent[language].status}</p>
                    <input 
                        type="date" 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                    />
                    <input 
                        type="text" 
                        name="version" 
                        value={formData.version} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                    />
                    <div className="flex justify-between mt-4">
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
                            {textContent[language].save}
                        </button>
                        <button onClick={() => setSelectedModifyRecorder(null)} className="px-4 py-2 bg-black text-white rounded">
                            {textContent[language].cancel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
