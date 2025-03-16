"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; 
import Navbar from "../../../../components/navbars/Navbar_general";

export default function LocationDetails() {
    const params = useParams();
    const id = params?.id; 
    const [location, setLocation] = useState(null);
    const [recorders, setRecorders] = useState([]);
    const [language, setLanguage] = useState("en");  
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const router = useRouter();

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));  
    };

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:8080/api/v1/locations/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setLocation(data);
                setFormData(data);
            })
            .catch((error) => console.error("Error fetching location details:", error));

        fetch(`http://localhost:8080/api/v1/locations/${id}/recorders`)
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setRecorders([]);
                } else {
                    setRecorders(data);
                }
            })
            .catch((error) => console.error("Error fetching recorders:", error));

        const userIsAdmin = localStorage.getItem("is_admin") === "true";
        setIsAdmin(userIsAdmin);
    }, [id]); 

    if (!location) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    const handleDelete = async () => {
        if (!id) return;
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta ubicación?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/locations/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Ubicación eliminada correctamente.");
                router.push("/general/locations_general");
            } else {
                alert("Error al eliminar la ubicación.");
            }
        } catch (error) {
            console.error("Error deleting location:", error);
            alert("Error al conectar con el servidor.");
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/v1/locations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Ubicación actualizada correctamente.");
                setLocation(formData);
                setIsEditing(false);
            } else {
                alert("Error al actualizar la ubicación.");
            }
        } catch (error) {
            console.error("Error updating location:", error);
            alert("Error al conectar con el servidor.");
        }
    };

    const textContent = {
        en: {
            title: "",
            id: "ID",
            name: "Name",
            latitude: "Latitude",
            longitude: "Longitude",
            habitat: "Habitat",
            noRecorders: "No recorders found for this location.",
            recorders: "Recorders",
            backToLocations: "Back to Locations",
            description: "Here are the details of the selected location.",
            deleteButton: "Delete Location",
            editButton: "Edit Location",
            saveButton: "Save Changes",
            cancelButton: "Cancel"
        },
        es: {
            title: "",
            id: "ID",
            name: "Nombre",
            latitude: "Latitud",
            longitude: "Longitud",
            habitat: "Hábitat",
            noRecorders: "No se encontraron grabadores para esta ubicación.",
            recorders: "Grabadoras",
            backToLocations: "Volver a Ubicaciones",
            description: "Aquí están los detalles de la ubicación seleccionada.",
            deleteButton: "Eliminar Ubicación",
            editButton: "Editar Ubicación",
            saveButton: "Guardar Cambios",
            cancelButton: "Cancelar"
        },
    };

    const currentTextContent = textContent[language] || textContent.en;

    return (
        <div className="relative w-full h-screen">
            <Navbar toggleLanguage={toggleLanguage} language={language} />
            <div className="container mx-auto px-10 flex flex-col items-center h-full py-10">
                <h1 className="text-4xl font-bold">
                    {currentTextContent.title} {location.name_location ? `${location.name_location}` : ""}
                </h1>

                <p className="mt-4 text-lg">{currentTextContent.description}</p>

                {!isEditing ? (
                    <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-lg">
                        <p><strong>{currentTextContent.id}:</strong> {location.id_location}</p>
                        <p><strong>{currentTextContent.latitude}:</strong> {location.latitude_location}</p>
                        <p><strong>{currentTextContent.longitude}:</strong> {location.longitude_location}</p>
                        <p><strong>{currentTextContent.habitat}:</strong> {location.habitat_location || "N/A"}</p>
                    </div>
                ) : (
                <form onSubmit={handleSubmit} className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-lg">
                    <label>{currentTextContent.name}:</label>
                    <input type="text" name="name_location" value={formData.name_location} onChange={handleChange} className="w-full p-2 border rounded" />

                    <label>{currentTextContent.latitude}:</label>
                    <input type="text" name="latitude_location" value={formData.latitude_location} onChange={handleChange} className="w-full p-2 border rounded" />

                    <label>{currentTextContent.longitude}:</label>
                    <input type="text" name="longitude_location" value={formData.longitude_location} onChange={handleChange} className="w-full p-2 border rounded" />

                    <label>{currentTextContent.habitat}:</label>
                    <input type="text" name="habitat_location" value={formData.habitat_location} onChange={handleChange} className="w-full p-2 border rounded" />

                    <div className="flex gap-4 mt-4">
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            {currentTextContent.saveButton}
                        </button>
                        <button type="button" onClick={handleEditToggle} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                            {currentTextContent.cancelButton}
                        </button>
                    </div>
                </form>

                )}

                <button 
                    onClick={() => router.push("/general/locations_general")}
                    className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                    {currentTextContent.backToLocations}
                </button>

                {isAdmin && !isEditing && (
                    <div className="mt-4 flex gap-4">
                        <button onClick={handleEditToggle} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            {currentTextContent.editButton}
                        </button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                            {currentTextContent.deleteButton}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
