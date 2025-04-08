"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            router.push(`/general/recordings_general?filename=${encodeURIComponent(searchTerm)}`);
        }
        else if(searchTerm.trim() === ""){
            router.push('/general/recordings_general');
        }
    };
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

            {/* Barra de búsqueda */}
            <div className="flex-grow mx-10 flex">
                <div className="relative w-2/3">
                    <input
                        type="text"
                        placeholder={language === "en" ? "Search..." : "Buscar..."}
                        className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-black"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    {searchTerm && (
                        <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
                            onClick={() => {
                                setSearchTerm("");
                                router.push('/general/recordings_general');
                            }}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
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
