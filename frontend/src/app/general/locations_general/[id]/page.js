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
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
    
        // Fetch location details
        fetch(`http://localhost:8080/api/v1/locations/${id}`)
            .then((response) => response.json())
            .then((data) => setLocation(data))
            .catch((error) => console.error("Error fetching location details:", error));
    
        // Fetch recorders for this location
        fetch(`http://localhost:8080/api/v1/locations/${id}/recorders`)
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setRecorders([]); // No recorders found
                } else {
                    setRecorders(data);
                }
            })
            .catch((error) => console.error("Error fetching recorders:", error));
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
                    <p><strong>Latitude:</strong> {location.latitude_location}</p>
                    <p><strong>Longitude:</strong> {location.longitude_location}</p>
                    <p><strong>Habitat:</strong> {location.habitat_location || "N/A"}</p>
                </div>

                {/* Recorders List */}
                <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-lg">
                    <h2 className="text-2xl font-bold">Recorders</h2>
                    {recorders.length > 0 ? (
                        <ul className="mt-4">
                            {recorders.map((recorder) => (
                                <li 
                                    key={recorder.id_recorder} 
                                    className="py-2 border-b border-gray-300 cursor-pointer text-blue-500 hover:underline"
                                    onClick={() => router.push(`/general/recorders_general/${recorder.id_recorder}`)}
                                >
                                    <strong>ID Recorder:</strong> {recorder.id_recorder}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4">No recorders found for this location.</p>
                    )}
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
