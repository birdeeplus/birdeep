"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbars/Navbar_general";

export default function LocationsGeneral() {
    const [language, setLanguage] = useState("en");
    const [locations, setLocations] = useState([]);
    const router = useRouter();

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/locations")
            .then((response) => response.json())
            .then((data) => setLocations(data))
            .catch((error) => console.error("Error fetching locations:", error));
    }, []);

    const textContent = {
        en: {
            title: "Locations",
            description: "Click on a location to view details.",
        },
        es: {
            title: "Localizaciones",
            description: "Haz clic en una localización para ver detalles.",
        },
    };

    return (
        <div className="relative w-full h-screen">
            <Navbar toggleLanguage={toggleLanguage} language={language} />
            <div className="container mx-auto px-10 flex flex-col items-center h-full py-10">
                <h1 className=" mt-10 text-4xl font-bold">{textContent[language].title}</h1>
                <p className="mt-4 text-lg">{textContent[language].description}</p>
                <div className="mt-6 w-full max-w-md">
                    {locations.map((location) => (
                        <button
                            key={location.id_location}
                            onClick={() => router.push(`/general/locations_general/${location.id_location}`)}
                            className="block w-full text-center py-3 my-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                        >
                            {location.name_location}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}