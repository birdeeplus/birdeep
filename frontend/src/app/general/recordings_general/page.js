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

function RecordingsGeneral() {

    const [language, setLanguage] = useState("en");
    const [recordings, setRecordings] = useState([]);

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

      {/* Tabla de registros */}
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
      </div>
    </div>
  </div>
  );
}

export default RecordingsGeneral;
