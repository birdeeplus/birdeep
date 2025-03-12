"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/Navbar_general";

export default function MicrophonesTable() {
    const [language, setLanguage] = useState("en");
    const [microphones, setMicrophones] = useState([]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/microphones-recorders")
            .then((response) => response.json())
            .then((data) => setMicrophones(data))
            .catch((error) => console.error("Error fetching microphones:", error));
    }, []);

    return (
        <div className="w-full h-screen">
            {/* Navbar */}
            <Navbar toggleLanguage={toggleLanguage} language={language} />

            {/* Tabla de micrófonos */}
            <div className="w-full max-w-4xl mx-auto mt-20 p-4">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {language === "en" ? "Microphones List" : "Lista de Micrófonos"}
                </h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">
                                {language === "en" ? "Model" : "Modelo"}
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                {language === "en" ? "Comment" : "Comentario"}
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                {language === "en" ? "Recorder ID" : "ID Grabador"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {microphones.map((microphone) => (
                            <tr key={microphone.id_microphone} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {microphone.id_microphone}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {microphone.model_microphone}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {microphone.comment_microphone || "-"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {microphone.id_recorder || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
