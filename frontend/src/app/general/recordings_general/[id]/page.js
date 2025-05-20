"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; 
import Navbar from "../../../../components/navbars/Navbar_general";

export default function RecordingDetails() {
    const params = useParams();
    const id = params?.id; 
    const [recording, setRecording] = useState(null);
    const [recorders, setRecorders] = useState([]);
    const [language, setLanguage] = useState("en");  // Estado para el idioma
    const router = useRouter();

    const toggleLanguage = () => {
        const newLang = language === "en" ? "es" : "en";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
    };
      

    useEffect(() => {
        if (!id) return;
        
        const savedLanguage = localStorage.getItem("language") || "es";
        setLanguage(savedLanguage);
        
        // Fetch recording details
        fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_IP}:8080/api/v1/recordings/${id}`)
            .then((response) => response.json())
            .then((data) => setRecording(data))
            .catch((error) => console.error("Error fetching recording details:", error));
    }, [id]);

    if (!recording) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    // Traducciones para los textos
    const textContent = {
      en: {
        title: "Recording Details",
        id: "ID",
        recorderId: "ID recorder recording",
        timeRecord: "Time record",
        fileType: "File type record",
        bitrate: "Bitrate record",
        sampleRate: "Sample rate record",
        gain: "Gain record",
        duration: "Duration record",
        uri: "Uri",
        device: "Device",
        backToRecordings: "Back to Recordings"
      },
      es: {
        title: "Detalles de la grabación",
        id: "ID",
        recorderId: "ID grabación del grabador",
        timeRecord: "Hora de grabación",
        fileType: "Tipo de archivo de grabación",
        bitrate: "Tasa de bits de grabación",
        sampleRate: "Frecuencia de muestreo de grabación",
        gain: "Ganancia de grabación",
        duration: "Duración de grabación",
        uri: "Uri",
        device: "Dispositivo",
        backToRecordings: "Volver a Grabaciones"
      },
    };

    return (
        <div className="relative w-full h-screen">
            <Navbar toggleLanguage={toggleLanguage} language={language} />
            <div className="container mx-auto px-10 flex flex-col items-center h-full py-10">
                <h1 className="text-4xl font-bold">{textContent[language].title}</h1>
                <p className="mt-4 text-lg">{textContent[language].description}</p>
                <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-2xl"> {/* Aumenté el tamaño */}
                    <p><strong>{textContent[language].id}:</strong> {recording.id_record}</p>
                    <p><strong>{textContent[language].recorderId}:</strong> {recording.id_recorder_recordings}</p>
                    <p><strong>{textContent[language].timeRecord}:</strong> {recording.time_record}</p>
                    <p><strong>{textContent[language].fileType}:</strong> {recording.filetype_record}</p>
                    <p><strong>{textContent[language].bitrate}:</strong> {recording.bitrate_record}</p>
                    <p><strong>{textContent[language].sampleRate}:</strong> {recording.sample_rate_record}</p>
                    <p><strong>{textContent[language].gain}:</strong> {recording.gain_record}</p>
                    <p><strong>{textContent[language].duration}:</strong> {recording.duration_record}</p>
                    <p><strong>{textContent[language].uri}:</strong> {recording.uri}</p>
                    <p><strong>{textContent[language].device}:</strong> {recording.device}</p>
                </div>

                <button 
                    onClick={() => router.push("/general/recordings_general")}
                    className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                    {textContent[language].backToRecordings}
                </button>
            </div>
        </div>

    );
}