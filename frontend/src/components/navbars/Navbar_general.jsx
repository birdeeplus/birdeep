"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "../../app/styles/fonts.css";
import LanguageToggleButton from "../Button_language";
import SidebarMenu from "./SidebarMenu";
import LoginModal from "./LoginModal";
import LogoutConfirmation from "./LogoutModal";

export default function Navbar({ toggleLanguage, language }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const adminStatus = localStorage.getItem("is_admin") === "true";
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(adminStatus);
        }
    }, []);

    return (
        <nav className="w-full flex justify-between items-center py-6 px-6 fixed top-0 z-50">
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
                {isLoggedIn && isAdmin ? (
                    <span className="text-green-500 font-bold cursor-pointer" onClick={() => setLogoutOpen(true)}>
                        Admin
                    </span>
                ) : (
                    <button className="p-1" onClick={() => setLoginOpen(true)}>
                        <Image src="/iconos/user.png" alt="User" width={32} height={32} />
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
                onLoginSuccess={() => setIsLoggedIn(true)}
            />

            {/* LogoutModal */}
            <LogoutConfirmation
                isOpen={logoutOpen}
                onClose={() => setLogoutOpen(false)}
                language={language}
                onLogoutConfirm={() => setIsLoggedIn(false)}
            />
        </nav>
    );
}
