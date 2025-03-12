// components/SearchBar.js
"use client";
import { useState } from "react";

export default function SearchBar({ language }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="flex-grow mx-10">
            <input
                type="text"
                placeholder={language === "en" ? "Search..." : "Buscar..."}
                className="w-2/3 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:border-black"
                value={searchQuery}
                onChange={handleSearchChange}
            />
        </div>
    );
}
