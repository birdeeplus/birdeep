"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { FaPlay, FaEdit, FaPause, FaDownload } from "react-icons/fa";
import Navbar from "../../../../components/navbars/Navbar_busqueda";
import AudioPlayer from "@/components/AudioPlayer";
import Image from "next/image";
import RecordingDetailsModal from "@/components/grabaciones/RecordingDetailsModal";
import EditRecorderForm from "../../../../components/recorders/EditRecorderForm";
import DeleteRecorderModal from "../../../../components/recorders/DeleteRecorderModal";
import RecorderInfoModal from "../../../../components/recorders/RecorderDetailsModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/timepicker-custom.css";
import "../../../styles/datepicker-custom.css"; // Ajusta la ruta según dónde pongas el CSS
import { es, enUS } from "date-fns/locale";


export default function RecorderDetails() {
    const { id } = useParams();
    const [recordings, setRecordings] = useState([]);
    const [filteredRecordings, setFilteredRecordings] = useState([]);
    const [locations, setLocations] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;
    const [language, setLanguage] = useState("en");
    const [hasMore, setHasMore] = useState(true);
    const [selectedRecordingId, setSelectedRecordingId] = useState(null);
    const [lastClicked, setLastClicked] = useState(null);
    const [loading, setLoading] = useState(true);
    const [grabadora, setGrabadora] = useState([]);
    const [recorders, setRecorders] = useState([]);
    const [selectedModifyRecorder, setSelectedModifyRecorder] = useState(null);
    const [selectedDeleteRecorder, setSelectedDeleteRecorder] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [grabadoraEliminada, setGrabadoraEliminada] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showRecorderInfo, setShowRecorderInfo] = useState(false);
    const [microphones, setMicrophones] = useState([]);
    const [processors, setProcessors] = useState([]);


    // Filter states
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [aplicarFiltros, setAplicarFiltros] = useState(false);
    const searchParams = useSearchParams();
    const filename = searchParams.get("filename") || "";

    const toggleLanguage = () => {
        const newLang = language === "en" ? "es" : "en";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
    };

    const dbHost = process.env.NEXT_PUBLIC_DB_HOST;

    useEffect(() => {
        fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_IP}:8080/api/v1/locations`)
            .then((response) => response.json())
            .then((data) => setLocations(data))
            .catch((error) => console.error("Error fetching locations:", error));

        fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_IP}:8080/api/v1/recorders`)
            .then((response) => response.json())
            .then((data) => setRecorders(data))
            .catch((error) => console.error("Error fetching recorders:", error));

        fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_IP}:8080/api/v1/microphones`)
            .then((response) => response.json())
            .then((data) => setMicrophones(data))
            .catch((error) => console.error("Error fetching microphones:", error));

        fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_IP}:8080/api/v1/processors`)
            .then((response) => response.json())
            .then((data) => setProcessors(data))
            .catch((error) => console.error("Error fetching processors:", error));

    }, []);

    //Obtener la grabadora específica
    useEffect(() => {
        if (recorders.length > 0 && id) {
            const currentRecorder = recorders.find(rec => rec.id_recorder == id);
            if (currentRecorder) {
                setGrabadora(currentRecorder);
            }
        }
    }, [recorders, id]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setErrorMessage("");
            const savedLanguage = localStorage.getItem("language") || "es";
            setLanguage(savedLanguage);

            if (!id) return;

            //Validación de filtros
            if (aplicarFiltros) {
                if (horaInicio && horaFin && horaInicio > horaFin) {
                    setErrorMessage(
                        language === "es"
                            ? "La hora de inicio no puede ser mayor que la hora de fin."
                            : "Start time cannot be later than end time."
                    );
                    setLoading(false);
                    return;
                }

                if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
                    setErrorMessage(
                        language === "es"
                            ? "La fecha de inicio no puede ser mayor que la fecha de fin."
                            : "Start date cannot be later than end date."
                    );
                    setLoading(false);
                    return;
                }
            }

            // Si pasa validaciones, construye y ejecuta el fetch
            const params = new URLSearchParams({
                page: currentPage,
                per_page: perPage,
                id_recorder_recordings: id
            });

            if (aplicarFiltros) {
                if (horaInicio) params.append("hora_inicio", horaInicio);
                if (horaFin) params.append("hora_fin", horaFin);
                if (fechaInicio) params.append("fecha_inicio", fechaInicio);
                if (fechaFin) params.append("fecha_fin", fechaFin);
                if (selectedLocation) params.append("id_location", selectedLocation);
            }

            if (filename) {
                params.append("filename", filename);
            }

            const endpoint = aplicarFiltros
                ? `http://${process.env.NEXT_PUBLIC_BACKEND_IP}:8080/api/v1/recordings_filtradas?${params.toString()}`
                : `http://${process.env.NEXT_PUBLIC_BACKEND_IP}:8080/api/v1/recordings_paginacion?${params.toString()}`;

            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                const results = aplicarFiltros ? data.results : data;
                setRecordings(results);
                setFilteredRecordings(results);
                setHasMore(results.length === perPage);
                if (results.length === 0 && currentPage > 1) {
                    setCurrentPage(1);
                }
            } catch (error) {
                console.error("Error fetching recordings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [
        currentPage,
        id,
        perPage,
        aplicarFiltros,
        horaInicio,
        horaFin,
        fechaInicio,
        fechaFin,
        selectedLocation,
        filename,
        language,
    ]);


    const togglePlay = (audioSrc) => {
        if (currentAudio === audioSrc && lastClicked === audioSrc) {
            setCurrentAudio(null);
            setIsPlaying(false);
            setLastClicked(null);
        } else {
            setCurrentAudio(audioSrc);
            setIsPlaying(true);
            setLastClicked(audioSrc);
        }
    };

    const downloadRecording = (audioUrl, filename) => {
        fetch(audioUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename || "audio.wav";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error("Error al descargar el archivo:", error));
    };

    const handleDeleteClick = (recorder) => {
        setSelectedDeleteRecorder(recorder);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedDeleteRecorder) {
            try {
                await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_IP}:8080/api/v1/recorders/${selectedDeleteRecorder.id_recorder}`, {
                    method: "DELETE",
                });

                // Eliminar la grabadora de la lista
                setRecorders(recorders.filter(r => r.id_recorder !== selectedDeleteRecorder.id_recorder));
                setGrabadoraEliminada(true); // Mostrar el mensaje de "grabadora no existe"
            } catch (error) {
                console.error("Error deleting recorder:", error);
            }
        }
        setIsDeleteModalOpen(false);
        setSelectedDeleteRecorder(null);
    };

    const isRecorderActive = () => {
        if (!grabadora.status) return false;

        const lastStatusDate = new Date(grabadora.status);
        const now = new Date();

        const diffInMs = now - lastStatusDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        return diffInDays <= 3;
    };

    const validarFiltros = () => {
        if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
            setErrorMessage(language === "es" ? "La fecha de inicio no puede ser posterior a la de fin." : "Start date cannot be after end date.");
            return false;
        }

        if (fechaFin && new Date(fechaFin) > new Date()) {
            setErrorMessage(language === "es" ? "La fecha de fin no puede ser en el futuro." : "End date cannot be in the future.");
            return false;
        }

        if (
            fechaInicio === fechaFin &&
            horaInicio &&
            horaFin &&
            horaInicio > horaFin
        ) {
            setErrorMessage(language === "es" ? "La hora de inicio no puede ser posterior a la de fin." : "Start time cannot be after end time.");
            return false;
        }

        setErrorMessage(""); // Limpiar mensaje si todo está bien
        return true;
    };


    // Traducciones para los textos
    const textContent = {
        en: {
            title: "Recorder",
            filterByDateTime: "Filter recordings by date and time:",
            startDate: "Start Date",
            startTime: "Start Time",
            endDate: "End Date",
            endTime: "End Time",
            filterButton: "apply Filters",
            clearFilters: "clear Filters",
            noRecordings: "No recordings found with the applied filters.",
            previousPage: "Previous",
            nextPage: "Next",
            pageOf: "Page",
            download: "Download",
            allRecordings: "all recordings (#)"
        },
        es: {
            title: "Grabadora",
            filterByDateTime: "Filtrar grabaciones por fecha y hora:",
            startDate: "Fecha Inicio",
            startTime: "Hora Inicio",
            endDate: "Fecha Fin",
            endTime: "Hora Fin",
            filterButton: "aplicar filtros",
            clearFilters: "reiniciar filtros",
            noRecordings: "No se encontraron grabaciones con los filtros aplicados.",
            previousPage: "Anterior",
            nextPage: "Siguiente",
            pageOf: "Página",
            download: "Descargar",
            allRecordings: "todas las grabaciones (nº)"
        },
    };


    // Generar opciones de hora en bloques de 15 minutos
    const generateTimeOptions = (startHour = 0, startMinute = 0) => {
        const options = [];
        for (let h = startHour; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                if (h === startHour && m < startMinute) continue;
                const hh = h.toString().padStart(2, "0");
                const mm = m.toString().padStart(2, "0");
                options.push(`${hh}:${mm}`);
            }
        }
        return options;
    };

    const allTimeOptions = generateTimeOptions();
    const filteredEndOptions = horaInicio
        ? generateTimeOptions(
            parseInt(horaInicio.split(":")[0]),
            parseInt(horaInicio.split(":")[1])
        )
        : allTimeOptions;


    return (
        <div id="cliente" className="relative bg-[#F8F8F8]  w-full h-screen">
            {/* Navbar */}
            <Navbar toggleLanguage={toggleLanguage} language={language} background="f8" />

            {/* Contenido principal */}
            <div className="w-full max-w-screen-xl mx-auto sm:px-6 lg:px-8 flex flex-col items-start h-full pb-36">

                {/* Titulo y Estado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full mb-8">

                    {/* Titulo, Estado, Info y Botón Eliminar */}
                    {grabadoraEliminada ? (
                        <div className="mt-24 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <p className="text-gray-500 text-lg mt-4">
                                {language === "es" ? "La grabadora ya no existe." : "This recorder no longer exists."}
                            </p>
                        </div>
                    ) : (
                        grabadora && (
                            <div className="mt-24 flex flex-col sm:flex-row sm:items-center justify-between w-full gap-6">

                                {/* Parte izquierda: Nombre + Info */}
                                <div className="flex flex-col mt-4">
                                    <div className="flex items-center gap-2">
                                        <h1 className="Montserrat text-[#375B38] text-2xl sm:text-3xl font-bold">
                                            {language === "es" ? "Grabadora" : "Recorder"} {grabadora.recorder_name}
                                        </h1>

                                        <button
                                            onClick={() => {
                                                if (localStorage.getItem("is_admin") === "true") {
                                                    setSelectedModifyRecorder(grabadora);
                                                } else {
                                                    setShowRecorderInfo(true);
                                                }
                                            }}
                                            className="hover:opacity-70 transition-opacity ml-2"
                                            title={language === "es" ? "Información" : "Information"}
                                        >
                                            <Image
                                                src="/iconos/info.png"
                                                alt="info"
                                                width={16}
                                                height={16}
                                            />
                                        </button>
                                    </div>

                                    {/* Estado activo/inactivo */}
                                    <p className="text-sm mt-1 text-[#375B38]">
                                        <span className="font-semibold">
                                            {language === "es" ? "Último estado:" : "Last status:"}{" "}
                                        </span>
                                        {grabadora.status
                                            ? new Date(grabadora.status).toLocaleString(language === "es" ? "es-ES" : "en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })
                                            : language === "es" ? "Sin datos" : "No data"}
                                    </p>
                                </div>

                                {/* Parte derecha: Botón eliminar (solo admin) */}
                                {localStorage.getItem("is_admin") === "true" && (
                                    <button
                                        onClick={() => {
                                            setSelectedDeleteRecorder(grabadora);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="px-4 py-1 border-2 border-[#375B38] text-[#375B38] rounded-full text-sm font-medium hover:bg-[#375B38] hover:text-white transition"
                                    >
                                        {language === "es" ? "eliminar" : "delete"}
                                    </button>
                                )}

                            </div>
                        )
                    )}

                </div>

                {!grabadoraEliminada && (
                    <div className="w-full max-w-screen-xl">
                        {/* Filtros */}
                        <div className="grid grid-cols-12 gap-x-20 gap-y-3 mb-6 text-sm text-[#375B38] Montserrat items-center">

                            {/* Grupo Horas */}
                            <div className="flex items-center gap-2 col-span-4">
                                {/* Icono con tooltip */}
                                <div className="relative group flex flex-col items-center w-4 h-4 shrink-0">
                                    <Image src="/iconos/info.png" alt="info" width={16} height={16} className="cursor-pointer w-4 h-4" />
                                    <div className="absolute top-full mt-3 bg-white text-black text-xs rounded-lg shadow-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        {language === "es" ? "Rango de horas" : "Hour range"}
                                    </div>
                                </div>

                                {/* Hora de inicio */}
                                <select
                                    value={horaInicio}
                                    onChange={(e) => {
                                        setHoraInicio(e.target.value);
                                        if (horaFin && horaFin <= e.target.value) {
                                            setHoraFin("");
                                        }
                                    }}
                                    className="bg-white rounded px-3 py-1 w-full max-w-[10rem] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
                                >
                                    <option value="">{language === "es" ? "Hora inicio" : "Start time"}</option>
                                    {allTimeOptions.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>

                                {/* Hora de fin */}
                                <select
                                    value={horaFin}
                                    onChange={(e) => setHoraFin(e.target.value)}
                                    className="bg-white rounded px-3 py-1 w-full max-w-[10rem] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
                                >
                                    <option value="">{language === "es" ? "Hora fin" : "End time"}</option>
                                    {filteredEndOptions.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            {/* Grupo Fechas */}
                            <div className="flex items-center gap-2 col-span-5">
                                {/* Icono con tooltip */}
                                <div className="relative group flex flex-col items-center">
                                    <Image src="/iconos/info.png" alt="info" width={16} height={16} className="cursor-pointer" />
                                    <div className="absolute top-full mt-3 bg-white text-black text-xs rounded-lg shadow-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        {language === "es" ? "Rango de fechas" : "Date range"}
                                    </div>
                                </div>

                                {/* Fecha Inicio */}
                                <DatePicker
                                    selected={fechaInicio ? new Date(fechaInicio) : null}
                                    onChange={(date) => {
                                        // porque la primera vez que se selecciona la fecha pone 1 dia menos
                                        const formattedDate = date.toLocaleDateString('sv-SE').split("T")[0];
                                        console.log("Fecha Inicio:", formattedDate);
                                        setFechaInicio(formattedDate);
                                        if (!fechaFin || fechaFin < formattedDate) {
                                            setFechaFin(formattedDate);
                                        }
                                    }}
                                    locale={language === "es" ? es : enUS}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText={language === "es" ? "Fecha inicio" : "Start date"}
                                    maxDate={new Date()}
                                    className="bg-white rounded px-3 py-1 w-full max-w-[10rem] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
                                />

                                {/* Fecha Fin */}
                                <DatePicker
                                    selected={fechaFin ? new Date(fechaFin) : null}
                                    onChange={(date) => setFechaFin(date.toISOString().split("T")[0])}
                                    locale={language === "es" ? es : enUS}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText={language === "es" ? "Fecha fin" : "End date"}
                                    minDate={fechaInicio ? new Date(fechaInicio) : null}
                                    maxDate={new Date()}
                                    className="bg-white rounded px-3 py-1 w-full max-w-[10rem] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
                                />

                            </div>
                        </div>

                        {/* Buttons for applying/clearing filters */}
                        <div className="col-span-12 flex gap-4 mt-3 mb-10">
                            <button
                                onClick={() => {
                                    if (!validarFiltros()) return;
                                    setCurrentPage(1);
                                    setAplicarFiltros(true);
                                    setSelectedLocation(grabadora.id_location_recorder);
                                }}
                                className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                            >
                                {textContent[language].filterButton}
                            </button>

                            <button
                                onClick={() => {
                                    setHoraInicio("");
                                    setHoraFin("");
                                    setFechaInicio("");
                                    setFechaFin("");
                                    setSelectedLocation(grabadora.id_location_recorder);
                                    setCurrentPage(1);
                                    setAplicarFiltros(false);
                                }}
                                className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                            >
                                {textContent[language].clearFilters}
                            </button>
                        </div>


                        {errorMessage && (
                            <div className="text-red-500 text-sm mt-2 ml-6">{errorMessage}</div>
                        )}

                        {/*
                            <p className="italic text-sm text-gray-500 mt-2 mb-4 ml-6">
                                {textContent[language].allRecordings}
                            </p>
                            */}

                        {/* List of recordings or message if none found */}
                        {filteredRecordings.length === 0 && !loading ? (
                            <div className="w-full text-center text-gray-500 italic my-6">
                                {textContent[language].noRecordings}
                            </div>
                        ) : (
                            filteredRecordings.map((recording) => (
                                <div
                                    key={recording.id_record}
                                    className="rounded-xl flex items-center justify-between mb-2 px-4 py-3 Montserrat transition duration-300 hover:bg-white w-full"
                                >
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => {
                                                const cleanUrl = recording.uri.substring(recording.uri.indexOf("/datos_audios_bd"));
                                                togglePlay(`http://${dbHost}:8081${cleanUrl}`);
                                            }}
                                            className="w-7 h-7"
                                        >
                                            <Image src="/iconos/play.png" alt="Play" width={30} height={30} />
                                        </button>

                                        <div className="cursor-pointer">
                                            <p className="text-sm font-semibold text-[#375B38]">{recording.filename}</p>
                                            <p className="text-xs text-gray-500">
                                                {language === "es" ? "grabadora" : "recorder"} #{recording.id_recorder_recordings}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pr-2">
                                        <button onClick={() => setSelectedRecordingId(recording.id_record)} className="w-5 h-5">
                                            <Image src="/iconos/info.png" alt="info" width={18} height={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const url_transformada = recording.uri.replace(
                                                    "static/datos_audios_bd/audio_data",
                                                    "proxy-audio"
                                                );
                                                downloadRecording(url_transformada, recording.filename);
                                            }}
                                            className="w-5 h-5"
                                        >
                                            <Image src="/iconos/download.png" alt="download" width={18} height={18} />
                                        </button>
                                    </div>
                                </div>

                            ))
                        )}

                        {/* Paginación dinámica */}
                        <div className="w-full flex justify-center mt-2">
                            <div className="flex items-center gap-3 text-sm Montserrat text-[#375B38] select-none">

                                {/* Botón anterior */}
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-30"
                                >
                                    <span className="text-lg">&lt;</span>
                                </button>

                                {/* Páginas dinámicas */}
                                {Array.from({ length: 4 }).map((_, i) => {
                                    const pageNum = Math.max(1, currentPage - 1) + i;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-6 h-6 flex items-center justify-center rounded-full transition ${currentPage === pageNum
                                                ? "bg-white font-semibold shadow"
                                                : "hover:underline"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {/* Botón siguiente */}
                                <button
                                    onClick={() => setCurrentPage((prev) => (hasMore ? prev + 1 : prev))}
                                    disabled={!hasMore}
                                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-30"
                                >
                                    <span className="text-lg">&gt;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {selectedRecordingId && (
                    <RecordingDetailsModal
                        id={selectedRecordingId}
                        onClose={() => setSelectedRecordingId(null)}
                        language={language}
                    />
                )}

                {currentAudio && (
                    <AudioPlayer
                        src={currentAudio}
                        filename={recordings.find((r) =>
                            currentAudio?.includes(r.filename)
                          )?.filename || "audio.wav"}
                          
                          recorderId={recordings.find((r) =>
                            currentAudio?.includes(r.filename)
                          )?.id_recorder_recordings || "—"}
                          
                        onClose={() => {
                            setCurrentAudio(null);
                            setLastClicked(null);
                        }}
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

                {showRecorderInfo && grabadora && (
                    <RecorderInfoModal
                        recorder={grabadora}
                        location={locations.find((loc) => loc.id_location === grabadora.id_location_recorder)}
                        microphone={microphones.find((mic) => mic.id_microphone === grabadora.id_microphone_recorder)}
                        processor={processors.find((proc) => proc.id_processor === grabadora.id_processor_recorder)}
                        onClose={() => setShowRecorderInfo(false)}
                        language={language}
                    />
                )}

            </div>
        </div>
    );
}