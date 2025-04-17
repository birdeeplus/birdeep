"use client";
import React from "react";

const AddMicrophonePopup = ({
  showForm,
  setShowForm,
  language,
  recorders,
  handleChange,
  formData,
  handleSubmit
}) => {
  if (!showForm) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === "addMicrophoneOverlay") {
      setShowForm(false);
    }
  };

  const handleRecorderChange = (e) => {
    const value = e.target.value === "" ? null : e.target.value;
    handleChange({ target: { name: "id_recorder", value } });
  };

  const uniqueRecorders = [
    ...new Map(recorders.map((item) => [item.id_recorder, item])).values()
  ];

  return (
    <div
      id="addMicrophoneOverlay"
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-[#F9F9F9] rounded-2xl shadow-lg w-full max-w-2xl px-10 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h2 className="text-center text-[#375B38] text-l mb-10 montserrat">
          {language === "en" ? "Add microphone" : "Añadir micrófono"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-32 text-sm">
            {/* Columna izquierda */}
            <div className="flex flex-col gap-12">
              {/* Modelo */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">
                  {language === "en" ? "model" : "modelo"}
                </label>
                <select
                  name="model_microphone"
                  value={formData.model_microphone}
                  onChange={handleChange}
                  className="bg-white text-[#778184]/50 w-[17rem] h-8 rounded-md px-2 py-1 text-sm appearance-none border-none"
                >
                  <option value="AudioMoth">AudioMoth</option>
                  <option value="Other">{language === "en" ? "other" : "otro"}</option>
                </select>
              </div>

              {/* ID grabadora */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">
                  {language === "en" ? "recorder ID" : "ID grabadora"}
                </label>
                <select
                  name="id_recorder"
                  value={formData.id_recorder === null ? "" : formData.id_recorder}
                  onChange={handleRecorderChange}
                  className="bg-white text-[#778184]/50 w-[17rem] h-8 rounded-md px-2 py-1 text-sm appearance-none border-none"
                >
                  <option value="">{language === "en" ? "not assigned" : "no asignado"}</option>
                  {uniqueRecorders.map((recorder) => (
                    <option key={recorder.id_recorder} value={String(recorder.id_recorder)}>
                      {recorder.id_recorder}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="flex flex-col gap-6">
              {/* Comentario */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#778184]">
                  {language === "en" ? "comment" : "comentario"}
                </label>
                <input
                  type="text"
                  name="comment_microphone"
                  value={formData.comment_microphone}
                  onChange={handleChange}
                  placeholder={language === "en" ? "write here" : "escribe aquí"}
                  className="bg-white text-[#778184]/50 w-[17rem] h-8 rounded-md px-2 py-1 text-sm placeholder-[#77818480]"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-6 mt-10">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
            >
              {language === "en" ? "cancel" : "cancelar"}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
            >
              {language === "en" ? "save" : "guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMicrophonePopup;
