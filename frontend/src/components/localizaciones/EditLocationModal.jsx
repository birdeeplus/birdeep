"use client";
import { useState } from "react";
import Image from "next/image";

export default function EditLocationModal({ location, onClose, onSave, language }) {
  const [formData, setFormData] = useState(location);

  const labels = {
    en: {
      title: "Location metadata",
      id_location: "id_location",
      name_location: "name_location",
      latitude_location: "latitude_location",
      longitude_location: "longitude_location",
      habitat_location: "habitat_location",
      save: "accept",
      cancel: "cancel",
    },
    es: {
      title: "Metadatos localización",
      id_location: "id_location",
      name_location: "nombre_localización",
      latitude_location: "latitud",
      longitude_location: "longitud",
      habitat_location: "hábitat",
      save: "aceptar",
      cancel: "cancelar",
    },
  };

  const l = labels[language] || labels["es"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_IP}:8080/api/v1/locations/${formData.id_location}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onSave(); // Recargar lista
      onClose();
    } else {
      alert(language === "es" ? "Error al actualizar localización" : "Error updating location");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-lg px-10 py-8 w-[680px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-[#375B38] font-semibold text-md mb-8">
          {l.title}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* ID - solo lectura */}
            <div className="flex flex-col gap-1 col-span-1">
              <label className="text-xs text-[#375B38]">{l.id_location}</label>
              <div className="text-sm text-gray-500 bg-[#F5F5F5] border rounded-md px-3 py-2">
                {formData.id_location}
              </div>
            </div>

            {/* Nombre */}
            <div className="flex flex-col gap-1 relative col-span-1">
              <label className="text-xs text-[#375B38]">{l.name_location}</label>
              <input
                type="text"
                name="name_location"
                value={formData.name_location || ""}
                onChange={handleChange}
                className="text-sm text-gray-700 border rounded-md px-3 py-2 pr-10"
              />
              <Image
                src="/iconos/edit.png"
                alt="edit"
                width={12}
                height={12}
                className="absolute right-4 top-8 opacity-60 pointer-events-none"
              />
            </div>

            {/* Latitud */}
            <div className="flex flex-col gap-1 relative col-span-1">
              <label className="text-xs text-[#375B38]">{l.latitude_location}</label>
              <input
                type="text"
                name="latitude_location"
                value={formData.latitude_location || ""}
                onChange={handleChange}
                className="text-sm text-gray-700 border rounded-md px-3 py-2 pr-10"
              />
              <Image
                src="/iconos/edit.png"
                alt="edit"
                width={12}
                height={12}
                className="absolute right-4 top-8 opacity-60 pointer-events-none"
              />
            </div>

            {/* Longitud */}
            <div className="flex flex-col gap-1 relative col-span-1">
              <label className="text-xs text-[#375B38]">{l.longitude_location}</label>
              <input
                type="text"
                name="longitude_location"
                value={formData.longitude_location || ""}
                onChange={handleChange}
                className="text-sm text-gray-700 border rounded-md px-3 py-2 pr-10"
              />
              <Image
                src="/iconos/edit.png"
                alt="edit"
                width={12}
                height={12}
                className="absolute right-4 top-8 opacity-60 pointer-events-none"
              />
            </div>

            {/* Hábitat */}
            <div className="flex flex-col gap-1 relative col-span-1">
              <label className="text-xs text-[#375B38]">{l.habitat_location}</label>
              <input
                type="text"
                name="habitat_location"
                value={formData.habitat_location || ""}
                onChange={handleChange}
                className="text-sm text-gray-700 border rounded-md px-3 py-2 pr-10"
              />
              <Image
                src="/iconos/edit.png"
                alt="edit"
                width={12}
                height={12}
                className="absolute right-4 top-8 opacity-60 pointer-events-none"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-6 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
            >
              {l.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
            >
              {l.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
