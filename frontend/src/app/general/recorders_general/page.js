"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbars/Navbar_general";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import AddRecorderForm from "./Components/AddRecorderForm";
import EditRecorderForm from "./Components/EditRecorderForm";
import DeleteRecorderModal from "./Components/DeleteRecorderModal";

export default function RecordersGeneral() {
    const [language, setLanguage] = useState("en");
    const [isAdmin, setIsAdmin] = useState(false);
    const [recorders, setRecorders] = useState([]);
    const [selectedModifyRecorder, setSelectedModifyRecorder] = useState(null);
    const [selectedDeleteRecorder, setSelectedDeleteRecorder] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const router = useRouter();

    const textContent = {
        en: {
            title: "Recorders",
            description: "Here you can explore different recorders available in BIRDeep.",
            tableHeaders: ["ID", "ID Location", "ID Microphone", "ID Processor", "Installation Date", "Modify", "Delete"],
            add: "Add Recorder",
        },
        es: {
            title: "Grabadoras",
            description: "Aquí puedes explorar las diferentes grabadoras disponibles en BIRDeep.",
            tableHeaders: ["ID", "ID Ubicación", "ID Micrófono", "ID Procesador", "Fecha de Instalación", "Modificar", "Eliminar"],
            add: "Añadir Grabadora",
        },
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/recorders")
            .then((response) => response.json())
            .then((data) => setRecorders(data))
            .catch((error) => console.error("Error fetching recorders:", error));
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
            <br></br>
            <div className="container mx-auto px-10 py-10">
                <h1 className="text-4xl font-bold">{textContent[language].title}</h1>
                <p className="mt-4 text-lg max-w-md">{textContent[language].description}</p>

                {isAdmin && (
                    <button onClick={() => setIsAdding(true)} className="mt-4 px-4 py-2 bg-black text-white rounded-lg flex items-center">
                        <FaPlus className="mr-2" /> {textContent[language].add}
                    </button>
                )}

                <table className="w-full border-collapse border border-gray-300 mt-8">
                    <thead>
                        <tr className="bg-gray-200">
                            {textContent[language].tableHeaders.map((header, index) => (
                                <th key={index} className="border border-gray-300 px-4 py-2">{header}</th>
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
                                <td className="border border-gray-300 px-4 py-2">{recorder.id_recorder}</td>
                                <td className="border border-gray-300 px-4 py-2">{recorder.id_location_recorder}</td>
                                <td className="border border-gray-300 px-4 py-2">{recorder.id_microphone_recorder}</td>
                                <td className="border border-gray-300 px-4 py-2">{recorder.id_processor_recorder}</td>
                                <td className="border border-gray-300 px-4 py-2">{recorder.installation_date}</td>

                                {isAdmin && (
                                    <>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button onClick={(e) => { e.stopPropagation(); setSelectedModifyRecorder(recorder); }} className="text-black-500 hover:text-black-700">
                                                <FaEdit />
                                            </button>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(recorder); }} className="text-black-500 hover:text-black-700">
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

            {isAdding && <AddRecorderForm setIsAdding={setIsAdding} 
                setRecorders={setRecorders} 
                recorders={recorders} 
                language={language} 
            />}

            {selectedModifyRecorder && <EditRecorderForm selectedModifyRecorder={selectedModifyRecorder} 
                setSelectedModifyRecorder={setSelectedModifyRecorder} 
                setRecorders={setRecorders} 
                recorders={recorders} 
                language={language}
            />}

            {isDeleteModalOpen && <DeleteRecorderModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                recorderName={selectedDeleteRecorder?.id_recorder || ""}
            />}
        </div>
    );
}
