"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/Navbar_general";
import AddProcessorPopup from "../../../components/procesors/AddProcesorPopup";
import EditProcessorPopup from "../../../components/procesors/EditProcesorPopup";
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
    const [isAdmin, setIsAdmin] = useState(false);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };

    useEffect(() => {
        const updateAdminStatus = () => {
            const userRole = localStorage.getItem("is_admin");
            const isUserAdmin = userRole === "true";
            setIsAdmin(isUserAdmin);

            // Si no es admin, mostrar mensaje de acceso denegado y redirigir
            if (!isUserAdmin) {
                alert("You do not have access to this page.");
                window.location.href = "/"; // Redirige al home
            }
        };
    
        updateAdminStatus(); // Ejecutar al inicio
    
        const handleAuthChange = () => {
            updateAdminStatus(); // Actualizar estado cuando cambie la autenticación
        };
    
        window.addEventListener("authChange", handleAuthChange);
    
        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);

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
                <AddProcessorPopup 
                    showForm={showForm} 
                    setShowForm={setShowForm} 
                    formData={formData} 
                    handleChange={handleChange} 
                    handleSubmit={handleSubmit} 
                    recorders={recorders} 
                    language={language} 
                />
            )}
            {showEditForm && (
                <EditProcessorPopup
                    showEditForm={showEditForm}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    setShowEditForm={setShowEditForm}
                    handleUpdate={fetchProcessors} // Asegúrate de que fetchProcessors haga la actualización correcta
                    recorders={recorders}
                    language={language}
                />
            )}
        </div>
    );
}
