"use client";
import React, { useState } from "react";

export default function AddLocationModal({ setShowForm, onAddLocation, language }) {
  const [form, setForm] = useState({
    name_location: "",
    latitude_location: "",
    longitude_location: "",
    habitat_location: "",
  });

  const text = {
    es: {
      title: "Añadir localización",
      name: "nombre",
      lat: "latitud",
      lon: "longitud",
      habitat: "hábitat",
      placeholder: "escribe aquí",
      cancel: "cancelar",
      save: "guardar",
    },
    en: {
      title: "Add location",
      name: "name",
      lat: "latitude",
      lon: "longitude",
      habitat: "habitat",
      placeholder: "write here",
      cancel: "cancel",
      save: "save",
    },
  };

  const t = text[language];

  const handleOverlayClick = (e) => {
    if (e.target.id === "addLocationOverlay") {
      setShowForm(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:8080/api/v1/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setShowForm(false);
      onAddLocation();
      setForm({
        name_location: "",
        latitude_location: "",
        longitude_location: "",
        habitat_location: "",
      });
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  return (
    <div
      id="addLocationOverlay"
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-[#F9F9F9] rounded-2xl shadow-lg w-full max-w-xl px-10 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-[#375B38] text-l mb-10 montserrat">
          {t.title}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 text-sm">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#778184]">{t.name}</label>
              <input
                type="text"
                name="name_location"
                value={form.name_location}
                onChange={handleChange}
                placeholder={t.placeholder}
                className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1 text-sm placeholder-[#77818480]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#778184]">{t.lat}</label>
              <input
                type="number"
                step="any"
                name="latitude_location"
                value={form.latitude_location}
                onChange={handleChange}
                placeholder={t.placeholder}
                className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1 text-sm placeholder-[#77818480]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#778184]">{t.lon}</label>
              <input
                type="number"
                step="any"
                name="longitude_location"
                value={form.longitude_location}
                onChange={handleChange}
                placeholder={t.placeholder}
                className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1 text-sm placeholder-[#77818480]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#778184]">{t.habitat}</label>
              <input
                type="text"
                name="habitat_location"
                value={form.habitat_location}
                onChange={handleChange}
                placeholder={t.placeholder}
                className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1 text-sm placeholder-[#77818480]"
              />
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-10">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
