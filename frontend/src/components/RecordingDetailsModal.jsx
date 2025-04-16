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

  const labels = {
    es: {
      title: "Metadatos grabación",
      id_record: "id de grabación",
      id_recorder_recordings: "id grabadora asociada",
      time_record: "fecha y hora de grabación",
      filetype_record: "tipo de archivo",
      bitrate_record: "tasa de bits (kbps)",
      sample_rate_record: "frecuencia de muestreo (hz)",
      gain_record: "ganancia",
      duration_record: "duración (segundos)",
      uri: "ruta de almacenamiento",
      device: "dispositivo",
      filename: "nombre del archivo"
    },
    en: {
      title: "Recording metadata",
      id_record: "recording id",
      id_recorder_recordings: "linked recorder id",
      time_record: "recording date and time",
      filetype_record: "file type",
      bitrate_record: "bitrate (kbps)",
      sample_rate_record: "sample rate (hz)",
      gain_record: "gain",
      duration_record: "duration (seconds)",
      uri: "storage path",
      device: "device",
      filename: "filename"
    }
  };

  if (!recording) return null;
  const l = labels[language];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-[39rem] px-8 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h2 className="text-center text-[#375B38] text-sm sm:text-base mb-12">
          {l.title}
        </h2>

        {/* Contenido */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-8 text-sm">
            {[
              "id_record",
              "id_recorder_recordings",
              "time_record",
              "filetype_record",
              "bitrate_record",
              "sample_rate_record",
              "gain_record",
              "duration_record",
              "uri",
              "device",
              "filename"
            ].map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">{l[key]}</label>
                <span className="text-sm text-[#778184]/50 break-all">
                  {recording[key] !== null && recording[key] !== "" ? recording[key] : "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
