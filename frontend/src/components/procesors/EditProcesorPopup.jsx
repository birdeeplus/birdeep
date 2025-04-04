import React from "react";

const EditProcessorPopup = ({
  showEditForm,
  editFormData,
  setEditFormData,
  setShowEditForm,
  handleUpdate,
  recorders,
  language,
}) => {
  if (!showEditForm || !editFormData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {language === "en" ? "Edit Processor" : "Editar Procesador"}
        </h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-2">
            <label className="block mb-1">
              {language === "en" ? "Model:" : "Modelo:"}
            </label>
            <select
              name="model_processor"
              value={editFormData.model_processor}
              onChange={(e) =>
                setEditFormData({ ...editFormData, model_processor: e.target.value })
              }
              className="border w-full p-2 rounded"
            >
              <option value="Orange Pi 3">Orange Pi 3</option>
              <option value="Other">{language === "en" ? "Other" : "Otro"}</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block mb-1">
              {language === "en" ? "Comment:" : "Comentario:"}
            </label>
            <input
              type="text"
              name="comment_processor"
              value={editFormData.comment_processor || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, comment_processor: e.target.value })
              }
              className="border w-full p-2 rounded"
              placeholder={language === "en" ? "Add comment" : "Añadir comentario"}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1">
              {language === "en" ? "Recorder ID:" : "ID Grabadora:"}
            </label>
            <select
              name="id_recorder"
              value={editFormData.id_recorder !== null ? String(editFormData.id_recorder) : ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  id_recorder: e.target.value !== "" ? Number(e.target.value) : null,
                })
              }
              className="border w-full p-2 rounded"
            >
              <option value="">-</option>
              {recorders.map((recorder) => (
                <option key={recorder.id_recorder} value={String(recorder.id_recorder)}>
                  {recorder.id_recorder}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowEditForm(false)}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              {language === "en" ? "Cancel" : "Cancelar"}
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              {language === "en" ? "Update" : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProcessorPopup;
