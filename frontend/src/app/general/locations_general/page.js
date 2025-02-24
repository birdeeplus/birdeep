// src/app/general/locations_general/page.js

"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/Navbar_general";

export default function LocationsGeneral() {
    const [language, setLanguage] = useState("en");
    const [locations, setLocations] = useState([]);
    
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
            title: "Welcome to the Locations Page",
            description: "Here you can explore different locations available in BIRDeep.",
            tableHeaders: ["ID", "Latitude", "Longitude", "Name", "Habitat"]
        },
        es: {
            title: "Bienvenido a la página de Localizaciones",
            description: "Aquí puedes explorar las diferentes localizaciones disponibles en BIRDeep.",
            tableHeaders: ["ID", "Latitud", "Longitud", "Nombre", "Hábitat"]
        },
    };

    return (
        <div className="relative w-full h-screen">
            <Navbar toggleLanguage={toggleLanguage} language={language} />
            <div className="container mx-auto px-10 flex flex-col items-center h-full py-10">
                <h1 className="text-4xl font-bold">{textContent[language].title}</h1>
                <p className="mt-4 text-lg max-w-md">{textContent[language].description}</p>
                <div className="mt-8 w-full overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                {textContent[language].tableHeaders.map((header, index) => (
                                    <th key={index} className="border border-gray-300 px-4 py-2">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map((location) => (
                                <tr key={location.id_location} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2">{location.id_location}</td>
                                    <td className="border border-gray-300 px-4 py-2">{location.latitude_location}</td>
                                    <td className="border border-gray-300 px-4 py-2">{location.longitude_location}</td>
                                    <td className="border border-gray-300 px-4 py-2">{location.name_location}</td>
                                    <td className="border border-gray-300 px-4 py-2">{location.habitat_location || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
