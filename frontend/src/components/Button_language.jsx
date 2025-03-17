// src/components/Button_language.jsx

import Image from "next/image";

export default function LanguageToggleButton({ toggleLanguage, language }) {
    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center px-2 py-1 border-2 border-[#375B38] text-[#375B38] rounded-full transition text-sm font-medium font-sans"
        >
            <Image src="/iconos/globe.png" alt="Language" width={17} height={17} className="mr-2" />
            <span className="InterRegular">{language === "en" ? "español" : "english"}</span>
        </button>
    );
}