"use client";
import { useState } from "react";

export default function LoginForm({ language, onLoginSuccess }) {
    const [error, setError] = useState("");

    const loginFormOptions = {
        en: { title: "Sign in", username: "Username", password: "Password", login: "Sign in", forgot: "Forgot your password?" },
        es: { title: "Inicio de sesión", username: "Usuario", password: "Contraseña", login: "Iniciar sesión", forgot: "¿Has olvidado tu contraseña?" },
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

            const data = await response.json();

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
        <div className="bg-[#F8F8F8] rounded-xl shadow-lg p-8 w-[360px] flex flex-col items-center">
            <h2 className="text-[#375B38] font-semibold text-xl mb-6">{loginFormOptions[language].title}</h2>

            <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
                <div className="w-full mb-4">
                    <label className="block text-sm text-gray-700 font-medium mb-1">{loginFormOptions[language].username}</label>
                    <input
                        type="text"
                        name="username"
                        required
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                </div>

                <div className="w-full mb-4">
                    <label className="block text-sm text-gray-700 font-medium mb-1">{loginFormOptions[language].password}</label>
                    <input
                        type="password"
                        name="password"
                        required
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                </div>

                <p className="text-xs text-gray-500 mb-4 cursor-pointer hover:text-gray-700">{loginFormOptions[language].forgot}</p>

                {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}

                <button
                    type="submit"
                    className="px-5 py-2 border border-[#375B38] text-[#375B38] rounded-full flex items-center transition-all duration-300 ease-in-out hover:bg-[#375B38] hover:text-white text-sm font-semibold"
                >
                    <span className="mr-2">{loginFormOptions[language].login}</span>
                    <span className="text-lg">›</span>
                </button>
            </form>
        </div>
    );
}
