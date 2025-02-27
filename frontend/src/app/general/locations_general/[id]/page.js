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
    const [language, setLanguage] = useState("en");  // Estado para el idioma
    const router = useRouter();

    const toggleLanguage = () => {
      setLanguage((prev) => (prev === "en" ? "es" : "en"));  // Cambiar el idioma
    };

    useEffect(() => {
        if (!id) return;
        
        // Fetch location details
        fetch(`http://localhost:8080/api/v1/locations/${id}`)
            .then((response) => response.json())
            .then((data) => setLocation(data))
            .catch((error) => console.error("Error fetching location details:", error));
        
        // Fetch recorders for this location
        fetch(`http://localhost:8080/api/v1/recorders?location_id=${id}`)
            .then((response) => response.json())
            .then((data) => setRecorders(data))
            .catch((error) => console.error("Error fetching recorders:", error));
    }, [id]);

    if (!location) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    // Traducciones para los textos
    const textContent = {
      en: {
        title: "Location Details",
        id: "ID",
        latitude: "Latitude",
        longitude: "Longitude",
        habitat: "Habitat",
        noRecorders: "No recorders found for this location.",
        recorders: "Recorders",
        backToLocations: "Back to Locations",
        description: "Here are the details of the selected location."
      },
      es: {
        title: "Detalles de la ubicación",
        id: "ID",
        latitude: "Latitud",
        longitude: "Longitud",
        habitat: "Hábitat",
        noRecorders: "No se encontraron grabadores para esta ubicación.",
        recorders: "Grabadoras",
        backToLocations: "Volver a Ubicaciones",
        description: "Aquí están los detalles de la ubicación seleccionada."
      },
    };

    // Acceso seguro al contenido según el idioma seleccionado
    const currentTextContent = textContent[language] || textContent.en;

    return (
        <div className="relative w-full h-screen">
            <Navbar toggleLanguage={toggleLanguage} language={language} />
            <div className="container mx-auto px-10 flex flex-col items-center h-full py-10">
                <h1 className="text-4xl font-bold">{currentTextContent.title}</h1>
                <p className="mt-4 text-lg">{currentTextContent.description}</p>
                <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-lg">
                    <p><strong>{currentTextContent.id}:</strong> {location.id_location}</p>
                    <p><strong>{currentTextContent.latitude}:</strong> {location.latitude_location}</p>
                    <p><strong>{currentTextContent.longitude}:</strong> {location.longitude_location}</p>
                    <p><strong>{currentTextContent.habitat}:</strong> {location.habitat_location || "N/A"}</p>
                </div>
                
                {/* Lista de Grabadores */}
                <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-lg">
                    <h2 className="text-2xl font-bold">{currentTextContent.recorders}</h2>
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
                        <p className="mt-4">{currentTextContent.noRecorders}</p>
                    )}
                </div>
                
                <button 
                    onClick={() => router.push("/general/locations_general")}
                    className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                    {currentTextContent.backToLocations}
                </button>
            </div>
        </div>
    );
}
