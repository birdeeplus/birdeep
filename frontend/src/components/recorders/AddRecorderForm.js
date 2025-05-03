"use client";
import React, { useState, useEffect } from "react";

export default function AddRecorderForm({ setIsAdding, setRecorders, recorders, language }) {
  const [locations, setLocations] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [processors, setProcessors] = useState([]);
  const lastRecorder = recorders[recorders.length - 1];
  const nextId = lastRecorder.id_recorder + 1;

  const [formData, setFormData] = useState({
    id_recorder: nextId,
    recorder_name: "",
    id_location_recorder: "",
    id_microphone_recorder: "",
    id_processor_recorder: "",
    installation_date: "",
    status: "",
    version: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    installationDate: "",
    statusDate: ""
  });

  const textContent = {
    en: {
      save: "save",
      cancel: "cancel",
      title: "Add recorder",
      name: "name",
      location: "location",
      microphone: "microphone",
      processor: "processor",
      installDate: "installation date",
      status: "status",
      version: "recorder version",
      placeholder: "write here",
      select: "select",
      nameExists: "Recorder name already exists",
      futureDate: "Date cannot be in the future"
    },
    es: {
      save: "guardar",
      cancel: "cancelar",
      title: "Añadir grabadora",
      name: "nombre",
      location: "localización",
      microphone: "micrófono",
      processor: "procesador",
      installDate: "fecha de instalación",
      status: "estado",
      version: "versión de la grabadora",
      placeholder: "escribe aquí",
      select: "seleccionar",
      nameExists: "El nombre de la grabadora ya existe",
      futureDate: "La fecha no puede ser en el futuro"
    }
  };

  const t = textContent[language];

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/v1/locations").then(res => res.json()),
      fetch("http://localhost:8080/api/v1/microphones").then(res => res.json()),
      fetch("http://localhost:8080/api/v1/processors").then(res => res.json())
    ])
      .then(([loc, mic, proc]) => {
        setLocations(loc);
        setMicrophones(mic.filter(m => m.id_recorder === null));
        setProcessors(proc.filter(p => p.id_recorder === null));
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "recorder_name" && !/^\d*$/.test(e.target.value)) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Validación de nombre de grabadora
    if (recorders.some((recorder) => recorder.recorder_name === formData.recorder_name)) {
      formErrors.name = t.nameExists;
    }

    // Validación de fechas
    if (formData.installation_date > today) {
      formErrors.installationDate = t.futureDate;
    }

    if (formData.status && formData.status > today) {
      formErrors.statusDate = t.futureDate;
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const dataToSend = {
      ...formData,
      version: formData.version || null,
      status: formData.status || null,
      id_microphone_recorder: formData.id_microphone_recorder || null,
      id_processor_recorder: formData.id_processor_recorder || null
    };

    const response = await fetch("http://localhost:8080/api/v1/recorders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend)
    });

    if (response.ok) {
      const result = await response.json();
      setRecorders([...recorders, result.recorder]);
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-2">
      <div className="bg-[#F9F9F9] rounded-2xl shadow-lg w-full max-w-3xl px-8 py-8">
        <h2 className="text-center text-[#375B38] text-l mb-10 Montserrat">
          {t.title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-sm">
            {/* Columna izquierda */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">{t.name}</label>
                <input
                  type="text"
                  name="recorder_name"
                  value={formData.recorder_name}
                  onChange={handleChange}
                  placeholder={t.placeholder}
                  className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1 placeholder-[#77818480]"
                  required
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">{t.microphone}</label>
                <select
                  name="id_microphone_recorder"
                  value={formData.id_microphone_recorder}
                  onChange={handleChange}
                  className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1"
                >
                  <option value="">{t.select}</option>
                  {microphones.map((m) => (
                    <option key={m.id_microphone} value={m.id_microphone}>{m.id_microphone}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">{t.installDate}</label>
                <input
                  type="date"
                  name="installation_date"
                  value={formData.installation_date}
                  onChange={handleChange}
                  className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1"
                  required
                />
                {errors.installationDate && <p className="text-red-500 text-xs">{errors.installationDate}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">{t.version}</label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  placeholder={t.placeholder}
                  className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1 placeholder-[#77818480]"
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">{t.location}</label>
                <select
                  name="id_location_recorder"
                  value={formData.id_location_recorder}
                  onChange={handleChange}
                  className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1"
                  required
                >
                  <option value="">{t.select}</option>
                  {locations.map((l) => (
                    <option key={l.id_location} value={l.id_location}>
                    {l.name_location.replaceAll("_", " ")}
                  </option>
                    
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">{t.processor}</label>
                <select
                  name="id_processor_recorder"
                  value={formData.id_processor_recorder}
                  onChange={handleChange}
                  className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1"
                >
                  <option value="">{t.select}</option>
                  {processors.map((p) => (
                    <option key={p.id_processor} value={p.id_processor}>{p.id_processor}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">{t.status}</label>
                <input
                  type="date"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="bg-white text-[#778184]/50 h-8 rounded-md px-2 py-1"
                />
                {errors.statusDate && <p className="text-red-500 text-xs">{errors.statusDate}</p>}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-6 mt-10">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
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
