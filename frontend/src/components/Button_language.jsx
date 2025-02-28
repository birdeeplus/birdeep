// src/components/Button_language.jsx

import Image from "next/image";

export default function LanguageToggleButton({ toggleLanguage, language }) {
    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center px-3 py-1 bg-black text-white rounded-full transition text-sm font-medium font-sans"
        >
            <Image src="/iconos/globe.png" alt="Language" width={17} height={17} className="mr-2" />
            <span className="InterRegular">{language === "en" ? "español" : "english"}</span>
        </button>
    );
}