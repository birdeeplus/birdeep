"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/Navbar_general";
import { FaTrash, FaEdit } from "react-icons/fa";


export default function ProcessorsGeneral() {
    const [language, setLanguage] = useState("en");
    const [processors, setProcessors] = useState([]);
    const [recorders, setRecorders] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({
        model_processor: "Orange Pi 3",
        comment_processor: "",
        id_recorder: ""
    });

    const [editFormData, setEditFormData] = useState(null);


    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };

    // Obtener lista de procesadores y grabadoras
    useEffect(() => {
        fetchProcessors();
        fetchRecorders();
    }, []);

    const fetchProcessors = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/processors");
            const data = await response.json();
            setProcessors(data);
        } catch (error) {
            console.error("Error fetching processors:", error);
        }
    };

    const fetchRecorders = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/recorders");
            const data = await response.json();
            setRecorders(data);
        } catch (error) {
            console.error("Error fetching recorders:", error);
        }
    };

    // Añadir nuevo procesador
    const handleSubmit = async (e) => {
        e.preventDefault();

        const nextId =
            processors.length > 0
                ? Math.max(...processors.map((p) => p.id_processor)) + 1
                : 1;

        const newProcessor = {
            id_processor: nextId,
            model_processor: formData.model_processor,
            comment_processor: formData.comment_processor,
            id_recorder: formData.id_recorder !== "" ? Number(formData.id_recorder) : null
        };

        try {
            const response = await fetch("http://localhost:8080/api/v1/processors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newProcessor)
            });

            if (response.ok) {
                fetchProcessors(); // Recargar lista después de añadir
                setShowForm(false);
                setFormData({
                    model_processor: "Orange Pi 3",
                    comment_processor: "",
                    id_recorder: ""
                });
            } else {
                console.error("Error adding processor:", response.statusText);
                alert("Error adding processor");
            }
        } catch (error) {
            console.error("Error adding processor:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "id_recorder" ? (value ? Number(value) : null) : value
        }));
    };

    // Editar procesador
    const handleEdit = (processor) => {
        setEditFormData(processor);
        setShowEditForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/processors/${editFormData.id_processor}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(editFormData)
                }
            );

            if (response.ok) {
                fetchProcessors(); // Recargar lista después de actualizar
                setShowEditForm(false);
            } else {
                console.error("Error updating processor:", response.statusText);
                alert("Error updating processor");
            }
        } catch (error) {
            console.error("Error updating processor:", error);
        }
    };

    // Eliminar procesador
    const handleDelete = async (id_processor) => {
        if (confirm("¿Estás seguro de que deseas eliminar este procesador?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/processors/${id_processor}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    alert("Procesador eliminado correctamente");
                    fetchProcessors(); // Recargar lista después de eliminar
                } else {
                    alert("Error al eliminar el procesador");
                }
            } catch (error) {
                console.error("Error deleting processor:", error);
            }
        }
    };

    return (
        <div className="relative w-full h-screen p-6">
            <Navbar toggleLanguage={toggleLanguage} language={language} />

            <div className="w-full max-w-screen-xl mx-auto sm:px-6 lg:px-8 flex flex-col items-start h-full pb-36">

            {/* Titulo */}
            <h1 className="Montserrat text-[#375B38] text-2xl mt-24 sm:text-3xl font-bold mb-8">
                {language === "en" ? "Processor List" : "Lista de Procesadores"}
            </h1>

                <div className="flex justify-end mb-4">
                    <button
                        style={{ backgroundColor: '#375B38' }}
                        className="text-white px-3 py-1 rounded hover:opacity-80"
                        onClick={() => setShowForm(true)}
                    >
                        + {language === "en" ? "Add Processor" : "Añadir Procesador"}
                    </button>
                </div>

                <table className="text-[#375B38] w-full mt-8 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py">{language === "en" ? "Model" : "Modelo"}</th>
                            <th className="px-4 py">{language === "en" ? "Comment" : "Comentario"}</th>
                            <th className="px-4 py">{language === "en" ? "ID Recorder" : "ID Grabadora"}</th>
                            <th className="px-4 py">{language === "en" ? "Delete" : "Eliminar"}</th>
                            <th className="px-4 py">{language === "en" ? "Edit" : "Modificar"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processors.length > 0 ? (
                            processors.map((processor) => (
                                <tr key={processor.id_processor} className="text-center cursor-pointer hover:bg-gray-100">
                                    <td className="px-4 py-2 rounded-l-lg">
                                        {processor.id_processor}
                                    </td>
                                    <td className="px-4 py-2">
                                        {processor.model_processor}
                                    </td>
                                    <td className="px-4 py-2">
                                        {processor.comment_processor || (language === "en" ? "No comments" : "Sin comentarios")}
                                    </td>
                                    <td className="px-4 py-2">
                                        {processor.id_recorder 
                                            ? processor.id_recorder 
                                            : (language === "en" ? "Not assigned" : "No asignado")}
                                    </td>

                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDelete(processor.id_processor)}
                                            className="text-black hover:text-black"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleEdit(processor)}
                                            className="text-black hover:text-black"
                                        >
                                            <FaEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-4">
                                    {language === "en" ? "There are no registered processors." : "No hay procesadores registrados."}
                                    
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
                                    value={formData.id_recorder !== null ? String(formData.id_recorder) : ""}
                                    onChange={handleChange}
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


            {showEditForm && editFormData && (
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
                                            id_recorder: e.target.value !== "" ? Number(e.target.value) : null
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
            )}


        </div>
    );
}
