// src/app/general/recordings_general/page.js

'use client';

//Imports de librerias
import { useState, useEffect } from "react";
import { Card, Form, Button, Table, Row, Col, Modal } from 'react-bootstrap';
import moment from "moment";
//import SpectrogramPlayer from "react-audio-spectrogram-player";
import { decode } from "wav-decoder";
import { useDropzone } from "react-dropzone";



//Imports de componentes
import Navbar from "../../../components/navbars/Navbar_busqueda";


//add
import { FaPlay, FaPause, FaDownload } from "react-icons/fa";


function RecordingsGeneral() {

    const [language, setLanguage] = useState("en");
    const [recordings, setRecordings] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    //add
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;


    const toggleLanguage = () => {
      setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };
    
    useEffect(() => {
      fetch("http://localhost:8080/api/v1/recordings")
          .then((response) => response.json())
          .then((data) => setRecordings(data))
          .catch((error) => console.error("Error fetching recordings:", error));
    }, []);

    //idioma y traduccion
    const textContent = {
      en: {
        title: "Recordings",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        content:
          "Related content",
        error:
          "Error loading recordings.",
      },
      es: {
        title: "Grabaciones",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        content:
          "Contenido relacionado",
        error: 
          "Error al cargar las grabaciones.",
      },
    };

//add
const togglePlay = (audioSrc) => {
  if (currentAudio === audioSrc) {
      setIsPlaying(!isPlaying);
      setCurrentAudio(null);
  } else {
      setCurrentAudio(audioSrc);
      setIsPlaying(true);
  }
};

const totalPages = Math.ceil(recordings.length / itemsPerPage);
const paginatedRecordings = recordings.slice(
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

return (
  <div id="cliente" className="relative w-full h-screen">
    {/* Navbar */}
    <Navbar toggleLanguage={toggleLanguage} language={language} />
    
    {/* Contenido principal */}
    <div className="container mx-auto px-10 flex flex-col items-start h-full mt-24">
      <div className="w-1/2">
        <h1 className="text-4xl font-bold">{textContent[language].title}</h1>
        {/* <p className="mt-4 text-lg max-w-md">{textContent[language].description}</p> */}
        <p className="mt-20 text-lg max-w-md font-bold">{textContent[language].content}</p>
      </div>

      {recordings.length === 0 ? (
                <p className="mt-4 text-lg text-gray-500">{textContent[language].error}</p>
            ) : (
                <div className="ml-10 mt-10 space-y-2 w-full">
                    {recordings.slice(0, 5).map((recording) => (
                        <div key={recording.id_record} className="flex items-center gap-4 border-b pb-4 pt-3">
                            <button onClick={() => togglePlay(recording.uri)} className="text-2xl">
                                {currentAudio === recording.uri && isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                            <span className="flex-grow">{recording.filename}</span>
                                <button onClick={() => downloadRecording(recording.uri, recording.filename)} className="text-xl mr-10">
                                    <FaDownload />
                                </button>
                        </div>  
                    ))}
                </div>
            )}

            <div className="mt-10 flex items-center justify-center gap-4 w-full">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="self-center">Página {currentPage + 1} de {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Siguiente
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

export default RecordingsGeneral;
