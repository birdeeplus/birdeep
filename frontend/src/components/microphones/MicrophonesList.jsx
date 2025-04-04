import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function MicrophonesList({ language, handleDelete, handleEdit }) {
    const [microphones, setMicrophones] = useState([]);

    // Usamos useEffect para hacer la solicitud cuando el componente se monta
    useEffect(() => {
        const fetchMicrophones = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/microphones"); // Asegúrate de que esta URL es correcta
                const data = await response.json();
                setMicrophones(data);
            } catch (error) {
                console.error("Error fetching microphones:", error);
            }
        };

        fetchMicrophones(); // Llamamos a la función cuando el componente se monta
    }, []); // El array vacío asegura que solo se ejecute una vez cuando el componente se monta

    return (
        <table className="text-[#375B38] text-center w-full mt-8 rounded-lg overflow-hidden">
            <thead>
                <tr className="bg-gray-200">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">
                        {language === "en" ? "Model" : "Modelo"}
                    </th>
                    <th className="px-4 py-2">
                        {language === "en" ? "Comment" : "Comentario"}
                    </th>
                    <th className="px-4 py-2">
                        {language === "en" ? "Recorder ID" : "ID Grabador"}
                    </th>
                    <th className="px-4 py-2">
                        {language === "en" ? "Delete" : "Eliminar"}
                    </th>
                    <th className="px-4 py-2">
                        {language === "en" ? "Modify" : "Modificar"}
                    </th>
                </tr>
            </thead>
            <tbody>
                {microphones.length > 0 ? (
                    microphones.map((microphone, index) => (
                        <tr key={microphone.id_microphone ?? `temp-${index}`} className="px-4 py-2 rounded-l-lg">
                            <td className="px-4 py-2">{microphone.id_microphone}</td>
                            <td className="px-4 py-2">{microphone.model_microphone}</td>
                            <td className="px-4 py-2">
                                {microphone.comment_microphone || (language === "en" ? "No comments" : "Sin comentarios")}
                            </td>
                            <td className="px-4 py-2">
                                {microphone.id_recorder || (language === "en" ? "Not assigned" : "No asignado")}
                            </td>
                            <td className="c">
                                <button
                                    onClick={() => handleDelete(microphone.id_microphone)}
                                    className="text-black hover:text-black"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                            <td className="text-center">
                                <button
                                    onClick={() => handleEdit(microphone)}
                                    className="text-black hover:text-black"
                                >
                                    <FaEdit />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center py-2">
                            {language === "en" ? "No microphones available" : "No hay micrófonos disponibles"}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
