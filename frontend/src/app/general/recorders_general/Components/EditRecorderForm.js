"use client";
import React, { useState, useEffect } from "react";

export default function EditRecorderForm({ selectedRecorder, setSelectedRecorder, setRecorders, recorders, language }) {
    
    const [locations, setLocations] = useState([]);
    const [microphones, setMicrophones] = useState([]);
    const [processors, setProcessors] = useState([]);
    const [formData, setFormData] = useState({
        recorder_name : selectedRecorder.recorder_name || "",
        id_location_recorder: selectedRecorder.id_location_recorder || "",
        id_microphone_recorder: selectedRecorder.id_microphone_recorder || "",
        id_processor_recorder: selectedRecorder.id_processor_recorder || "",
        installation_date: selectedRecorder.installation_date || "",
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
        if (selectedRecorder) {

            setFormData({
                recorder_name : selectedRecorder.recorder_name || "",
                id_location_recorder: selectedRecorder.id_location_recorder || "",
                id_microphone_recorder: selectedRecorder.id_microphone_recorder || "",
                id_processor_recorder: selectedRecorder.id_processor_recorder || "",
                installation_date: convertDate(selectedRecorder.installation_date) || "",
                status: convertDate(selectedRecorder.status) || "",
            });
        }
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
    }, [selectedRecorder]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/v1/recorders/${selectedRecorder.id_recorder}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error updating recorder");

            const updatedRecorder = await response.json();
            setRecorders(recorders.map((rec) => (rec.id_recorder === selectedRecorder.id_recorder ? updatedRecorder : rec)));
            setSelectedRecorder(null);
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
                        name="name_recorder" 
                        placeholder={textContent[language].name_recorder}
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
                        required>
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
                        required>
                        {microphones.map((mic) => (
                            <option key={mic.id_microphone} value={mic.id_microphone}>{mic.id_microphone}</option>
                        ))}   
                    </select>
                    <p>{textContent[language].selectProcessor}</p>
                    <select 
                        name="id_processor_recorder" 
                        value={formData.id_processor_recorder} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                        required>
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
                    <div className="flex justify-between mt-4">
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
                            {textContent[language].save}
                        </button>
                        <button onClick={() => setSelectedRecorder(null)} className="px-4 py-2 bg-black text-white rounded">
                            {textContent[language].cancel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
