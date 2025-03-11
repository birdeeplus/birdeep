"use client";
import { useState } from "react";

export default function LoginForm({ language, onClose, onLoginSuccess }) {
    const [error, setError] = useState(""); // Estado para manejar el mensaje de error

    const loginFormOptions = {
        en: { username: "Username", password: "Password", login: "Login" },
        es: { username: "Usuario", password: "Contraseña", login: "Iniciar sesión" },
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(""); // Limpiar error antes de la petición

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
                // Guardar el token en localStorage
                localStorage.setItem("token", data.access_token);

                // Guardar el rol (si es admin) en localStorage
                const isAdmin = data.is_admin || false; // Suponiendo que el servidor manda un campo 'is_admin'
                localStorage.setItem("is_admin", isAdmin);

                // Llamar a la función onLoginSuccess para actualizar el estado de sesión
                onLoginSuccess(isAdmin);
            } else {
                setError(data.message || "Credenciales incorrectas"); // Mostrar mensaje de error debajo del formulario
            }
        } catch (error) {
            console.error("Error en el login:", error);
            setError("Error en la conexión con el servidor");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 w-[550px] h-[460px] relative flex flex-col justify-center">
            <button onClick={onClose} className="absolute top-4 right-6 text-lg font-bold text-gray-500 hover:text-black transition">
                ✕
            </button>

            <form onSubmit={handleLogin}>
                <div className="mb-5 px-[70]">
                    <label className="InterRegular block text-sm font-medium text-gray-900">
                        {loginFormOptions[language].username}
                    </label>
                    <input type="text" name="username" required className="block w-full py-2 px-3 border border-gray-300 rounded-md" />
                </div>

                <div className="mb-6 px-[70]">
                    <label className="InterRegular block text-sm font-medium text-gray-900">
                        {loginFormOptions[language].password}
                    </label>
                    <input type="password" name="password" required className="block w-full py-2 px-3 border border-gray-300 rounded-md" />
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <div className="flex justify-center">
                    <button type="submit" className="px-6 py-2 bg-black text-white text-md font-medium rounded-xl hover:bg-gray-900 transition">
                        {loginFormOptions[language].login}
                    </button>
                </div>
            </form>
        </div>
    );
}
