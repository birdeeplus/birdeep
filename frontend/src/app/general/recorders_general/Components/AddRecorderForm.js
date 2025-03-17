"use client";
import React, { useState, useEffect } from "react";

export default function AddRecorderForm({ setIsAdding, setRecorders, recorders, language }) {
    const [locations, setLocations] = useState([]);
    const [microphones, setMicrophones] = useState([]);
    const [processors, setProcessors] = useState([]);
    const lastRecorder = recorders[recorders.length - 1];
    const nextId = lastRecorder.id_recorder + 1;
    const [formData, setFormData] = useState({
        name_recorder: "",
        id_location_recorder: "",
        id_microphone_recorder: "",
        id_processor_recorder: "",
        installation_date: "",
        status: ""
    });

    const textContent = {
        en: {
            save: "Save",
            cancel: "Cancel",
            add: "Add Recorder",
            selectLocation: "Select location",
            selectMicrophone: "Select microphone",
            selectProcessor: "Select processor",
            recorderName: "Recorder name",
            installationDate: "Installation date",
            status: "Status",
        },
        es: {
            save: "Guardar",
            cancel: "Cancelar",
            add: "Añadir Grabadora",
            selectLocation: "Seleccionar localización",
            selectMicrophone: "Seleccionar micrófono",
            selectProcessor: "Seleccionar procesador",
            recorderName: "Nombre de la grabadora",
            installationDate: "Fecha de instalación",
            status: "Estado",
        },
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/locations")
            .then((response) => response.json())
            .then((data) => setLocations(data))
            .catch((error) => console.error("Error fetching locations:", error));

        fetch("http://localhost:8080/api/v1/microphones")
            .then((response) => response.json())
            .then((data) => setMicrophones(data))
            .catch((error) => console.error("Error fetching microphones:", error));

        fetch("http://localhost:8080/api/v1/processors")
            .then((response) => response.json())
            .then((data) => setProcessors(data))
            .catch((error) => console.error("Error fetching processors:", error));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/v1/recorders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const newRecorder = await response.json();
                setRecorders([...recorders, newRecorder.recorder]);
                setIsAdding(false);
            } else {
                console.error("Error adding recorder");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">{textContent[language].add}</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <p>{textContent[language].recorderName}</p>
                    <input 
                        type="text" 
                        name="name_recorder" 
                        placeholder={textContent[language].recorderName}
                        value={formData.name_recorder} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                        required
                    />
                    <select
                        name="id_location_recorder" 
                        value={formData.id_location_recorder} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded"
                        required>
                        <option value="">{textContent[language].selectLocation}</option>
                        {locations.map((loc) => (
                            <option key={loc.id_location} value={loc.id_location}>{loc.name_location}</option>
                        ))}
                    </select> 
                    <select 
                        name="id_microphone_recorder" 
                        value={formData.id_microphone_recorder} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                        required>
                        <option value="">{textContent[language].selectMicrophone}</option>
                        {microphones.map((mic) => (
                            <option key={mic.id_microphone} value={mic.id_microphone}>{mic.id_microphone}</option>
                        ))}   
                    </select>
                    <select 
                        name="id_processor_recorder" 
                        value={formData.id_processor_recorder} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                        required>
                        <option value="">{textContent[language].selectProcessor}</option>
                        {processors.map((proc) => (
                            <option key={proc.id_processor} value={proc.id_processor}>{proc.id_processor}</option>
                        ))}
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
                        required
                    />
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-300 rounded">
                            {textContent[language].cancel}
                        </button>
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
                            {textContent[language].save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
