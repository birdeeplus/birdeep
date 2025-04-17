"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbars/Navbar_general";
import { FaTrash, FaPlus } from "react-icons/fa";
import AddRecorderForm from "../../../components/recorders/AddRecorderForm";
import EditRecorderForm from "../../../components/recorders/EditRecorderForm";
import DeleteRecorderModal from "../../../components/recorders/DeleteRecorderModal";
import RecorderInfoModal from "../../../components/recorders/RecorderDetailsModal";
import Image from "next/image";

export default function RecordersGeneral() {
  const [language, setLanguage] = useState("en");
  const [isAdmin, setIsAdmin] = useState(false);
  const [recorders, setRecorders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [processors, setProcessors] = useState([]);
  const [selectedModifyRecorder, setSelectedModifyRecorder] = useState(null);
  const [selectedDeleteRecorder, setSelectedDeleteRecorder] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInfoRecorder, setSelectedInfoRecorder] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [allRecorders, setAllRecorders] = useState([]);

  const router = useRouter();

  const textContent = {
    en: {
      title: "Recorders",
      add: "add",
    },
    es: {
      title: "Grabadoras",
      add: "añadir",
    },
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "es";
    setLanguage(savedLanguage);

    Promise.all([
      fetch("http://localhost:8080/api/v1/recorders").then((res) => res.json()),
      fetch("http://localhost:8080/api/v1/locations").then((res) => res.json()),
      fetch("http://localhost:8080/api/v1/microphones").then((res) => res.json()),
      fetch("http://localhost:8080/api/v1/processors").then((res) => res.json()),
    ])
      .then(([recordersData, locationsData, microphonesData, processorsData]) => {
        setRecorders(recordersData);
        setAllRecorders(recordersData);
        setLocations(locationsData);
        setMicrophones(microphonesData);
        setProcessors(processorsData);
      })
      .catch((error) => console.error("Error fetching data:", error));

    const userIsAdmin = localStorage.getItem("is_admin") === "true";
    setIsAdmin(userIsAdmin);
  }, []);

  const handleDeleteClick = (recorder) => {
    setSelectedDeleteRecorder(recorder);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDeleteRecorder) {
      try {
        await fetch(`http://localhost:8080/api/v1/recorders/${selectedDeleteRecorder.id_recorder}`, {
          method: "DELETE",
        });
        setRecorders(recorders.filter((r) => r.id_recorder !== selectedDeleteRecorder.id_recorder));
      } catch (error) {
        console.error("Error deleting recorder:", error);
      }
    }
    setIsDeleteModalOpen(false);
    setSelectedDeleteRecorder(null);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F8F8F8]">
      <Navbar toggleLanguage={toggleLanguage} language={language} />
      <br />
      <div className="w-full max-w-screen-xl mx-auto sm:px-6 lg:px-8 flex flex-col items-start min-h-screen pb-24 mt-20">
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-[#375B38] text-4xl font-montserrat font-bold">
              {textContent[language].title}
            </h1>

            {isAdmin && (
              <button
                onClick={() => setIsAdding(true)}
                className="border-2 border-[#375B38] text-[#375B38] px-4 py-1 rounded-full flex items-center gap-2 hover:bg-[#375B38] hover:text-white transition"
              >
                {textContent[language].add}
                <FaPlus className="text-xs" />
              </button>
            )}
          </div>

          {/* Filtro de localizaciones */}
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <div className="relative group flex flex-col items-center">
              <Image src="/iconos/info.png" alt="info" width={16} height={16} className="cursor-pointer" />
              <div className="absolute top-full mt-3 bg-white text-black text-xs rounded-lg shadow-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                {language === "es" ? "Ubicación" : "Location"}
              </div>
            </div>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white rounded px-3 py-1 w-full max-w-xs border-none focus:outline-none focus:ring-0 text-[#375B38] text-sm appearance-none"
            >
              <option value="">{language === "es" ? "localizaciones" : "locations"}</option>
              {locations.map((location) => (
                <option key={location.id_location} value={location.id_location}>
                  {location.name_location.replaceAll("_", " ")}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (selectedLocation) {
                  const filtered = allRecorders.filter(
                    (r) => r.id_location_recorder === parseInt(selectedLocation)
                  );
                  setRecorders(filtered);
                }
              }}
              className="px-4 py-1 bg-[#375B38] text-white rounded hover:bg-[#2c482d] text-sm"
            >
              {language === "es" ? "Aplicar filtro" : "Apply filter"}
            </button>

            <button
              onClick={() => {
                setSelectedLocation("");
                setRecorders(allRecorders);
              }}
              className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
            >
              {language === "es" ? "Quitar filtro" : "Clear filter"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6 w-full">
          <p className="italic text-sm text-gray-500 mb-3">
            {language === "es" ? "todas las grabadoras" : "all recorders"}
          </p>

          {recorders.map((recorder) => (
            <div
              key={recorder.id_recorder}
              className="flex justify-between items-center rounded-xl px-4 py-2 hover:bg-white transition w-full"
            >
              <button
                onClick={() => router.push(`/general/recorders_general/${recorder.id_recorder}`)}
                className="flex items-center gap-2 font-medium px-4 py-2 rounded-xl transition-all bg-white text-[#375B38] hover:bg-[#375B38] hover:text-white"
              >
                {language === "es" ? "grabadora" : "recorder"} #{recorder.recorder_name}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="flex items-center gap-6 text-[#375B38]">
                {isAdmin && (
                  <>
                    <Image
                      src="/iconos/eliminar.png"
                      alt="Eliminar"
                      width={20}
                      height={20}
                      className="cursor-pointer hover:opacity-70"
                      onClick={() => handleDeleteClick(recorder)}
                      title={language === "es" ? "Eliminar" : "Delete"}
                    />
                  </>
                )}

                <button
                  onClick={() => {
                    if (isAdmin) {
                      setSelectedModifyRecorder(recorder);
                    } else {
                      setSelectedInfoRecorder({
                        recorder,
                        location: locations.find((loc) => loc.id_location === recorder.id_location_recorder),
                        microphone: microphones.find((m) => m.id_microphone === recorder.id_microphone_recorder),
                        processor: processors.find((p) => p.id_processor === recorder.id_processor_recorder),
                      });
                    }
                  }}
                  title={language === "es" ? "Información" : "Information"}
                >
                  <Image src="/iconos/info.png" alt="info" width={16} height={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modales */}
      {isAdding && (
        <AddRecorderForm
          setIsAdding={setIsAdding}
          setRecorders={setRecorders}
          recorders={recorders}
          language={language}
        />
      )}

      {selectedModifyRecorder && (
        <EditRecorderForm
          selectedModifyRecorder={selectedModifyRecorder}
          setSelectedModifyRecorder={setSelectedModifyRecorder}
          setRecorders={setRecorders}
          recorders={recorders}
          language={language}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteRecorderModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          recorderName={selectedDeleteRecorder?.recorder_name || ""}
          language={language}
        />
      )}

      {selectedInfoRecorder && (
        <RecorderInfoModal
          recorder={selectedInfoRecorder.recorder}
          location={selectedInfoRecorder.location}
          microphone={selectedInfoRecorder.microphone}
          processor={selectedInfoRecorder.processor}
          language={language}
          onClose={() => setSelectedInfoRecorder(null)}
        />
      )}
    </div>
  );
}
