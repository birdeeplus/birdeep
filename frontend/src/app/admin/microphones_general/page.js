"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/Navbar_general";
import { FaTrash, FaEdit } from "react-icons/fa";
import AddMicrophonePopup from "../../../components/microphones/AddMicrophonePopup";
import EditMicrophonePopup from "../../../components/microphones/EditMicrophonePopup";
import MicrophonesList from "../../../components/microphones/MicrophonesList";  // Importa el nuevo componente

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
    const [isAdmin, setIsAdmin] = useState(false);


    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };

    useEffect(() => {
        const updateAdminStatus = () => {
            const userRole = localStorage.getItem("is_admin");
            const isUserAdmin = userRole === "true";
            setIsAdmin(isUserAdmin);

            if (!isUserAdmin) {
                alert("You do not have access to this page.");
                window.location.href = "/";
            }
        };
    
        updateAdminStatus();
    
        const handleAuthChange = () => {
            updateAdminStatus();
        };
    
        window.addEventListener("authChange", handleAuthChange);
    
        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newMicrophone = {
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
    
                // Actualiza el estado para incluir el nuevo micrófono en la lista
                setMicrophones((prev) => [
                    ...prev,
                    savedMicrophone
                ]);
    
                // Cierra el formulario y limpia los datos
                setShowForm(false);
                setFormData({
                    model_microphone: "AudioMoth",  // o el valor por defecto que prefieras
                    comment_microphone: "",
                    id_recorder: ""
                });
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
            [name]: value === "later" ? "later" : (name === "id_recorder" ? (value ? Number(value) : null) : value)
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

    const handleDelete = async (id_microphone) => {
        if (confirm("¿Estás seguro de que deseas eliminar este micrófono?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/microphones/${id_microphone}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Micrófono eliminado correctamente");
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
            <Navbar toggleLanguage={toggleLanguage} language={language} />

            <div className="w-full max-w-screen-xl mx-auto sm:px-6 lg:px-8 flex flex-col items-start h-full pb-36">
                <h2 className="Montserrat text-[#375B38] text-2xl mt-24 sm:text-3xl font-bold mb-8">
                    {language === "en" ? "Microphones List" : "Lista de Micrófonos"}
                </h2>
                <div className="flex justify-end mb-4">
                    <button
                        style={{ backgroundColor: '#375B38' }}
                        className="text-white px-3 py-1 rounded hover:opacity-80"
                        onClick={() => setShowForm(true)}
                    >
                        + {language === "en" ? "Add Microphone" : "Añadir Micrófono"}
                    </button>
                </div>

                <MicrophonesList
                    microphones={microphones}
                    language={language}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                />
            </div>

            {/* Llamada al componente AddMicrophonePopup */}
            {showForm && (
                <AddMicrophonePopup
                    showForm={showForm}
                    setShowForm={setShowForm}
                    language={language}
                    recorders={recorders}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            )}

            {showEditForm && (
                <EditMicrophonePopup
                    showEditForm={showEditForm}
                    setShowEditForm={setShowEditForm}
                    language={language}
                    formData={editFormData} 
                    handleChange={(e) => {
                        const { name, value } = e.target;
                        setEditFormData((prevData) => ({
                            ...prevData,
                            [name]: value,
                        }));
                    }}
                    handleSubmit={handleUpdate} 
                    recorders={recorders} 
                />
            )}
        </div>
    );
}