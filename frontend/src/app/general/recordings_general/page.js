'use client';

// Imports de librerías
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AudioPlayer from "../../../components/AudioPlayer";


// Imports de componentes
import Navbar from "../../../components/navbars/Navbar_general";

function RecordingsGeneral() {
  const [language, setLanguage] = useState("en");
  const [recordings, setRecordings] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 5; // Número de grabaciones por página
  const router = useRouter(); // hook de router

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:8080/api/v1/recordings_paginacion?page=${currentPage}&per_page=${perPage}`)
      .then((response) => response.json())
      .then((data) => {
        setRecordings(data);
        setLoading(false);
        setHasMore(data.length === perPage); // Si devuelve menos de perPage, no hay más páginas
      })
      .catch((error) => {
        console.error("Error fetching recordings:", error);
        setLoading(false);
      });
  }, [currentPage]); // Ejecutar cada vez que currentPage cambie

  // Traducción de textos
  const textContent = {
    en: {
      title: "Recordings",
      content: "Related content",
      error: "Error loading recordings.",
    },
    es: {
      title: "Grabaciones",
      content: "Contenido relacionado",
      error: "Error al cargar las grabaciones.",
    },
  };

  // Función para controlar la reproducción de audio
  const togglePlay = (audioSrc) => {
    if (currentAudio === audioSrc) {
      setIsPlaying(!isPlaying);
      setCurrentAudio(null);
    } else {
      setCurrentAudio(audioSrc);
      setIsPlaying(true);
    }
  };

  // Función para descargar la grabación
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
      })
      .catch((error) => console.error("Error al descargar el archivo:", error));
  };

  // Función para redirigir a la página de detalles
  const goToRecordingDetails = (id) => {
    router.push(`/general/recordings_general/${id}`);
  };

  return (
    <div id="cliente" className="relative bg-[#F8F8F8]  w-full h-screen ">
      {/* Navbar */}
      <Navbar toggleLanguage={toggleLanguage} language={language} background="f8" />

      {/* Contenido principal */}
      <div className="container mx-auto px-2 flex flex-col items-start h-full">

        {/* Titulo */}
        <h1 className="Montserrat text-[#375B38] text-2xl mt-24 sm:text-3xl font-bold mb-8">
          {textContent[language].title}
        </h1>

        {/* Filtros */}
        <div className="grid grid-cols-12 gap-x-[2px] gap-y-3 mb-5 text-sm text-[#375B38] Montserrat items-center">

          {/* Grupo Horas (col-span-4 de 12) */}
          <div className="flex items-center gap-[6px] col-span-4">
            <div className="flex items-center gap-[6px]">
              <Image src="/iconos/info.png" alt="info" width={16} height={16} />
              <input
                type="time"
                defaultValue="00:00"
                className="bg-white rounded-md px-2 py-[5px] w-[95px] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none text-center"
              />
            </div>
            <input
              type="time"
              defaultValue="00:00"
              className="bg-white rounded-md px-2 py-[5px] w-[95px] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none text-center"
            />
          </div>

          {/* Grupo Fechas (col-span-5) */}
          <div className="flex items-center gap-[6px] col-span-5">
            <Image src="/iconos/info.png" alt="info" width={16} height={16} />
            <input
              type="date"
              className="bg-white rounded-md px-2 py-[5px] w-[150px] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
            />
            <input
              type="date"
              className="bg-white rounded-md px-2 py-[5px] w-[150px] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
            />
          </div>

          {/* Localización (col-span-3) */}
          <div className="flex items-center gap-[6px] col-span-3">
            <Image src="/iconos/info.png" alt="info" width={16} height={16} />
            <select
              className="bg-white rounded-md px-3 py-[6px] w-[300px] border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
            >
              <option>localizaciones</option>
            </select>
          </div>
        </div>



        <p className="italic text-sm text-gray-500 mt-2 mb-4 ml-6">
          {language === "es" ? "todas las grabaciones (nº)" : "all recordings (#)"}
        </p>


        {recordings.map((recording) => (
          <div
            key={recording.id_record}
            className="rounded-xl flex items-center justify-between mb-1 px-6 py-4 Montserrat transition duration-300 hover:bg-white w-[100%]"
          >
            {/* Parte izquierda: play + info */}
            <div className="flex items-center gap-5">
              {/* Icono de play */}
              <button onClick={() => togglePlay(recording.uri)} className="w-[20px] h-[20px]">
                <Image
                  src="/iconos/play.png"
                  alt="Play"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </button>

              {/* Nombre del archivo */}
              <div onClick={() => goToRecordingDetails(recording.id_record)} className="cursor-pointer">
                <p className="text-sm font-semibold text-[#375B38]">{recording.filename}</p>
                <p className="text-xs text-gray-500">grabadora</p>
              </div>
            </div>

            {/* Parte derecha: icono info y descarga */}
            <div className="flex items-center gap-4 pr-4">
              <Image src="/iconos/info.png" alt="info" width={16} height={16} />
              <button onClick={() => downloadRecording(recording.uri, recording.filename)} className="w-[18px] h-[18px]">
                <Image
                  src="/iconos/download.png"
                  alt="download"
                  width={18}
                  height={18}
                  className="object-contain"
                />
              </button>
            </div>
          </div>
        ))}


        {/* Paginación numerada */}
        <div className="w-full flex justify-center mt-2">
          <div className="flex items-center gap-6 text-sm Montserrat text-[#375B38]">

            {/* Números de página */}
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(currentPage + (hasMore ? 1 : 0)) }, (_, i) => i + 1).map((pageNum) => (
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
              ))}
            </div>

            {/* Botón siguiente */}
            <button
              onClick={() => setCurrentPage((prev) => (hasMore ? prev + 1 : prev))}
              disabled={!hasMore}
              className="px-4 py-[4px] border border-[#375B38] rounded-full hover:bg-[#F2F2F2] disabled:opacity-30"
            >
              {language === "es" ? "siguiente" : "next"}
            </button>
          </div>
        </div>


        <AudioPlayer
          src={currentAudio}
          filename={recordings.find((r) => r.uri === currentAudio)?.filename || "audio.wav"}
          onClose={() => setCurrentAudio(null)}
        />

      </div>
    </div>
  );
}

export default RecordingsGeneral;
