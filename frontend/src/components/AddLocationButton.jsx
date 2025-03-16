"use client";
import { useState } from "react";

export default function AddLocationButton({ onAddLocation }) {
    const [showForm, setShowForm] = useState(false);
    const [newLocation, setNewLocation] = useState({
        name_location: "",
        latitude_location: "",
        longitude_location: "",
        habitat_location: ""
    });
    const [message, setMessage] = useState(""); // Mensaje de éxito o error

    const handleChange = (e) => {
        setNewLocation({ ...newLocation, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Limpiar mensaje previo

        try {
            const response = await fetch("http://localhost:8080/api/v1/locations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLocation),
            });

            if (response.ok) {
                setShowForm(false);
                setNewLocation({ name_location: "", latitude_location: "", longitude_location: "", habitat_location: "" });
                setMessage("Ubicación añadida con éxito ✅");
                onAddLocation(); // Actualizar mapa
            } else {
                setMessage("Error al añadir ubicación ❌");
            }
        } catch (error) {
            console.error("Error adding location:", error);
            setMessage("Error de conexión ❌");
        }
    };

    return (
        <div className="absolute top-20 right-10 z-10">
            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
                {showForm ? "Cancelar" : "Añadir Localización"}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mt-2 w-72">
                    <input
                        type="text"
                        name="name_location"
                        placeholder="Nombre"
                        value={newLocation.name_location}
                        onChange={handleChange}
                        className="w-full border p-2 rounded mb-2"
                        required
                    />
                    <input
                        type="number"
                        step="any"
                        name="latitude_location"
                        placeholder="Latitud"
                        value={newLocation.latitude_location}
                        onChange={handleChange}
                        className="w-full border p-2 rounded mb-2"
                        required
                    />
                    <input
                        type="number"
                        step="any"
                        name="longitude_location"
                        placeholder="Longitud"
                        value={newLocation.longitude_location}
                        onChange={handleChange}
                        className="w-full border p-2 rounded mb-2"
                        required
                    />
                    <input
                        type="text"
                        name="habitat_location"
                        placeholder="Hábitat"
                        value={newLocation.habitat_location}
                        onChange={handleChange}
                        className="w-full border p-2 rounded mb-2"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Guardar
                    </button>
                    {message && <p className="text-sm mt-2 text-center">{message}</p>}
                </form>
            )}
        </div>
    );
}
