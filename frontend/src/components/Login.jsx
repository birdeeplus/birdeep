"use client";
import { useState } from "react";

export default function LoginForm({ language, onLoginSuccess }) {
    const [error, setError] = useState("");

    const loginFormOptions = {
        en: { title: "Sign in", username: "Username", password: "Password", login: "Sign in" },
        es: { title: "Inicio de sesión", username: "Usuario", password: "Contraseña", login: "Iniciar sesión" },
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");

        const username = event.target.username.value;
        const password = event.target.password.value;

        try {
            const response = await fetch("http://localhost:8080/api/v1/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const textResponse = await response.text();
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (error) {
                console.error("Respuesta no válida:", textResponse);
                setError("Error en el servidor. Inténtalo más tarde.");
                return;
            }

            if (response.ok) {
                localStorage.setItem("token", data.access_token);
                const isAdmin = data.is_admin || false;
                localStorage.setItem("is_admin", isAdmin);
                onLoginSuccess(isAdmin);
            } else {
                setError(data.message || "Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error en el login:", error);
            setError("Error en la conexión con el servidor");
        }
    };

    return (
        <div className="bg-[#F8F8F8] rounded-2xl shadow-lg p-6 w-[400px] h-[410px] relative flex flex-col justify-center">
            {/* Título */}
            <h2 className="text-center text-[#375B38] font-semibold text-lg mb-5">
                {loginFormOptions[language].title}
            </h2>

            <form onSubmit={handleLogin} className="flex flex-col items-center">
                <div className="mb-3 w-[85%]">
                    <label className="block text-xs text-gray-900 font-medium mb-1">
                        {loginFormOptions[language].username}
                    </label>
                    <input
                        type="text"
                        name="username"
                        required
                        className="w-full py-1.5 px-3 text-sm border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-5 w-[85%]">
                    <label className="block text-xs text-gray-900 font-medium mb-1">
                        {loginFormOptions[language].password}
                    </label>
                    <input
                        type="password"
                        name="password"
                        required
                        className="w-full py-1.5 px-3 text-sm border border-gray-300 rounded-md"
                    />
                </div>

                {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}

                {/* Botón de inicio de sesión*/}
                <button
                    type="submit"
                    className="mt-5 px-5 py-1.5 border-2 border-[#375B38] text-[#375B38] rounded-full flex items-center group transition-all duration-300 ease-in-out hover:bg-[#375B38] hover:text-white text-sm font-semibold"
                >
                    <span className="mr-1">{loginFormOptions[language].login}</span>
                    <span className="text-sm">›</span>
                </button>
            </form>
        </div>
    );
}
