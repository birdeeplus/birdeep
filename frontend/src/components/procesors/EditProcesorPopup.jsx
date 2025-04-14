// components/procesors/EditProcessorPopup.jsx

"use client";
import Image from "next/image";

export default function EditProcessorPopup({
  showEditForm,
  editFormData,
  setEditFormData,
  setShowEditForm,
  handleUpdate,
  recorders,
  language,
}) {
  if (!showEditForm || !editFormData) return null;

  const labels = {
    id_processor: "id_processor",
    model_processor: "model_processor",
    comment_processor: "comment_processor",
    id_recorder: "id_recorder",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg px-10 py-8 w-[680px]">
        <h2 className="text-center text-[#375B38] font-semibold text-md mb-8">
          {language === "es" ? "Metadatos procesador" : "Processor metadata"}
        </h2>

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#375B38]">{labels.id_processor}</label>
              <input
                type="text"
                value={editFormData.id_processor}
                readOnly
                className="text-sm text-gray-500 bg-[#F5F5F5] border rounded-md px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#375B38]">{labels.model_processor}</label>
              <select
                name="model_processor"
                value={editFormData.model_processor}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, model_processor: e.target.value })
                }
                className="text-sm text-gray-700 border rounded-md px-3 py-2"
              >
                <option value="Orange Pi 3">Orange Pi 3</option>
                <option value="Other">{language === "en" ? "Other" : "Otro"}</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#375B38]">{labels.comment_processor}</label>
              <input
                type="text"
                name="comment_processor"
                value={editFormData.comment_processor || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, comment_processor: e.target.value })
                }
                className="text-sm text-gray-700 border rounded-md px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#375B38]">{labels.id_recorder}</label>
              <select
                name="id_recorder"
                value={editFormData.id_recorder !== null ? String(editFormData.id_recorder) : ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    id_recorder: e.target.value !== "" ? Number(e.target.value) : null,
                  })
                }
                className="text-sm text-gray-700 border rounded-md px-3 py-2"
              >
                {recorders.map((rec) => (
                  <option key={rec.id_recorder} value={rec.id_recorder}>
                    {rec.id_recorder}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <button
              type="button"
              onClick={() => setShowEditForm(false)}
              className="px-6 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
            >
              {language === "es" ? "cancelar" : "cancel"}
            </button>
            <button
              type="submit"
              className="px-6 py-1.5 text-sm rounded-full border-2 border-[#375B38] text-[#375B38] hover:bg-[#375B38] hover:text-white transition"
            >
              {language === "es" ? "aceptar" : "accept"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
