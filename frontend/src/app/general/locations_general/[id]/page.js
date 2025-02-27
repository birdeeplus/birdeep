"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../../components/navbars/Navbar_general";

export default function LocationDetails() {
    const router = useRouter();
    const { id } = useParams(); // Accedemos directamente al id
    const [location, setLocation] = useState(null);
    const [recorderId, setRecorderId] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:8080/api/v1/locations/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setLocation(data);
                    // Obtener el id_recorder asociado
                    return fetch(`http://localhost:8080/api/v1/recorders/${id}`);
                })
                .then((response) => response.json())
                .then((recorderData) => {
                    if (recorderData.length > 0) {
                        setRecorderId(recorderData[0].id_recorder);
                    }
                })
                .catch((error) => console.error("Error fetching data:", error));
        }
    }, [id]);

    if (!location) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="relative w-full h-screen">
            <Navbar />
            <div className="container mx-auto px-10 flex flex-col items-center h-full py-10">
                <h1 className="text-4xl font-bold">{location.name_location}</h1>
                <p className="mt-4 text-lg">Details of the location:</p>
                <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-lg">
                    <p><strong>ID:</strong> {location.id_location}</p>
                    <p><strong>Latitude:</strong> {location.latitude_location}</p>
                    <p><strong>Longitude:</strong> {location.longitude_location}</p>
                    <p><strong>Habitat:</strong> {location.habitat_location || "N/A"}</p>
                    <p><strong>Recorder ID:</strong> {recorderId || "No recorder assigned"}</p>
                </div>
                <button 
                    onClick={() => router.push("/general/locations_general")}
                    className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                    Back to Locations
                </button>
            </div>
        </div>
    );
}
