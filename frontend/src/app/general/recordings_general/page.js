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
    //add
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

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
      },
      es: {
        title: "Grabaciones",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        content:
        "Contenido relacionado",
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



return (
  <div id="cliente" className="relative w-full h-screen">
    {/* Navbar */}
    <Navbar toggleLanguage={toggleLanguage} language={language} />
    
    {/* Contenido principal */}
    <div className="container mx-auto px-10 flex flex-col items-start h-full mt-24">
      <div className="w-1/2">
        <h1 className="text-4xl font-bold">{textContent[language].title}</h1>
        <p className="mt-4 text-lg max-w-md">{textContent[language].description}</p>
        <p className="mt-4 text-lg max-w-md">{textContent[language].content}</p>
      </div>

      {recordings.length === 0 ? (
                <p className="mt-4 text-lg text-gray-500">No hay grabaciones en este intervalo.</p>
            ) : (
                <div className="ml-10 mt-10 space-y-2 w-full">
                    {recordings.slice(0, 5).map((recording) => (
                        <div key={recording.id_record} className="flex items-center gap-4 border-b pb-2">
                            <button onClick={() => togglePlay(recording.uri)} className="text-2xl">
                                {currentAudio === recording.uri && isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                            <span className="flex-grow">{recording.filename}</span>
                              <a href={recording.uri} download={recording.filename} className="text-xl mr-10">
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

{/* 
      {/* Tabla de registros
      <div className="w-full mt-10">
        <table className="border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Time</th>
              <th className="border border-gray-300 px-4 py-2">URI</th>
            </tr>
          </thead>
          <tbody>

            {recordings.slice(0, 5).map((record) => (
              <tr key={record.id_record} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{record.id_record}</td>
                <td className="border border-gray-300 px-4 py-2">{record.time_record}</td>
                <td className="border border-gray-300 px-4 py-2">{record.uri}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  </div>
  );
}

export default RecordingsGeneral;
