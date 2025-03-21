"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/Navbar_general";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function MicrophonesTable() {
    const [language, setLanguage] = useState("en");
    const [microphones, setMicrophones] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        model_microphone: "AudioMoth",
        comment_microphone: "",
        id_recorder: ""
    });
    const [showEditForm, setShowEditForm] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [recorders, setRecorders] = useState([]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/microphones")
            .then((response) => response.json())
            .then((data) => setMicrophones(data))
            .catch((error) => console.error("Error fetching microphones:", error));
        fetch("http://localhost:8080/api/v1/recorders") // Ruta para obtener IDs de grabadores
            .then((response) => response.json())
            .then((data) => setRecorders(data))
            .catch((error) => console.error("Error fetching recorders:", error));
    }, []);

    // Enviar formulario para añadir micrófono
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Generar el siguiente ID automáticamente
        const nextId =
            microphones.length > 0
                ? Math.max(...microphones.map((m) => m.id_microphone)) + 1
                : 1;

        const newMicrophone = {
            id_microphone: nextId,
            model_microphone: formData.model_microphone,
            comment_microphone: formData.comment_microphone,
            id_recorder: formData.id_recorder !== "" ? Number(formData.id_recorder) : null
        };

        try {
            const response = await fetch("http://localhost:8080/api/v1/microphones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newMicrophone)
            });

            if (response.ok) {

                const savedMicrophone = await response.json();

                //const addedMicrophone = await response.json();
                setMicrophones((prev) => [
                    ...prev,
                    {
                        ...newMicrophone,
                        id_microphone: savedMicrophone.id_microphone || nextId,
                        id_recorder: savedMicrophone.id_recorder ?? null

                    }
                ]);

                setShowForm(false);
                setFormData({
                    model_microphone: "AudioMoth",
                    comment_microphone: "",
                    id_recorder: ""
                });

                // Recargar automáticamente el estado
                fetch("http://localhost:8080/api/v1/microphones-recorders")
                    .then((response) => response.json())
                    .then((data) => setMicrophones(data))
                    .catch((error) =>
                        console.error("Error fetching microphones:", error)
                    );

            } else {
                console.error("Error adding microphone:", response.statusText);
                alert("Error adding microphone");
            }
        } catch (error) {
            console.error("Error adding microphone:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "id_recorder" ? (value ? Number(value) : null) : value
        }));
    };
    

    const handleEdit = (microphone) => {
        setEditFormData(microphone);
        setShowEditForm(true);
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
    
        try {

            const response = await fetch(
                `http://localhost:8080/api/v1/microphones/${editFormData.id_microphone}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editFormData),
                }
            );
    
            if (response.ok) {
                
                // Recargar desde el servidor después de la actualización
                fetch("http://localhost:8080/api/v1/microphones-recorders")
                    .then((response) => response.json())
                    .then((data) => setMicrophones(data))
                    .catch((error) =>
                        console.error("Error fetching microphones:", error)
                    );
    
                setShowEditForm(false);
                setEditFormData(null);
            } else {
                console.error("Error updating microphone:", response.statusText);
                alert("Error updating microphone");
            }
        } catch (error) {
            console.error("Error updating microphone:", error);
        }
    };
    
    

    //Función para eliminar micrófono
    const handleDelete = async (id_microphone) => {
        if (confirm("¿Estás seguro de que deseas eliminar este micrófono?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/microphones/${id_microphone}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Micrófono eliminado correctamente");
                    // Actualizar la lista eliminando el micrófono de la tabla
                    setMicrophones(microphones.filter(mic => mic.id_microphone !== id_microphone));
                } else {
                    alert("Error al eliminar el micrófono");
                }
            } catch (error) {
                console.error("Error deleting microphone:", error);
                alert("Error al eliminar el micrófono");
            }
        }
    };
    

    return (
        <div className="w-full h-screen">
            {/* Navbar */}
            <Navbar toggleLanguage={toggleLanguage} language={language} />

            {/* Tabla de micrófonos */}
            <div className="w-full max-w-4xl mx-auto mt-20 p-4">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {language === "en" ? "Microphones List" : "Lista de Micrófonos"}
                </h2>
                <div className="flex justify-end mb-6">
                    <button
                        className="bg-black text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => setShowForm(true)}
                    >
                        + {language === "en" ? "Add Microphone" : "Añadir Micrófono"}
                    </button>
                    <br></br>
                </div>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">
                                {language === "en" ? "Model" : "Modelo"}
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                {language === "en" ? "Comment" : "Comentario"}
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                {language === "en" ? "Recorder ID" : "ID Grabador"}
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                {language === "en" ? "Delete" : "Eliminar"}
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                {language === "en" ? "Modify" : "Modificar"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {microphones.map((microphone, index) => (
                            <tr key={microphone.id_microphone ?? `temp-${index}`} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {microphone.id_microphone}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {microphone.model_microphone}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {microphone.comment_microphone || "-"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {microphone.id_recorder || "-"}
                                </td>
                                {/* Icono de eliminar */}
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleDelete(microphone.id_microphone)}
                                        className="text-black hover:text-black"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleEdit(microphone)}
                                        className="text-black hover:text-black"
                                    >
                                        <FaEdit />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* Popup para añadir micrófono */}
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

            {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {language === "en" ? "Edit Microphone" : "Editar Micrófono"}
                        </h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-2">
                                <label>Model:</label>
                                <select
                                    name="model_microphone"
                                    value={editFormData.model_microphone ||""}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, model_microphone: e.target.value })
                                    }
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
                                    value={editFormData.comment_microphone ||""}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, comment_microphone: e.target.value })
                                    }
                                    className="border w-full p-2"
                                />
                            </div>

                            <div className="mb-2">
                                <label>Recorder ID:</label>
                                <select
                                    name="id_recorder"
                                    value={editFormData?.id_recorder !== null ? String(editFormData?.id_recorder) : ""}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, id_recorder: e.target.value !== "" ? Number(e.target.value) : null })
                                    }
                                    className="border w-full p-2"
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
            )}



        </div>
    );
}
