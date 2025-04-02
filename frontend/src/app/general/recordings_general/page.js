'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AudioPlayer from "../../../components/AudioPlayer";
import RecordingDetailsModal from "../../../components/RecordingDetailsModal";
import Navbar from "../../../components/navbars/Navbar_general";

function RecordingsGeneral() {
  const [language, setLanguage] = useState("en");
  const [recordings, setRecordings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastClicked, setLastClicked] = useState(null);
  const [selectedRecordingId, setSelectedRecordingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const perPage = 5;
  const router = useRouter();

  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [aplicarFiltros, setAplicarFiltros] = useState(false);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage,
      per_page: perPage,
    });

    if (aplicarFiltros) {
      if (horaInicio) params.append("hora_inicio", horaInicio);
      if (horaFin) params.append("hora_fin", horaFin);
      if (fechaInicio) params.append("fecha_inicio", fechaInicio);
      if (fechaFin) params.append("fecha_fin", fechaFin);
      if (selectedLocation) params.append("id_location", selectedLocation);
    }

    const endpoint = aplicarFiltros
      ? `http://localhost:8080/api/v1/recordings_filtradas?${params.toString()}`
      : `http://localhost:8080/api/v1/recordings_paginacion?${params.toString()}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const results = aplicarFiltros ? data.results : data;
        setRecordings(results);
        setHasMore(results.length === perPage);
        if (results.length === 0 && currentPage > 1) {
          setCurrentPage(1);
        }
      })
      .finally(() => setLoading(false));
  }, [
    currentPage,
    aplicarFiltros,
    horaInicio,
    horaFin,
    fechaInicio,
    fechaFin,
    selectedLocation,
  ]);


  useEffect(() => {
    fetch("http://localhost:8080/api/v1/locations")
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

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
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || "audio.wav";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  };

  const textContent = {
    en: { title: "Recordings" },
    es: { title: "Grabaciones" },
  };

  return (
    <div id="cliente" className="relative bg-[#F8F8F8]  w-full h-screen">
      {/* Navbar */}
      <Navbar toggleLanguage={toggleLanguage} language={language} background="f8" />

      {/* Contenido principal */}
      <div className="w-full max-w-screen-xl mx-auto sm:px-6 lg:px-8 flex flex-col items-start h-full pb-36">

        {/* Titulo */}
        <h1 className="Montserrat text-[#375B38] text-2xl mt-28 sm:text-3xl font-bold mb-8">
          {textContent[language].title}
        </h1>

        {/* Filtros */}
        <div className="grid grid-cols-12 gap-x-20 gap-y-3 mb-5 text-sm text-[#375B38] Montserrat items-center">
          {/* Grupo Horas */}
          <div className="flex items-center gap-2 col-span-4">
            {/* Icono con tooltip */}
            <div className="relative group flex flex-col items-center">
              <Image src="/iconos/info.png" alt="info" width={16} height={16} className="cursor-pointer" />
              <div className="absolute top-full mt-3 bg-white text-black text-xs rounded-lg shadow-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap montserrat">
                Rango de horas
              </div>
            </div>

            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="bg-white rounded px-3 py-1 min-w-[6rem] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none text-center"
            />
            <input
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className="bg-white rounded px-3 py-1 min-w-[6rem] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none text-center"
            />
          </div>


          {/* Grupo Fechas */}
          <div className="flex items-center gap-2 col-span-5">
            {/* Icono con tooltip */}
            <div className="relative group flex flex-col items-center">
              <Image src="/iconos/info.png" alt="info" width={16} height={16} className="cursor-pointer" />
              <div className="absolute top-full mt-3 bg-white text-black text-xs rounded-lg shadow-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                Rango de fechas
              </div>
            </div>

            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="bg-white rounded px-3 py-1 w-full max-w-[10rem] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="bg-white rounded px-3 py-1 w-full max-w-[10rem] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
            />
          </div>


          {/* Localización */}
          <div className="flex items-center gap-2 col-span-3">
            {/* Icono con tooltip */}
            <div className="relative group flex flex-col items-center">
              <Image src="/iconos/info.png" alt="info" width={16} height={16} className="cursor-pointer" />
              <div className="absolute top-full mt-3 bg-white text-black text-xs rounded-lg shadow-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                Ubicación
              </div>
            </div>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white rounded px-3 py-1 w-full border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
            >
              <option value="">Selecciona una localización</option>
              {locations.map((location) => (
                <option key={location.id_location} value={location.id_location}>
                  {location.name_location}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div className="col-span-12 flex gap-4 mt-3">
          <button
            onClick={() => {
              setCurrentPage(1);
              setAplicarFiltros(true);
            }}
            className="px-4 py-1 bg-[#375B38] text-white rounded hover:bg-[#2c482d]"
          >
            Aplicar filtros
          </button>

          <button
            onClick={() => {
              setHoraInicio("");
              setHoraFin("");
              setFechaInicio("");
              setFechaFin("");
              setSelectedLocation("");
              setCurrentPage(1);
              setAplicarFiltros(false);
            }}
            className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Borrar filtros
          </button>
        </div>


        <p className="italic text-sm text-gray-500 mt-2 mb-4 ml-6">
          {language === "es" ? "todas las grabaciones (nº)" : "all recordings (#)"}
        </p>


        {/* Lista de grabaciones o mensaje si no hay */}
        {recordings.length === 0 && !loading ? (
          <div className="w-full text-center text-gray-500 italic my-6">
            {language === "es"
              ? "No se encontraron grabaciones con los filtros aplicados."
              : "No recordings found with the applied filters."}
          </div>
        ) : (
          recordings.map((recording) => (
            <div
              key={recording.id_record}
              className="rounded-xl flex items-center justify-between mb-1 px-4 py-3 Montserrat transition duration-300 hover:bg-white w-full"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => togglePlay(recording.uri)} className="w-7 h-7">
                  <Image src="/iconos/play.png" alt="Play" width={30} height={30} />
                </button>

                <div className="cursor-pointer">
                  <p className="text-sm font-semibold text-[#375B38]">{recording.filename}</p>
                  <p className="text-xs text-gray-500">grabadora #{recording.id_recorder_recordings}</p>
                </div>

              </div>

              <div className="flex items-center gap-3 pr-2">
                <button onClick={() => setSelectedRecordingId(recording.id_record)} className="w-5 h-5">
                  <Image src="/iconos/info.png" alt="info" width={18} height={18} />
                </button>
                <button onClick={() => downloadRecording(recording.uri, recording.filename)} className="w-5 h-5">
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
            filename={recordings.find((r) => r.uri === currentAudio)?.filename || "audio.wav"}
            recorderId={recordings.find((r) => r.uri === currentAudio)?.id_recorder_recordings || "—"}
            onClose={() => {
              setCurrentAudio(null);
              setLastClicked(null);
            }}
          />
        )}

      </div>
    </div>
  );
}

export default RecordingsGeneral;
