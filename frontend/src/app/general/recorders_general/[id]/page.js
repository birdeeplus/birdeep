"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaPlay, FaPause, FaDownload } from "react-icons/fa";
import Navbar from "../../../../components/navbars/Navbar_busqueda";

export default function RecorderDetails() {
    const { id } = useParams();
    const [recordings, setRecordings] = useState([]);
    const [filteredRecordings, setFilteredRecordings] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("23:59");
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [language, setLanguage] = useState("en");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
      };
      
    useEffect(() => {
        if (id) {
            fetch(`http://localhost:8080/api/v1/recordings?id_recorder_recordings=${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setRecordings(data);
                    setFilteredRecordings(data);
                })
                .catch((error) => console.error("Error fetching recordings:", error));
        }
    }, [id]);

    const togglePlay = (audioSrc) => {
        if (currentAudio === audioSrc) {
            setIsPlaying(!isPlaying);
            setCurrentAudio(null);
        } else {
            setCurrentAudio(audioSrc);
            setIsPlaying(true);
        }
    };


    const filterByDateTime = () => {
        if (!startDate || !endDate || !startTime || !endTime) return;

        const startTimestamp = new Date(`${startDate}T${startTime}`).getTime();
        const endTimestamp = new Date(`${endDate}T${endTime}`).getTime();

        const filtered = recordings.filter((recording) => {
            const recordTime = new Date(recording.time_record).getTime();
            return recordTime >= startTimestamp && recordTime <= endTimestamp;
        });

        setFilteredRecordings(filtered);
        setCurrentPage(0); // Reset page on new filter
    };

    const totalPages = Math.ceil(filteredRecordings.length / itemsPerPage);
    const paginatedRecordings = filteredRecordings.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const downloadRecording = (audioUrl, filename) => {
        fetch(audioUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename || "audio.wav"; // Nombre del archivo
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error("Error al descargar el archivo:", error));
    };

    // Traducciones para los textos
    const textContent = {
        en: {
            title: "Recorders",
            filterByDateTime: "Filter recordings by date and time:",
            startDate: "Start Date",
            startTime: "Start Time",
            endDate: "End Date",
            endTime: "End Time",
            filterButton: "Filter",
            noRecordings: "No recordings in this interval.",
            previousPage: "Previous",
            nextPage: "Next",
            pageOf: "Page",
            download: "Download"
        },
        es: {
            title: "Grabadoras",
            filterByDateTime: "Filtrar grabaciones por fecha y hora:",
            startDate: "Fecha Inicio",
            startTime: "Hora Inicio",
            endDate: "Fecha Fin",
            endTime: "Hora Fin",
            filterButton: "Filtrar",
            noRecordings: "No hay grabaciones en este intervalo.",
            previousPage: "Anterior",
            nextPage: "Siguiente",
            pageOf: "Página",
            download: "Descargar",
        },
    };

    return (
        <div className="relative w-full h-screen">
            <Navbar toggleLanguage={toggleLanguage} language={language} />
            <div className="container mx-auto px-10 py-10">
                <br></br>
                <br></br>
                <h1 className="text-4xl font-bold">{textContent[language].title} {id}</h1>
                <p className="mt-4 text-lg">{textContent[language].filterByDateTime}</p>
                <div className="flex gap-4 mt-4 flex-wrap">
                    <div>
                        <label className="block text-sm font-semibold">{textContent[language].startDate}</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">{textContent[language].startTime}</label>
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">{textContent[language].endDate}</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">{textContent[language].endTime}</label>
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded w-full" />
                    </div>
                    <div className="self-end">
                        <button onClick={filterByDateTime} className="bg-black text-white px-4 py-2 rounded">{textContent[language].filterButton}</button>
                    </div>
                </div>
                {paginatedRecordings.length === 0 ? (
                    <p className="mt-4 text-lg text-gray-500">{textContent[language].noRecordings}</p>
                ) : (
                    <div className="mt-4 space-y-2">
                        {paginatedRecordings.map((recording) => (
                            <div key={recording.id_record} className="flex items-center gap-4 border-b pb-2">
                                <button onClick={() => togglePlay(recording.uri)} className="text-2xl">
                                    {currentAudio === recording.uri && isPlaying ? <FaPause /> : <FaPlay />}
                                </button>
                                <span className="flex-grow">{recording.filename}</span>
                                <button onClick={() => downloadRecording(recording.uri, recording.filename)} className="text-xl">
                                    <FaDownload />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        {textContent[language].previousPage}
                    </button>
                    <span className="self-center">
                        {textContent[language].pageOf} {currentPage + 1} {textContent[language].of} {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        {textContent[language].nextPage}
                    </button>
                </div>
                {currentAudio && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg w-2/3 shadow-lg">
                        <audio controls autoPlay={isPlaying} src={currentAudio} className="w-full" />
                    </div>
                )}
            </div>
        </div>
    );
}
