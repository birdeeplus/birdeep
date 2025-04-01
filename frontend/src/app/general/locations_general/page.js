"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../../../components/navbars/Navbar_general";
import AddLocationButton from "../../../components/AddLocationButton";

const blackIcon = new L.Icon({
    iconUrl: "/iconos/map-marker-black.png",
    iconSize: [30, 30],
    iconAnchor: [15, 40],
    popupAnchor: [1, -34],
});

export default function LocationsGeneral() {
    const [language, setLanguage] = useState("en");
    const [locations, setLocations] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };

    const fetchLocations = () => {
        fetch("http://localhost:8080/api/v1/locations")
            .then((response) => response.json())
            .then((data) => setLocations(data))
            .catch((error) => console.error("Error fetching locations:", error));
    };

    const updateAdminStatus = () => {
        const userRole = localStorage.getItem("is_admin");
        setIsAdmin(userRole === "true"); // Verifica correctamente el valor de admin
    };

    useEffect(() => {
        const updateAdminStatus = () => {
            const userRole = localStorage.getItem("is_admin");
            setIsAdmin(userRole === "true");
        };
    
        updateAdminStatus(); // Ejecutar al inicio
        fetchLocations();
    
        const handleAuthChange = () => {
            updateAdminStatus(); // Actualizar estado cuando cambie la autenticación
        };
    
        window.addEventListener("authChange", handleAuthChange);
    
        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);
    

    return (
        <div className="relative w-full h-screen">
            {/* Navbar */}
            <Navbar toggleLanguage={toggleLanguage} language={language} />

            {/* Botón de añadir localización si es admin */}
            {isAdmin && <AddLocationButton onAddLocation={fetchLocations} />}

            {/* Contenedor del mapa */}
            <div className="relative w-full h-full pt-[90px]">
                <MapContainer
                    center={[36.990000, -6.440000]} // Doñana como centro del mapa
                    zoom={12}
                    className="absolute top-0 left-0 w-full h-full z-0"
                >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                    {locations.map((location) => (
                        <Marker
                            key={location.id_location}
                            position={[location.latitude_location, location.longitude_location]}
                            icon={blackIcon}
                            eventHandlers={{
                                click: () => router.push(`/general/locations_general/${location.id_location}`),
                            }}
                        >
                            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                                <span className="font-bold">{location.name_location}</span>
                            </Tooltip>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}