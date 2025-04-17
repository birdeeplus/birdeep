"use client";
import React from "react";

export default function RecorderDetailsModal({ recorder, location, microphone, processor, onClose, language }) {
  const labels = {
    en: {
      title: "Recorder metadata",
      id_recorder: "ID Recorder",
      recorder_name: "Recorder Name",
      id_location_recorder: "Location",
      id_microphone_recorder: "Microphone",
      id_processor_recorder: "Processor",
      installation_date: "Installation Date",
      status: "Status",
      version: "Version"
    },
    es: {
      title: "Metadatos grabadora",
      id_recorder: "ID grabadora",
      recorder_name: "Nombre grabadora",
      id_location_recorder: "Localización",
      id_microphone_recorder: "Micrófono",
      id_processor_recorder: "Procesador",
      installation_date: "Fecha instalación",
      status: "Estado",
      version: "Versión"
    }
  };

  const l = labels[language];

  if (!recorder) return null;

  const fields = {
    id_recorder: recorder.id_recorder,
    recorder_name: recorder.recorder_name,
    id_location_recorder: location?.name_location,
    id_microphone_recorder: microphone?.model_microphone,
    id_processor_recorder: processor?.model_processor,
    installation_date: recorder.installation_date ? new Date(recorder.installation_date).toISOString().split("T")[0] : null,
    status: recorder.status ? new Date(recorder.status).toISOString().split("T")[0] : null,
    version: recorder.version
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#F9F9F9] rounded-2xl shadow-lg w-full max-w-[34rem] px-4 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h2 className="text-center text-[#375B38] text-sm sm:text-base mb-12 Montserrat">
          {l.title}
        </h2>

        {/* Contenido */}
        <div className="flex justify-items-start ml-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-32 gap-y-10 text-sm">
            {Object.keys(fields).map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">{l[key]}</label>
                <span className="text-sm text-[#778184]/50 break-all">
                  {fields[key] !== null && fields[key] !== "" ? fields[key] : "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
