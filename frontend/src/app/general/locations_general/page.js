// src/app/general/locations_general/page.js
"use client";
import { useState } from "react";
import Navbar from "../../../components/navbars/Navbar_general";

export default function LocationsGeneral() {
    const [language, setLanguage] = useState("en");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };

    const textContent = {
        en: {
            title: "Welcome to the Locations Page",
            description: "Here you can explore different locations available in BIRDeep.",
        },
        es: {
            title: "Bienvenido a la página de Localizaciones",
            description: "Aquí puedes explorar las diferentes localizaciones disponibles en BIRDeep.",
        },
    };

    return (
        <div className="relative w-full h-screen">
            {/* Navbar */}
            <Navbar toggleLanguage={toggleLanguage} language={language} />

            {/* Contenido de la página */}
            <div className="container mx-auto px-10 flex items-center justify-start h-full">
                <div className="w-1/2">
                    <h1 className="text-4xl font-bold">{textContent[language].title}</h1>
                    <p className="mt-4 text-lg max-w-md">{textContent[language].description}</p>
                </div>
            </div>
        </div>
    );
}
