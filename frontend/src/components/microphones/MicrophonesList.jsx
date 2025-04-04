import { FaTrash, FaEdit } from "react-icons/fa";

export default function MicrophonesList({ language, microphones, handleDelete, handleEdit }) {
    return (
        <table className="text-[#375B38] text-center w-full mt-8 rounded-lg overflow-hidden">
            <thead>
                <tr className="bg-gray-200">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">{language === "en" ? "Model" : "Modelo"}</th>
                    <th className="px-4 py-2">{language === "en" ? "Comment" : "Comentario"}</th>
                    <th className="px-4 py-2">{language === "en" ? "Recorder ID" : "ID Grabador"}</th>
                    <th className="px-4 py-2">{language === "en" ? "Delete" : "Eliminar"}</th>
                    <th className="px-4 py-2">{language === "en" ? "Modify" : "Modificar"}</th>
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
                            <td className="text-center">
                                <button
                                    onClick={() => handleDelete(microphone.id_microphone)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                            <td className="text-center">
                                <button
                                    onClick={() => handleEdit(microphone)}
                                    className="text-blue-500 hover:text-blue-700"
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
