"use client";
import React from "react";

export default function RecorderDetailsModal({ recorder, location, microphone, processor, onClose, language }) {
  const textContent = {
    en: {
      title: "Recorder Information",
      name: "Name",
      location: "Location",
      microphone: "Microphone Model",
      processor: "Processor Model",
      date: "Installation Date",
      version: "Version",
      close: "Close"
    },
    es: {
      title: "Información de la grabadora",
      name: "Nombre",
      location: "Localización",
      microphone: "Modelo del micrófono",
      processor: "Modelo del procesador",
      date: "Fecha de instalación",
      version: "Versión",
      close: "Cerrar"
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">{textContent[language].title}</h2>
        <ul className="space-y-2 text-sm text-[#375B38]">
          <li><strong>{textContent[language].name}:</strong> {recorder.recorder_name}</li>
          <li><strong>{textContent[language].location}:</strong> {location?.name_location}</li>
          <li><strong>{textContent[language].microphone}:</strong> {microphone?.model_microphone}</li>
          <li><strong>{textContent[language].processor}:</strong> {processor?.model_processor}</li>
          <li><strong>{textContent[language].date}:</strong> {recorder.installation_date}</li>
          <li><strong>{textContent[language].version}:</strong> {recorder.version || "—"}</li>
        </ul>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-[#375B38] text-white px-4 py-1 rounded">
            {textContent[language].close}
          </button>
        </div>
      </div>
    </div>
  );
}
