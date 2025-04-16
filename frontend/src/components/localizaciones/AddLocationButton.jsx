"use client";
import React, { useState } from "react";
import AddLocationModal from "./AddLocationModal";

export default function AddLocationButton({ onAddLocation, language }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="absolute top-20 right-10 z-10 border-2 border-[#375B38] text-[#375B38] text-sm rounded-full px-4 py-0.25 flex items-center gap-3 hover:bg-[#375B38] hover:text-white transition"
      >
        {language === "en" ? "add" : "añadir"} <span className="text-xl">+</span>
      </button>

      {showForm && (
        <AddLocationModal
          setShowForm={setShowForm}
          onAddLocation={onAddLocation}
          language={language}
        />
      )}
    </>
  );
}
