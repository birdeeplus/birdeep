"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaPlay, FaPause, FaDownload } from "react-icons/fa";
import Navbar from "../../../../components/navbars/Navbar_general";

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

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:8080/api/v1/recordings?id_recorder_recordings=${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setRecordings(data);
                    setFilteredRecordings(data); // Inicialmente, todas las grabaciones
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
    };

    return (
        <div className="relative w-full h-screen">
            <Navbar />
            <div className="container mx-auto px-10 py-10">
                <h1 className="text-4xl font-bold">Grabadoras {id}</h1>
                <p className="mt-4 text-lg">Filtrar grabaciones por fecha y hora:</p>

                {/* Inputs de fecha y hora */}
                <div className="flex gap-4 mt-4 flex-wrap">
                    <div>
                        <label className="block text-sm font-semibold">Fecha Inicio</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Hora Inicio</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Fecha Fin</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Hora Fin</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div className="self-end">
                        <button
                            onClick={filterByDateTime}
                            className="bg-black text-white px-4 py-2 rounded"
                        >
                            Filtrar
                        </button>
                    </div>
                </div>

                {filteredRecordings.length === 0 ? (
                    <p className="mt-4 text-lg text-gray-500">No hay grabaciones en este intervalo.</p>
                ) : (
                    <div className="mt-4 space-y-2">
                        {filteredRecordings.map((recording) => (
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

                {currentAudio && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg w-2/3 shadow-lg">
                        <audio controls autoPlay={isPlaying} src={currentAudio} className="w-full" />
                    </div>
                )}
            </div>
        </div>
    );
}
