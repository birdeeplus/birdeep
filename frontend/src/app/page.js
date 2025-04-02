// src/app/page.jsx

"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/navbars/Navbar_general";
import "../app/styles/fonts.css";

export default function Home() {
  const [language, setLanguage] = useState("es");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  const textContent = {
    en: {
      title: "BIRDEEP+",
      description:
        "Explore and download bird sounds from Doñana! Connect with nature and enjoy its beauty now.",
      button: "Discover",
    },
    es: {
      title: "BIRDEEP+",
      description:
        "¡Explora y descarga audios de las aves de Doñana! Conéctate con la naturaleza y disfruta de su belleza ahora mismo.",
      button: "descubrir",
    },
  };

  return (
    <div className="relative w-full h-screen">
      {/* Navbar */}
      <Navbar toggleLanguage={toggleLanguage} language={language} />

      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/photos/fondo.png"
          alt="Fondo Pajaros"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto flex items-center justify-start h-full px-4 sm:px-10 lg:px-20">
        <div className="w-full max-w-xs">
          <h1 className="NeueHaasDisplayMediu text-2xl sm:text-3xl font-medium text-[#375B38]">
            {textContent[language].title}
          </h1>

          <p className="Montserrat mt-3 text-sm sm:text-base text-gray-800 leading-relaxed">
            {textContent[language].description}
          </p>

          {/* Botón con diseño compacto */}
          <button className="mt-5 px-3 py-1 border-2 border-[#375B38] text-[#375B38] rounded-full flex items-center group transition-all duration-300 ease-in-out hover:bg-[#375B38] hover:text-white Montserrat text-sm sm:text-base font-semibold">
            <span className="mr-2">{textContent[language].button}</span>
            <span className="text-lg sm:text-xl leading-none">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
