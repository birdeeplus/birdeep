import React from 'react';

const AddProcessorPopup = ({ showForm, setShowForm, language, recorders, handleChange, formData, handleSubmit }) => {
  // Manejador de cambios para el id_recorder
  const handleRecorderChange = (e) => {
    const value = e.target.value === "" ? null : e.target.value;
    handleChange({ target: { name: "id_recorder", value } });
  };

  // Filtrar grabadoras para eliminar duplicados por id_recorder
  const uniqueRecorders = [...new Map(recorders.map(item => [item.id_recorder, item])).values()];

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {language === "en" ? "Add Processor" : "Añadir Procesador"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block mb-1">
                  {language === "en" ? "Model:" : "Modelo:"}
                </label>
                <select
                  name="model_processor"
                  value={formData.model_processor}
                  onChange={handleChange}
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
                  value={formData.comment_processor}
                  onChange={handleChange}
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
                  value={formData.id_recorder === null ? "" : formData.id_recorder}
                  onChange={handleRecorderChange}
                  className="border w-full p-2 rounded"
                >
                  <option value="">{language === "en" ? "Not assigned" : "No asignado"}</option>
                  {uniqueRecorders.map((recorder) => (
                    <option key={recorder.id_recorder} value={String(recorder.id_recorder)}>
                      {recorder.id_recorder}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                >
                  {language === "en" ? "Cancel" : "Cancelar"}
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  {language === "en" ? "Save" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProcessorPopup;