"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../components/navbars/Navbar_general";
import "../app/styles/fonts.css";
import Footer from "../components/footer/Footer";

export default function Home() {
  const [language, setLanguage] = useState("es");
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const backgroundImages = [
    "/photos/fondo1.png",
    "/photos/fondo2.png",
    "/photos/fondo3.png",
    "/photos/fondo4.png",
    "/photos/fondo5.png",
  ];

  const toggleLanguage = () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const textContent = {
    en: {
      title: "BIRDEEP+",
      description:
        "Explore and download bird sounds from Doñana! Connect with nature and enjoy its beauty now.",
      button: "discover",
    },
    es: {
      title: "BIRDEEP+",
      description:
        "¡Explora y descarga audios de las aves de Doñana! Conéctate con la naturaleza y disfruta de su belleza ahora mismo.",
      button: "descubrir",
    },
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "es";
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="w-full">
      <Navbar toggleLanguage={toggleLanguage} language={language} />
      {console.log("ip: ", process.env.NEXT_PUBLIC_BACKEND_IP)}

      {/* Sección pantalla completa con carrusel */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Imagen de fondo */}
        {backgroundImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Fondo ${index + 1}`}
            fill
            priority={index === 0}
            className={`absolute object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Indicadores */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          {backgroundImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full ${
                i === currentSlide ? "bg-[#1f2937]" : "bg-[#1f2937]/50"
              }`}
            />
          ))}
        </div>

        {/* Contenido principal encima del fondo */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center px-6 sm:px-16 lg:px-32">
          <div className="w-full max-w-xs">
            <h1 className="NeueHaasDisplayMediu text-2xl sm:text-3xl font-medium text-[#375B38]">
              {textContent[language].title}
            </h1>
            <p className="Montserrat mt-3 text-sm sm:text-base text-gray-800 leading-relaxed">
              {textContent[language].description}
            </p>
            <button
              onClick={() => router.push("/general/locations_general")}
              className="mt-5 px-3 py-1 border-2 border-[#375B38] text-[#375B38] rounded-full flex items-center group transition-all duration-300 ease-in-out hover:bg-[#375B38] hover:text-white Montserrat text-sm sm:text-base font-semibold"
            >
              <span className="mr-2">{textContent[language].button}</span>
              <span className="text-lg sm:text-xl leading-none">›</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer visible al hacer scroll */}
      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}
