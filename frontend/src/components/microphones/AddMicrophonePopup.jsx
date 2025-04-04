import React, { useState } from 'react';

const AddMicrophonePopup = ({ showForm, setShowForm, language, recorders, handleChange, formData, handleSubmit }) => {
    return (
        <>
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {language === "en" ? "Add Microphone" : "Añadir Micrófono"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label>Model:</label>
                                <select
                                    name="model_microphone"
                                    value={formData.model_microphone}
                                    onChange={handleChange}
                                    className="border w-full p-2"
                                >
                                    <option value="AudioMoth">AudioMoth</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label>Comment:</label>
                                <input
                                    type="text"
                                    name="comment_microphone"
                                    value={formData.comment_microphone}
                                    onChange={handleChange}
                                    className="border w-full p-2"
                                />
                            </div>
                            <div className="mb-2">
                                <label>Recorder ID:</label>
                                <select
                                    name="id_recorder"
                                    value={formData.id_recorder !== null ? String(formData.id_recorder) : ""}
                                    onChange={handleChange}
                                    className="border w-full p-2"
                                >
                                    <option value="">-</option>
                                    <option value="later">{language === "en" ? "Choose later" : "Escoger más tarde"}</option>
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

export default AddMicrophonePopup;
