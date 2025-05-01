"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LocationInfoModal({ location, onClose, language }) {
  const router = useRouter();
  const [recorders, setRecorders] = useState([]);

  useEffect(() => {
    if (!location?.id_location) return;

    fetch(`http://localhost:8080/api/v1/locations/${location.id_location}/recorders`)
      .then((res) => res.json())
      .then((data) => {
        setRecorders(data.message ? [] : data);
      })
      .catch((err) => {
        console.error("Error fetching recorders:", err);
        setRecorders([]);
      });
  }, [location]);

  if (!location) return null;

  const labels = {
    en: {
      title: "Location Details",
      name: "Name",
      latitude: "Latitude",
      longitude: "Longitude",
      habitat: "Habitat",
      recorders: "Recorders",
    },
    es: {
      title: "Detalles de la localización",
      name: "Nombre",
      latitude: "Latitud",
      longitude: "Longitud",
      habitat: "Hábitat",
      recorders: "Grabadoras",
    },
  };

  const l = labels[language] || labels["es"];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#F9F9F9] rounded-2xl shadow-lg w-full max-w-lg pl-12 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nombre y hábitat con estilo destacado */}
        <div className="mb-8">
          <p className="text-[#375B38] font-bold text-2xl">
            {location.name_location}
          </p>
          <p className="italic text-base text-[#778184]/50">
            {location.habitat_location || "-"}
          </p>
        </div>

        {/* Coordenadas */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-6 text-sm text-[#778184] mt-10 mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{l.latitude}</span>
            <span className="text-[#778184]/50 text-sm">
              {location.latitude_location || "-"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{l.longitude}</span>
            <span className="text-[#778184]/50 text-sm">
              {location.longitude_location || "-"}
            </span>
          </div>
        </div>

        {/* Grabadoras asociadas */}
        {recorders.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[#778184]">{l.recorders}</span>
            <div className="flex flex-wrap gap-2">
              {recorders.map((recorder) => (
                <button
                  key={recorder.id_recorder}
                  onClick={() =>
                    router.push(`/general/recorders_general/${recorder.id_recorder}`)
                  }
                  className="px-4 py-1 rounded-full border-2 text-sm font-medium border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
                >
                  {language === "es" ? "Grabadora" : "Recorder"} #{recorder.recorder_name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
