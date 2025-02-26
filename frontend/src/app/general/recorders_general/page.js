"use client";
import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaDownload } from "react-icons/fa";
import Navbar from "../../../components/navbars/Navbar_general";

export default function RecordersGeneral() {
    const [language, setLanguage] = useState("en");
    const [recorders, setRecorders] = useState([]);
    const [recordings, setRecordings] = useState({});
    const [expandedRecorder, setExpandedRecorder] = useState(null);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

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

    const fetchRecordings = (recorderId) => {
        if (expandedRecorder === recorderId) {
            setExpandedRecorder(null);
        } else {
            if (!recordings[recorderId]) {
                fetch(`http://localhost:8080/api/v1/recordings?id_recorder_recordings=${recorderId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        setRecordings((prev) => ({ ...prev, [recorderId]: data }));
                        setExpandedRecorder(recorderId);
                    })
                    .catch((error) => console.error("Error fetching recordings:", error));
            } else {
                setExpandedRecorder(recorderId);
            }
        }
    };

    const togglePlay = (audioSrc) => {
        if (currentAudio === audioSrc) {
            setIsPlaying(!isPlaying);
            setCurrentAudio(null);
        } else {
            setCurrentAudio(audioSrc);
            setIsPlaying(true);
        }
    };
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
                                <React.Fragment key={recorder.id_recorder}>
                                    <tr className="text-center">
                                        <td className="border border-gray-300 px-4 py-2">{recorder.id_recorder}</td>
                                        <td className="border border-gray-300 px-4 py-2">{recorder.id_location_recorder}</td>
                                        <td className="border border-gray-300 px-4 py-2">{recorder.id_microphone_recorder}</td>
                                        <td className="border border-gray-300 px-4 py-2">{recorder.id_processor_recorder}</td>
                                        <td className="border border-gray-300 px-4 py-2">{recorder.installation_date}</td>
                                    </tr>  
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                                    

                {/* Audios de cada grabadora */}
                <div className="mt-8 w-full">
                    {recorders.map((recorder) => (
                        <div key={recorder.id_recorder} className="mb-4">
                            <button 
                                className="flex items-center px-3 py-1 bg-black text-white rounded-full transition text-sm font-medium font-sans"
                                onClick={() => fetchRecordings(recorder.id_recorder)}
                            >
                                {expandedRecorder === recorder.id_recorder
                                    ? textContent[language].hideRecordings(recorder.recorder_name)
                                    : textContent[language].viewRecordings(recorder.recorder_name)}
                            </button>
                            {expandedRecorder === recorder.id_recorder && recordings[recorder.id_recorder] && (
                                <div className="mt-4 space-y-2">
                                    {recordings[recorder.id_recorder].map((recording) => (
                                        <div key={recording.id_record} className="flex items-center gap-4 border-b pb-2">
                                            <button onClick={() => togglePlay(recording.uri)} className="text-2xl">
                                                {currentAudio === recording.uri && isPlaying ? <FaPause /> : <FaPlay />}
                                            </button>
                                            <span className="flex-grow">{recording.filename}</span>
                                            <a href={recording.uri} download={recording.filename} className="text-xl">
                                                <FaDownload />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Reproductor del audio */}
                {currentAudio && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg w-2/3 shadow-lg">
                        <audio controls autoPlay={isPlaying} src={currentAudio} className="w-full" />
                    </div>
                )}
            </div>
        </div>
    </div>

    );
}
