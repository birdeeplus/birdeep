// src/app/page.jsx

"use client";
import { useState } from "react";
import Navbar from "../components/navbars/Navbar_general";

export default function Home() {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  const textContent = {
    en: {
      title: "Welcome to BIRDeep",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      button: "Explore",
    },
    es: {
      title: "Bienvenido a BIRDeep",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      button: "Explorar",
    },
  };

  return (
    <div className="relative w-full h-screen">
      {/* Navbar */}
      <Navbar toggleLanguage={toggleLanguage} language={language} />

      {/* Contenido principal */}
      <div className="container mx-auto px-10 flex items-center justify-start h-full">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold">{textContent[language].title}</h1>
          <p className="mt-4 text-lg max-w-md">{textContent[language].description}</p>
          
          {/* Botón con efecto hover */}
          <button className="mt-6 px-6 py-2 bg-black text-white rounded-full flex items-center group transition-all duration-300 ease-in-out">
            <span className="mr-2">{textContent[language].button}</span>
            <span className="transform transition-transform duration-300 ease-in-out group-hover:translate-x-2">➜</span>
          </button>
        </div>
      </div>
    </div>
  );
}

