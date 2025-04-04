import React from "react";

const EditMicrophonePopup = ({
    showEditForm,
    setShowEditForm,
    language,
    formData,
    handleChange,
    handleSubmit,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">
                    {language === "en" ? "Edit Microphone" : "Editar Micrófono"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label>{language === "en" ? "Model" : "Modelo"}:</label>
                        <select
                            name="model_microphone"
                            value={formData.model_microphone || ""}
                            onChange={handleChange}
                            className="border w-full p-2"
                        >
                            <option value="AudioMoth">AudioMoth</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="mb-2">
                        <label>{language === "en" ? "Comment" : "Comentario"}:</label>
                        <input
                            type="text"
                            name="comment_microphone"
                            value={formData.comment_microphone || ""}
                            onChange={handleChange}
                            className="border w-full p-2"
                        />
                    </div>

                    <div className="mb-2">
                        <label>{language === "en" ? "Recorder ID" : "ID Grabador"}:</label>
                        <select
                            name="id_recorder"
                            value={formData.id_recorder || ""}
                            onChange={handleChange}
                            className="border w-full p-2"
                        >
                            <option value="">{language === "en" ? "Not assigned" : "No asignado"}</option>
                            {/* Aquí puedes mapear los IDs de grabadores si tienes la lista */}
                            {/* <option value="1">1</option> */}
                        </select>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            {language === "en" ? "Save" : "Guardar"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowEditForm(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            {language === "en" ? "Cancel" : "Cancelar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMicrophonePopup;
