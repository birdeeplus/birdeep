"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/Navbar_general";

export default function ProcessorsGeneral() {
    const [language, setLanguage] = useState("en");
    const [processors, setProcessors] = useState([]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/processors-recorders")
            .then((response) => response.json())
            .then((data) => {
                console.log("Datos recibidos:", data); // Depuración
                setProcessors(Array.isArray(data) ? data : []);
            })
            .catch((error) => console.error("Error al obtener procesadores:", error));
    }, []);

    return (
        <div className="relative w-full h-screen p-6">
            <Navbar toggleLanguage={toggleLanguage} language={language} />

            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Lista de Procesadores</h2>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2 text-center">ID</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Modelo</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Comentario</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">ID Grabadora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processors.length > 0 ? (
                            processors.map((processor) => (
                                <tr key={processor.id_processor} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {processor.id_processor}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {processor.model_processor}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {processor.comment_processor || "Sin comentarios"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {processor.id_recorder ? processor.id_recorder : "No asignado"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-4">
                                    No hay procesadores registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
