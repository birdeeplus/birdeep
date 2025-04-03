"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbars/Navbar_general";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import AddRecorderForm from "../../../components/recorders/AddRecorderForm";
import EditRecorderForm from "../../../components/recorders/EditRecorderForm";
import DeleteRecorderModal from "../../../components/recorders/DeleteRecorderModal";

export default function RecordersGeneral() {
    const [language, setLanguage] = useState("en");
    const [isAdmin, setIsAdmin] = useState(false);
    const [recorders, setRecorders] = useState([]);
    const [locations, setLocations] = useState([]);
    const [microphones, setMicrophones] = useState([]);
    const [processors, setProcessors] = useState([]);
    const [selectedModifyRecorder, setSelectedModifyRecorder] = useState(null);
    const [selectedDeleteRecorder, setSelectedDeleteRecorder] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const router = useRouter();

    const textContent = {
        en: {
            title: "Recorders",
            description: "Here you can explore different recorders available in BIRDeep.",
            tableHeaders: ["ID", "Nombre", "Location", "Microphone Model", "Processor Model", "Installation Date", "Version", "Modify", "Delete"],
            add: "Add Recorder",
        },
        es: {
            title: "Grabadoras",
            description: "Aquí puedes explorar las diferentes grabadoras disponibles en BIRDeep.",
            tableHeaders: ["ID", "Name", "Ubicación", "Modelo del Micrófono", "Modelo del Procesador", "Fecha de Instalación", "Version", "Modificar", "Eliminar"],
            add: "Añadir Grabadora",
        },
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/recorders")
            .then((response) => response.json())
            .then((data) => setRecorders(data))
            .catch((error) => console.error("Error fetching recorders:", error));
        fetch("http://localhost:8080/api/v1/locations")
            .then((response) => response.json())
            .then((data) => setLocations(data))
            .catch((error) => console.error("Error fetching locatios:", error));
        fetch("http://localhost:8080/api/v1/microphones")
            .then((response) => response.json())
            .then((data) => setMicrophones(data))
            .catch((error) => console.error("Error fetching microphones:", error));
        fetch("http://localhost:8080/api/v1/processors")
            .then((response) => response.json())
            .then((data) => setProcessors(data))
            .catch((error) => console.error("Error fetching processors:", error));
        const userIsAdmin = localStorage.getItem("is_admin") === "true";
        setIsAdmin(userIsAdmin);
    }, []);

    const handleDeleteClick = (recorder) => {
        setSelectedDeleteRecorder(recorder);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedDeleteRecorder) {
            try {
                await fetch(`http://localhost:8080/api/v1/recorders/${selectedDeleteRecorder.id_recorder}`, {
                    method: "DELETE",
                });
                setRecorders(recorders.filter(r => r.id_recorder !== selectedDeleteRecorder.id_recorder));
            } catch (error) {
                console.error("Error deleting recorder:", error);
            }
        }
        setIsDeleteModalOpen(false);
        setSelectedDeleteRecorder(null);
    };

    return (
        <div className="relative w-full h-screen">
            <Navbar toggleLanguage={() => setLanguage(language === "en" ? "es" : "en")} language={language} />
            <br />
            <div className="w-full max-w-screen-xl mx-auto sm:px-6 lg:px-8 flex flex-col items-start h-80 pb-36 mt-20">
                <h1 className="text-[#375B38] text-4xl font-bold">{textContent[language].title}</h1>
                <p className="text-[#375B38] mt-4 text-lg max-w-md">{textContent[language].description}</p>

                {isAdmin && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="mt-4 px-4 py-2 bg-[#375B38] text-white rounded-full flex items-center"
                    >
                        <FaPlus className="mr-2" /> {textContent[language].add}
                    </button>
                )}

                <table className="text-[#375B38] w-full mt-8 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200">
                            {textContent[language].tableHeaders.map((header, index) => (
                                <th key={index} className="px-4 py-2">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {recorders.map((recorder) => (
                            <tr
                                key={recorder.id_recorder}
                                className="text-center cursor-pointer hover:bg-gray-100"
                                onClick={() => router.push(`/general/recorders_general/${recorder.id_recorder}`)}
                            >
                                <td className="px-4 py-2 rounded-l-lg">
                                    {recorder.id_recorder}
                                </td>
                                <td className="px-4 py-2 rounded-l-lg">
                                    {recorder.recorder_name}
                                </td>
                                <td className="px-4 py-2">
                                    {locations.find(loc => loc.id_location === recorder.id_location_recorder)?.name_location}
                                </td>
                                <td className="px-4 py-2">
                                    {microphones.find(mic => mic.id_microphone === recorder.id_microphone_recorder)?.model_microphone}
                                </td>
                                <td className="px-4 py-2">
                                    {processors.find(proc => proc.id_processor === recorder.id_processor_recorder)?.model_processor}
                                </td>
                                <td className="px-4 py-2">
                                    {recorder.installation_date}
                                </td>
                                <td className="px-4 py-2">
                                    {recorder.version}
                                </td>

                                {isAdmin && (
                                    <>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedModifyRecorder(recorder);
                                                }}
                                                className="text-black-500 hover:text-black-700"
                                            >
                                                <FaEdit />
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 rounded-r-lg">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(recorder);
                                                }}
                                                className="text-black-500 hover:text-black-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdding && (
                <AddRecorderForm
                    setIsAdding={setIsAdding}
                    setRecorders={setRecorders}
                    recorders={recorders}
                    language={language}
                />
            )}

            {selectedModifyRecorder && (
                <EditRecorderForm
                    selectedModifyRecorder={selectedModifyRecorder}
                    setSelectedModifyRecorder={setSelectedModifyRecorder}
                    setRecorders={setRecorders}
                    recorders={recorders}
                    language={language}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteRecorderModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    recorderName={selectedDeleteRecorder?.id_recorder || ""}
                />
            )}
        </div>
    );
}
