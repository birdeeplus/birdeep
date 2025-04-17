"use client";
import React from "react";

export default function DeleteRecorderModal({ isOpen, onClose, onConfirm, recorderName, language = "es" }) {
  if (!isOpen) return null;

  const text = {
    es: {
      confirm: "¿Estás seguro de que quieres eliminar la grabadora",
      cancel: "cancelar",
      accept: "aceptar",
    },
    en: {
      confirm: "Are you sure you want to delete recorder",
      cancel: "cancel",
      accept: "accept",
    },
  };

  const t = text[language];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-[#F9F9F9] rounded-2xl shadow-lg px-4 py-6 w-full max-w-md relative text-center">
        
        {/* Cierre */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-[#778184] text-2xl hover:opacity-70"
        >
          ×
        </button>

        {/* Texto de confirmación */}
        <p className="text-[#212121] text-sm montserrat mt-10 mb-8 Montserrat">
          {t.confirm} #{recorderName}?
        </p>

        {/* Botones */}
        <div className="flex justify-center gap-6">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
          >
            {t.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
