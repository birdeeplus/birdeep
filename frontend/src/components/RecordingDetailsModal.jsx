"use client";
import { useEffect, useState } from "react";

export default function RecordingDetailsModal({ id, onClose, language }) {
  const [recording, setRecording] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/v1/recordings/${id}`)
      .then((res) => res.json())
      .then((data) => setRecording(data))
      .catch((err) => console.error("Error fetching recording:", err));
  }, [id]);

  const text = {
    en: {
      title: "Recording Details",
      recorderId: "Recorder ID",
      timeRecord: "Time",
      fileType: "File Type",
      bitrate: "Bitrate",
      sampleRate: "Sample Rate",
      gain: "Gain",
      duration: "Duration",
      uri: "URI",
      device: "Device",
      close: "Close",
    },
    es: {
      title: "Detalles de la grabación",
      recorderId: "ID del grabador",
      timeRecord: "Hora",
      fileType: "Tipo de archivo",
      bitrate: "Tasa de bits",
      sampleRate: "Frecuencia de muestreo",
      gain: "Ganancia",
      duration: "Duración",
      uri: "URI",
      device: "Dispositivo",
      close: "Cerrar",
    },
  };

  if (!recording) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">{text[language].title}</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>{text[language].recorderId}:</strong> {recording.id_recorder_recordings}</p>
          <p><strong>{text[language].timeRecord}:</strong> {recording.time_record}</p>
          <p><strong>{text[language].fileType}:</strong> {recording.filetype_record}</p>
          <p><strong>{text[language].bitrate}:</strong> {recording.bitrate_record}</p>
          <p><strong>{text[language].sampleRate}:</strong> {recording.sample_rate_record}</p>
          <p><strong>{text[language].gain}:</strong> {recording.gain_record}</p>
          <p><strong>{text[language].duration}:</strong> {recording.duration_record}</p>
          <p><strong>{text[language].uri}:</strong> {recording.uri}</p>
          <p><strong>{text[language].device}:</strong> {recording.device}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          {text[language].close}
        </button>
      </div>
    </div>
  );
}
