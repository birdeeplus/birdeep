"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../../../components/navbars/Navbar_general";
import AddLocationButton from "../../../components/localizaciones/AddLocationButton";
import LocationInfoModal from "../../../components/localizaciones/LocationInfoModal";
import EditLocationModal from "../../../components/localizaciones/EditLocationModal";


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
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const router = useRouter();

    const toggleLanguage = () => {
        const newLang = language === "en" ? "es" : "en";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
    };


    const fetchLocations = () => {
        fetch("http://localhost:8080/api/v1/locations")
            .then((response) => response.json())
            .then((data) => setLocations(data))
            .catch((error) => console.error("Error fetching locations:", error));
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "es";
        setLanguage(savedLanguage);

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
            {isAdmin && <AddLocationButton onAddLocation={fetchLocations} language={language} />}

            {/* Contenedor del mapa */}
            <div className="relative w-full h-full pt-[90px]">
                <MapContainer
                    center={[36.990000, -6.440000]} // Doñana como centro del mapa
                    zoom={12}
                    minZoom={5}
                    className="absolute top-0 left-0 w-full h-full z-0"
                >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                    {locations.map((location) => (
                        <Marker
                            key={location.id_location}
                            position={[location.latitude_location, location.longitude_location]}
                            icon={blackIcon}
                            eventHandlers={{
                                click: () => {
                                    setSelectedLocation(location);
                                    if (isAdmin) {
                                        setShowEditModal(true);
                                    }
                                },
                            }}
                        >
                            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                                <div className="text-sm">
                                    <div className="font-bold">
                                        {location.name_location.replaceAll("_", " ")}
                                    </div>
                                    <div className="text-gray-700">
                                        {location.habitat_location.replaceAll("_", " ")}
                                    </div>
                                </div>
                            </Tooltip>

                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {selectedLocation && !isAdmin && (
                <LocationInfoModal
                    location={selectedLocation}
                    onClose={() => setSelectedLocation(null)}
                    language={language}
                />
            )}

            {selectedLocation && isAdmin && showEditModal && (
                <EditLocationModal
                    location={selectedLocation}
                    onClose={() => {
                        setSelectedLocation(null);
                        setShowEditModal(false);
                    }}
                    onSave={fetchLocations}
                    language={language}
                />

            )}

        </div>
    );
}