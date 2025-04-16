"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "../../app/styles/fonts.css";
import LanguageToggleButton from "../Button_language";
import SidebarMenu from "./SidebarMenu";
import LoginModal from "./LoginModal";
import LogoutConfirmation from "./LogoutModal";

export default function Navbar({ toggleLanguage, language, background = "transparent" }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);  // Nuevo estado para detectar el primer renderizado

    useEffect(() => {
        // Recupera los datos del localStorage al cargar la página
        const token = localStorage.getItem("token");
        const adminStatus = localStorage.getItem("is_admin");

        // Solo la primera vez que se carga la aplicación, se establece como usuario no autenticado
        if (!localStorage.getItem("isFirstLoad")) {
            localStorage.setItem("isFirstLoad", "true");
            setIsLoggedIn(false);  // Establecer como usuario normal en la primera carga
            setIsAdmin(false);      // Asegurarse de que no se inicia como admin
        } else {
            // Si ya es una recarga o una navegación posterior, recuperar el estado desde localStorage
            if (token) {
                setIsLoggedIn(true);
                setIsAdmin(adminStatus === "true");
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
        }
    }, []);

    const handleLoginSuccess = (adminStatus) => {
        setIsLoggedIn(true);
        setIsAdmin(adminStatus);

        localStorage.setItem("token", "your_token_value_here");
        localStorage.setItem("is_admin", adminStatus ? "true" : "false");

        window.dispatchEvent(new Event("authChange")); // Emitir evento de cambio
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsAdmin(false);

        localStorage.removeItem("token");
        localStorage.removeItem("is_admin");

        window.dispatchEvent(new Event("authChange")); // Emitir evento de cambio
    };


    return (
        <nav
            className={`w-full flex justify-between items-center py-6 px-6 fixed top-0 z-50 ${background === "f8" ? "bg-[#F8F8F8]" : "bg-transparent"}`}
        >

            {/* Menú Hamburguesa + Logo */}
            <div className="flex pl-6 items-center gap-4">
                {/* Botón Menú Hamburguesa */}
                <button onClick={() => setMenuOpen(true)} className="rounded-full">
                    <Image src="/iconos/menu.png" alt="Menu" width={28} height={28} />
                </button>

                {/* Logo */}
                <Link href="/" passHref>
                    <Image src="/photos/logo.png" alt="Logo" width={75} height={75} className="cursor-pointer" />
                </Link>
            </div>

            {/* Controles de Usuario */}
            <div className="flex items-center gap-4 pr-6">
                {/* Botón de Cambio de Idioma */}
                <LanguageToggleButton toggleLanguage={toggleLanguage} language={language} />

                {/* Botón de Usuario */}
                {isLoggedIn ? (
                    <button className="p-1" onClick={() => setLogoutOpen(true)}>
                        <Image
                            src={isAdmin ? "/iconos/admin.png" : "/iconos/user.png"}
                            alt={isAdmin ? "Admin" : "User"}
                            width={34}
                            height={34}
                        />
                    </button>
                ) : (
                    <button className="p-1" onClick={() => setLoginOpen(true)}>
                        <Image src="/iconos/user.png" alt="User" width={34} height={34} />
                    </button>
                )}
            </div>

            {/* SidebarMenu (Menú Lateral) */}
            <SidebarMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                menuOptions={{
                    en: { locations: "Locations", recorders: "Recorders", recordings: "Recordings" },
                    es: { locations: "Ubicaciones", recorders: "Grabadoras", recordings: "Grabaciones" },
                }}
                adminMenuOptions={{
                    en: { microphones: "Microphones", procesors: "Processors" },
                    es: { microphones: "Micrófonos", procesors: "Procesadores" },
                }}
                language={language}
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
            />

            {/* LoginModal */}
            <LoginModal
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
                language={language}
                onLoginSuccess={handleLoginSuccess}  // Pasa la función con el estado admin
            />

            {/* LogoutModal */}
            <LogoutConfirmation
                isOpen={logoutOpen}
                onClose={() => setLogoutOpen(false)}
                language={language}
                onLogoutConfirm={handleLogout} // Llama a la función de logout
            />
        </nav>
    );
}
