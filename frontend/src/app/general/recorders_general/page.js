"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/Navbar_general";
import Link from "next/link";

export default function RecordersGeneral() {
    const [language, setLanguage] = useState("en");
    const [recorders, setRecorders] = useState([]);

    const textContent = {
        en: {
            title: "Recorders",
            description: "Here you can explore different recorders available in BIRDeep.",
            tableHeaders: ["ID", "ID Location", "ID Microphone", "ID Processor", "Installation Date"],
            viewRecordings: (name) => `View recordings of recorder ${name}`,
            hideRecordings: (name) => `Hide recordings of recorder ${name}`,
        },
        es: {
            title: "Grabadoras",
            description: "Aquí puedes explorar las diferentes grabadoras disponibles en BIRDeep.",
            tableHeaders: ["ID", "ID Ubicación", "ID Micrófono", "ID Procesador", "Fecha de Instalación"],
            viewRecordings: (name) => `Ver grabaciones de la grabadora ${name}`,
            hideRecordings: (name) => `Ocultar grabaciones de la grabadora ${name}`,
        },
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/recorders")
            .then((response) => response.json())
            .then((data) => setRecorders(data))
            .catch((error) => console.error("Error fetching recorders:", error));
    }, []);


    return (
        <div className="relative w-full h-screen">
            <Navbar toggleLanguage={() => setLanguage(language === "en" ? "es" : "en")} language={language} />
            <div className="container mx-auto px-10 py-10">
            <h1 className="text-4xl font-bold">{textContent[language].title}</h1>
                <p className="mt-4 text-lg max-w-md">{textContent[language].description}</p>
                
                {/* Tabla de grabadoras */}
                <div className="mt-8 w-full overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                {textContent[language].tableHeaders.map((header, index) => (
                                    <th key={index} className="border border-gray-300 px-4 py-2">{header}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {recorders.map((recorder) => (
                                <tr key={recorder.id_recorder} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Link href={`/general/recorders_general/${recorder.id_recorder}`} className="text-blue-500 hover:underline">
                                            {recorder.id_recorder}
                                        </Link>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{recorder.id_location_recorder}</td>
                                    <td className="border border-gray-300 px-4 py-2">{recorder.id_microphone_recorder}</td>
                                    <td className="border border-gray-300 px-4 py-2">{recorder.id_processor_recorder}</td>
                                    <td className="border border-gray-300 px-4 py-2">{recorder.installation_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>
        </div>
    </div>

    );
}
